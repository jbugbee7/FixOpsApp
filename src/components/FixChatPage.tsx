
import React, { useState } from 'react';
import { useConversationMessages } from '@/hooks/useConversationMessages';
import { useConversations } from '@/hooks/useConversations';
import { useBasicCaseOperations } from '@/hooks/useBasicCaseOperations';
import { useAuth } from '@/contexts/AuthContext';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useIsMobile } from '@/hooks/use-mobile';
import ChatLayout from '@/components/chat/ChatLayout';
import ChatSidebar from '@/components/chat/ChatSidebar';
import EnhancedChatMainArea from '@/components/chat/EnhancedChatMainArea';
import { Case } from '@/types/case';

const FixChatPage = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<Case | null>(null);
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const isOnline = useNetworkStatus();
  
  // Get conversations
  const { 
    conversations, 
    isLoading: conversationsLoading, 
    error: conversationsError,
    refetch: refetchConversations 
  } = useConversations();

  console.log('FixChatPage render:', {
    conversationsCount: conversations.length,
    conversationsLoading,
    conversationsError,
    selectedConversation,
    user: user?.id
  });

  // Auto-select first conversation when conversations load
  React.useEffect(() => {
    if (conversations.length > 0 && !selectedConversation) {
      // Try to select "General Discussion" first, or the first conversation
      const generalConversation = conversations.find(c => 
        c.name.toLowerCase().includes('general')
      );
      const targetConversation = generalConversation?.id || conversations[0].id;
      console.log('Auto-selecting conversation:', targetConversation);
      setSelectedConversation(targetConversation);
    }
  }, [conversations, selectedConversation]);

  const {
    messages,
    inputMessage,
    setInputMessage,
    isLoading,
    isFetching,
    hasConnectionError,
    sendMessage,
  } = useConversationMessages(selectedConversation);

  // Get work orders for referencing
  const { cases } = useBasicCaseOperations(user, isOnline);

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

  const handleViewWorkOrder = (workOrder: Case) => {
    setSelectedWorkOrder(workOrder);
  };

  const handleBackFromWorkOrder = () => {
    setSelectedWorkOrder(null);
  };

  const getPlaceholderText = () => {
    const currentConversation = conversations.find(c => c.id === selectedConversation);
    const conversationName = currentConversation?.name || 'this conversation';
    return `Share your message in ${conversationName}...`;
  };

  // If viewing a work order, show work order details
  if (selectedWorkOrder) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="p-4">
          <button 
            onClick={handleBackFromWorkOrder}
            className="mb-4 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
          >
            ← Back to Chat
          </button>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              {selectedWorkOrder.wo_number || `WO-${selectedWorkOrder.id.slice(0, 8)}`}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Customer Information</h3>
                <p><strong>Name:</strong> {selectedWorkOrder.customer_name}</p>
                <p><strong>Phone:</strong> {selectedWorkOrder.customer_phone || 'N/A'}</p>
                <p><strong>Address:</strong> {selectedWorkOrder.customer_address || 'N/A'}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Appliance Information</h3>
                <p><strong>Brand:</strong> {selectedWorkOrder.appliance_brand}</p>
                <p><strong>Type:</strong> {selectedWorkOrder.appliance_type}</p>
                <p><strong>Model:</strong> {selectedWorkOrder.appliance_model || 'N/A'}</p>
              </div>
            </div>
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Problem Description</h3>
              <p className="bg-slate-50 dark:bg-slate-700 p-3 rounded">
                {selectedWorkOrder.problem_description}
              </p>
            </div>
            <div className="mt-4">
              <p><strong>Status:</strong> {selectedWorkOrder.status}</p>
              <p><strong>Created:</strong> {new Date(selectedWorkOrder.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Find current conversation
  const currentConversation = conversations.find(c => c.id === selectedConversation);

  const sidebar = (
    <ChatSidebar
      selectedConversation={selectedConversation || undefined}
      onSelectConversation={setSelectedConversation}
      isCollapsed={sidebarCollapsed && !isMobile}
    />
  );

  return (
    <ChatLayout
      mobileSidebarOpen={mobileSidebarOpen}
      setMobileSidebarOpen={setMobileSidebarOpen}
      sidebar={sidebar}
    >
      <EnhancedChatMainArea
        currentConversation={currentConversation}
        selectedConversation={selectedConversation}
        conversationsLoading={conversationsLoading}
        conversationsError={conversationsError}
        conversations={conversations}
        messages={messages}
        workOrders={cases}
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        isLoading={isLoading}
        isFetching={isFetching}
        hasConnectionError={hasConnectionError}
        sendMessage={sendMessage}
        onToggleSidebar={handleToggleSidebar}
        onViewWorkOrder={handleViewWorkOrder}
        showMenuButton={isMobile}
        onRetryConversations={refetchConversations}
        handleKeyPress={handleKeyPress}
        getPlaceholderText={getPlaceholderText}
      />
    </ChatLayout>
  );
};

export default FixChatPage;
