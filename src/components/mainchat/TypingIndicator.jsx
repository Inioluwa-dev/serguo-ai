import React from 'react';

const TypingIndicator = ({ isTyping, settings }) => {
  if (!isTyping || !settings.typingIndicators) return null;

  return (
    <div className={`flex gap-2 sm:gap-4 ${settings.compactMode ? 'py-2' : ''}`}>
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
      <div className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 sm:px-4 sm:py-3">
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce"></div>
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
