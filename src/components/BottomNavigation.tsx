
import React from "react";
import { Home, Wrench, Bot, Settings } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

const BottomNavigation = ({ activeTab, onTabChange }: BottomNavigationProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 shadow-lg pb-safe-bottom">
      <div className="relative">
        <div className="grid w-full grid-cols-4 h-16">
          <NavButton value="dashboard" icon={<Home />} label="Home" activeTab={activeTab} onTabChange={onTabChange} />
          <NavButton value="work-order" icon={<Wrench />} label="Work Order" activeTab={activeTab} onTabChange={onTabChange} />
          <NavButton value="ai-assistant" icon={<Bot />} label="AI Assistant" activeTab={activeTab} onTabChange={onTabChange} />
          <NavButton value="settings" icon={<Settings />} label="Settings" activeTab={activeTab} onTabChange={onTabChange} />
        </div>
      </div>
    </div>
  );
};

const NavButton = ({ 
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
    <button
      onClick={() => onTabChange(value)}
      className="relative flex flex-col items-center justify-center h-full bg-transparent gap-1 transition-colors"
    >
      {React.cloneElement(icon as React.ReactElement, { 
        className: isActive ? "h-5 w-5 text-purple-600 dark:text-purple-400" : "h-5 w-5 text-slate-400 dark:text-slate-500",
      })}
      <span className={`text-xs ${isActive ? 'text-purple-600 dark:text-purple-400 font-medium' : 'text-slate-400 dark:text-slate-500'}`}>
        {label}
      </span>
    </button>
  );
};

export default BottomNavigation;
