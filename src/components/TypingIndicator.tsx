import React from 'react';
import { Bot } from 'lucide-react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start mb-6 animate-fade-in">
      <div className="max-w-[80%] mr-12">
        <div className="flex items-start space-x-3">
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-500/25">
            <Bot className="w-4 h-4 text-white" />
          </div>

          {/* Typing Animation */}
          <div className="px-4 py-3 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50">
            <div className="flex items-center space-x-1">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="text-xs text-gray-400 ml-2">AI is thinking...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;