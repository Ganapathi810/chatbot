import React, { useState, useRef, useEffect } from 'react';
import { useUserData } from '@nhost/react';
import { Send, Sparkles } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  hasMessages: boolean;
  isNewChat?: boolean;
  isCollapsed?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading, hasMessages, isNewChat = false, isCollapsed = false }) => {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasShownWelcome, setHasShownWelcome] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const user = useUserData();

  const userName = user?.displayName || user?.email?.split('@')[0] || 'there';
  const welcomeText = `How can I help you today, ${userName}?`;

  useEffect(() => {
    if (!hasMessages && welcomeText && !hasShownWelcome) {
      // Show streaming animation only for the first time in session (not new chats)
      if (!isNewChat) {
        setIsTyping(true);
        setDisplayedText('');
        
        let currentIndex = 0;
        const typingInterval = setInterval(() => {
          if (currentIndex < welcomeText.length) {
            setDisplayedText(welcomeText.slice(0, currentIndex + 1));
            currentIndex++;
          } else {
            setIsTyping(false);
            setHasShownWelcome(true);
            clearInterval(typingInterval);
          }
        }, 50);

        return () => clearInterval(typingInterval);
      } else {
        // For new chats, show immediately without animation
        setDisplayedText(welcomeText);
        setIsTyping(false);
        setHasShownWelcome(true);
      }
    }
  }, [welcomeText, hasMessages, hasShownWelcome, isNewChat]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;
    
    onSendMessage(message.trim());
    setMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const inputContainerClass = hasMessages 
    ? `fixed bottom-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-700/50 p-3 sm:p-4 ${
        isCollapsed ? 'left-0' : 'left-80'
      }`
    : "flex items-center justify-center min-h-[60vh]";

  return (
    <div className={inputContainerClass}>
      <div className={`w-full max-w-4xl mx-auto px-3 sm:px-4 lg:px-0 ${!hasMessages ? 'animate-fade-in' : ''}`}>
        {!hasMessages && (
          <div className="text-center mb-6 sm:mb-8 animate-slide-up px-4">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mb-4 shadow-2xl shadow-orange-500/30 animate-bounce-subtle">
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4 sm:mb-6">
              {displayedText}
              {isTyping && (
                <span className="inline-block w-0.5 h-5 sm:h-6 bg-orange-500 ml-1 animate-pulse"></span>
              )}
            </h2>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative group">
            <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-full border border-gray-600/50 hover:border-gray-500/50 focus-within:border-orange-500/50 focus-within:shadow-lg focus-within:shadow-orange-500/20 transition-all duration-300">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything"
                disabled={isLoading}
                className="w-full px-6 py-4 pr-16 bg-transparent text-white placeholder-gray-400 resize-none focus:outline-none min-h-[60px] max-h-[200px] overflow-y-auto text-base flex items-center"
                rows={1}
              />
              
              <button
                type="submit"
                disabled={!message.trim() || isLoading}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-full transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25 disabled:hover:scale-100 disabled:hover:shadow-none flex items-center justify-center"
              >
                <Send className="w-5 h-5 transform rotate-[30deg]" />
              </button>
            </div>
          </div>
          {!hasMessages && (
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              {[
                "Explain quantum computing",
                "Write a creative story",
                "Help me plan a project",
                "Analyze this data"
              ].map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setMessage(suggestion)}
                  className="px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white rounded-lg border border-gray-600/50 hover:border-gray-500/50 transition-all duration-200 hover:scale-105 text-sm"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ChatInput;