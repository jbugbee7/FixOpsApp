
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Settings, Home, Bot, GraduationCap } from 'lucide-react';

const BottomNavigation = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 shadow-lg">
      <TabsList className="grid w-full grid-cols-5 h-24 bg-white dark:bg-slate-900 rounded-none p-3">
        <TabsTrigger 
          value="dashboard" 
          className="flex flex-col items-center justify-center gap-1 data-[state=active]:bg-transparent relative group h-full py-2"
        >
          <div className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 group-data-[state=active]:bg-purple-500 group-data-[state=active]:shadow-lg group-data-[state=active]:scale-110">
            <Home className="h-6 w-6 group-data-[state=active]:text-white text-slate-600 dark:text-slate-400" />
          </div>
          <span className="text-xs font-medium group-data-[state=active]:text-purple-500 text-slate-600 dark:text-slate-400 leading-tight text-center">Dashboard</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="fixchat" 
          className="flex flex-col items-center justify-center gap-1 data-[state=active]:bg-transparent relative group h-full py-2"
        >
          <div className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 group-data-[state=active]:bg-purple-500 group-data-[state=active]:shadow-lg group-data-[state=active]:scale-110">
            <MessageCircle className="h-6 w-6 group-data-[state=active]:text-white text-slate-600 dark:text-slate-400" />
          </div>
          <span className="text-xs font-medium group-data-[state=active]:text-purple-500 text-slate-600 dark:text-slate-400 leading-tight text-center">FixChat</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="ai-assistant" 
          className="flex flex-col items-center justify-center gap-1 data-[state=active]:bg-transparent relative group h-full py-2"
        >
          <div className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 group-data-[state=active]:bg-purple-500 group-data-[state=active]:shadow-lg group-data-[state=active]:scale-110">
            <Bot className="h-6 w-6 group-data-[state=active]:text-white text-slate-600 dark:text-slate-400" />
          </div>
          <span className="text-xs font-medium group-data-[state=active]:text-purple-500 text-slate-600 dark:text-slate-400 leading-tight text-center">FixBot</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="analytics" 
          className="flex flex-col items-center justify-center gap-1 data-[state=active]:bg-transparent relative group h-full py-2"
        >
          <div className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 group-data-[state=active]:bg-purple-500 group-data-[state=active]:shadow-lg group-data-[state=active]:scale-110">
            <GraduationCap className="h-6 w-6 group-data-[state=active]:text-white text-slate-600 dark:text-slate-400" />
          </div>
          <span className="text-xs font-medium group-data-[state=active]:text-purple-500 text-slate-600 dark:text-slate-400 leading-tight text-center">Training</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="settings" 
          className="flex flex-col items-center justify-center gap-1 data-[state=active]:bg-transparent relative group h-full py-2"
        >
          <div className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 group-data-[state=active]:bg-purple-500 group-data-[state=active]:shadow-lg group-data-[state=active]:scale-110">
            <Settings className="h-6 w-6 group-data-[state=active]:text-white text-slate-600 dark:text-slate-400" />
          </div>
          <span className="text-xs font-medium group-data-[state=active]:text-purple-500 text-slate-600 dark:text-slate-400 leading-tight text-center">Settings</span>
        </TabsTrigger>
      </TabsList>
    </div>
  );
};

export default BottomNavigation;
