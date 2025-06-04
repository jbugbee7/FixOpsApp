
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2 } from 'lucide-react';

interface ChatInputAreaProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  onSendMessage: () => void;
  isLoading: boolean;
  isFetching: boolean;
  placeholderText: string;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

const ChatInputArea = ({
  inputMessage,
  setInputMessage,
  onSendMessage,
  isLoading,
  isFetching,
  placeholderText,
  onKeyPress
}: ChatInputAreaProps) => {
  return (
    <div className="p-4 border-t border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900">
      <div className="flex space-x-3">
        <Input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={onKeyPress}
          placeholder={placeholderText}
          className="flex-1 bg-slate-50 dark:bg-slate-800"
          disabled={isLoading || isFetching}
        />
        <Button 
          onClick={onSendMessage}
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
  );
};

export default ChatInputArea;
