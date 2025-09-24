import React, { useState } from 'react';
import { FiX, FiMessageSquare, FiUpload, FiSearch, FiTrash2, FiSettings, FiCopy, FiImage, FiZap, FiHelpCircle } from 'react-icons/fi';

const HelpPopup = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const helpItems = [
    {
      icon: FiMessageSquare,
      title: "How to Chat",
      description: "Type your message and press Enter or click Send. Ask questions, upload images, or request analysis.",
      tips: ["Use natural language", "Be specific with requests", "Try follow-up questions"]
    },
    {
      icon: FiUpload,
      title: "Upload Files",
      description: "Click the link icon (🔗) to upload images or PDFs. Drag & drop also works!",
      tips: ["Supported: JPEG, PNG, GIF, WebP, PDF", "Max size: 10MB", "Paste images with Ctrl+V"]
    },
    {
      icon: FiSearch,
      title: "Search Messages",
      description: "Use the search bar in the sidebar to find specific messages in your conversation.",
      tips: ["Search is instant", "Case-insensitive", "Highlights matches"]
    },
    {
      icon: FiCopy,
      title: "Copy Messages",
      description: "Click the 'Copy' button below any message to copy it to your clipboard.",
      tips: ["One-click copying", "Works with all messages", "Visual confirmation"]
    },
    {
      icon: FiTrash2,
      title: "Clear Chat",
      description: "Click the trash icon in the sidebar to clear all messages and start fresh.",
      tips: ["Cannot be undone", "Settings are preserved", "Starts new conversation"]
    },
    {
      icon: FiSettings,
      title: "Settings",
      description: "Customize your experience with font size, sound effects, and other preferences.",
      tips: ["Auto-save enabled", "Theme preferences", "Notification settings"]
    }
  ];

  const quickTips = [
    "Ask 'What's in this image?' when uploading photos",
    "Use Ctrl+A to select all text in the input",
    "The AI remembers your conversation context",
    "Try asking follow-up questions for more details",
    "Upload PDFs to extract and analyze text",
    "Search your history to find specific information"
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-secondary border sidebar-border rounded-xl w-full max-w-3xl h-[85vh] flex flex-col overflow-hidden theme-transition">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sidebar-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <FiHelpCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary">Help & Support</h1>
              <p className="text-sm text-secondary">Simple guide to using Serguo AI</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
          >
            <FiX className="w-6 h-6 text-primary" />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 border-b sidebar-border">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search help topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 input-bg border input-border rounded-lg input-text focus:outline-none focus-border"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
          <div className="p-6">
            {searchQuery ? (
              <div>
                <h2 className="text-xl font-semibold text-primary mb-4">Search Results</h2>
                {helpItems.filter(item => 
                  item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  item.description.toLowerCase().includes(searchQuery.toLowerCase())
                ).length > 0 ? (
                  <div className="space-y-4">
                    {helpItems.filter(item => 
                      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      item.description.toLowerCase().includes(searchQuery.toLowerCase())
                    ).map((item, index) => (
                      <div key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                            <item.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-primary mb-2">{item.title}</h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-3">{item.description}</p>
                            <div className="space-y-1">
                              {item.tips.map((tip, tipIndex) => (
                                <div key={tipIndex} className="text-sm text-gray-500 dark:text-gray-400">
                                  • {tip}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FiSearch className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No results found for "{searchQuery}"</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-8">
                {/* Quick Tips */}
                <div>
                  <h2 className="text-xl font-semibold text-primary mb-4">Quick Tips</h2>
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {quickTips.map((tip, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <span className="text-blue-500 text-lg">💡</span>
                          <span className="text-sm text-gray-700 dark:text-gray-300">{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Help Items */}
                <div>
                  <h2 className="text-xl font-semibold text-primary mb-4">How to Use Serguo AI</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {helpItems.map((item, index) => (
                      <div key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-all duration-200">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                            <item.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-primary mb-2">{item.title}</h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-3">{item.description}</p>
                            <div className="space-y-1">
                              {item.tips.map((tip, tipIndex) => (
                                <div key={tipIndex} className="text-sm text-gray-500 dark:text-gray-400">
                                  • {tip}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPopup;