import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useSubscription, useMutation, useQuery } from '@apollo/client';
import { useUserData } from '@nhost/react';
import { SUBSCRIBE_TO_MESSAGES, SEND_MESSAGE, TRIGGER_CHATBOT, GET_CHAT_MESSAGES } from '../graphql/queries';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import ChatInput from './ChatInput';
import { User } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  is_bot: boolean;
  created_at: string;
  user_id: string;
}

interface MessageViewProps {
  chatId: string;
  isNewChat?: boolean;
  isCollapsed?: boolean;
}

const MessageView: React.FC<MessageViewProps> = ({ chatId, isNewChat = false, isCollapsed = false }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessages, setStreamingMessages] = useState<Set<string>>(new Set());
  const [currentUserMessage, setCurrentUserMessage] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const user = useUserData();

  // Use query for faster initial load, then subscription for updates
  const { data: queryData, loading: queryLoading } = useQuery(GET_CHAT_MESSAGES, {
    variables: { chatId },
    fetchPolicy: 'cache-first',
    skip: !chatId,
  });

  const { data: subscriptionData } = useSubscription(SUBSCRIBE_TO_MESSAGES, {
    variables: { chatId },
    skip: !chatId || queryLoading,
  });

  const messages: Message[] = subscriptionData?.messages || queryData?.messages || [];

  const [sendMessage] = useMutation(SEND_MESSAGE);
  const [triggerChatbot] = useMutation(TRIGGER_CHATBOT);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'end',
      inline: 'nearest'
    });
  };

  useEffect(() => {
    // Scroll to bottom when new messages arrive or when loading state changes
    const timeoutId = setTimeout(() => {
      scrollToBottom();
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [messages.length, isLoading]);

  // Scroll to bottom when a new message is being typed (streaming)
  useEffect(() => {
    if (streamingMessages.size > 0) {
      const timeoutId = setTimeout(() => {
        scrollToBottom();
      }, 50);
      
      return () => clearTimeout(timeoutId);
    }
  }, [streamingMessages]);

  // Handle streaming for new bot messages
  useEffect(() => {
    const botMessages = messages.filter(msg => msg.is_bot);
    const latestBotMessage = botMessages[botMessages.length - 1];
    
    if (latestBotMessage && !streamingMessages.has(latestBotMessage.id)) {
      // Check if this is a new bot message (created within last 2 seconds)
      const messageAge = Date.now() - new Date(latestBotMessage.created_at).getTime();
      if (messageAge < 2000) {
        setStreamingMessages(prev => new Set(prev).add(latestBotMessage.id));
        
        // Remove from streaming after animation completes
        const streamingDuration = latestBotMessage.content.length * 30 + 500;
        setTimeout(() => {
          setStreamingMessages(prev => {
            const newSet = new Set(prev);
            newSet.delete(latestBotMessage.id);
            return newSet;
          });
        }, streamingDuration);
      }
    }
  }, [messages, streamingMessages]);

  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim() || !user?.id || isLoading || !chatId) return;

    const currentMessage = messageText;
    setCurrentUserMessage(currentMessage);
    setIsLoading(true);

    try {
      // Send user message
      const userMessageResult = await sendMessage({
        variables: {
          chatId,
          content: currentMessage,
          userId: user.id,
        },
      });

      // Trigger chatbot response
      const botResult = await triggerChatbot({
        variables: {
          chat_id: chatId,
          message: currentMessage,
        },
      });
    } catch (err) {
      console.error('Error sending message:', err);
      
      // Handle specific authorization errors
      if (err instanceof Error && err.message.includes('user is not authorized to access the chat')) {
        // You might want to show a user-friendly error message here
        console.error('Authorization error: User cannot access this chat');
      }
    } finally {
      setIsLoading(false);
      setCurrentUserMessage('');
    }
  };

  if (queryLoading) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }


    return (
      <div className="flex-1 flex flex-col relative h-full">
        {messages.length > 0 || isLoading ? (
          <>
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-6 py-4 sm:py-6 pb-40 h-0 scroll-smooth">
              <div className="max-w-4xl mx-auto space-y-1">
                {messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    isStreaming={streamingMessages.has(message.id)}
                  />
                ))}
                
                <div ref={messagesEndRef} className="h-8 sm:h-12" />
              </div>
            </div>

            {/* Fixed Typing Indicator - Always above input */}
            {isLoading && (
              <div className={`${
                isCollapsed ? 'left-0' : 'left-80'
              } right-0 fixed bottom-24 px-4 sm:px-6 pointer-events-none z-10`}>
                <div className="max-w-4xl mx-auto">
                  <TypingIndicator />
                </div>
              </div>
            )}

            {/* Chat Input → fixed at bottom when there are messages */}
            <ChatInput 
              onSendMessage={handleSendMessage} 
              isLoading={isLoading} 
              hasMessages={messages.length > 0}
              isNewChat={isNewChat}
              isCollapsed={isCollapsed}
            />
          </>
        ) : (
          /* Centered input when no messages */
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full">
              <ChatInput 
                onSendMessage={handleSendMessage} 
                isLoading={isLoading} 
                hasMessages={false}
                isNewChat={isNewChat}
                isCollapsed={isCollapsed}
              />
            </div>
          </div>
        )}
      </div>
    );

};

export default MessageView;