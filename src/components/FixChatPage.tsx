
import React, { useState } from 'react';
import { useSimplifiedForumMessages } from '@/hooks/useSimplifiedForumMessages';
import { useBasicCaseOperations } from '@/hooks/useBasicCaseOperations';
import { useAuth } from '@/contexts/AuthContext';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useIsMobile } from '@/hooks/use-mobile';
import ChatLayout from '@/components/chat/ChatLayout';
import EnhancedChatMainArea from '@/components/chat/EnhancedChatMainArea';
import { Case } from '@/types/case';

const FixChatPage = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<Case | null>(null);
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const isOnline = useNetworkStatus();
  
  const {
    messages,
    inputMessage,
    setInputMessage,
    isLoading,
    isFetching,
    hasConnectionError,
    sendMessage,
  } = useSimplifiedForumMessages();

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
    return "Share your repair tips, ask questions, reference work orders (e.g., WO-123), or help fellow technicians...";
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
            ← Back to Repair Forum
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

  // Create a proper mock conversation object
  const mockConversation = {
    id: 'repair-forum',
    name: 'Repair Forum',
    description: 'Repair forum for technicians',
    member_count: undefined,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: 'system'
  };

  // Simple sidebar for repair forum
  const sidebar = (
    <div className={`bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 ${
      isMobile ? 'w-80' : sidebarCollapsed ? 'w-16' : 'w-80'
    } transition-all duration-300`}>
      <div className="p-4">
        <h2 className={`font-semibold text-slate-900 dark:text-slate-100 ${
          sidebarCollapsed && !isMobile ? 'text-center text-sm' : 'text-lg'
        }`}>
          {sidebarCollapsed && !isMobile ? 'Forum' : 'Repair Forum'}
        </h2>
        {!sidebarCollapsed || isMobile ? (
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Connect with fellow repair technicians, share knowledge, get help with your cases, and reference work orders (type WO-123).
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
      <EnhancedChatMainArea
        currentConversation={mockConversation}
        selectedConversation="repair-forum"
        conversationsLoading={false}
        conversationsError={null}
        conversations={[]}
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
        onRetryConversations={() => {}}
        handleKeyPress={handleKeyPress}
        getPlaceholderText={getPlaceholderText}
      />
    </ChatLayout>
  );
};

export default FixChatPage;
