import React, { useState, useEffect } from 'react';
import { 
  FiSearch, 
  FiSettings,
  FiX,
  FiTrash2,
  FiMessageSquare,
  FiChevronLeft,
  FiMenu,
  FiEdit3,
  FiHelpCircle
} from 'react-icons/fi';
import SettingsPopup from './SettingsPopup';
import HelpPopup from './HelpPopup';

const Sidebar = ({ isOpen, onToggle, onClearChat, searchQuery, setSearchQuery }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Force dark mode only
  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
    localStorage.setItem('theme', 'dark');
  }, []);

  const handleClearChat = () => {
    setShowDeleteConfirm(true);
  };

  const confirmClearChat = () => {
    onClearChat();
    setShowDeleteConfirm(false);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Collapsed Sidebar - Four Icons */}
      {!isOpen && (
        <div className="fixed left-0 top-0 bottom-0 z-50 w-12 sm:w-16 sidebar-bg border-r sidebar-border flex flex-col items-center justify-between py-4 sm:py-6 theme-transition">
          {/* Top Icons */}
          <div className="flex flex-col items-center space-y-4 sm:space-y-6">
            {/* Menu Icon */}
            <button
              onClick={onToggle}
              className="p-2 sm:p-3 rounded-full hover-bg-primary transition-colors cursor-pointer"
              title="Open sidebar"
            >
              <FiMenu className="text-muted text-lg sm:text-xl" />
            </button>
            
            {/* Clear Chat Icon */}
            <button
              onClick={() => {
                onClearChat();
                onToggle(); // Also open sidebar
              }}
              className="p-2 sm:p-3 rounded-full hover-bg-primary transition-colors cursor-pointer"
              title="Clear chat & open sidebar"
            >
              <FiTrash2 className="text-muted text-lg sm:text-xl" />
            </button>
          </div>
          
          {/* Bottom Icons */}
          <div className="flex flex-col items-center space-y-4 sm:space-y-6">
            {/* Help Icon */}
            <button
              onClick={() => setShowHelp(true)}
              className="p-2 sm:p-3 rounded-full hover-bg-primary transition-colors cursor-pointer"
              title="Help & Support"
            >
              <FiHelpCircle className="text-muted text-lg sm:text-xl" />
            </button>

            {/* Settings Icon */}
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 sm:p-3 rounded-full hover-bg-primary transition-colors cursor-pointer"
              title="Settings"
            >
              <FiSettings className="text-muted text-lg sm:text-xl" />
            </button>

          </div>
        </div>
      )}
      
      {/* Full Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 sm:w-80 sidebar-bg border-r sidebar-border theme-transition
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-3 sm:p-4 border-b sidebar-border">
            <div className="flex items-center gap-2 sm:gap-3">
              <button 
                onClick={onToggle}
                className="p-1.5 sm:p-2 hover-bg-primary rounded-lg transition-colors cursor-pointer"
                title="Hide sidebar"
              >
                <FiChevronLeft className="text-muted text-lg sm:text-xl" />
              </button>
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 input-bg border input-border rounded-lg input-text placeholder-gray-500 focus:outline-none focus-border text-xs sm:text-sm theme-transition cursor-text"
                />
                <FiSearch className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-muted text-xs sm:text-sm" />
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="p-3 sm:p-4 space-y-4 sm:space-y-6">
            {/* Current Chat Info */}
            <div className="card-bg rounded-lg p-4 border input-border theme-transition">
              <div className="flex items-center gap-3 mb-3">
                <FiMessageSquare className="text-green-400" />
                <span className="text-primary font-medium">Current Chat</span>
              </div>
              <p className="text-secondary text-sm mb-3">
                You're chatting with Serguo AI. Ask me anything about images, text extraction, or general questions.
              </p>
              <button
                onClick={handleClearChat}
                className="w-full flex items-center gap-2 px-3 py-2 bg-white hover:bg-gray-100 text-black hover:text-black rounded-lg transition-colors text-sm cursor-pointer border border-gray-300"
              >
                <FiTrash2 className="text-sm" />
                Clear Chat
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-auto p-4 border-t sidebar-border space-y-2">
            <button 
              onClick={() => setShowSettings(true)}
              className="w-full flex items-center gap-3 p-3 hover:bg-white hover:text-black text-secondary rounded-lg transition-colors group cursor-pointer"
            >
              <FiSettings className="group-hover:text-black" />
              <span>Settings</span>
            </button>
            
            <button 
              onClick={() => setShowHelp(true)}
              className="w-full flex items-center gap-3 p-3 hover:bg-white hover:text-black text-secondary rounded-lg transition-colors group cursor-pointer"
            >
              <FiHelpCircle className="group-hover:text-black" />
              <span>Help</span>
            </button>
          </div>
        </div>
      </div>

      {/* Clear Chat Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-gray-800 dark:bg-gray-200 rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-white dark:text-gray-800 font-semibold mb-2">Clear Chat</h3>
            <p className="text-gray-300 dark:text-gray-600 text-sm mb-4">
              Are you sure you want to clear the current chat? This will remove all messages and cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-700 dark:bg-gray-300 hover:bg-white hover:text-black text-white dark:text-gray-800 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmClearChat}
                className="flex-1 px-4 py-2 bg-white hover:bg-gray-100 text-black hover:text-black rounded-lg transition-colors cursor-pointer border border-gray-300"
              >
                Clear Chat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popups */}
      <SettingsPopup 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)}
      />
      
      <HelpPopup 
        isOpen={showHelp} 
        onClose={() => setShowHelp(false)}
      />
    </>
  );
};

export default Sidebar;
