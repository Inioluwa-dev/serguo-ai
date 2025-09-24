import React from 'react';

const FilePreview = ({ imagePreview, selectedImage, removeImagePreview }) => {
  if (!imagePreview) return null;

  return (
    <div className="mb-3 sm:mb-4 relative">
      <div className="relative inline-block bg-gray-100 dark:bg-gray-800 rounded-2xl p-2 sm:p-3 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="relative">
          {selectedImage && selectedImage.type === 'application/pdf' ? (
            <div className="max-w-[200px] sm:max-w-xs max-h-32 sm:max-h-40 rounded-lg bg-red-50 dark:bg-red-900/20 flex flex-col items-center justify-center p-4 border-2 border-dashed border-red-300 dark:border-red-600">
              <svg className="w-8 h-8 sm:w-12 sm:h-12 text-red-500 mb-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
              <p className="text-xs text-red-600 dark:text-red-400 font-medium text-center">
                {selectedImage.name}
              </p>
            </div>
          ) : (
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="max-w-[200px] sm:max-w-xs max-h-32 sm:max-h-40 rounded-lg object-cover shadow-sm"
            />
          )}
          <button
            type="button"
            onClick={removeImagePreview}
            className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-xs font-bold shadow-lg transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
            title="Remove file"
          >
            ×
          </button>
        </div>
        <div className="mt-1 sm:mt-2 text-xs text-gray-600 dark:text-gray-400">
          {selectedImage && selectedImage.type === 'application/pdf' ? 'PDF ready to send' : 'Image ready to send'}
        </div>
      </div>
    </div>
  );
};

export default FilePreview;
