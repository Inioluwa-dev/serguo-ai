import React from 'react';

const Header = () => {
  return (
    <div className="fixed top-4 left-6 sm:left-16 z-20 pl-0 sm:pl-4">
      <div className="flex items-center gap-2">
        <img 
          src="/serguo.jpeg" 
          alt="Serguo AI Logo" 
          className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Serguo AI</h1>
          <p className="text-xs sm:text-sm text-gray-400 -mt-1">Your Image to Text AI</p>
        </div>
      </div>
    </div>
  );
};

export default Header;
