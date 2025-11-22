
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
    <header className="bg-gradient-to-r from-background via-card to-background backdrop-blur-xl border-b border-border/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Sidebar trigger and Home Button */}
          <div className="flex items-center gap-2">
            <SidebarTrigger className="h-9 w-9 md:hidden rounded-xl hover:bg-muted/50 transition-colors" />
            <Button 
              onClick={onHomeClick} 
              variant="ghost" 
              size="sm"
              className="rounded-xl hover:bg-muted/50 transition-colors"
            >
              <Home className="h-5 w-5 mr-2" />
              <span className="hidden sm:inline font-medium">Home</span>
            </Button>
          </div>

          {/* Center - FixOps Logo */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 dark:from-red-600 dark:to-white rounded-2xl shadow-lg shadow-red-500/30">
              <Wrench className="h-5 w-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <div className="text-xl font-bold bg-gradient-to-r from-red-600 to-black dark:from-red-600 dark:to-white bg-clip-text text-transparent">
                FixOps
              </div>
            </div>
          </div>

          {/* Right side - WiFi Status and User menu */}
          <div className="flex items-center gap-3">
            {/* WiFi Status */}
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-muted/50">
              {isOnline ? (
                <Wifi className="h-4 w-4 text-green-600 dark:text-green-400" />
              ) : (
                <WifiOff className="h-4 w-4 text-muted-foreground" />
              )}
            </div>

            {/* User menu */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="rounded-xl hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-red-600 mr-2">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="hidden sm:inline font-medium">{displayName}</span>
              </Button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-card/95 backdrop-blur-xl rounded-2xl shadow-xl border border-border/50 z-50 overflow-hidden">
                  <div className="p-4 border-b border-border/50">
                    <p className="font-semibold">{displayName}</p>
                    <p className="text-xs text-muted-foreground mt-1">{userProfile?.email}</p>
                  </div>
                  <div className="p-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowUserMenu(false);
                        onSignOut();
                      }}
                      className="w-full justify-start rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
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
