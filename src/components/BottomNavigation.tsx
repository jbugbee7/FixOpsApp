
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Settings, Home, Bot, GraduationCap } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

const BottomNavigation = ({ activeTab, onTabChange }: BottomNavigationProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 shadow-lg pb-safe-bottom">
      <TabsList className="grid w-full grid-cols-5 h-16 bg-white dark:bg-slate-900 rounded-none">
        <TabItem value="dashboard" icon={<Home />} activeTab={activeTab} onTabChange={onTabChange} />
        <TabItem value="fixchat" icon={<MessageCircle />} activeTab={activeTab} onTabChange={onTabChange} />
        <TabItem value="ai-assistant" icon={<Bot />} activeTab={activeTab} onTabChange={onTabChange} />
        <TabItem value="training" icon={<GraduationCap />} activeTab={activeTab} onTabChange={onTabChange} />
        <TabItem value="settings" icon={<Settings />} activeTab={activeTab} onTabChange={onTabChange} />
      </TabsList>
    </div>
  );
};

const TabItem = ({ 
  value, 
  icon,
  activeTab,
  onTabChange
}: { 
  value: string; 
  icon: React.ReactNode;
  activeTab: string;
  onTabChange: (value: string) => void;
}) => {
  const isActive = activeTab === value;
  
  return (
    <TabsTrigger
      value={value}
      onClick={() => onTabChange(value)}
      className="relative flex items-center justify-center h-full bg-transparent data-[state=active]:bg-transparent"
    >
      {/* Normal state icon */}
      {!isActive && (
        <div className="flex items-center justify-center text-slate-400 dark:text-slate-400">
          {React.cloneElement(icon as React.ReactElement, { 
            className: "h-6 w-6",
          })}
        </div>
      )}
      
      {/* Active state - purple circle contained within tab */}
      {isActive && (
        <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center shadow-lg">
          {React.cloneElement(icon as React.ReactElement, { 
            className: "h-5 w-5 text-white",
          })}
        </div>
      )}
    </TabsTrigger>
  );
};

export default BottomNavigation;
