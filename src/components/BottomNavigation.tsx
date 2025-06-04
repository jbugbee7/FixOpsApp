
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Settings, Home, Bot, GraduationCap } from 'lucide-react';
import { Fragment } from "react";

const BottomNavigation = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 shadow-lg pb-safe-bottom">
      <TabsList className="grid w-full grid-cols-5 h-20 bg-white dark:bg-slate-900 rounded-none">
        <TabItem value="dashboard" icon={<Home />} label="Home" />
        <TabItem value="fixchat" icon={<MessageCircle />} label="Chat" />
        <TabItem value="ai-assistant" icon={<Bot />} label="FixBot" />
        <TabItem value="analytics" icon={<GraduationCap />} label="Training" />
        <TabItem value="settings" icon={<Settings />} label="Settings" />
      </TabsList>
    </div>
  );
};

// Extracted TabItem component for better reusability and readability
const TabItem = ({ 
  value, 
  icon, 
  label 
}: { 
  value: string; 
  icon: React.ReactNode; 
  label: string 
}) => {
  return (
    <TabsTrigger
      value={value}
      className="relative flex flex-col items-center justify-center data-[state=active]:bg-transparent h-full"
    >
      <div className="flex flex-col items-center justify-center gap-1">
        {/* Active tab indicator - elevated circle */}
        <div className="w-12 h-12 rounded-full flex items-center justify-center mb-1 transition-all duration-300 group-data-[state=active]:bg-purple-500 data-[state=active]:bg-purple-600 data-[state=active]:shadow-md data-[state=active]:text-white dark:data-[state=active]:text-white text-slate-400 dark:text-slate-400">
          {React.cloneElement(icon as React.ReactElement, { 
            className: "h-5 w-5",
          })}
        </div>
        <span className="text-xs font-medium data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400 text-slate-500 dark:text-slate-400 mt-0.5">
          {label}
        </span>
      </div>
    </TabsTrigger>
  );
};

export default BottomNavigation;
