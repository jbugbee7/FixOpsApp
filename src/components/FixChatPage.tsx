
import React, { useState, useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Send, Loader2, Users } from 'lucide-react';
import { useConversationMessages } from '@/hooks/useConversationMessages';
import { useConversations } from '@/hooks/useConversations';
import { useIsMobile } from '@/hooks/use-mobile';
import ForumMessage from '@/components/forum/ForumMessage';
import ConnectionStatus from '@/components/chat/ConnectionStatus';
import ChatSidebar from '@/components/chat/ChatSidebar';
import ChatHeader from '@/components/chat/ChatHeader';

const FixChatPage = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('conversations');
  const isMobile = useIsMobile();
  
  const { conversations } = useConversations();
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

  // Find or auto-select General Discussion conversation
  const generalDiscussion = useMemo(() => {
    return conversations.find(conv => conv.name.toLowerCase().includes('general discussion') || conv.name.toLowerCase().includes('general'));
  }, [conversations]);

  // Auto-select first conversation if none selected
  React.useEffect(() => {
    if (!selectedConversation && conversations.length > 0) {
      if (activeTab === 'general' && generalDiscussion) {
        setSelectedConversation(generalDiscussion.id);
      } else if (activeTab === 'conversations') {
        setSelectedConversation(conversations[0].id);
      }
    }
  }, [conversations, selectedConversation, activeTab, generalDiscussion]);

  // Switch to general discussion when tab changes
  React.useEffect(() => {
    if (activeTab === 'general' && generalDiscussion) {
      setSelectedConversation(generalDiscussion.id);
    }
  }, [activeTab, generalDiscussion]);

  const renderChatContent = () => (
    <>
      <ChatHeader 
        conversationName={currentConversation?.name || 'Select a conversation'}
        memberCount={currentConversation?.member_count}
        onToggleSidebar={() => {
          if (isMobile) {
            setMobileSidebarOpen(!mobileSidebarOpen);
          } else {
            setSidebarCollapsed(!sidebarCollapsed);
          }
        }}
        showMenuButton={isMobile}
      />
      
      <Card className="flex-1 flex flex-col border-0 rounded-none bg-white dark:bg-slate-900">
        <CardContent className="flex-1 flex flex-col p-0">
          {/* Connection Status */}
          <div className="px-4 py-2">
            <ConnectionStatus hasConnectionError={hasConnectionError} />
          </div>
          
          {!selectedConversation ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 dark:text-slate-400">
                  {activeTab === 'general' 
                    ? "No General Discussion conversation found. Please create one." 
                    : "Select a conversation to start chatting"
                  }
                </p>
              </div>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1 px-4">
                <div className="space-y-4 pb-4">
                  {isFetching ? (
                    <div className="text-center py-8">
                      <Loader2 className="h-8 w-8 text-slate-400 mx-auto mb-4 animate-spin" />
                      <p className="text-slate-500 dark:text-slate-400">
                        Loading messages...
                      </p>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageCircle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500 dark:text-slate-400">
                        No messages yet. Be the first to start the conversation!
                      </p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <ForumMessage key={message.id} message={message} />
                    ))
                  )}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-slate-100 dark:bg-slate-700 rounded-lg px-4 py-2 max-w-xs">
                        <div className="flex items-center space-x-2">
                          <div className="animate-pulse flex space-x-1">
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                          <span className="text-sm text-slate-500">Sending...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              
              <div className="p-4 border-t border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900">
                <div className="flex space-x-3">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={activeTab === 'general' 
                      ? "Join the general discussion..."
                      : "Share your repair tips, ask questions, or help fellow technicians..."
                    }
                    className="flex-1 bg-slate-50 dark:bg-slate-800"
                    disabled={isLoading || isFetching}
                  />
                  <Button 
                    onClick={sendMessage}
                    disabled={!inputMessage.trim() || isLoading || isFetching}
                    className="bg-blue-500 hover:bg-blue-600 px-4"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </>
  );

  return (
    <div className="h-screen flex bg-slate-50 dark:bg-slate-900">
      {/* Mobile Sidebar Overlay */}
      {isMobile && mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar - only show in conversations tab */}
      {activeTab === 'conversations' && (
        <div className={`${
          isMobile 
            ? `fixed left-0 top-0 h-full z-50 transform transition-transform duration-300 ${
                mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
              }`
            : 'relative'
        }`}>
          <ChatSidebar
            selectedConversation={selectedConversation || undefined}
            onSelectConversation={(id) => {
              setSelectedConversation(id);
              if (isMobile) {
                setMobileSidebarOpen(false);
              }
            }}
            isCollapsed={!isMobile && sidebarCollapsed}
          />
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-12 bg-slate-100 dark:bg-slate-800">
              <TabsTrigger 
                value="conversations" 
                className="flex items-center space-x-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Conversations</span>
              </TabsTrigger>
              <TabsTrigger 
                value="general" 
                className="flex items-center space-x-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900"
              >
                <Users className="h-4 w-4" />
                <span>General Discussion</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="conversations" className="mt-0 h-[calc(100vh-3rem)]">
              {renderChatContent()}
            </TabsContent>
            
            <TabsContent value="general" className="mt-0 h-[calc(100vh-3rem)]">
              {renderChatContent()}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default FixChatPage;
