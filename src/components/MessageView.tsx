import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useSubscription, useMutation } from '@apollo/client';
import { useUserData } from '@nhost/react';
import { SUBSCRIBE_TO_MESSAGES, SEND_MESSAGE, TRIGGER_CHATBOT } from '../graphql/queries';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import ChatInput from './ChatInput';

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
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const user = useUserData();

  const { data, loading, error } = useSubscription(SUBSCRIBE_TO_MESSAGES, {
    variables: { chatId },
  });

  const [sendMessage] = useMutation(SEND_MESSAGE);
  const [triggerChatbot] = useMutation(TRIGGER_CHATBOT);

  const messages: Message[] = useMemo(() => data?.messages || [], [data?.messages]);

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
    if (streamingMessageId) {
      const timeoutId = setTimeout(() => {
        scrollToBottom();
      }, 50);
      
      return () => clearTimeout(timeoutId);
    }
  }, [streamingMessageId]);

  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim() || !user?.id || isLoading) return;

    const currentMessage = messageText;
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
      
      // Set streaming effect for the bot response
      if (botResult.data?.chatbot_response?.response) {
        // Find the latest bot message and set it for streaming
        setTimeout(() => {
          const latestMessages = data?.messages || [];
          const latestBotMessage = latestMessages
            .filter((msg: Message) => msg.is_bot)
            .sort((a: Message, b: Message) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
          
          if (latestBotMessage) {
            setStreamingMessageId(latestBotMessage.id);
            setTimeout(() => setStreamingMessageId(null), latestBotMessage.content.length * 30 + 1000);
          }
        }, 500);
      }
    } catch (err) {
      console.error('Error sending message:', err);
      
      // Handle specific authorization errors
      if (err instanceof Error && err.message.includes('user is not authorized to access the chat')) {
        // You might want to show a user-friendly error message here
        console.error('Authorization error: User cannot access this chat');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    console.log(error)
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <p className="text-red-600">Error loading messages</p>
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
                    isStreaming={streamingMessageId === message.id}
                  />
                ))}
                
                <div ref={messagesEndRef} className="h-4" />
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