
import React, { useState, useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
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
    // Clear localStorage
    localStorage.removeItem('serguo-messages');
  };

  const handleClearChat = () => {
    setMessages([]);
    setSearchQuery('');
    // Clear localStorage
    localStorage.removeItem('serguo-messages');
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
    <HelmetProvider>
      <div className="h-screen bg-primary text-primary flex theme-transition">
        {/* Sidebar */}
        <Sidebar 
          isOpen={sidebarOpen} 
          onToggle={() => setSidebarOpen(!sidebarOpen)} 
          onClearChat={handleClearChat}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col ml-12 sm:ml-16 lg:ml-0 pb-32 sm:pb-36">
          {/* Main Chat Area */}
          <MainChat 
            onNewChat={handleNewChat}
            messages={messages}
            setMessages={setMessages}
            searchQuery={searchQuery}
          />
        </div>
      </div>
    </HelmetProvider>
  );
}

export default App;
