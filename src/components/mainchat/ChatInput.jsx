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
  isHighlighted 
}) => {
  return (
    <div className="p-3 sm:p-6 border-t border-gray-800 dark:border-gray-700 bg-primary overflow-hidden">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
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
            className={`w-full pl-14 sm:pl-16 pr-12 sm:pr-16 py-3 sm:py-4 input-bg border input-border rounded-2xl input-text placeholder-gray-400 focus:outline-none focus-border focus:ring-1 focus:ring-gray-600 text-base sm:text-lg theme-transition pulse-glow ${
              isHighlighted ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600' : ''
            }`}
            style={{borderRadius: '16px'}}
            autoFocus
          />
          
          {/* Upload Link Icon */}
          <button
            type="button"
            onClick={() => document.getElementById('image-upload').click()}
            className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 p-1.5 sm:p-2 text-muted hover:text-primary transition-colors cursor-pointer"
            title="Upload file"
          >
            <FiLink className="text-lg sm:text-xl" />
          </button>
          
          {/* Hidden File Input */}
          <input
            id="image-upload"
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/bmp,image/svg+xml,application/pdf"
            onChange={handleImageUpload}
            className="hidden"
          />
          
          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputValue.trim() && !selectedImage}
            className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 p-2 sm:p-3 bg-tertiary hover-bg-primary disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer rounded-full transition-colors"
            title={selectedImage ? "Send image" : "Send message"}
          >
            <FiSend className="text-primary text-sm sm:text-base" />
          </button>
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
        <div className="text-center mt-2 sm:mt-3">
          <p className="text-xs text-muted">made by mr heritage</p>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
