
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Home, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCompany } from '@/contexts/CompanyContext';
import ThemeToggle from './ThemeToggle';

interface AppHeaderProps {
  isOnline: boolean;
  onHomeClick: () => void;
  onSignOut: () => void;
}

const AppHeader = ({ isOnline, onHomeClick, onSignOut }: AppHeaderProps) => {
  const { userProfile } = useAuth();
  const { company } = useCompany();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const displayName = userProfile?.full_name || 'User';
  const companyName = company?.name || 'Your Company';

  return (
    <header className="bg-white dark:bg-slate-900 shadow-sm border-b border-slate-200 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and Company */}
          <div className="flex items-center space-x-4">
            <Button 
              onClick={onHomeClick} 
              variant="ghost" 
              size="sm"
              className="flex items-center space-x-2"
            >
              <Home className="h-5 w-5" />
              <span className="font-semibold">{companyName}</span>
            </Button>
          </div>

          {/* Center - Connection Status */}
          <div className="flex items-center">
            <Badge 
              variant={isOnline ? "default" : "destructive"}
              className="text-xs"
            >
              {isOnline ? "Online" : "Offline"}
            </Badge>
          </div>

          {/* Right side - User menu and theme toggle */}
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{displayName}</span>
              </Button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg border border-slate-200 dark:border-slate-700 z-50">
                  <div className="py-1">
                    <div className="px-4 py-2 text-sm text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                      {displayName}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowUserMenu(false);
                        onSignOut();
                      }}
                      className="w-full justify-start px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
