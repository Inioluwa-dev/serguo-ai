
import React, { useState, useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import cacheManager from './services/cacheManager';
import { NotificationProvider } from './contexts/NotificationContext';
import ErrorBoundary from './components/ErrorBoundary';
import Sidebar from './components/Sidebar';
import MainChat from './components/MainChat';
import LoadingSpinner from './components/mainchat/LoadingSpinner';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading time and initialize app
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Show loading for 2 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleNewChat = () => {
    setMessages([]);
    setSearchQuery('');
    // Clear messages using cache manager
    cacheManager.safeSaveToLocalStorage([]);
  };

  const handleClearChat = () => {
    setMessages([]);
    setSearchQuery('');
    // Clear messages using cache manager
    cacheManager.safeSaveToLocalStorage([]);
  };

  // Show loading spinner while loading
  if (isLoading) {
    return (
      <HelmetProvider>
        <LoadingSpinner />
      </HelmetProvider>
    );
  }

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <NotificationProvider>
          <div className="h-screen bg-primary text-primary flex theme-transition">
        {/* Mobile Header - Only visible on mobile */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-primary border-b border-gray-800 dark:border-gray-700 px-4 py-3 flex items-center justify-between backdrop-blur-sm bg-opacity-95">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <img 
              src="/serguo.jpeg" 
              alt="Serguo AI Logo" 
              className="w-8 h-8 rounded-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <h1 className="text-white text-lg font-semibold">Serguo AI</h1>
          </div>
          
          {/* Menu/Close Button - Right side */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
          >
            {sidebarOpen ? (
              // X icon when sidebar is open
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              // Hamburger menu when sidebar is closed
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Sidebar */}
        <Sidebar 
          isOpen={sidebarOpen} 
          onToggle={() => setSidebarOpen(!sidebarOpen)} 
          onClearChat={handleClearChat}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col ml-0 lg:ml-16 pb-32 sm:pb-36 pt-16 lg:pt-0">
          {/* Main Chat Area */}
          <MainChat 
            onNewChat={handleNewChat}
            messages={messages}
            setMessages={setMessages}
            searchQuery={searchQuery}
          />
        </div>
      </div>
        </NotificationProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
