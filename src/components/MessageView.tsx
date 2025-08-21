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
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [userScrolled, setUserScrolled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const lastMessageCountRef = useRef(0);
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

  // Check if user is near bottom of scroll
  const isNearBottom = () => {
    if (!messagesContainerRef.current) return true;
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    return scrollHeight - scrollTop - clientHeight < 100;
  };

  // Scroll to bottom function
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
    }
  };

  // Handle scroll events to detect manual scrolling
  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    
    const isAtBottom = isNearBottom();
    setShouldAutoScroll(isAtBottom);
    
    // If user scrolled up, mark as manually scrolled
    if (!isAtBottom && !userScrolled) {
      setUserScrolled(true);
    }
    
    // If user scrolled back to bottom, reset manual scroll flag
    if (isAtBottom && userScrolled) {
      setUserScrolled(false);
    }
  };

  // Auto-scroll when new messages arrive (ChatGPT style)
  useEffect(() => {
    const currentMessageCount = messages.length;
    const hadNewMessage = currentMessageCount > lastMessageCountRef.current;
    
    if (hadNewMessage) {
      // Always scroll if user hasn't manually scrolled up, or if they're near bottom
      if (shouldAutoScroll || !userScrolled) {
        setTimeout(scrollToBottom, 50);
      }
      lastMessageCountRef.current = currentMessageCount;
    }
  }, [messages.length, shouldAutoScroll, userScrolled]);

  // Scroll to bottom when chat changes
  useEffect(() => {
    if (chatId) {
      lastMessageCountRef.current = 0;
      setShouldAutoScroll(true);
      setUserScrolled(false);
      setTimeout(scrollToBottom, 100);
    }
  }, [chatId]);

  // Always scroll when user sends a message
  useEffect(() => {
    if (isLoading) {
      setShouldAutoScroll(true);
      setUserScrolled(false);
      setTimeout(scrollToBottom, 50);
    }
  }, [isLoading]);

  // Add scroll listener
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Handle streaming for new bot messages
  useEffect(() => {
    const botMessages = messages.filter(msg => msg.is_bot);
    const latestBotMessage = botMessages[botMessages.length - 1]; // Last bot message is the latest
    
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

    // Force scroll when user sends message
    setShouldAutoScroll(true);
    setUserScrolled(false);
    
    setIsLoading(true);

    try {
      // Send user message
      const userMessageResult = await sendMessage({
        variables: {
          chatId,
          content: messageText,
          userId: user.id,
        },
      });

      // Trigger chatbot response
      const botResult = await triggerChatbot({
        variables: {
          chat_id: chatId,
          message: messageText,
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
    }
  };

    return (
      <div className="flex-1 flex flex-col relative h-full">
        {messages.length > 0 || isLoading ? (
          <>
            {/* Messages Container */}
            <div 
              ref={messagesContainerRef}
              className={`flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-6 py-4 sm:py-6 h-0 ${
              messages.length > 0 && !isLoading && streamingMessages.size === 0 ? 'pb-96' : 'pb-40'
            }`}>
              <div className="max-w-4xl mx-auto space-y-1 pb-20">
                {messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    isStreaming={streamingMessages.has(message.id)}
                  />
                ))}
                <div ref={messagesEndRef} className="h-1" />
              </div>
            </div>

            {/* Typing Indicator */}
            {isLoading && (
              <div className={`${
                isCollapsed ? 'left-0' : 'left-80'
              } right-0 fixed bottom-24 px-4 sm:px-6 pointer-events-none z-10`}>
                <div className="max-w-4xl mx-auto">
                  <TypingIndicator />
                </div>
              </div>
            )}

            {/* Chat Input */}
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