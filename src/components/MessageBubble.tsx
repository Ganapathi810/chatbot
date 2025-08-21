import React, { useState, useEffect } from 'react';
import { useUserData } from '@nhost/react';
import { Bot, User, Copy, Check } from 'lucide-react';

interface MessageBubbleProps {
  message: {
    id: string;
    content: string;
    is_bot: boolean;
    created_at: string;
  };
  isStreaming?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isStreaming = false }) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copied, setCopied] = useState(false);
  const user = useUserData();

  useEffect(() => {
    if (message.is_bot && isStreaming) {
      setIsTyping(true);
      setDisplayedContent('');
      
      let currentIndex = 0;
      const typingInterval = setInterval(() => {
        if (currentIndex < message.content.length) {
          setDisplayedContent(message.content.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          setIsTyping(false);
          clearInterval(typingInterval);
        }
      }, 30);

      return () => clearInterval(typingInterval);
    } else {
      setDisplayedContent(message.content);
      setIsTyping(false);
    }
  }, [message.content, message.is_bot, isStreaming]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const formatContent = (content: string) => {
    // Simple formatting for bold, italic, and code
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-700 px-1 py-0.5 rounded text-sm">$1</code>')
      .replace(/\n/g, '<br>');
  };

  const getUserDisplayName = () => {
    if (user?.displayName) return user.displayName;
    if (user?.email) return user.email.split('@')[0];
    return 'You';
  };

  return (
    <div className={`flex ${!message.is_bot ? 'justify-end' : 'justify-start'} mb-6 sm:mb-8 animate-fade-in`}>
      <div className={`max-w-[85%] sm:max-w-[80%] ${!message.is_bot ? 'ml-8 sm:ml-12' : 'mr-8 sm:mr-12'}`}>
        <div className={`flex items-start ${!message.is_bot ? 'flex-row-reverse' : ''}`}>
          {/* Avatar */}
          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
            message.is_bot 
              ? 'bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/25'
              : 'bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/25' 
          }`}>
            {!message.is_bot ? (
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            ) : (
              <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            )}
          </div>

          {/* Message Content */}
          <div className={`relative group ${!message.is_bot ? 'flex flex-col items-end mr-3 sm:mr-4' : 'ml-3 sm:ml-4'}`}>
            {/* Name above message */}
            <div className={`text-xs text-gray-400 mb-2 ${!message.is_bot ? 'text-right' : 'text-left'}`}>
              {!message.is_bot ? getUserDisplayName() : 'ChatMind AI'}
            </div>
            
            <div className={`px-3 sm:px-4 py-2 sm:py-3 rounded-2xl shadow-sm ${
              !message.is_bot
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/20'
                : 'bg-gray-800/90 backdrop-blur-sm border border-gray-700/60 text-gray-100 shadow-lg shadow-gray-900/20'
            }`}>
              <div 
                className="text-sm sm:text-base leading-relaxed break-words"
                dangerouslySetInnerHTML={{ __html: formatContent(displayedContent) }}
              />
              
              {isTyping && (
                <span className="inline-block w-2 h-4 bg-blue-400 ml-1 animate-pulse"></span>
              )}
            </div>

            {/* Message Actions */}
            <div className={`flex items-center space-x-2 mt-1 sm:mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
              !message.is_bot ? 'flex-row-reverse' : ''
            }`}>
              <span className="text-xs text-gray-500 hidden sm:inline">
                {new Date(message.created_at).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
              
              <button
                onClick={handleCopy}
                className="p-1 rounded hover:bg-gray-700/50 transition-colors duration-200 sm:opacity-100 opacity-70"
                title="Copy message"
              >
                {copied ? (
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                ) : (
                  <Copy className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 hover:text-gray-300" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;