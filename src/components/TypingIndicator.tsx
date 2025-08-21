import React from 'react';
import { Bot } from 'lucide-react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start mb-4 sm:mb-6 animate-fade-in">
      <div className="max-w-[85%] sm:max-w-[80%] mr-8 sm:mr-12">
        <div className="flex items-start space-x-2 sm:space-x-3">
          {/* Avatar */}
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/25">
            <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
          </div>

          {/* Typing Animation */}
          <div className="px-3 sm:px-4 py-2 sm:py-3 rounded-2xl bg-gray-800/80 backdrop-blur-sm border border-gray-600/50">
            <div className="flex items-center space-x-1">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="text-xs text-gray-400 ml-2 hidden sm:inline">AI is thinking...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;