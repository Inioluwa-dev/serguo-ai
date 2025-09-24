import React, { useState, useEffect } from 'react';
import { FiX, FiSave, FiVolume2, FiVolumeX, FiZap, FiMinimize2, FiType, FiTrash2, FiInfo, FiHelpCircle, FiMail, FiGithub, FiTwitter, FiExternalLink, FiArrowLeft, FiSettings, FiUser, FiShield, FiBell, FiMonitor, FiCode, FiGlobe, FiEdit3 } from 'react-icons/fi';

const SettingsPopup = ({ isOpen, onClose }) => {
  const [currentView, setCurrentView] = useState('main'); // 'main' or specific setting
  const [activeTab, setActiveTab] = useState('general');

  // Load settings from localStorage
  const [settings, setSettings] = useState({
    autoSave: true,
    typingIndicators: true,
    soundEffects: false,
    animations: true,
    compactMode: false,
    fontSize: 'medium',
    messageLimit: 100
  });

  useEffect(() => {
    const savedSettings = localStorage.getItem('serguo-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const saveSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem('serguo-settings', JSON.stringify(newSettings));
  };

  if (!isOpen) return null;

  const mainSettings = [
    {
      id: 'general',
      title: 'General',
      description: 'Basic app settings and preferences',
      icon: FiSettings,
      color: 'bg-blue-500'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Sound effects and alerts',
      icon: FiBell,
      color: 'bg-green-500'
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      description: 'Data handling and security settings',
      icon: FiShield,
      color: 'bg-red-500'
    },
    {
      id: 'about',
      title: 'About',
      description: 'App information and support',
      icon: FiInfo,
      color: 'bg-gray-500'
    },
    {
      id: 'developer',
      title: 'Developer',
      description: 'Developer information and contact',
      icon: FiCode,
      color: 'bg-indigo-500'
    }
  ];

  const handleBack = () => {
    setCurrentView('main');
  };

  const handleSettingClick = (settingId) => {
    setActiveTab(settingId);
    setCurrentView(settingId);
  };

  const renderMainMenu = () => (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-primary">Settings</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors cursor-pointer"
        >
          <FiX className="w-5 h-5 text-primary" />
        </button>
      </div>

      <div className="space-y-3">
        {mainSettings.map((setting) => (
          <button
            key={setting.id}
            onClick={() => handleSettingClick(setting.id)}
            className="w-full p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${setting.color} text-white`}>
                <setting.icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-primary">{setting.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{setting.description}</p>
              </div>
              <FiArrowLeft className="w-5 h-5 text-gray-400 rotate-180" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderGeneralSettings = () => (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={handleBack}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors cursor-pointer"
        >
          <FiArrowLeft className="w-5 h-5 text-primary" />
        </button>
        <h2 className="text-2xl font-bold text-primary">General Settings</h2>
      </div>

      <div className="space-y-6">
        {/* Auto Save */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-primary">Auto Save</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Automatically save your conversations</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoSave}
                onChange={(e) => saveSettings({...settings, autoSave: e.target.checked})}
                className="sr-only peer"
              />
              <div className="relative w-12 h-6 bg-gray-300 dark:bg-gray-600 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-500 peer-checked:bg-blue-500 transition-all duration-200">
                <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-lg transform transition-all duration-300 ease-in-out peer-checked:translate-x-6 peer-checked:shadow-xl"></div>
              </div>
            </label>
          </div>
        </div>

        {/* Typing Indicators */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-primary">Typing Indicators</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Show when AI is typing</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.typingIndicators}
                onChange={(e) => saveSettings({...settings, typingIndicators: e.target.checked})}
                className="sr-only peer"
              />
              <div className="relative w-12 h-6 bg-gray-300 dark:bg-gray-600 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-500 peer-checked:bg-blue-500 transition-all duration-200">
                <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-lg transform transition-all duration-300 ease-in-out peer-checked:translate-x-6 peer-checked:shadow-xl"></div>
              </div>
            </label>
          </div>
        </div>

        {/* Font Size */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-primary mb-3">Font Size</h3>
          <select
            value={settings.fontSize}
            onChange={(e) => saveSettings({...settings, fontSize: e.target.value})}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-primary focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
            <option value="extraLarge">Extra Large</option>
          </select>
        </div>

        {/* Message Limit */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-primary mb-3">Message History Limit</h3>
          <input
            type="number"
            value={settings.messageLimit}
            onChange={(e) => saveSettings({...settings, messageLimit: parseInt(e.target.value)})}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-primary focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="10"
            max="1000"
          />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Maximum number of messages to keep in history</p>
        </div>
      </div>
    </div>
  );


  const renderNotificationsSettings = () => (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={handleBack}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors cursor-pointer"
        >
          <FiArrowLeft className="w-5 h-5 text-primary" />
        </button>
        <h2 className="text-2xl font-bold text-primary">Notifications</h2>
      </div>

      <div className="space-y-6">
        {/* Sound Effects */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-primary">Sound Effects</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Play sounds for send and receive</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.soundEffects}
                onChange={(e) => saveSettings({...settings, soundEffects: e.target.checked})}
                className="sr-only peer"
              />
              <div className="relative w-12 h-6 bg-gray-300 dark:bg-gray-600 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-500 peer-checked:bg-blue-500 transition-all duration-200">
                <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-lg transform transition-all duration-300 ease-in-out peer-checked:translate-x-6 peer-checked:shadow-xl"></div>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={handleBack}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors cursor-pointer"
        >
          <FiArrowLeft className="w-5 h-5 text-primary" />
        </button>
        <h2 className="text-2xl font-bold text-primary">Privacy & Security</h2>
      </div>

      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-primary mb-3">Data Storage</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Your conversations are stored locally on your device. We don't collect or store your data on our servers.
          </p>
          <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors cursor-pointer">
            Clear All Data
          </button>
        </div>
      </div>
    </div>
  );

  const renderAboutSettings = () => (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={handleBack}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors cursor-pointer"
        >
          <FiArrowLeft className="w-5 h-5 text-primary" />
        </button>
        <h2 className="text-2xl font-bold text-primary">About</h2>
      </div>

      <div className="space-y-6">
        {/* About Serguo AI */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-primary mb-4">About Serguo AI</h3>
          <div className="flex items-center gap-4 mb-4">
            <img src="/serguo.jpeg" alt="Serguo AI" className="w-16 h-16 rounded-full object-cover" />
            <div>
              <h4 className="text-xl font-bold text-primary">Serguo AI</h4>
              <p className="text-gray-500 dark:text-gray-400">Your Image to Text AI</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            An intelligent AI assistant powered by Google's Gemini model, designed to help you with image analysis and text generation. 
            Upload images or PDFs and get detailed descriptions, analysis, and answers to your questions.
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-semibold text-primary">Version:</span>
              <span className="text-gray-600 dark:text-gray-300 ml-2">2.0.0</span>
            </div>
            <div>
              <span className="font-semibold text-primary">AI Model:</span>
              <span className="text-gray-600 dark:text-gray-300 ml-2">Google Gemini</span>
            </div>
            <div>
              <span className="font-semibold text-primary">Platform:</span>
              <span className="text-gray-600 dark:text-gray-300 ml-2">Web Application</span>
            </div>
            <div>
              <span className="font-semibold text-primary">Year:</span>
              <span className="text-gray-600 dark:text-gray-300 ml-2">2025</span>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-primary mb-4">Frequently Asked Questions</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-primary mb-2">What types of files can I upload?</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                You can upload images (JPEG, PNG, GIF, WebP, BMP, SVG) and PDF files. The AI will analyze the content and provide detailed descriptions.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-primary mb-2">Is my data secure?</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Yes! All your conversations are stored locally on your device. We don't collect or store your data on our servers.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-primary mb-2">How does the AI work?</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Serguo AI uses Google's Gemini 2.0 Flash model to analyze your images and provide intelligent responses based on the visual content.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-primary mb-2">Can I use this for free?</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Yes! Serguo AI is completely free to use. No registration or payment required.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );

  const renderDeveloperSettings = () => (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={handleBack}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors cursor-pointer"
        >
          <FiArrowLeft className="w-5 h-5 text-primary" />
        </button>
        <h2 className="text-2xl font-bold text-primary">Developer Information</h2>
      </div>

      <div className="space-y-6">
        {/* Developer Profile */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <div className="flex items-center gap-6 mb-6">
            <img src="/mr_h.png" alt="Mr Heritage" className="w-20 h-20 rounded-full object-cover shadow-lg" />
            <div>
              <h3 className="text-2xl font-bold text-primary">Mr Heritage</h3>
              <p className="text-lg text-gray-500 dark:text-gray-400">Full Stack Developer</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                Passionate developer creating innovative solutions with modern technologies
              </p>
            </div>
          </div>
          
          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <FiMail className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <a href="mailto:misterhge@gmail.com" className="text-blue-500 hover:text-blue-600 transition-colors cursor-pointer font-medium">
                  misterhge@gmail.com
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <FiGithub className="w-5 h-5 text-gray-800 dark:text-gray-200" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">GitHub</p>
                <a href="https://github.com/Inioluwa_dev" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 transition-colors cursor-pointer font-medium">
                  @Inioluwa_dev
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <FiTwitter className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">X (Twitter)</p>
                <a href="https://x.com/Inioluwa_dev" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 transition-colors cursor-pointer font-medium">
                  @Inioluwa_dev
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <FiGlobe className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Portfolio</p>
                <a href="https://mr-heritage.web.app" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 transition-colors cursor-pointer font-medium">
                  mr-heritage.web.app
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Skills & Technologies */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h3 className="text-xl font-bold text-primary mb-4">Skills & Technologies</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              'React', 'JavaScript', 'Django', 'Tailwind CSS', 'Firebase', 
              'MongoDB', 'Git', 'AWS', 'Render'
            ].map((skill) => (
              <div key={skill} className="px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium text-center">
                {skill}
              </div>
            ))}
          </div>
        </div>

        {/* Experience & Projects */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h3 className="text-xl font-bold text-primary mb-4">Experience & Projects</h3>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold text-primary">Full Stack Developer</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">2023 - Present</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Developing web applications using modern technologies including React, Node.js, and cloud platforms.
              </p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-semibold text-primary">Serguo AI Project</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">2025</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Built an intelligent image-to-text AI assistant using Google's Gemini API with React and modern web technologies.
              </p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-semibold text-primary">Portfolio Website</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">2025</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Created a responsive portfolio showcasing projects and skills using React and Tailwind CSS.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Actions */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h3 className="text-xl font-bold text-primary mb-4">Get In Touch</h3>
          <div className="flex flex-wrap gap-3">
            <a 
              href="mailto:misterhge@gmail.com" 
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors cursor-pointer"
            >
              <FiMail className="w-4 h-4" />
              <span>Send Email</span>
            </a>
            <a 
              href="https://github.com/Inioluwa_dev" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg transition-colors cursor-pointer"
            >
              <FiGithub className="w-4 h-4" />
              <span>View GitHub</span>
            </a>
            <a 
              href="https://mr-heritage.web.app" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors cursor-pointer"
            >
              <FiGlobe className="w-4 h-4" />
              <span>Visit Portfolio</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentView = () => {
    switch (currentView) {
      case 'general':
        return renderGeneralSettings();
      case 'notifications':
        return renderNotificationsSettings();
      case 'privacy':
        return renderPrivacySettings();
      case 'about':
        return renderAboutSettings();
      case 'developer':
        return renderDeveloperSettings();
      default:
        return renderMainMenu();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-1 sm:p-4">
      <div className="bg-secondary border sidebar-border rounded-lg w-full max-w-4xl h-[95vh] sm:h-[80vh] flex flex-col overflow-hidden theme-transition mobile-popup">
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
          {renderCurrentView()}
        </div>
      </div>
    </div>
  );
};

export default SettingsPopup;