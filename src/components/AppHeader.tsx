
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, User, Wrench } from 'lucide-react';
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
    <header className="bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo */}
          <div className="flex items-center space-x-4">
            <Button 
              onClick={onHomeClick} 
              variant="ghost" 
              size="sm"
              className="text-white hover:bg-white/20 flex items-center space-x-3"
            >
              <div className="p-2 bg-white/20 rounded-lg">
                <Wrench className="h-6 w-6 text-white" />
              </div>
              <div className="text-left">
                <div className="text-xl font-bold">FixOps</div>
                <div className="text-xs text-purple-100">Repair Management</div>
              </div>
            </Button>
          </div>

          {/* Center - Connection Status */}
          <div className="flex items-center">
            <Badge 
              variant={isOnline ? "default" : "destructive"}
              className={`text-xs ${isOnline ? 'bg-green-500 hover:bg-green-600' : ''}`}
            >
              {isOnline ? "Online" : "Offline"}
            </Badge>
          </div>

          {/* Right side - User menu */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="text-white hover:bg-white/20 flex items-center space-x-2"
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
