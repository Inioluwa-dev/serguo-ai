import React from 'react';
import { FiSend, FiLink } from 'react-icons/fi';
import FilePreview from './FilePreview';

const ChatInput = ({ 
  inputValue, 
  setInputValue, 
  handleSubmit, 
  handleImageUpload, 
  handlePaste,
  handleTextSelection, 
  handleKeyDown, 
  imagePreview, 
  selectedImage, 
  removeImagePreview, 
  isHighlighted,
  isRequestActive,
  stopCurrentRequest
}) => {
  return (
    <div className="p-1 sm:p-2 md:p-4 border-t border-gray-800 dark:border-gray-700 bg-primary overflow-hidden">
      <form onSubmit={handleSubmit} className="max-w-[280px] xs:max-w-sm sm:max-w-md md:max-w-lg mx-auto ultra-mobile-form small-mobile-form">
        {/* File Preview */}
        <FilePreview 
          imagePreview={imagePreview}
          selectedImage={selectedImage}
          removeImagePreview={removeImagePreview}
        />
        
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onPaste={handlePaste}
            onSelect={handleTextSelection}
            onMouseUp={handleTextSelection}
            onKeyUp={handleTextSelection}
            onKeyDown={handleKeyDown}
            placeholder={imagePreview ? "Add a message to go with your image..." : "Message Serguo AI..."}
            className={`w-full pl-16 sm:pl-10 md:pl-14 pr-8 sm:pr-10 md:pr-14 py-2 sm:py-2.5 md:py-3 input-bg border input-border rounded-2xl input-text placeholder-gray-400 focus:outline-none focus-border focus:ring-1 focus:ring-gray-600 text-xs sm:text-sm md:text-base theme-transition pulse-glow ultra-mobile-input small-mobile-input ${
              isHighlighted ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600' : ''
            }`}
            style={{borderRadius: '16px'}}
            autoFocus
          />
          
          {/* Upload Link Icon */}
          <button
            type="button"
            onClick={() => document.getElementById('image-upload').click()}
            className="absolute left-1 sm:left-1.5 md:left-2 top-1/2 transform -translate-y-1/2 p-0.5 sm:p-1 md:p-1.5 text-muted hover:text-primary transition-colors cursor-pointer ultra-mobile-button small-mobile-button"
            title="Upload file"
          >
            <FiLink className="text-xs sm:text-sm md:text-lg ultra-mobile-icon small-mobile-icon" />
          </button>
          
          {/* Hidden File Input */}
          <input
            id="image-upload"
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/bmp,image/svg+xml,application/pdf"
            onChange={handleImageUpload}
            className="hidden"
          />
          
          {/* Send/Stop Button */}
          {isRequestActive ? (
            <button
              type="button"
              onClick={stopCurrentRequest}
              className="absolute right-1 sm:right-1.5 md:right-2 top-1/2 transform -translate-y-1/2 p-1 sm:p-1.5 md:p-2 bg-red-500 hover:bg-red-600 text-white cursor-pointer rounded-full transition-colors ultra-mobile-button small-mobile-button"
              title="Stop request"
            >
              <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white rounded-sm"></div>
            </button>
          ) : (
            <button
              type="submit"
              disabled={!inputValue.trim() && !selectedImage}
              className="absolute right-1 sm:right-1.5 md:right-2 top-1/2 transform -translate-y-1/2 p-1 sm:p-1.5 md:p-2 bg-tertiary hover-bg-primary disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer rounded-full transition-colors ultra-mobile-button small-mobile-button"
              title={selectedImage ? "Send image" : "Send message"}
            >
              <FiSend className="text-primary text-xs sm:text-xs md:text-sm ultra-mobile-icon small-mobile-icon" />
            </button>
          )}
        </div>
        
        {/* Text Selection Indicator */}
        {isHighlighted && (
          <div className="mt-2 text-center">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
              Text selected - ready to send
            </span>
          </div>
        )}
        
        {/* Made by Mr Heritage */}
        <div className="text-center mt-0.5 sm:mt-1 md:mt-2">
          <p className="text-xs text-muted">made by mr heritage</p>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
