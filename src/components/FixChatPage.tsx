
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, Loader2 } from 'lucide-react';
import { useForumMessages } from '@/hooks/useForumMessages';
import ForumMessage from '@/components/forum/ForumMessage';
import ConnectionStatus from '@/components/chat/ConnectionStatus';

const FixChatPage = () => {
  const {
    messages,
    inputMessage,
    setInputMessage,
    isLoading,
    isFetching,
    hasConnectionError,
    sendMessage,
  } = useForumMessages();

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <Card className="dark:bg-slate-800 dark:border-slate-700 h-full flex flex-col border-0 rounded-none">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between dark:text-slate-100">
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {isFetching ? 'Loading...' : `${messages.length} messages`}
            </span>
            <ConnectionStatus hasConnectionError={hasConnectionError} />
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 px-6">
            <div className="space-y-4 pb-4">
              {isFetching ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 text-slate-400 mx-auto mb-4 animate-spin" />
                  <p className="text-slate-500 dark:text-slate-400">
                    Loading forum messages...
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
          
          <div className="p-6 border-t border-slate-200 dark:border-slate-600">
            <div className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Share your repair tips, ask questions, or help fellow technicians..."
                className="flex-1"
                disabled={isLoading || isFetching}
              />
              <Button 
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading || isFetching}
                className="bg-blue-500 hover:bg-blue-600"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FixChatPage;
