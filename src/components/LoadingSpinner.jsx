import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-primary flex items-center justify-center z-50">
      <div className="relative">
        {/* Outer Circle */}
        <div className="w-20 h-20 border-4 border-transparent border-t-blue-500 border-r-blue-500 rounded-full animate-spin"></div>
        
        {/* Middle Circle */}
        <div className="absolute top-2 left-2 w-16 h-16 border-4 border-transparent border-t-green-500 border-r-green-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        
        {/* Inner Circle */}
        <div className="absolute top-4 left-4 w-12 h-12 border-4 border-transparent border-t-purple-500 border-r-purple-500 rounded-full animate-spin" style={{ animationDuration: '1s' }}></div>
        
        {/* Center Dot */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full animate-pulse"></div>
      </div>
      
      {/* Loading Text */}
      <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2">
        <p className="text-white text-lg font-semibold animate-pulse">Loading Serguo AI...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
