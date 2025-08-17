import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  hasMessages: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading, hasMessages }) => {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    ? "fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-700/50 p-4"
    : "flex items-center justify-center min-h-[60vh]";

  return (
    <div className={inputContainerClass}>
      <div className={`w-full max-w-4xl mx-auto ${!hasMessages ? 'animate-fade-in' : ''}`}>
        {!hasMessages && (
          <div className="text-center mb-8 animate-slide-up">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mb-4 shadow-2xl shadow-orange-500/30 animate-bounce-subtle">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
              What can I help you with?
            </h2>
            <p className="text-gray-400 text-lg">
              Start a conversation with your AI assistant
            </p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="relative">
          <div className={`relative bg-gray-800/50 backdrop-blur-sm rounded-2xl border transition-all duration-300 ${
            isFocused 
              ? 'border-orange-500/50 shadow-lg shadow-orange-500/10 ring-1 ring-orange-500/20' 
              : 'border-gray-600/50 hover:border-gray-500/50'
          }`}>
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
              disabled={isLoading}
              className="w-full px-6 py-4 pr-16 bg-transparent text-white placeholder-gray-400 resize-none focus:outline-none min-h-[60px] max-h-[200px] overflow-y-auto"
              rows={1}
            />
            
            <button
              type="submit"
              disabled={!message.trim() || isLoading}
              className="absolute right-3 bottom-3 p-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25 disabled:hover:scale-100 disabled:hover:shadow-none"
            >
              <Send className="w-5 h-5" />
            </button>
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