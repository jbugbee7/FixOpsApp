
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
      // Better Safari keyboard detection
      let isKeyboard = false;
      
      if (window.visualViewport) {
        // Modern Safari with Visual Viewport API
        isKeyboard = window.visualViewport.height < window.innerHeight * 0.75;
      } else {
        // Fallback for older Safari versions
        isKeyboard = window.innerHeight < screen.height * 0.75;
      }
      
      setIsKeyboardVisible(isKeyboard);
    };

    const handleFocus = () => {
      // Safari-specific handling
      setTimeout(() => {
        setIsKeyboardVisible(true);
        onScrollToBottom();
        
        // Safari iOS specific: scroll input into view
        if (inputRef.current && /iPad|iPhone|iPod/.test(navigator.userAgent)) {
          inputRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
      }, 300);
    };

    const handleBlur = () => {
      setTimeout(() => {
        setIsKeyboardVisible(false);
      }, 300);
    };

    // Use Visual Viewport API if available (Safari 13+)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
    } else {
      // Fallback for older Safari
      window.addEventListener('resize', handleResize);
    }

    const inputElement = inputRef.current;
    if (inputElement) {
      inputElement.addEventListener('focus', handleFocus);
      inputElement.addEventListener('blur', handleBlur);
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
      } else {
        window.removeEventListener('resize', handleResize);
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
      className={`fixed left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 transition-all duration-300 z-[60] ${
        isKeyboardVisible ? 'bottom-0' : 'bottom-16 sm:bottom-20'
      }`}
    >
      <div className="max-w-4xl mx-auto flex space-x-2 sm:space-x-3 p-3 sm:p-4">
        <Input
          ref={inputRef}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={hasConnectionError 
            ? "AI features temporarily limited - basic responses only..." 
            : "Ask FixBot about repairs, parts, troubleshooting, or specific work orders..."
          }
          className="flex-1 text-sm sm:text-base h-10 sm:h-11 touch-manipulation"
          disabled={isLoading}
          // Safari-specific attributes
          enterKeyHint="send"
          inputMode="text"
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
