import React, { useState, useEffect } from 'react';

const TypingAnimation = () => {
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const fullText = "My name is Serguo AI 🤖\nHow can I help you today? ✨";
  
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setDisplayText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 80); // Slightly faster typing speed
    
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500); // Cursor blink speed
    
    return () => clearInterval(cursorInterval);
  }, []);
  
  return (
    <div className="text-center">
      <h2 className="text-2xl sm:text-4xl font-semibold text-primary mb-6 sm:mb-8 text-glow font-mono whitespace-pre-line">
        {displayText}
        <span className={`inline-block w-0.5 h-8 sm:h-12 bg-primary ml-1 ${showCursor ? 'opacity-100' : 'opacity-0'}`}></span>
      </h2>
    </div>
  );
};

export default TypingAnimation;
