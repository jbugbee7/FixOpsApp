
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Settings, Home, Bot, GraduationCap, Users } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

const BottomNavigation = ({ activeTab, onTabChange }: BottomNavigationProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 shadow-lg pb-safe-bottom">
      <TabsList className="grid w-full grid-cols-6 h-16 bg-white dark:bg-slate-900 rounded-none relative overflow-visible">
        <TabItem value="dashboard" icon={<Home />} activeTab={activeTab} onTabChange={onTabChange} />
        <TabItem value="fixchat" icon={<MessageCircle />} activeTab={activeTab} onTabChange={onTabChange} />
        <TabItem value="discussion" icon={<Users />} activeTab={activeTab} onTabChange={onTabChange} />
        <TabItem value="ai-assistant" icon={<Bot />} activeTab={activeTab} onTabChange={onTabChange} />
        <TabItem value="analytics" icon={<GraduationCap />} activeTab={activeTab} onTabChange={onTabChange} />
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
      className="relative flex items-center justify-center h-full bg-transparent data-[state=active]:bg-transparent overflow-visible"
    >
      {/* Normal state icon */}
      {!isActive && (
        <div className="flex items-center justify-center text-slate-400 dark:text-slate-400">
          {React.cloneElement(icon as React.ReactElement, { 
            className: "h-6 w-6",
          })}
        </div>
      )}
      
      {/* Active state - smaller raised purple circle with cut-out effect */}
      {isActive && (
        <>
          {/* Cut-out effect - creates the notch in the tab bar */}
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-16 h-8 bg-transparent">
            {/* Main cut-out area */}
            <div className="absolute top-4 left-2 right-2 h-4 bg-transparent"></div>
          </div>
          
          {/* Smaller raised purple circle */}
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center shadow-lg">
              {React.cloneElement(icon as React.ReactElement, { 
                className: "h-5 w-5 text-white",
              })}
            </div>
          </div>
        </>
      )}
    </TabsTrigger>
  );
};

export default BottomNavigation;
