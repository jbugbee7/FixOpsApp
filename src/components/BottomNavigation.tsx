
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Settings, Home, Bot, GraduationCap } from 'lucide-react';

const BottomNavigation = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 shadow-lg">
      <TabsList className="grid w-full grid-cols-5 h-20 bg-white dark:bg-slate-900 rounded-none p-2">
        <TabsTrigger 
          value="dashboard" 
          className="flex flex-col items-center justify-center gap-2 data-[state=active]:bg-transparent relative group h-full"
        >
          <div className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 group-data-[state=active]:bg-purple-500 group-data-[state=active]:shadow-lg">
            <Home className="h-5 w-5 group-data-[state=active]:text-white text-slate-600 dark:text-slate-400" />
          </div>
          <span className="text-xs font-medium group-data-[state=active]:text-purple-500 text-slate-600 dark:text-slate-400">Dashboard</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="fixchat" 
          className="flex flex-col items-center justify-center gap-2 data-[state=active]:bg-transparent relative group h-full"
        >
          <div className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 group-data-[state=active]:bg-purple-500 group-data-[state=active]:shadow-lg">
            <MessageCircle className="h-5 w-5 group-data-[state=active]:text-white text-slate-600 dark:text-slate-400" />
          </div>
          <span className="text-xs font-medium group-data-[state=active]:text-purple-500 text-slate-600 dark:text-slate-400">FixChat</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="ai-assistant" 
          className="flex flex-col items-center justify-center gap-2 data-[state=active]:bg-transparent relative group h-full"
        >
          <div className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 group-data-[state=active]:bg-purple-500 group-data-[state=active]:shadow-lg">
            <Bot className="h-5 w-5 group-data-[state=active]:text-white text-slate-600 dark:text-slate-400" />
          </div>
          <span className="text-xs font-medium group-data-[state=active]:text-purple-500 text-slate-600 dark:text-slate-400">FixBot</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="analytics" 
          className="flex flex-col items-center justify-center gap-2 data-[state=active]:bg-transparent relative group h-full"
        >
          <div className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 group-data-[state=active]:bg-purple-500 group-data-[state=active]:shadow-lg">
            <GraduationCap className="h-5 w-5 group-data-[state=active]:text-white text-slate-600 dark:text-slate-400" />
          </div>
          <span className="text-xs font-medium group-data-[state=active]:text-purple-500 text-slate-600 dark:text-slate-400">Training</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="settings" 
          className="flex flex-col items-center justify-center gap-2 data-[state=active]:bg-transparent relative group h-full"
        >
          <div className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 group-data-[state=active]:bg-purple-500 group-data-[state=active]:shadow-lg">
            <Settings className="h-5 w-5 group-data-[state=active]:text-white text-slate-600 dark:text-slate-400" />
          </div>
          <span className="text-xs font-medium group-data-[state=active]:text-purple-500 text-slate-600 dark:text-slate-400">Settings</span>
        </TabsTrigger>
      </TabsList>
    </div>
  );
};

export default BottomNavigation;
