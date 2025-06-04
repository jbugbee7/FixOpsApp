
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Settings, Home, Bot, GraduationCap } from 'lucide-react';

const BottomNavigation = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 shadow-lg pb-safe-bottom">
      <TabsList className="grid w-full grid-cols-5 h-16 bg-white dark:bg-slate-900 rounded-none relative">
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
      className="relative flex items-center justify-center h-full bg-transparent data-[state=active]:bg-transparent"
    >
      {/* Normal state icon */}
      <div className="flex items-center justify-center data-[state=active]:hidden text-slate-400 dark:text-slate-400">
        {React.cloneElement(icon as React.ReactElement, { 
          className: "h-6 w-6",
        })}
      </div>
      
      {/* Active state - purple circle with scooped effect */}
      <div className="hidden data-[state=active]:flex absolute inset-0 items-center justify-center">
        {/* Purple circle that "scoops" the icon */}
        <div className="relative">
          {/* Main circle */}
          <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center shadow-lg">
            {React.cloneElement(icon as React.ReactElement, { 
              className: "h-6 w-6 text-white",
            })}
          </div>
          
          {/* Curved bottom extension */}
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-4 bg-purple-600 rounded-b-full"></div>
          
          {/* Smooth blend with background */}
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-20 h-3 bg-white dark:bg-slate-900 rounded-t-full"></div>
        </div>
      </div>
    </TabsTrigger>
  );
};

export default BottomNavigation;
