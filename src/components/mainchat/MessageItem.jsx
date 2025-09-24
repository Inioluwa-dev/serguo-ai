import React from 'react';
import { FiCopy, FiCheck, FiImage } from 'react-icons/fi';

const MessageItem = ({ message, searchQuery, copiedMessageId, copyMessage }) => {
  return (
    <div
      key={message.id}
      className={`flex gap-2 sm:gap-4 ${message.isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`flex gap-2 sm:gap-4 max-w-[90%] sm:max-w-[80%] ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {message.isUser ? (
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-500">
            <span className="text-white text-xs sm:text-sm font-semibold">U</span>
          </div>
        ) : (
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
            <img 
              src="/serguo.jpeg" 
              alt="Serguo AI" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="w-full h-full bg-green-600 flex items-center justify-center" style={{display: 'none'}}>
              <span className="text-white text-xs sm:text-sm font-semibold">S</span>
            </div>
          </div>
        )}
        <div className={`px-3 py-2 sm:px-4 sm:py-3 rounded-lg text-sm sm:text-base mb-4 ${
          message.isUser 
            ? 'bg-gray-800 text-white' 
            : 'bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
        }`}>
          {/* File Display */}
          {message.image && !message.isImagePlaceholder && (
            <div className="mb-2 sm:mb-3">
              {message.image.startsWith('data:application/pdf') ? (
                <div 
                  className="max-w-full h-32 sm:h-40 bg-red-50 dark:bg-red-900/20 rounded-lg border-2 border-dashed border-red-300 dark:border-red-600 flex flex-col items-center justify-center p-4 cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => window.open(message.image, '_blank')}
                >
                  <svg className="w-8 h-8 sm:w-12 sm:h-12 text-red-500 mb-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                  <p className="text-xs text-red-600 dark:text-red-400 font-medium text-center">
                    Click to open PDF
                  </p>
                </div>
              ) : (
                <img 
                  src={message.image} 
                  alt="Uploaded image" 
                  className="max-w-full h-auto rounded-lg shadow-lg cursor-pointer hover:opacity-90 transition-opacity"
                  style={{ maxHeight: '200px', objectFit: 'contain' }}
                  onClick={() => window.open(message.image, '_blank')}
                />
              )}
            </div>
          )}
          
          {/* File Placeholder */}
          {message.isImagePlaceholder && (
            <div className="mb-2 sm:mb-3">
              <div className="max-w-full h-32 sm:h-40 bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center p-4">
                <FiImage className="text-2xl sm:text-3xl text-gray-400 mb-2" />
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center">
                  {message.content ? 'File + Text sent' : 'File sent'}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  (File data not saved)
                </p>
              </div>
            </div>
          )}
          
                 {/* Text Content */}
                 {message.content && (
                   <div>
                     <p className="text-xs sm:text-sm leading-relaxed text-gray-900 dark:text-white">
                       {searchQuery ? (
                         message.content.split(new RegExp(`(${searchQuery})`, 'gi')).map((part, index) => 
                           part.toLowerCase() === searchQuery.toLowerCase() ? (
                             <mark key={index} className="bg-yellow-400 text-black px-1 rounded">
                               {part.replace(/[<>]/g, '')}
                             </mark>
                           ) : (
                             part.replace(/[<>]/g, '')
                           )
                         )
                       ) : (
                         message.content.replace(/[<>]/g, '')
                       )}
                     </p>
              
              {/* Copy Button */}
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
                <button
                  onClick={() => copyMessage(message.id, message.content)}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-300 transition-colors cursor-pointer"
                  title="Copy message"
                >
                  {copiedMessageId === message.id ? (
                    <>
                      <FiCheck className="w-3 h-3" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <FiCopy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
