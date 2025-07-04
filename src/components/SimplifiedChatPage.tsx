
import React, { useState } from 'react';
import { useSimplifiedChat } from '@/hooks/useSimplifiedChat';
import { useUserRole } from '@/hooks/useUserRole';
import { useBasicCaseOperations } from '@/hooks/useBasicCaseOperations';
import { useAuth } from '@/contexts/AuthContext';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Menu, Users, Plus, MessageCircle, Loader2, Shield, UserCog, UserPlus, MoreVertical, RefreshCw } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Case } from '@/types/case';
import CreateConversationDialog from './chat/CreateConversationDialog';
import AddUsersToConversationDialog from './chat/AddUsersToConversationDialog';
import ConversationMembersDialog from './chat/ConversationMembersDialog';
import EnhancedForumMessage from './forum/EnhancedForumMessage';

const SimplifiedChatPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [addUsersDialogOpen, setAddUsersDialogOpen] = useState(false);
  const [membersDialogOpen, setMembersDialogOpen] = useState(false);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<Case | null>(null);
  
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const isOnline = useNetworkStatus();
  const { isAdmin } = useUserRole();
  
  const {
    conversations,
    messages,
    selectedConversation,
    setSelectedConversation,
    inputMessage,
    setInputMessage,
    isLoading,
    isFetching,
    error,
    sendMessage,
    refetchConversations
  } = useSimplifiedChat();

  // Auto-select General Discussion when conversations load
  React.useEffect(() => {
    if (conversations.length > 0 && !selectedConversation) {
      const generalDiscussion = conversations.find(c => c.name === 'General Discussion');
      if (generalDiscussion) {
        setSelectedConversation(generalDiscussion.id);
      }
    }
  }, [conversations, selectedConversation, setSelectedConversation]);

  const { cases } = useBasicCaseOperations(user, isOnline);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleViewWorkOrder = (workOrder: Case) => {
    setSelectedWorkOrder(workOrder);
  };

  const getConversationIcon = (name: string) => {
    if (name.toLowerCase().includes('general')) return Users;
    if (name.toLowerCase().includes('technician')) return Shield;
    if (name.toLowerCase().includes('manager')) return UserCog;
    return MessageCircle;
  };

  const currentConversation = conversations.find(c => c.id === selectedConversation);

  // Work order details view
  if (selectedWorkOrder) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="p-4">
          <button 
            onClick={() => setSelectedWorkOrder(null)}
            className="mb-4 text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200"
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

  return (
    <div className="h-screen flex bg-purple-50 dark:bg-slate-900">
      {/* Mobile Sidebar Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`${
        isMobile 
          ? `fixed left-0 top-0 h-full z-50 transform transition-transform duration-300 ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`
          : 'relative'
      } w-80 border-r border-purple-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex flex-col`}>
        
        {/* Sidebar Header */}
        <div className="p-4 border-b border-purple-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-6 w-6 text-purple-500" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Conversations
              </h2>
            </div>
            {isAdmin && (
              <Button
                size="sm"
                onClick={() => setCreateDialogOpen(true)}
                className="h-8 px-3 text-xs bg-purple-500 hover:bg-purple-600"
                title="Create New Conversation"
              >
                <Plus className="h-4 w-4 mr-1" />
                Create
              </Button>
            )}
          </div>
        </div>
        
        {/* Conversations List */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            {isFetching ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
                <span className="ml-2 text-slate-500">Loading conversations...</span>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="text-red-700 dark:text-red-400 text-sm mb-3">
                    {error}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={refetchConversations}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Retry
                  </Button>
                </div>
              </div>
            ) : conversations.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 text-purple-300 mx-auto mb-4" />
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  No conversations available
                </p>
                {isAdmin && (
                  <p className="text-slate-400 dark:text-slate-500 text-xs mt-2">
                    Create conversations and manually add users to get started
                  </p>
                )}
              </div>
            ) : (
              conversations.map((conversation) => {
                const IconComponent = getConversationIcon(conversation.name);
                return (
                  <div
                    key={conversation.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors mb-2 ${
                      selectedConversation === conversation.id
                        ? 'bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800'
                        : 'hover:bg-purple-50 dark:hover:bg-slate-800'
                    }`}
                    onClick={() => {
                      setSelectedConversation(conversation.id);
                      if (isMobile) setSidebarOpen(false);
                    }}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        selectedConversation === conversation.id
                          ? 'bg-purple-500 text-white'
                          : 'bg-purple-100 dark:bg-slate-700 text-purple-600 dark:text-slate-400'
                      }`}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-slate-900 dark:text-slate-100 truncate">
                            {conversation.name}
                          </h3>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {new Date(conversation.last_message_time).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                          {conversation.last_message}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <div className="flex items-center">
                            <Users className="h-3 w-3 text-slate-400 mr-1" />
                            <span className="text-xs text-slate-400">
                              {conversation.member_count} members
                            </span>
                          </div>
                          {isAdmin && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 hover:bg-purple-100 dark:hover:bg-slate-700"
                                  onClick={(e) => e.stopPropagation()}
                                  title="Manage Conversation"
                                >
                                  <MoreVertical className="h-3 w-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedConversation(conversation.id);
                                  setAddUsersDialogOpen(true);
                                }}>
                                  <UserPlus className="h-4 w-4 mr-2" />
                                  Add Users
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedConversation(conversation.id);
                                  setMembersDialogOpen(true);
                                }}>
                                  <Users className="h-4 w-4 mr-2" />
                                  View Members
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Chat Header */}
        <div className="h-16 border-b border-purple-200 dark:border-slate-600 bg-white dark:bg-slate-900 flex items-center justify-between px-4">
          <div className="flex items-center space-x-3">
            {isMobile && (
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
                <Menu className="h-5 w-5" />
              </Button>
            )}
            <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {currentConversation?.name || 'Repair Forum'}
            </h1>
          </div>
          
          {currentConversation && (
            <div className="flex items-center space-x-4">
              <div className="text-slate-500 dark:text-slate-400 text-sm flex items-center">
                <Users className="h-4 w-4 mr-2" />
                {currentConversation.member_count} members
              </div>
              {isAdmin && currentConversation && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setAddUsersDialogOpen(true)}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Users to Chat
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setMembersDialogOpen(true)}>
                      <Users className="h-4 w-4 mr-2" />
                      Manage Members
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          )}
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-4 pb-4">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 text-purple-300 mx-auto mb-4" />
                <p className="text-slate-500 dark:text-slate-400">
                  No messages yet. Start the conversation!
                </p>
                {!selectedConversation && (
                  <p className="text-slate-400 dark:text-slate-500 text-xs mt-2">
                    Select or create a conversation to begin chatting
                  </p>
                )}
              </div>
            ) : (
              messages.map((message) => (
                <EnhancedForumMessage 
                  key={message.id} 
                  message={message}
                  workOrders={cases}
                  onViewWorkOrder={handleViewWorkOrder}
                />
              ))
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t border-purple-200 dark:border-slate-600 bg-white dark:bg-slate-900">
          <div className="flex space-x-3">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={currentConversation ? `Share your message in ${currentConversation.name}...` : 'Select a conversation to start chatting...'}
              className="flex-1 bg-purple-50 dark:bg-slate-800 border-purple-200 dark:border-slate-700 focus:border-purple-500 focus:ring-purple-500"
              disabled={isLoading || !selectedConversation}
            />
            <Button 
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading || !selectedConversation}
              className="bg-purple-500 hover:bg-purple-600 px-4"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Admin Dialogs */}
      {isAdmin && (
        <>
          <CreateConversationDialog
            open={createDialogOpen}
            onOpenChange={setCreateDialogOpen}
            onConversationCreated={refetchConversations}
          />
          <AddUsersToConversationDialog
            open={addUsersDialogOpen}
            onOpenChange={setAddUsersDialogOpen}
            conversationId={selectedConversation}
            conversationName={currentConversation?.name || ''}
            onUsersAdded={refetchConversations}
          />
          <ConversationMembersDialog
            open={membersDialogOpen}
            onOpenChange={setMembersDialogOpen}
            conversationId={selectedConversation}
            conversationName={currentConversation?.name || ''}
          />
        </>
      )}
    </div>
  );
};

export default SimplifiedChatPage;
