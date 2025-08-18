import React, { useState, useEffect } from 'react';
import { Bot, Sparkles } from 'lucide-react';

const TopBar: React.FC = () => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const brandText = 'ChatMind AI';

  useEffect(() => {
    if (!brandText) return;

    setIsTyping(true);
    setDisplayedText('');
    
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex < brandText.length) {
        setDisplayedText(brandText.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typingInterval);
      }
    }, 50);

    return () => clearInterval(typingInterval);
  }, [brandText]);

  return (
    <div className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-700/50 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3 animate-fade-in">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/25">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-center">
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {displayedText}
                {isTyping && (
                  <span className="inline-block w-0.5 h-5 bg-orange-500 ml-1 animate-pulse"></span>
                )}
              </h1>
              <Sparkles className="w-5 h-5 text-orange-400 ml-2 animate-twinkle" />
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-400">Online</span>
        </div>
      </div>
    </div>
  );
};

export default TopBar;