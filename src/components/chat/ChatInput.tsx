
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
      // Detect keyboard on mobile devices
      let isKeyboard = false;
      
      if (window.visualViewport) {
        // Modern browsers with Visual Viewport API
        const viewportHeight = window.visualViewport.height;
        const windowHeight = window.innerHeight;
        isKeyboard = viewportHeight < windowHeight * 0.75;
      }
      
      setIsKeyboardVisible(isKeyboard);
    };

    const handleFocus = () => {
      // Delay to ensure keyboard is fully shown
      setTimeout(() => {
        setIsKeyboardVisible(true);
        onScrollToBottom();
        
        // Scroll input into view on mobile
        if (inputRef.current) {
          inputRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'nearest' 
          });
        }
      }, 300);
    };

    const handleBlur = () => {
      setTimeout(() => {
        setIsKeyboardVisible(false);
      }, 100);
    };

    // Listen to viewport changes
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
      window.visualViewport.addEventListener('scroll', handleResize);
    }

    const inputElement = inputRef.current;
    if (inputElement) {
      inputElement.addEventListener('focus', handleFocus);
      inputElement.addEventListener('blur', handleBlur);
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
        window.visualViewport.removeEventListener('scroll', handleResize);
      }
      if (inputElement) {
        inputElement.removeEventListener('focus', handleFocus);
        inputElement.removeEventListener('blur', handleBlur);
      }
    };
  }, [setIsKeyboardVisible, onScrollToBottom]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      e.preventDefault(); // Prevent Safari's default behavior
      onSendMessage();
    }
  };

  return (
    <div 
      className="fixed left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 z-[60] transition-all duration-200"
      style={{
        bottom: 0,
        transform: isKeyboardVisible ? 'translateY(0)' : 'translateY(0)',
        paddingBottom: 'env(safe-area-inset-bottom)'
      }}
    >
      <div className="max-w-4xl mx-auto flex space-x-2 sm:space-x-3 p-3 sm:p-4">
        <Input
          ref={inputRef}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={hasConnectionError 
            ? "AI features temporarily limited..." 
            : "Type your message..."
          }
          className="flex-1 text-sm sm:text-base h-10 sm:h-11 touch-manipulation"
          disabled={isLoading}
          enterKeyHint="send"
          inputMode="text"
          autoComplete="off"
        />
        <Button 
          onClick={onSendMessage} 
          size="icon"
          disabled={isLoading || !inputMessage.trim()}
          className="h-10 w-10 sm:h-11 sm:w-11 flex-shrink-0 touch-manipulation"
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
