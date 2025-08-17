import React, { useState, useEffect } from 'react';
import { useUserData } from '@nhost/react';

interface TopBarProps {
  selectedChatTitle?: string;
}

const TopBar: React.FC<TopBarProps> = ({ selectedChatTitle }) => {
  const user = useUserData();
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const welcomeText = user?.email ? `Welcome back, ${user.email.split('@')[0]}` : 'Welcome';

  useEffect(() => {
    if (!welcomeText) return;

    setIsTyping(true);
    setDisplayedText('');
    
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex < welcomeText.length) {
        setDisplayedText(welcomeText.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typingInterval);
      }
    }, 50);

    return () => clearInterval(typingInterval);
  }, [welcomeText]);

  return (
    <div className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-700/50 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {selectedChatTitle ? (
            <div className="animate-fade-in">
              <h1 className="text-xl font-semibold text-white">{selectedChatTitle}</h1>
              <p className="text-sm text-gray-400">Active conversation</p>
            </div>
          ) : (
            <div className="animate-fade-in">
              <h1 className="text-xl font-semibold text-white">
                {displayedText}
                {isTyping && (
                  <span className="inline-block w-0.5 h-5 bg-orange-500 ml-1 animate-pulse"></span>
                )}
              </h1>
              <p className="text-sm text-orange-400">Ready to start a new conversation</p>
            </div>
          )}
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