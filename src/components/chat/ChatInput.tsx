
import { useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2 } from 'lucide-react';

interface ChatInputProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  onSendMessage: () => void;
  isLoading: boolean;
  hasConnectionError: boolean;
  isKeyboardVisible: boolean;
  setIsKeyboardVisible: (visible: boolean) => void;
  onScrollToBottom: () => void;
}

const ChatInput = ({
  inputMessage,
  setInputMessage,
  onSendMessage,
  isLoading,
  hasConnectionError,
  isKeyboardVisible,
  setIsKeyboardVisible,
  onScrollToBottom,
}: ChatInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined' && window.visualViewport) {
        const viewportHeight = window.visualViewport.height;
        const windowHeight = window.innerHeight;
        const isKeyboard = viewportHeight < windowHeight * 0.75;
        setIsKeyboardVisible(isKeyboard);
        
        if (isKeyboard) {
          setTimeout(() => {
            onScrollToBottom();
          }, 100);
        }
      }
    };

    const handleFocus = () => {
      setTimeout(() => {
        setIsKeyboardVisible(true);
        onScrollToBottom();
      }, 150);
    };

    const handleBlur = () => {
      setTimeout(() => {
        setIsKeyboardVisible(false);
      }, 100);
    };

    if (typeof window !== 'undefined' && window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
    }
    
    const input = inputRef.current;
    if (input) {
      input.addEventListener('focus', handleFocus);
      input.addEventListener('blur', handleBlur);
    }

    return () => {
      if (typeof window !== 'undefined' && window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
      }
      if (input) {
        input.removeEventListener('focus', handleFocus);
        input.removeEventListener('blur', handleBlur);
      }
    };
  }, [onScrollToBottom, setIsKeyboardVisible]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      e.preventDefault(); // Prevent Safari's default behavior
      onSendMessage();
    }
  };

  return (
    <div 
      className="border-t border-border bg-background p-3 w-full"
      style={{
        position: 'sticky',
        bottom: 0,
        paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
        zIndex: 10
      }}
    >
      <div className="flex gap-2 max-w-4xl mx-auto">
        <Input
          ref={inputRef}
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={hasConnectionError ? "Connection error..." : "Type a message..."}
          disabled={isLoading || hasConnectionError}
          className="flex-1 bg-muted touch-manipulation"
          enterKeyHint="send"
          inputMode="text"
          autoComplete="off"
        />
        <Button
          onClick={onSendMessage}
          disabled={!inputMessage.trim() || isLoading || hasConnectionError}
          size="icon"
          className="flex-shrink-0 touch-manipulation"
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

export default ChatInput;
