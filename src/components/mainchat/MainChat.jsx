import React, { useState, useRef, useEffect } from 'react';
import { getContextualResponse } from '../../services/geminiApi';
import cacheManager from '../../services/cacheManager';
import { useNotification } from '../../contexts/NotificationContext';
import SEO from '../seo/SEO';
import Header from './Header';
import BackgroundBalls from './BackgroundBalls';
import StatusIndicators from './StatusIndicators';
import MessageList from './MessageList';
import ChatInput from './ChatInput';

const MainChat = ({ onNewChat, messages, setMessages, searchQuery }) => {
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [isRequestActive, setIsRequestActive] = useState(false);
  const [requestTimeout, setRequestTimeout] = useState(null);
  const abortControllerRef = useRef(null);
  const currentTimeoutRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [settings, setSettings] = useState({
    autoSave: true,
    typingIndicators: true,
    soundEffects: false,
    animations: true,
    compactMode: false,
    fontSize: 'medium'
  });
  const audioContextRef = useRef(null);
  const { showError, showWarning } = useNotification();

  // Function to stop the current request
  const stopCurrentRequest = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    
    if (currentTimeoutRef.current) {
      clearTimeout(currentTimeoutRef.current);
      currentTimeoutRef.current = null;
    }
    
    if (requestTimeout) {
      clearTimeout(requestTimeout);
      setRequestTimeout(null);
    }
    
    setIsTyping(false);
    setIsRequestActive(false);
    setIsRetrying(false);
    setApiError(null);
    
    // Add a message indicating the request was cancelled
    const cancelledMessage = {
      id: Date.now() + 1,
      content: "Request cancelled by user.",
      isUser: false,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, cancelledMessage]);
  };

  // Enhanced cache management using the new cache manager
  const safeSaveToLocalStorage = (messagesToSave) => {
    cacheManager.safeSaveToLocalStorage(messagesToSave);
  };

  // Load settings and messages using enhanced cache manager
  React.useEffect(() => {
    const savedSettings = localStorage.getItem('serguo-settings');
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      setSettings(parsedSettings);
      
      // Update cache manager config with user settings
      cacheManager.updateConfig({
        maxMessages: parsedSettings.messageLimit || 50,
        messageExpiryDays: parsedSettings.messageExpiryDays || 30
      });
    }
    
    // Load saved messages if auto-save is enabled
    if (settings.autoSave) {
      const loadedMessages = cacheManager.loadMessages();
      if (loadedMessages.length > 0) {
        setMessages(loadedMessages);
        
        // Force scroll to bottom after loading messages
        setTimeout(() => {
          if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'end' 
            });
          }
        }, 100);
      }
    }
  }, []);

  // Enhanced periodic cleanup using cache manager
  React.useEffect(() => {
    if (settings.autoSave && messages.length > 0) {
      // Check if we should perform periodic cleanup
      if (cacheManager.shouldPerformCleanup(messages.length)) {
        console.log('Performing periodic cache cleanup...');
        safeSaveToLocalStorage(messages);
      }
      
      // Check if storage is approaching limits
      if (cacheManager.isStorageNearLimit()) {
        console.log('Storage approaching limit, performing cleanup...');
        safeSaveToLocalStorage(messages);
      }
    }
  }, [messages.length, settings.autoSave]);

  // Enhanced auto-scroll function - scroll to last message before input
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      // Scroll the messagesEndRef into view (which is now at the bottom)
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'end',
        inline: 'nearest'
      });
      
      // Also try to scroll the container to bottom as backup
      const messagesContainer = messagesEndRef.current.closest('.overflow-y-auto');
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    // Multiple attempts to ensure scrolling works - more aggressive
    const timeouts = [
      setTimeout(scrollToBottom, 10),
      setTimeout(scrollToBottom, 50),
      setTimeout(scrollToBottom, 150),
      setTimeout(scrollToBottom, 300),
      setTimeout(scrollToBottom, 500)
    ];
    
    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [messages, isTyping]);

  // Scroll to bottom when component first loads with messages
  useEffect(() => {
    if (messages.length > 0) {
      // Multiple attempts for initial load
      const timeouts = [
        setTimeout(scrollToBottom, 100),
        setTimeout(scrollToBottom, 500),
        setTimeout(scrollToBottom, 1000)
      ];
      
      return () => {
        timeouts.forEach(timeout => clearTimeout(timeout));
      };
    }
  }, []);

  // Force scroll to bottom on page load
  useEffect(() => {
    const timeouts = [];
    
    const handleLoad = () => {
      timeouts.push(setTimeout(scrollToBottom, 100));
      timeouts.push(setTimeout(scrollToBottom, 500));
    };
    
    // Scroll on page load
    handleLoad();
    
    // Also scroll when window loads
    window.addEventListener('load', handleLoad);
    
    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  // Cleanup AudioContext on unmount
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, []);

  // Filter messages based on search query
  const filteredMessages = searchQuery 
    ? messages.filter(message => 
        message.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : messages;

  // Sound effects function with older browser compatibility
  const playSound = (type) => {
    if (!settings.soundEffects) return;
    
    try {
      // Check for Web Audio API support
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) {
        // Fallback to simple beep for older browsers
        return;
      }
      
      // Reuse existing AudioContext or create new one
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }
      
      const audioContext = audioContextRef.current;
      
      // Resume context if suspended (required for iOS)
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
      
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      if (type === 'send') {
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);
      } else if (type === 'receive') {
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.15);
      }
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch (error) {
      // Silent fail for older browsers
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Check if it's a valid file type (images or PDFs)
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'image/svg+xml', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        showError('Please select a valid file (JPEG, PNG, GIF, WebP, BMP, SVG, or PDF)');
        return;
      }

      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        showError('File size should be less than 10MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(file);
        setImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePaste = (e) => {
    const items = e.clipboardData.items;
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      // Check for images or PDFs
      if (item.type.indexOf('image') !== -1 || item.type === 'application/pdf') {
        const file = item.getAsFile();
        
        if (file) {
          // Check file size (max 10MB)
          if (file.size > 10 * 1024 * 1024) {
            showError('File size should be less than 10MB');
            return;
          }

          const reader = new FileReader();
          reader.onload = (event) => {
            setSelectedImage(file);
            setImagePreview(event.target.result);
          };
          reader.readAsDataURL(file);
        }
        break;
      }
    }
  };

  const removeImagePreview = () => {
    setSelectedImage(null);
    setImagePreview(null);
    // Reset file input
    const fileInput = document.getElementById('image-upload');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  // Handle text selection
  const handleTextSelection = () => {
    setTimeout(() => {
      const input = document.querySelector('input[type="text"]');
      if (input) {
        const start = input.selectionStart;
        const end = input.selectionEnd;
        const hasSelection = start !== end;
        const isAllSelected = hasSelection && start === 0 && end === input.value.length;
        setIsHighlighted(hasSelection);
        
        // Check if we're in light mode
        const isLightMode = !document.documentElement.classList.contains('dark');
        
        // Add special styling for Ctrl+A (select all) - change selection background
        if (isAllSelected) {
          if (isLightMode) {
            // Light mode: black selection background
            input.style.setProperty('--selection-bg', 'black');
            input.style.setProperty('--selection-color', 'white');
          } else {
            // Dark mode: white selection background
            input.style.setProperty('--selection-bg', 'white');
            input.style.setProperty('--selection-color', 'black');
          }
        } else {
          // Reset to default
          input.style.setProperty('--selection-bg', '');
          input.style.setProperty('--selection-color', '');
        }
      }
    }, 10);
  };

  // Handle Ctrl+A key combination
  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === 'a') {
      setTimeout(() => {
        const input = e.target;
        // Check if we're in light mode
        const isLightMode = !document.documentElement.classList.contains('dark');
        
        if (isLightMode) {
          // Light mode: black selection background
          input.style.setProperty('--selection-bg', 'black');
          input.style.setProperty('--selection-color', 'white');
        } else {
          // Dark mode: white selection background
          input.style.setProperty('--selection-bg', 'white');
          input.style.setProperty('--selection-color', 'black');
        }
      }, 10);
    }
  };

  // Copy message to clipboard
  const copyMessage = async (messageId, content) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (error) {
      console.error('Failed to copy message:', error);
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if offline before processing
    if (!navigator.onLine) {
      const offlineMessage = {
        id: Date.now(),
        content: "You're not connected to the internet. Please check your connection and try again.",
        isUser: false,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, offlineMessage]);
      return;
    }
    
    // Check for text extraction request
    if (inputValue.toLowerCase().includes('extract text') || 
        inputValue.toLowerCase().includes('extract the text') ||
        inputValue.toLowerCase().includes('show me the text') ||
        inputValue.toLowerCase().includes('text extraction')) {
      // If there's an image, extract text from it
      if (selectedImage) {
        const userMessage = {
          id: Date.now(),
          content: inputValue,
          image: imagePreview,
          isUser: true,
          timestamp: new Date().toISOString()
        };
        
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setSelectedImage(null);
        setImagePreview(null);
        
        // Get AI response for text extraction
        setIsTyping(true);
        setApiError(null);
        setIsRetrying(false);
        setIsRequestActive(true);
        
        // Create AbortController for request cancellation
        abortControllerRef.current = new AbortController();
        
        // Set 30-second timeout
        const timeout = setTimeout(() => {
          if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            setIsTyping(false);
            setIsRequestActive(false);
            setIsRetrying(false);
            setApiError("Text extraction timed out after 30 seconds. Please try again.");
            
            const timeoutMessage = {
              id: Date.now() + 1,
              content: "Text extraction timed out after 30 seconds. Please try again.",
              isUser: false,
              timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, timeoutMessage]);
          }
        }, 30000);
        currentTimeoutRef.current = timeout;
        setRequestTimeout(timeout);
        
        try {
          const aiResponse = await getContextualResponse(
            messages, 
            "Please extract all text from this image and format it nicely with proper structure. Use markdown formatting with headings, bold text, and organized sections. Make it look professional and well-structured, not just raw text. Include all visible text, numbers, and any other textual content.",
            imagePreview,
            abortControllerRef.current.signal
          );

          // Create a single AI message that contains both analysis and extracted text
          const aiMessage = {
            id: Date.now() + 1,
            content: aiResponse,
            isUser: false,
            isExtractedText: true, // Mark this as extracted text for special formatting
            timestamp: new Date().toISOString()
          };
          
          setMessages(prev => [...prev, aiMessage]);
          setIsTyping(false);
          setIsRequestActive(false);
          
          // Clear timeout and abort controller
          clearTimeout(timeout);
          currentTimeoutRef.current = null;
          setRequestTimeout(null);
          abortControllerRef.current = null;
          
          // Auto-save if enabled
          if (settings.autoSave) {
            // Create a copy of the AI message with truncated content for storage
            const storageMessage = {
              ...aiMessage,
              content: aiMessage.content.length > 5000 
                ? aiMessage.content.substring(0, 5000) + '... [Content truncated for storage]'
                : aiMessage.content
            };
            
            safeSaveToLocalStorage([...messages, userMessage, storageMessage]);
          }
          
        } catch (error) {
          console.error('Error extracting text:', error);
          setIsTyping(false);
          setIsRequestActive(false);
          setIsRetrying(false);
          
          // Clear timeout and abort controller
          clearTimeout(timeout);
          currentTimeoutRef.current = null;
          setRequestTimeout(null);
          abortControllerRef.current = null;
          
          // Check if request was aborted
          if (error.name === 'AbortError') {
            console.log('Text extraction was aborted');
            return;
          }
          
          setApiError(error.message);
        }
        return;
      }
    }
    
    if (inputValue.trim() || selectedImage) {
      const userMessage = {
        id: Date.now(),
        content: inputValue,
        image: imagePreview,
        isUser: true,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, userMessage]);
      setInputValue('');
      setSelectedImage(null);
      setImagePreview(null);
      
      // Play send sound
      playSound('send');
      
      // Auto-save if enabled (skip images to avoid quota issues)
      if (settings.autoSave) {
        try {
          // Create a message without image data for storage
          const messageForStorage = {
            ...userMessage,
            image: userMessage.image ? '[IMAGE_DATA]' : null // Replace image data with placeholder
          };
          safeSaveToLocalStorage([...messages, messageForStorage]);
        } catch (error) {
          console.warn('Failed to save to localStorage:', error.message);
        }
      }
      
      // Get AI response from Gemini API
      setIsTyping(true);
      setApiError(null);
      setIsRetrying(false);
      setIsRequestActive(true);
      
      // Create AbortController for request cancellation
      abortControllerRef.current = new AbortController();
      
      // Set 30-second timeout
      const timeout = setTimeout(() => {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
          setIsTyping(false);
          setIsRequestActive(false);
          setIsRetrying(false);
          setApiError("Request timed out after 30 seconds. Please try again.");
          
          const timeoutMessage = {
            id: Date.now() + 1,
            content: "Request timed out after 30 seconds. Please try again.",
            isUser: false,
            timestamp: new Date().toISOString()
          };
          setMessages(prev => [...prev, timeoutMessage]);
        }
      }, 30000);
      currentTimeoutRef.current = timeout;
      setRequestTimeout(timeout);
      
      try {
        const aiResponse = await getContextualResponse(
          messages, 
          inputValue.trim() || "Please analyze this image", 
          imagePreview,
          abortControllerRef.current.signal
        );

        const aiMessage = {
          id: Date.now() + 1,
          content: aiResponse,
          isUser: false,
          timestamp: new Date().toISOString()
        };
        
        setMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);
        setIsRequestActive(false);
        
        // Clear timeout and abort controller
        clearTimeout(timeout);
        currentTimeoutRef.current = null;
        setRequestTimeout(null);
        abortControllerRef.current = null;
        
        // Play receive sound
        playSound('receive');
        
        // Auto-save if enabled (skip images to avoid quota issues)
        if (settings.autoSave) {
          const messageForStorage = {
            ...aiMessage,
            image: aiMessage.image ? '[IMAGE_DATA]' : null
          };
          safeSaveToLocalStorage([...messages, userMessage, messageForStorage]);
        }
      } catch (error) {
        console.error('Error getting AI response:', error);
        setIsTyping(false);
        setIsRequestActive(false);
        setIsRetrying(false);
        
        // Clear timeout and abort controller
        clearTimeout(timeout);
        currentTimeoutRef.current = null;
        setRequestTimeout(null);
        abortControllerRef.current = null;
        
        // Check if request was aborted
        if (error.name === 'AbortError') {
          console.log('Request was aborted');
          return;
        }
        
        setApiError(error.message);
        
        // Fallback response
        const fallbackMessage = {
          id: Date.now() + 1,
          content: "I'm sorry, I'm having trouble connecting to the AI service right now. Please try again in a moment.",
          isUser: false,
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, fallbackMessage]);
      }
    }
  };

  // Get font size class
  const getFontSizeClass = () => {
    switch (settings.fontSize) {
      case 'small': return 'text-sm';
      case 'large': return 'text-lg';
      default: return 'text-base';
    }
  };

  // Structured Data for Serguo AI - 2025 Optimized
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Serguo AI",
    "alternateName": [
      "Serguo AI", 
      "Image to Text", 
      "Image to Text AI", 
      "AI Image to Text", 
      "Mr Heritage AI", 
      "Olayoriju Inioluwa AI",
      "Inioluwa AI",
      "AI Image Analysis Tool",
      "Free Image to Text Converter",
      "AI Image Recognition Tool",
      "Image Text Extractor",
      "AI Image Reader",
      "Smart Image Analysis",
      "AI Photo Analyzer",
      "Image Content Analyzer",
      "AI Visual Recognition",
      "Image Description Generator",
      "AI Image Interpreter",
      "Smart Image Scanner",
      "AI Image Processor",
      "Image Text Recognition",
      "AI Image Understanding",
      "Visual AI Assistant",
      "Image AI Tool",
      "AI Image Scanner",
      "Smart Image Reader",
      "AI Image Decoder",
      "Image Analysis AI",
      "AI Image Translator",
      "Visual Content AI"
    ],
    "description": "Serguo AI - Advanced Image to Text AI assistant powered by Google's Gemini 2.0 Flash model. Upload images, PDFs, and get detailed analysis. Free to use with cutting-edge image recognition capabilities. Created by Mr Heritage (Olayoriju Inioluwa).",
    "url": "https://serguo-ai.web.app",
    "applicationCategory": "WebApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "creator": {
      "@type": "Person",
      "name": "Mr Heritage",
      "alternateName": [
        "Olayoriju Inioluwa", 
        "Inioluwa", 
        "inioluwa_dev", 
        "Comibyte",
        "Mr Heritage Developer",
        "Olayoriju Developer"
      ],
      "url": "https://mr-heritage.web.app",
      "sameAs": [
        "https://github.com/Inioluwa_dev",
        "https://twitter.com/Inioluwa_dev",
        "https://mr-heritage.web.app"
      ],
      "jobTitle": "Full Stack Developer",
      "knowsAbout": [
        "React", 
        "JavaScript", 
        "Django", 
        "Tailwind CSS", 
        "Firebase", 
        "MongoDB", 
        "Git", 
        "AWS", 
        "Render"
      ]
    },
    "featureList": [
      "Image to Text Conversion",
      "AI Image Analysis", 
      "PDF Text Extraction", 
      "AI Chat Interface",
      "Real-time Search",
      "Dark/Light Mode",
      "Mobile Responsive",
      "Free to Use",
      "Google Gemini AI",
      "Advanced Image Recognition"
    ],
    "screenshot": "/serguo.jpeg",
    "softwareVersion": "2.0.0",
    "datePublished": "2025-01-01",
    "dateModified": "2025-01-01",
    "inLanguage": "en",
    "isAccessibleForFree": true,
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "permissions": "No special permissions required",
    "softwareHelp": {
      "@type": "CreativeWork",
      "name": "Serguo AI Help & Support",
      "description": "Comprehensive help documentation for using Serguo AI - Your Image to Text AI Assistant"
    },
    "keywords": [
      "Serguo AI",
      "Image to Text",
      "AI Image Analysis", 
      "Mr Heritage",
      "Olayoriju Inioluwa",
      "Free AI Tool",
      "Google Gemini",
      "AI Assistant",
      "Image Recognition",
      "PDF Reader",
      "AI Chat",
      "Image Text Extractor",
      "AI Image Reader",
      "Smart Image Analysis",
      "AI Photo Analyzer",
      "Image Content Analyzer",
      "AI Visual Recognition",
      "Image Description Generator",
      "AI Image Interpreter",
      "Smart Image Scanner",
      "AI Image Processor",
      "Image Text Recognition",
      "AI Image Understanding",
      "Visual AI Assistant",
      "Image AI Tool",
      "AI Image Scanner",
      "Smart Image Reader",
      "AI Image Decoder",
      "Image Analysis AI",
      "AI Image Translator",
      "Visual Content AI",
      "OCR AI",
      "AI Image Caption",
      "Image AI Assistant",
      "AI Image Analysis Tool",
      "Free Image AI",
      "AI Image Tool",
      "Image AI Converter",
      "AI Image Extractor",
      "Smart Image AI",
      "AI Image Reader Tool",
      "Image AI Scanner",
      "AI Image Analyzer Tool",
      "Visual AI Tool",
      "Image AI Processor",
      "AI Image Recognition Tool",
      "Image AI Assistant Tool",
      "AI Image Analysis Software",
      "Image AI Recognition",
      "AI Image Processing Tool",
      "Image AI Understanding Tool"
    ]
  };

  return (
    <div className={`flex-1 flex flex-col bg-primary h-screen ${getFontSizeClass()} theme-transition relative`}>
      {/* SEO Component */}
      <SEO
        title="Serguo AI - Image to Text AI Assistant | Mr Heritage"
        description="Serguo AI - Advanced Image to Text AI assistant powered by Google's Gemini 2.0 Flash model. Upload images, PDFs, and get detailed analysis. Free to use with cutting-edge image recognition capabilities. Created by Mr Heritage (Olayoriju Inioluwa)."
        keywords="Serguo AI, Image to Text, AI Image Analysis, Mr Heritage, Olayoriju Inioluwa, Inioluwa, AI Assistant, Google Gemini, Image Recognition, PDF Reader, Free AI Tool, AI Chat, Image to Text Converter, AI Image Analysis Tool, Mr Heritage AI, Olayoriju Inioluwa AI, Inioluwa AI, Image Text Extractor, AI Image Reader, Smart Image Analysis, AI Photo Analyzer, Image Content Analyzer, AI Visual Recognition, Image Description Generator, AI Image Interpreter, Smart Image Scanner, AI Image Processor, Image Text Recognition, AI Image Understanding, Visual AI Assistant, Image AI Tool, AI Image Scanner, Smart Image Reader, AI Image Decoder, Image Analysis AI, AI Image Translator, Visual Content AI, OCR AI, AI Image Caption, Image AI Assistant, AI Image Analysis Tool, Free Image AI, AI Image Tool, Image AI Converter, AI Image Extractor, Smart Image AI, AI Image Reader Tool, Image AI Scanner, AI Image Analyzer Tool, Visual AI Tool, Image AI Processor, AI Image Recognition Tool, Image AI Assistant Tool, AI Image Analysis Software, Image AI Recognition, AI Image Processing Tool, Image AI Understanding Tool"
        image="/serguo.jpeg"
        url="https://serguo-ai.web.app"
        structuredData={structuredData}
        author="Mr Heritage (Olayoriju Inioluwa)"
        twitterHandle="@Inioluwa_dev"
      />
      
      {/* Header */}
      <Header />
      
      {/* Moving Balls Background */}
      <BackgroundBalls />
      
      {/* Status Indicators */}
      <StatusIndicators 
        apiError={apiError}
        setApiError={setApiError}
        isRetrying={isRetrying}
      />

      {/* Messages Area - Flexible height with top padding for fixed header and bottom padding for fixed input */}
      <div className="flex-1 flex flex-col pt-20 sm:pt-24 md:pt-28 pb-24 sm:pb-28 md:pb-32">
        <MessageList 
          messages={messages}
          filteredMessages={filteredMessages}
          searchQuery={searchQuery}
          isTyping={isTyping}
          settings={settings}
          copiedMessageId={copiedMessageId}
          copyMessage={copyMessage}
          messagesEndRef={messagesEndRef}
        />
      </div>
      
      {/* Input Area - Fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-primary border-t border-gray-800 dark:border-gray-700 mb-0">
        <ChatInput 
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleSubmit={handleSubmit}
          handleImageUpload={handleImageUpload}
          handlePaste={handlePaste}
          handleTextSelection={handleTextSelection}
          handleKeyDown={handleKeyDown}
          imagePreview={imagePreview}
          selectedImage={selectedImage}
          removeImagePreview={removeImagePreview}
          isHighlighted={isHighlighted}
          isRequestActive={isRequestActive}
          stopCurrentRequest={stopCurrentRequest}
        />
      </div>

    </div>
  );
};

export default MainChat;
