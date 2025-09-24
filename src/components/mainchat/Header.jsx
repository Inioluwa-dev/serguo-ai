import React from 'react';

const Header = () => {
  return (
    <div className="fixed top-2 sm:top-4 left-8 sm:left-12 md:left-20 z-20 px-4 sm:px-6 md:px-8">
      <div className="flex items-center gap-1 sm:gap-2">
        <img 
          src="/serguo.jpeg" 
          alt="Serguo AI Logo" 
          className="w-5 h-5 sm:w-6 md:w-8 sm:h-6 md:h-8 rounded-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
        <div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Serguo AI</h1>
          <p className="text-xs sm:text-sm text-gray-400 -mt-0.5 sm:-mt-1">Your Image to Text AI</p>
        </div>
      </div>
    </div>
  );
};

export default Header;
