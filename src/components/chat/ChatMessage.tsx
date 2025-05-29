
import { User } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Message } from '@/types/chat';
import AnimatedRepairBot from '@/components/AnimatedRepairBot';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  return (
    <div
      className={`flex px-2 sm:px-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`flex items-start space-x-2 sm:space-x-3 max-w-[85%] sm:max-w-[80%] ${
          message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
        }`}
      >
        <div
          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            message.sender === 'user'
              ? 'bg-blue-500'
              : 'bg-slate-200 dark:bg-slate-700'
          }`}
        >
          {message.sender === 'user' ? (
            <User className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
          ) : (
            <AnimatedRepairBot className="h-4 w-4 sm:h-5 sm:w-5" />
          )}
        </div>
        <Card
          className={`${
            message.sender === 'user'
              ? 'bg-blue-500 text-white border-blue-500'
              : 'bg-white dark:bg-slate-800 dark:border-slate-700'
          } shadow-sm`}
        >
          <CardContent className="p-2.5 sm:p-3">
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.text}</p>
            <p
              className={`text-xs mt-1.5 ${
                message.sender === 'user'
                  ? 'text-blue-100'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {message.timestamp.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChatMessage;
