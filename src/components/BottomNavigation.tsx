
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Settings, Home, Bot, GraduationCap } from 'lucide-react';

const BottomNavigation = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 shadow-lg pb-safe-bottom">
      <TabsList className="grid w-full grid-cols-5 h-16 bg-white dark:bg-slate-900 rounded-none relative overflow-visible">
        <TabItem value="dashboard" icon={<Home />} />
        <TabItem value="fixchat" icon={<MessageCircle />} />
        <TabItem value="ai-assistant" icon={<Bot />} />
        <TabItem value="analytics" icon={<GraduationCap />} />
        <TabItem value="settings" icon={<Settings />} />
      </TabsList>
    </div>
  );
};

const TabItem = ({ 
  value, 
  icon
}: { 
  value: string; 
  icon: React.ReactNode; 
}) => {
  return (
    <TabsTrigger
      value={value}
      className="relative flex items-center justify-center h-full bg-transparent data-[state=active]:bg-transparent overflow-visible"
    >
      {/* Normal state icon */}
      <div className="flex items-center justify-center text-slate-400 dark:text-slate-400 data-[state=active]:hidden">
        {React.cloneElement(icon as React.ReactElement, { 
          className: "h-6 w-6",
        })}
      </div>
      
      {/* Active state - purple circle with scoop effect */}
      <div className="hidden data-[state=active]:flex absolute -top-2 inset-x-0 items-start justify-center">
        {/* Main purple circle that extends above the tab bar */}
        <div className="relative">
          <div className="w-14 h-14 bg-purple-600 rounded-full flex items-center justify-center shadow-lg relative z-10">
            {React.cloneElement(icon as React.ReactElement, { 
              className: "h-6 w-6 text-white",
            })}
          </div>
          
          {/* Bottom extension that creates the scoop effect */}
          <div className="absolute top-7 left-1/2 transform -translate-x-1/2 w-16 h-8 bg-purple-600"></div>
          
          {/* Curved sides to blend with the background */}
          <div className="absolute top-7 -left-2 w-4 h-8 bg-white dark:bg-slate-900 rounded-br-full"></div>
          <div className="absolute top-7 -right-2 w-4 h-8 bg-white dark:bg-slate-900 rounded-bl-full"></div>
        </div>
      </div>
    </TabsTrigger>
  );
};

export default BottomNavigation;
