
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Settings, Home, Bot, Plus } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  onAddWorkOrder?: () => void;
}

const BottomNavigation = ({ activeTab, onTabChange, onAddWorkOrder }: BottomNavigationProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 shadow-lg pb-safe-bottom">
      <div className="relative">
        <TabsList className="grid w-full grid-cols-5 h-16 bg-white dark:bg-slate-900 rounded-none">
          <TabItem value="dashboard" icon={<Home />} label="Home" activeTab={activeTab} onTabChange={onTabChange} />
          <TabItem value="fixchat" icon={<MessageCircle />} label="Chat" activeTab={activeTab} onTabChange={onTabChange} />
          
          {/* Center Add Button */}
          <div className="relative flex items-center justify-center">
            <button
              onClick={onAddWorkOrder}
              className="absolute -top-6 w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
            >
              <Plus className="h-7 w-7 text-white" strokeWidth={3} />
            </button>
          </div>
          
          <TabItem value="ai-assistant" icon={<Bot />} label="AI" activeTab={activeTab} onTabChange={onTabChange} />
          <TabItem value="settings" icon={<Settings />} label="Settings" activeTab={activeTab} onTabChange={onTabChange} />
        </TabsList>
      </div>
    </div>
  );
};

const TabItem = ({ 
  value, 
  icon,
  label,
  activeTab,
  onTabChange
}: { 
  value: string; 
  icon: React.ReactNode;
  label: string;
  activeTab: string;
  onTabChange: (value: string) => void;
}) => {
  const isActive = activeTab === value;
  
  return (
    <TabsTrigger
      value={value}
      onClick={() => onTabChange(value)}
      className="relative flex flex-col items-center justify-center h-full bg-transparent data-[state=active]:bg-transparent gap-1"
    >
      {React.cloneElement(icon as React.ReactElement, { 
        className: isActive ? "h-5 w-5 text-purple-600 dark:text-purple-400" : "h-5 w-5 text-slate-400 dark:text-slate-500",
      })}
      <span className={`text-xs ${isActive ? 'text-purple-600 dark:text-purple-400 font-medium' : 'text-slate-400 dark:text-slate-500'}`}>
        {label}
      </span>
    </TabsTrigger>
  );
};

export default BottomNavigation;
