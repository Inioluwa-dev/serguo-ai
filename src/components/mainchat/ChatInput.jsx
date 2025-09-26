import React, { useEffect } from 'react';
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
  // Handle mobile keyboard visibility
  useEffect(() => {
    const handleFocus = () => {
      // Scroll to input when focused on mobile
      setTimeout(() => {
        const input = document.querySelector('input[type="text"]');
        if (input && window.innerWidth <= 768) {
          input.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'nearest'
          });
        }
      }, 300);
    };

    const handleBlur = () => {
      // Reset scroll when input loses focus
      if (window.innerWidth <= 768) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    const input = document.querySelector('input[type="text"]');
    if (input) {
      input.addEventListener('focus', handleFocus);
      input.addEventListener('blur', handleBlur);
    }

    return () => {
      if (input) {
        input.removeEventListener('focus', handleFocus);
        input.removeEventListener('blur', handleBlur);
      }
    };
  }, []);

  return (
    <div className="p-4 border-t border-gray-800 dark:border-gray-700 bg-primary safe-area-pb">
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
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
            className={`w-full pl-12 pr-12 py-3 input-bg border input-border rounded-full input-text placeholder-gray-400 focus:outline-none focus-border focus:ring-1 focus:ring-gray-600 text-base theme-transition ${
              isHighlighted ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600' : ''
            }`}
            style={{borderRadius: '50px'}}
            autoFocus
          />
          
          {/* Upload Link Icon */}
          <button
            type="button"
            onClick={() => document.getElementById('image-upload').click()}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 p-2 text-muted hover:text-primary transition-colors cursor-pointer"
            title="Upload file"
          >
            <FiLink className="text-lg" />
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
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 bg-red-500 hover:bg-red-600 text-white cursor-pointer rounded-full transition-colors"
              title="Stop request"
            >
              <div className="w-4 h-4 border-2 border-white rounded-sm"></div>
            </button>
          ) : (
            <button
              type="submit"
              disabled={!inputValue.trim() && !selectedImage}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 bg-tertiary hover-bg-primary disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer rounded-full transition-colors"
              title={selectedImage ? "Send image" : "Send message"}
            >
              <FiSend className="text-primary text-sm" />
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
        <div className="text-center mt-2">
          <p className="text-xs text-muted">made by mr heritage</p>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
