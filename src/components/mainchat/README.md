# MainChat Components

This folder contains the modular components that make up the MainChat functionality, broken down for better navigation and maintainability.

## Component Structure

### Core Components

- **MainChat.jsx** - Main orchestrator component that manages state and coordinates all other components
- **Header.jsx** - Site header with logo and title
- **BackgroundBalls.jsx** - Animated background balls component
- **StatusIndicators.jsx** - Offline and API error status indicators

### Message Components

- **MessageList.jsx** - Container for all messages and empty state
- **MessageItem.jsx** - Individual message display component
- **TypingIndicator.jsx** - AI typing indicator animation
- **TypingAnimation.jsx** - Welcome screen typing animation

### Input Components

- **ChatInput.jsx** - Main input area with file upload functionality
- **FilePreview.jsx** - File preview component for uploaded images/PDFs

## Benefits of This Structure

1. **Better Navigation** - Each component has a specific responsibility
2. **Easier Maintenance** - Changes to one feature don't affect others
3. **Reusability** - Components can be reused in other parts of the app
4. **Testing** - Individual components can be tested in isolation
5. **Code Organization** - Related functionality is grouped together

## Usage

```jsx
import { MainChat } from './mainchat';
// or
import MainChat from './mainchat/MainChat';
```

## Component Dependencies

- MainChat → All other components
- MessageList → TypingAnimation, MessageItem, TypingIndicator
- ChatInput → FilePreview
- MessageItem → FiCopy, FiCheck, FiImage icons
- StatusIndicators → SVG icons for status display

## Props Flow

```
MainChat (main state)
├── Header (no props)
├── BackgroundBalls (no props)
├── StatusIndicators (isOffline, apiError, setApiError)
├── MessageList (messages, filteredMessages, searchQuery, isTyping, settings, copiedMessageId, copyMessage, messagesEndRef)
└── ChatInput (inputValue, setInputValue, handleSubmit, handleImageUpload, handleTextSelection, handleKeyDown, imagePreview, selectedImage, removeImagePreview, isHighlighted)
```
