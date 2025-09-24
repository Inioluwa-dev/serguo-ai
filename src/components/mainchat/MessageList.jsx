import React from 'react';
import { FiImage } from 'react-icons/fi';
import TypingAnimation from './TypingAnimation';
import MessageItem from './MessageItem';
import TypingIndicator from './TypingIndicator';

const MessageList = ({ 
  messages, 
  filteredMessages, 
  searchQuery, 
  isTyping, 
  settings, 
  copiedMessageId, 
  copyMessage, 
  messagesEndRef 
}) => {
  return (
    <div className="flex-1 overflow-y-auto px-2 sm:px-4 md:px-6 py-2 sm:py-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 relative z-10">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center max-w-2xl">
            {/* Animated Greeting */}
            <TypingAnimation />
          </div>
        </div>
      ) : (
        <div className="max-w-2xl sm:max-w-3xl mx-auto space-y-3 sm:space-y-4 md:space-y-6">
          {/* Image Placeholder Summary */}
          {filteredMessages.some(msg => msg.isImagePlaceholder) && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2">
                <FiImage className="text-blue-500 text-sm" />
                <span className="text-xs text-blue-600 dark:text-blue-400">
                  Some images in this conversation are not saved due to storage limits
                </span>
              </div>
            </div>
          )}
          
          {filteredMessages.length === 0 && searchQuery ? (
            <div className="text-center py-4 sm:py-6 md:py-8">
              <p className="text-gray-400 text-xs sm:text-sm">No messages found matching "{searchQuery}"</p>
            </div>
          ) : (
            filteredMessages.map((message) => (
              <MessageItem
                key={message.id}
                message={message}
                searchQuery={searchQuery}
                copiedMessageId={copiedMessageId}
                copyMessage={copyMessage}
              />
            ))
          )}
          
          {/* Typing Indicator */}
          <TypingIndicator isTyping={isTyping} settings={settings} />
          
          {/* Scroll target - placed at the bottom to scroll to last message */}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};

export default MessageList;
