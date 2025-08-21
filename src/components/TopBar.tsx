import React, { useState, useEffect } from 'react';
import { Bot, Sparkles, Menu } from 'lucide-react';

interface TopBarProps {
  onToggleSidebar?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onToggleSidebar }) => {
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
    <div className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-700/50 px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Mobile Sidebar Toggle */}
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-white transition-all duration-200 hover:scale-105"
            title="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-3 animate-fade-in">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/25">
              <Bot className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="flex items-center">
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {displayedText}
                {isTyping && (
                  <span className="inline-block w-0.5 h-5 bg-orange-500 ml-1 animate-pulse"></span>
                )}
              </h1>
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 ml-1 sm:ml-2 animate-twinkle" />
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs sm:text-sm text-gray-400 hidden sm:inline">Online</span>
        </div>
      </div>
    </div>
  );
};

export default TopBar;