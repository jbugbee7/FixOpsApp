
import { Message } from '@/types/chat';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.sender === 'user';
  
  return (
    <div
      className={`flex px-2 sm:px-4 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className="max-w-[85%] sm:max-w-[80%]">
        <div className={`space-y-1 rounded-lg p-3 ${
          isUser 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-muted text-foreground'
        }`}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {message.text}
          </p>
          <p className={`text-xs ${
            isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
          }`}>
            {message.timestamp.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
