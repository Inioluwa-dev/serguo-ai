import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-primary flex items-center justify-center z-50">
      <div className="relative">
        {/* Outer Circle - White */}
        <div className="w-24 h-24 border-4 border-transparent border-t-white border-r-white rounded-full animate-spin" style={{ animationDuration: '2s' }}></div>
        
        {/* Middle Circle - White */}
        <div className="absolute top-2 left-2 w-20 h-20 border-4 border-transparent border-t-white border-r-white rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        
        {/* Inner Circle - White */}
        <div className="absolute top-4 left-4 w-16 h-16 border-4 border-transparent border-t-white border-r-white rounded-full animate-spin" style={{ animationDuration: '1s' }}></div>
        
        {/* Smallest Circle - White */}
        <div className="absolute top-6 left-6 w-12 h-12 border-4 border-transparent border-t-white border-r-white rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
        
        {/* Center Dot */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full animate-pulse shadow-lg"></div>
      </div>
      
      {/* Loading Text with Glow Effect */}
      <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 text-center">
        <p className="text-white text-xl font-bold animate-pulse text-glow">
          Loading Serguo AI...
        </p>
        <p className="text-gray-300 text-sm mt-2 animate-pulse">
          Your Image to Text AI Assistant
        </p>
      </div>
      
      {/* Animated Dots */}
      <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 flex space-x-1">
        <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
