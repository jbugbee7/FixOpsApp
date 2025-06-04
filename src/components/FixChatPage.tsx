
import React, { useState, useMemo } from 'react';
import { useConversationMessages } from '@/hooks/useConversationMessages';
import { useConversations } from '@/hooks/useConversations';
import { useIsMobile } from '@/hooks/use-mobile';
import ChatSidebar from '@/components/chat/ChatSidebar';
import ChatLayout from '@/components/chat/ChatLayout';
import ChatMainArea from '@/components/chat/ChatMainArea';

const FixChatPage = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const { conversations, isLoading: conversationsLoading, error: conversationsError, refetch: refetchConversations } = useConversations();
  const {
    messages,
    inputMessage,
    setInputMessage,
    isLoading,
    isFetching,
    hasConnectionError,
    sendMessage,
  } = useConversationMessages(selectedConversation);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const currentConversation = useMemo(() => {
    return conversations.find(conv => conv.id === selectedConversation);
  }, [conversations, selectedConversation]);

  // Find or auto-select General Discussion conversation as the default
  const generalDiscussion = useMemo(() => {
    return conversations.find(conv => 
      conv.name.toLowerCase().includes('general discussion') || 
      conv.name.toLowerCase().includes('general')
    );
  }, [conversations]);

  // Auto-select General Discussion first, then fall back to first conversation
  React.useEffect(() => {
    if (!selectedConversation && conversations.length > 0 && !conversationsLoading) {
      if (generalDiscussion) {
        setSelectedConversation(generalDiscussion.id);
      } else {
        setSelectedConversation(conversations[0].id);
      }
    }
  }, [conversations, selectedConversation, generalDiscussion, conversationsLoading]);

  const getPlaceholderText = () => {
    if (!currentConversation) return "Select a conversation to start chatting";
    
    if (currentConversation.name.toLowerCase().includes('general')) {
      return "Join the general discussion...";
    }
    return "Share your repair tips, ask questions, or help fellow technicians...";
  };

  const handleRetryConversations = () => {
    refetchConversations();
  };

  const handleToggleSidebar = () => {
    if (isMobile) {
      setMobileSidebarOpen(!mobileSidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const handleSelectConversation = (id: string) => {
    setSelectedConversation(id);
    if (isMobile) {
      setMobileSidebarOpen(false);
    }
  };

  const sidebar = (
    <ChatSidebar
      selectedConversation={selectedConversation || undefined}
      onSelectConversation={handleSelectConversation}
      isCollapsed={!isMobile && sidebarCollapsed}
    />
  );

  return (
    <ChatLayout
      mobileSidebarOpen={mobileSidebarOpen}
      setMobileSidebarOpen={setMobileSidebarOpen}
      sidebar={sidebar}
    >
      <ChatMainArea
        currentConversation={currentConversation}
        selectedConversation={selectedConversation}
        conversationsLoading={conversationsLoading}
        conversationsError={conversationsError}
        conversations={conversations}
        messages={messages}
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        isLoading={isLoading}
        isFetching={isFetching}
        hasConnectionError={hasConnectionError}
        sendMessage={sendMessage}
        onToggleSidebar={handleToggleSidebar}
        showMenuButton={isMobile}
        onRetryConversations={handleRetryConversations}
        handleKeyPress={handleKeyPress}
        getPlaceholderText={getPlaceholderText}
      />
    </ChatLayout>
  );
};

export default FixChatPage;
