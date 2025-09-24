const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

/**
 * Send a message to Gemini API and get a response
 * @param {string} message - The user's message
 * @param {string} imageData - Optional base64 image data
 * @param {number} retryCount - Number of retries attempted
 * @returns {Promise<string>} - The AI response
 */
export const sendToGemini = async (message, imageData = null, retryCount = 0, signal = null) => {
  try {
    // Check if API key is available
    if (!GEMINI_API_KEY) {
      throw new Error('API key not found. Please check your environment variables.');
    }

    const parts = [];

    // Add text part
    if (message && message.trim()) {
      parts.push({
        text: message
      });
    }

    // Add file part if provided (image or PDF)
    if (imageData) {
      // Remove data URL prefix if present
      const base64Data = imageData.replace(/^data:[^;]+;base64,/, '');
      
      // Detect MIME type from the data URL
      const mimeType = imageData.match(/^data:([^;]+);base64,/);
      const detectedMimeType = mimeType ? mimeType[1] : "image/jpeg";
      
      parts.push({
        inline_data: {
          mime_type: detectedMimeType,
          data: base64Data
        }
      });
    }

    const requestBody = {
      contents: [
        {
          parts: parts
        }
      ]
    };


    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': GEMINI_API_KEY
      },
      body: JSON.stringify(requestBody),
      signal: signal
    });

    if (!response.ok) {
      // Handle specific error codes
      if (response.status === 503) {
        throw new Error('Service temporarily unavailable. The AI service is experiencing high traffic. Please try again in a few minutes.');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment before trying again.');
      } else if (response.status === 400) {
        throw new Error('Invalid request. Please check your input and try again.');
      } else if (response.status === 401) {
        throw new Error('API key invalid or expired. Please contact support.');
      } else if (response.status === 403) {
        throw new Error('Access forbidden. Please check your API permissions.');
      } else {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
    }

    const data = await response.json();
    
    // Extract the response text from Gemini's response structure
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      const responseText = data.candidates[0].content.parts
        .map(part => part.text)
        .join('');
      
      return responseText;
    } else {
      throw new Error('Invalid response structure from Gemini API');
    }

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    
    // Retry logic for 503 errors (service unavailable)
    if (error.message.includes('Service temporarily unavailable') && retryCount < 3) {
      const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff: 1s, 2s, 4s
      console.log(`Retrying in ${delay}ms... (attempt ${retryCount + 1}/3)`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      return await sendToGemini(message, imageData, retryCount + 1);
    }
    
    // Return a fallback response based on the error
    if (error.message.includes('Service temporarily unavailable')) {
      return "The AI service is currently experiencing high traffic. Please try again in a few minutes.";
    } else if (error.message.includes('Rate limit exceeded')) {
      return "You've reached the rate limit. Please wait a moment before trying again.";
    } else if (error.message.includes('API key invalid')) {
      return "There's an issue with the API configuration. Please contact support.";
    } else if (error.message.includes('API request failed')) {
      return "I'm sorry, I'm having trouble connecting to the AI service right now. Please try again in a moment.";
    } else if (error.message.includes('Invalid response structure')) {
      return "I received an unexpected response from the AI service. Please try again.";
    } else {
      return "I'm experiencing some technical difficulties. Please try again later.";
    }
  }
};

/**
 * Check if the API key is valid by making a test request
 * @returns {Promise<boolean>} - True if API key is valid
 */
export const validateApiKey = async () => {
  try {
    const testResponse = await sendToGemini("Hello");
    return testResponse && testResponse.length > 0;
  } catch (error) {
    console.error('API key validation failed:', error);
    return false;
  }
};

/**
 * Get a context-aware response based on the conversation history
 * @param {Array} messages - Array of previous messages
 * @param {string} newMessage - The new user message
 * @param {string} imageData - Optional base64 image data
 * @returns {Promise<string>} - The AI response
 */
export const getContextualResponse = async (messages, newMessage, imageData = null, signal = null) => {
  try {
    // Build context from recent messages (last 10 messages to avoid token limits)
    const recentMessages = messages.slice(-10);
    let contextPrompt = "";
    
    if (recentMessages.length > 0) {
      contextPrompt = "Previous conversation context:\n";
      recentMessages.forEach(msg => {
        if (msg.isUser) {
          contextPrompt += `User: ${msg.content}\n`;
        } else {
          contextPrompt += `Assistant: ${msg.content}\n`;
        }
      });
      contextPrompt += "\nCurrent message:\n";
    }

    const fullMessage = contextPrompt + newMessage;
    return await sendToGemini(fullMessage, imageData, 0, signal);
    
  } catch (error) {
    console.error('Error getting contextual response:', error);
    return "I'm sorry, I'm having trouble processing your request right now. Please try again.";
  }
};
