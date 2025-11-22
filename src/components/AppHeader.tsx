
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { LogOut, User, Wrench, Home, Wifi, WifiOff } from 'lucide-react';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from '@/contexts/AuthContext';

interface AppHeaderProps {
  isOnline: boolean;
  onHomeClick: () => void;
  onSignOut: () => void;
}

const AppHeader = ({ isOnline, onHomeClick, onSignOut }: AppHeaderProps) => {
  const { userProfile } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const displayName = userProfile?.full_name || 'User';

  return (
    <header className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 shadow-lg border-b border-slate-200 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Sidebar trigger and Home Button */}
          <div className="flex items-center gap-2">
            <SidebarTrigger className="h-8 w-8 md:hidden" />
            <Button 
              onClick={onHomeClick} 
              variant="ghost" 
              size="sm"
              className="text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center space-x-2"
            >
              <Home className="h-5 w-5" />
              <span className="hidden sm:inline">Home</span>
            </Button>
          </div>

          {/* Center - FixOps Logo */}
          <div className="flex items-center space-x-1">
            <div className="p-1.5 bg-gradient-to-r from-red-600 to-black rounded-lg shadow-md">
              <Wrench className="h-4 w-4 text-white" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-red-600 to-black bg-clip-text text-transparent">
                FixOps
              </div>
            </div>
          </div>

          {/* Right side - WiFi Status and User menu */}
          <div className="flex items-center space-x-3">
            {/* WiFi Status */}
            <div className="flex items-center">
              {isOnline ? (
                <Wifi className="h-5 w-5 text-green-600 dark:text-green-400" />
              ) : (
                <WifiOff className="h-5 w-5 text-slate-400 dark:text-slate-500" />
              )}
            </div>

            {/* User menu */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center space-x-2"
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
