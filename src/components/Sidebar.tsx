import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useSignOut, useUserData } from '@nhost/react';
import { GET_CHATS, CREATE_CHAT } from '../graphql/queries';
import { 
  Bot, 
  Plus, 
  MessageCircle, 
  ChevronLeft, 
  ChevronRight, 
  LogOut, 
  User,
  Sparkles 
} from 'lucide-react';

interface Chat {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  messages: Array<{
    content: string;
    created_at: string;
    is_bot: boolean;
  }>;
}

interface SidebarProps {
  selectedChatId: string | null;
  onSelectChat: (chatId: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onNewChatCreated?: (chatId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  selectedChatId, 
  onSelectChat, 
  isCollapsed, 
  onToggleCollapse,
  onNewChatCreated
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = React.useRef<HTMLDivElement>(null);
  const { data, loading, error } = useQuery(GET_CHATS);
  const [createChat] = useMutation(CREATE_CHAT, {
    refetchQueries: [{ query: GET_CHATS }],
  });
  const { signOut } = useSignOut();
  const user = useUserData();

  const chats: Chat[] = data?.chats || [];

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  const getUserDisplayName = () => {
    return user?.displayName || user?.email?.split('@')[0] || 'User';
  };

  const handleCreateChat = async () => {
    try {
      const result = await createChat({
        variables: {
          title: `New Chat ${new Date().toLocaleString()}`,
          userId: user?.id,
        },
      });
      if (result.data?.insert_chats_one) {
        const newChatId = result.data.insert_chats_one.id;
        onSelectChat(newChatId);
        onNewChatCreated?.(newChatId);
        
        // Auto-close sidebar on mobile after creating chat
        if (window.innerWidth < 1024) {
          onToggleCollapse();
        }
      }
    } catch (err) {
      console.error('Error creating chat:', err);
    }
  };

  const handleSignOut = () => {
    signOut();
  };

  const truncateTitle = (title: string, maxLength: number = 25) => {
    return title.length > maxLength ? `${title.substring(0, maxLength)}...` : title;
  };

  const formatChatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const chatDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (chatDate.getTime() === today.getTime()) {
      // Today - show time with AM/PM
      return date.toLocaleTimeString([], { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } else if (chatDate.getTime() === yesterday.getTime()) {
      // Yesterday
      return 'Yesterday';
    } else {
      // Other dates - show date
      return date.toLocaleDateString([], { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  return (
    <div className={`bg-gray-900/95 backdrop-blur-sm border-r border-gray-700/50 flex flex-col transition-all duration-300 ease-in-out h-full ${
      isCollapsed ? 'w-16' : 'w-80 lg:w-80'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-700/50">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3 animate-fade-in">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/25">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center">
                  <h1 className="text-lg font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    ChatMind AI
                  </h1>
                  <Sparkles className="w-4 h-4 text-orange-400 ml-1 animate-twinkle" />
                </div>
                <p className="text-xs text-orange-400">Intelligent Conversations</p>
              </div>
            </div>
          )}
          
          {isCollapsed && (
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/25 animate-fade-in mx-auto relative group">
              <Bot className="w-6 h-6 text-white" />
              {/* Tooltip */}
              <div className="absolute left-full ml-3 top-1/2 transform -translate-y-1/2 bg-gray-800/95 backdrop-blur-sm border border-gray-700/50 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-[100] shadow-xl">
                ChatMind AI
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-800/95 border-l border-b border-gray-700/50 rotate-45"></div>
              </div>
            </div>
          )}
          
          {!isCollapsed && (
            <button
              onClick={onToggleCollapse}
              className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-white transition-all duration-200 hover:scale-105"
              title="Collapse sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* New Chat Button */}
      <div className={`${isCollapsed ? 'p-3' : 'p-4'}`}>
        <button
          onClick={handleCreateChat}
          className={`w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25 relative group ${
            isCollapsed ? 'p-3 flex items-center justify-center' : 'py-3 px-4'
          }`}
          title="New Chat"
        >
          <div className="flex items-center justify-center space-x-2">
            <Plus className="w-4 h-4" />
            {!isCollapsed && <span>New Chat</span>}
          </div>
          {/* Tooltip for collapsed state */}
          {isCollapsed && (
            <div className="absolute left-full ml-3 top-1/2 transform -translate-y-1/2 bg-gray-800/95 backdrop-blur-sm border border-gray-700/50 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-[100] shadow-xl">
              New Chat
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-800/95 border-l border-b border-gray-700/50 rotate-45"></div>
            </div>
          )}
        </button>
      </div>

      {/* Expand Button for Collapsed State */}
      {isCollapsed && (
        <div className="px-3 pb-3">
          <button
            onClick={onToggleCollapse}
            className="w-full p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-white transition-all duration-200 hover:scale-105 relative group flex items-center justify-center"
            title="Expand sidebar"
          >
            <ChevronRight className="w-4 h-4" />
            {/* Tooltip */}
            <div className="absolute left-full ml-3 top-1/2 transform -translate-y-1/2 bg-gray-800/95 backdrop-blur-sm border border-gray-700/50 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-[100] shadow-xl">
              Expand Sidebar
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-800/95 border-l border-b border-gray-700/50 rotate-45"></div>
            </div>
          </button>
        </div>
      )}

      {/* Chat List */}
      <div className={`px-4 py-2 border-b border-gray-700/50 ${isCollapsed ? 'hidden' : ''}`}>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
          Chats
        </h2>
      </div>

      <div className={`flex-1 overflow-y-auto px-2 ${isCollapsed ? 'hidden' : ''}`}>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-400 text-sm">
            Error loading chats
          </div>
        ) : chats.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {!isCollapsed && (
              <div className="animate-fade-in">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                <p className="text-sm">No chats yet</p>
                <p className="text-xs text-gray-600">Create your first chat</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-1 pb-4">
            {chats.map((chat) => (
              <div key={chat.id} className="relative group">
                <button
                  onClick={() => onSelectChat(chat.id)}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 hover:bg-gray-800/50 ${
                    selectedChatId === chat.id
                      ? 'bg-orange-500/10 border border-orange-500/20 text-orange-300'
                      : 'text-gray-300 hover:text-white'
                  }`}
                  title={isCollapsed ? chat.title : undefined}
                >
                  <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
                    <MessageCircle className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && (
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate pr-12">
                          {chat.messages.length > 0 
                            ? truncateTitle(chat.messages[0].content, 35)
                            : truncateTitle(chat.title, 35)
                          }
                        </h3>
                        <div className="absolute bottom-1 right-3">
                          <span className="text-xs text-gray-500">
                            {formatChatTime(chat.updated_at)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </button>
                
                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-3 top-1/2 transform -translate-y-1/2 bg-gray-800/95 backdrop-blur-sm border border-gray-700/50 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-[100] shadow-xl">
                    {chat.title}
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-800/95 border-l border-b border-gray-700/50 rotate-45"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Spacer to push user menu to bottom when collapsed */}
      {isCollapsed && <div className="flex-1"></div>}

      {/* User Menu */}
      <div className="border-t border-gray-700/50 p-4 relative" ref={userMenuRef}>
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className={`w-full flex items-center rounded-lg hover:bg-gray-800/50 transition-all duration-200 text-gray-300 hover:text-white group relative ${
            isCollapsed ? 'justify-center p-3' : 'space-x-3 p-2'
          }`}
          title={isCollapsed ? getUserDisplayName() : undefined}
        >
          <div className={`bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center flex-shrink-0 ${
            isCollapsed ? 'w-10 h-10' : 'w-8 h-8'
          }`}>
            <User className={`${isCollapsed ? 'w-6 h-6' : 'w-5 h-5'}`} />
          </div>
          {!isCollapsed && (
            <div className="flex-1 text-left">
              <p className="text-sm font-medium truncate">{getUserDisplayName()}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          )}
          
          {/* Tooltip for collapsed state */}
          {isCollapsed && (
            <div className="absolute left-full ml-3 top-1/2 transform -translate-y-1/2 bg-gray-800/95 backdrop-blur-sm border border-gray-700/50 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-[100] shadow-xl">
              User Menu
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-800/95 border-l border-b border-gray-700/50 rotate-45"></div>
            </div>
          )}
        </button>

        {/* Dropdown Menu */}
        {showUserMenu && (
          <div className={`absolute bottom-full mb-2 bg-gray-800/95 backdrop-blur-sm border border-gray-700/50 rounded-lg shadow-xl z-[110] animate-slide-up ${
            isCollapsed ? 'left-full ml-2 min-w-[200px]' : 'left-0 right-0'
          }`}>
            <div className="px-4 py-3 border-b border-gray-700/50">
              <p className="text-sm font-medium text-white truncate">{getUserDisplayName()}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center space-x-2 px-4 py-3 text-left hover:bg-red-500/10 rounded-b-lg transition-all duration-200 text-red-400 hover:text-red-300 hover:bg-red-500/20"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;