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
        </div>
        
      </div>
    </div>
  );
};

export default TopBar;