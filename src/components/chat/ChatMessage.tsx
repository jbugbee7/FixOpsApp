
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
      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`flex items-start space-x-2 max-w-[80%] ${
          message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
        }`}
      >
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            message.sender === 'user'
              ? 'bg-blue-500'
              : 'bg-slate-200 dark:bg-slate-700'
          }`}
        >
          {message.sender === 'user' ? (
            <User className="h-4 w-4 text-white" />
          ) : (
            <AnimatedRepairBot className="h-5 w-5" />
          )}
        </div>
        <Card
          className={`${
            message.sender === 'user'
              ? 'bg-blue-500 text-white border-blue-500'
              : 'bg-white dark:bg-slate-800 dark:border-slate-700'
          }`}
        >
          <CardContent className="p-3">
            <p className="text-sm whitespace-pre-wrap">{message.text}</p>
            <p
              className={`text-xs mt-1 ${
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
