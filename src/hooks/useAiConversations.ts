import { useState, useEffect } from 'react';
import { Message } from '@/types/chat';

interface Conversation {
  id: string;
  title: string;
  lastMessage?: string;
  timestamp: Date;
  messages: Message[];
}

const STORAGE_KEY = 'ai_conversations';

export const useAiConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);

  // Load conversations from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const conversationsWithDates = parsed.map((conv: any) => ({
          ...conv,
          timestamp: new Date(conv.timestamp),
          messages: conv.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }));
        setConversations(conversationsWithDates);
        
        // Set the most recent conversation as current
        if (conversationsWithDates.length > 0) {
          setCurrentConversationId(conversationsWithDates[0].id);
        }
      } catch (error) {
        console.error('Failed to load conversations:', error);
      }
    } else {
      // Create initial conversation
      createNewConversation();
    }
  }, []);

  // Save conversations to localStorage
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    }
  }, [conversations]);

  const createNewConversation = () => {
    const newConv: Conversation = {
      id: Date.now().toString(),
      title: 'New Chat',
      timestamp: new Date(),
      messages: []
    };
    setConversations(prev => [newConv, ...prev]);
    setCurrentConversationId(newConv.id);
    return newConv.id;
  };

  const addMessage = (conversationId: string, message: Omit<Message, 'id' | 'timestamp'>) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        const newMessage: Message = {
          ...message,
          id: Date.now().toString(),
          timestamp: new Date()
        };
        
        const updatedMessages = [...conv.messages, newMessage];
        
        // Update conversation title from first user message if still "New Chat"
        let title = conv.title;
        if (title === 'New Chat' && message.sender === 'user') {
          title = message.text.slice(0, 30) + (message.text.length > 30 ? '...' : '');
        }
        
        return {
          ...conv,
          title,
          messages: updatedMessages,
          lastMessage: message.text.slice(0, 50) + (message.text.length > 50 ? '...' : ''),
          timestamp: new Date()
        };
      }
      return conv;
    }));
  };

  const deleteConversation = (id: string) => {
    setConversations(prev => {
      const filtered = prev.filter(conv => conv.id !== id);
      
      // If deleting current conversation, switch to another
      if (currentConversationId === id) {
        if (filtered.length > 0) {
          setCurrentConversationId(filtered[0].id);
        } else {
          // Create new conversation if none left
          const newId = createNewConversation();
          return conversations; // createNewConversation will update state
        }
      }
      
      return filtered;
    });
  };

  const getCurrentConversation = () => {
    return conversations.find(conv => conv.id === currentConversationId);
  };

  const getCurrentMessages = () => {
    return getCurrentConversation()?.messages || [];
  };

  const setConversationMessages = (conversationId: string, messages: Message[]) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        // Update title from first user message if still "New Chat"
        let title = conv.title;
        const firstUserMessage = messages.find(m => m.sender === 'user');
        if (title === 'New Chat' && firstUserMessage) {
          title = firstUserMessage.text.slice(0, 30) + (firstUserMessage.text.length > 30 ? '...' : '');
        }

        const lastMessage = messages[messages.length - 1];
        
        return {
          ...conv,
          title,
          messages,
          lastMessage: lastMessage?.text.slice(0, 50) + (lastMessage?.text.length > 50 ? '...' : ''),
          timestamp: new Date()
        };
      }
      return conv;
    }));
  };

  return {
    conversations,
    currentConversationId,
    setCurrentConversationId,
    createNewConversation,
    addMessage,
    deleteConversation,
    getCurrentConversation,
    getCurrentMessages,
    setConversationMessages
  };
};
