
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Settings, Home, Bot, GraduationCap, CheckCircle } from 'lucide-react';

const BottomNavigation = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 shadow-lg">
      <TabsList className="grid w-full grid-cols-6 h-16 bg-white dark:bg-slate-900 rounded-none">
        <TabsTrigger 
          value="dashboard" 
          className="flex flex-col items-center justify-center gap-1 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 dark:data-[state=active]:bg-blue-900/20"
        >
          <Home className="h-4 w-4" />
          <span className="text-xs">Work Orders</span>
        </TabsTrigger>
        <TabsTrigger 
          value="completed-orders" 
          className="flex flex-col items-center justify-center gap-1 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 dark:data-[state=active]:bg-blue-900/20"
        >
          <CheckCircle className="h-4 w-4" />
          <span className="text-xs">Completed</span>
        </TabsTrigger>
        <TabsTrigger 
          value="fixchat" 
          className="flex flex-col items-center justify-center gap-1 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 dark:data-[state=active]:bg-blue-900/20"
        >
          <MessageCircle className="h-4 w-4" />
          <span className="text-xs">FixChat</span>
        </TabsTrigger>
        <TabsTrigger 
          value="ai-assistant" 
          className="flex flex-col items-center justify-center gap-1 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 dark:data-[state=active]:bg-blue-900/20"
        >
          <Bot className="h-4 w-4" />
          <span className="text-xs">FixBot</span>
        </TabsTrigger>
        <TabsTrigger 
          value="analytics" 
          className="flex flex-col items-center justify-center gap-1 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 dark:data-[state=active]:bg-blue-900/20"
        >
          <GraduationCap className="h-4 w-4" />
          <span className="text-xs">Training</span>
        </TabsTrigger>
        <TabsTrigger 
          value="settings" 
          className="flex flex-col items-center justify-center gap-1 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 dark:data-[state=active]:bg-blue-900/20"
        >
          <Settings className="h-4 w-4" />
          <span className="text-xs">Settings</span>
        </TabsTrigger>
      </TabsList>
    </div>
  );
};

export default BottomNavigation;
