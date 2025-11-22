
import React from "react";
import { Home, BarChart3, Users, DollarSign, Plus } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  onAddWorkOrder?: () => void;
}

const BottomNavigation = ({ activeTab, onTabChange, onAddWorkOrder }: BottomNavigationProps) => {
  // Only show dashboard tabs when on dashboard-related views
  const isDashboardView = activeTab === 'dashboard' || activeTab === 'mobile-analytics' || activeTab === 'mobile-crm' || activeTab === 'mobile-accounting';

  if (!isDashboardView) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 shadow-lg pb-safe-bottom">
      <div className="relative">
        <div className="grid w-full grid-cols-5 h-16">
          <NavButton value="dashboard" icon={<Home />} label="Home" activeTab={activeTab} onTabChange={onTabChange} />
          <NavButton value="mobile-analytics" icon={<BarChart3 />} label="Analytics" activeTab={activeTab} onTabChange={onTabChange} />
          
          {/* Center Add Button */}
          <div className="relative flex items-center justify-center">
            <button
              onClick={onAddWorkOrder}
      className="absolute -top-6 w-14 h-14 bg-gun-metal rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 active:scale-95"
    >
      <Plus className="h-7 w-7 text-white" strokeWidth={3} />
            </button>
          </div>
          
          <NavButton value="mobile-crm" icon={<Users />} label="CRM" activeTab={activeTab} onTabChange={onTabChange} />
          <NavButton value="mobile-accounting" icon={<DollarSign />} label="Accounting" activeTab={activeTab} onTabChange={onTabChange} />
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
        className: isActive ? "h-5 w-5 text-gun-metal dark:text-gun-metal" : "h-5 w-5 text-gun-metal/60 dark:text-gun-metal/60",
      })}
      <span className={`text-xs ${isActive ? 'text-gun-metal dark:text-gun-metal font-medium' : 'text-gun-metal/60 dark:text-gun-metal/60'}`}>
        {label}
      </span>
    </button>
  );
};

export default BottomNavigation;
