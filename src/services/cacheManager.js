/**
 * Enhanced Cache Manager for Serguo AI
 * Handles localStorage with time-based expiration, LRU cleanup, and quota management
 */

class CacheManager {
  constructor() {
    this.STORAGE_KEYS = {
      MESSAGES: 'serguo-messages',
      SETTINGS: 'serguo-settings',
      CACHE_METADATA: 'serguo-cache-metadata'
    };
    
    this.DEFAULT_CONFIG = {
      maxMessages: 50,
      maxStorageSize: 2 * 1024 * 1024, // 2MB
      warningThreshold: 1.5 * 1024 * 1024, // 1.5MB
      messageExpiryDays: 30,
      contentMaxLength: 2000,
      cleanupInterval: 10 // messages
    };
    
    this.config = { ...this.DEFAULT_CONFIG };
    this.loadConfig();
  }

  /**
   * Load configuration from localStorage
   */
  loadConfig() {
    try {
      const savedSettings = localStorage.getItem(this.STORAGE_KEYS.SETTINGS);
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        this.config = {
          ...this.config,
          maxMessages: settings.messageLimit || this.DEFAULT_CONFIG.maxMessages,
          messageExpiryDays: settings.messageExpiryDays || this.DEFAULT_CONFIG.messageExpiryDays
        };
      }
    } catch (error) {
      console.warn('Failed to load cache config:', error);
    }
  }

  /**
   * Get current storage usage
   */
  getStorageUsage() {
    let totalSize = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        totalSize += localStorage[key].length;
      }
    }
    return totalSize;
  }

  /**
   * Get available storage quota
   */
  getStorageQuota() {
    try {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        return navigator.storage.estimate();
      }
    } catch (error) {
      console.warn('Storage quota estimation not available:', error);
    }
    return null;
  }

  /**
   * Check if message is expired
   */
  isMessageExpired(message) {
    if (!message.timestamp) return true;
    
    const messageDate = new Date(message.timestamp);
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() - this.config.messageExpiryDays);
    
    return messageDate < expiryDate;
  }

  /**
   * Sort messages by last access time (LRU)
   */
  sortByLastAccess(messages) {
    return messages.sort((a, b) => {
      const aTime = a.lastAccessed || new Date(a.timestamp).getTime();
      const bTime = b.lastAccessed || new Date(b.timestamp).getTime();
      return bTime - aTime; // Most recent first
    });
  }

  /**
   * Optimize message for storage
   */
  optimizeMessage(message) {
    return {
      id: message.id,
      content: message.content ? message.content.substring(0, this.config.contentMaxLength) : '',
      isUser: message.isUser,
      timestamp: message.timestamp,
      isExtractedText: message.isExtractedText,
      lastAccessed: message.lastAccessed || new Date().getTime(),
      // Remove image data to save space
      image: null
    };
  }

  /**
   * Clean expired messages
   */
  cleanExpiredMessages(messages) {
    const now = new Date();
    const validMessages = messages.filter(msg => {
      if (this.isMessageExpired(msg)) {
        console.log('Removing expired message:', msg.id);
        return false;
      }
      return true;
    });
    
    const removedCount = messages.length - validMessages.length;
    if (removedCount > 0) {
      console.log(`Cleaned ${removedCount} expired messages`);
    }
    
    return validMessages;
  }

  /**
   * Apply LRU cleanup when storage is full
   */
  applyLRUCleanup(messages, targetSize) {
    const sortedMessages = this.sortByLastAccess(messages);
    let currentSize = 0;
    const keptMessages = [];
    
    for (const message of sortedMessages) {
      const messageSize = JSON.stringify(message).length;
      if (currentSize + messageSize <= targetSize) {
        keptMessages.push(message);
        currentSize += messageSize;
      } else {
        console.log('Removing message due to size limit:', message.id);
      }
    }
    
    return keptMessages;
  }

  /**
   * Enhanced save with comprehensive cleanup
   */
  safeSaveToLocalStorage(messages) {
    try {
      // Update last accessed time for all messages
      const updatedMessages = messages.map(msg => ({
        ...msg,
        lastAccessed: new Date().getTime()
      }));

      // Clean expired messages first
      let cleanMessages = this.cleanExpiredMessages(updatedMessages);

      // Apply message count limit
      if (cleanMessages.length > this.config.maxMessages) {
        const sortedMessages = this.sortByLastAccess(cleanMessages);
        cleanMessages = sortedMessages.slice(0, this.config.maxMessages);
        console.log(`Applied message limit: kept ${cleanMessages.length} messages`);
      }

      // Optimize messages for storage
      const optimizedMessages = cleanMessages.map(msg => this.optimizeMessage(msg));
      
      const jsonString = JSON.stringify(optimizedMessages);
      
      // Check storage size and apply cleanup if needed
      if (jsonString.length > this.config.maxStorageSize) {
        console.warn('Messages too large for localStorage, applying LRU cleanup...');
        
        // Calculate target size (80% of max to leave some buffer)
        const targetSize = Math.floor(this.config.maxStorageSize * 0.8);
        const finalMessages = this.applyLRUCleanup(optimizedMessages, targetSize);
        
        const finalJson = JSON.stringify(finalMessages);
        localStorage.setItem(this.STORAGE_KEYS.MESSAGES, finalJson);
        console.log(`Saved ${finalMessages.length} messages after LRU cleanup`);
      } else {
        localStorage.setItem(this.STORAGE_KEYS.MESSAGES, jsonString);
      }

      // Update cache metadata
      this.updateCacheMetadata(optimizedMessages.length, jsonString.length);
      
    } catch (error) {
      console.warn('Failed to save to localStorage:', error.message);
      
      // Last resort: save only the most recent messages
      try {
        const recentMessages = messages.slice(-5).map(msg => this.optimizeMessage(msg));
        localStorage.setItem(this.STORAGE_KEYS.MESSAGES, JSON.stringify(recentMessages));
        console.log('Saved only last 5 messages as fallback');
      } catch (fallbackError) {
        console.error('Complete localStorage failure:', fallbackError.message);
      }
    }
  }

  /**
   * Load messages with cleanup
   */
  loadMessages() {
    try {
      const savedMessages = localStorage.getItem(this.STORAGE_KEYS.MESSAGES);
      if (!savedMessages) return [];

      const parsedMessages = JSON.parse(savedMessages);
      
      // Clean expired messages on load
      const cleanMessages = this.cleanExpiredMessages(parsedMessages);
      
      // If we cleaned messages, save the cleaned version
      if (cleanMessages.length !== parsedMessages.length) {
        this.safeSaveToLocalStorage(cleanMessages);
      }
      
      return cleanMessages.map(msg => ({
        ...msg,
        isImagePlaceholder: msg.image === '[IMAGE_DATA]'
      }));
      
    } catch (error) {
      console.error('Failed to load messages:', error);
      // Clear corrupted localStorage
      localStorage.removeItem(this.STORAGE_KEYS.MESSAGES);
      return [];
    }
  }

  /**
   * Update cache metadata
   */
  updateCacheMetadata(messageCount, dataSize) {
    const metadata = {
      lastUpdated: new Date().toISOString(),
      messageCount,
      dataSize,
      storageUsage: this.getStorageUsage()
    };
    
    try {
      localStorage.setItem(this.STORAGE_KEYS.CACHE_METADATA, JSON.stringify(metadata));
    } catch (error) {
      console.warn('Failed to update cache metadata:', error);
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    try {
      const metadata = localStorage.getItem(this.STORAGE_KEYS.CACHE_METADATA);
      const stats = metadata ? JSON.parse(metadata) : {};
      
      return {
        messageCount: stats.messageCount || 0,
        dataSize: stats.dataSize || 0,
        storageUsage: this.getStorageUsage(),
        lastUpdated: stats.lastUpdated,
        quota: this.getStorageQuota(),
        config: this.config
      };
    } catch (error) {
      console.error('Failed to get cache stats:', error);
      return {};
    }
  }

  /**
   * Clear all application data
   */
  clearAllData() {
    try {
      // Clear all Serguo-related data
      Object.values(this.STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      
      // Also clear any other Serguo-related keys
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('serguo-')) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      console.log('All Serguo data cleared from localStorage');
      return true;
    } catch (error) {
      console.error('Failed to clear all data:', error);
      return false;
    }
  }

  /**
   * Perform periodic cleanup
   */
  shouldPerformCleanup(messageCount) {
    return messageCount % this.config.cleanupInterval === 0;
  }

  /**
   * Check if storage is approaching limits
   */
  isStorageNearLimit() {
    const currentUsage = this.getStorageUsage();
    return currentUsage > this.config.warningThreshold;
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
  }
}

// Export singleton instance
export default new CacheManager();
