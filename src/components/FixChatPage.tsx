
import React, { useState } from 'react';
import { useSimplifiedForumMessages } from '@/hooks/useSimplifiedForumMessages';
import { useIsMobile } from '@/hooks/use-mobile';
import ChatLayout from '@/components/chat/ChatLayout';
import ChatMainArea from '@/components/chat/ChatMainArea';

const FixChatPage = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const {
    messages,
    inputMessage,
    setInputMessage,
    isLoading,
    isFetching,
    hasConnectionError,
    sendMessage,
  } = useSimplifiedForumMessages();

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleToggleSidebar = () => {
    if (isMobile) {
      setMobileSidebarOpen(!mobileSidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const getPlaceholderText = () => {
    return "Share your repair tips, ask questions, or help fellow technicians...";
  };

  // Create a proper mock conversation object
  const mockConversation = {
    id: 'global-chat',
    name: 'Repair Forum Chat',
    description: 'Global chat for repair technicians',
    member_count: undefined,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: 'system'
  };

  // Simple sidebar for global chat
  const sidebar = (
    <div className={`bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 ${
      isMobile ? 'w-80' : sidebarCollapsed ? 'w-16' : 'w-80'
    } transition-all duration-300`}>
      <div className="p-4">
        <h2 className={`font-semibold text-slate-900 dark:text-slate-100 ${
          sidebarCollapsed && !isMobile ? 'text-center text-sm' : 'text-lg'
        }`}>
          {sidebarCollapsed && !isMobile ? 'Chat' : 'Repair Forum Chat'}
        </h2>
        {!sidebarCollapsed || isMobile ? (
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Connect with fellow repair technicians, share knowledge, and get help with your cases.
          </p>
        ) : null}
      </div>
    </div>
  );

  return (
    <ChatLayout
      mobileSidebarOpen={mobileSidebarOpen}
      setMobileSidebarOpen={setMobileSidebarOpen}
      sidebar={sidebar}
    >
      <ChatMainArea
        currentConversation={mockConversation}
        selectedConversation="global"
        conversationsLoading={false}
        conversationsError={null}
        conversations={[]}
        messages={messages}
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        isLoading={isLoading}
        isFetching={isFetching}
        hasConnectionError={hasConnectionError}
        sendMessage={sendMessage}
        onToggleSidebar={handleToggleSidebar}
        showMenuButton={isMobile}
        onRetryConversations={() => {}}
        handleKeyPress={handleKeyPress}
        getPlaceholderText={getPlaceholderText}
      />
    </ChatLayout>
  );
};

export default FixChatPage;
