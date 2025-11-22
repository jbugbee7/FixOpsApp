
import { Message } from '@/types/chat';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  return (
    <div
      className={`flex px-2 sm:px-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div className="max-w-[85%] sm:max-w-[80%]">
        <div className="space-y-1">
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words text-foreground">
            {message.text}
          </p>
          <p className="text-xs text-muted-foreground">
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
