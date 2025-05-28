
import { Button } from "@/components/ui/button";
import { Home, LogOut, Wrench, Wifi, WifiOff } from 'lucide-react';

interface AppHeaderProps {
  isOnline: boolean;
  onHomeClick: () => void;
  onSignOut: () => void;
}

const AppHeader = ({ isOnline, onHomeClick, onSignOut }: AppHeaderProps) => {
  return (
    <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 dark:bg-slate-900/80 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Left - Home Button and Logo */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onHomeClick} className="flex items-center">
              <Home className="h-6 w-6" />
            </Button>
            
            {/* Logo with wrench icon */}
            <div className="flex items-center space-x-3">
              <Wrench className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  FixOps
                </h1>
              </div>
            </div>
          </div>
          
          {/* Right - Connection Status and Sign Out Icon */}
          <div className="flex items-center space-x-2">
            {/* Connection Status */}
            <div className="flex items-center">
              {isOnline ? (
                <Wifi className="h-5 w-5 text-green-600" />
              ) : (
                <WifiOff className="h-5 w-5 text-red-600" />
              )}
            </div>
            
            <Button variant="ghost" size="sm" onClick={onSignOut} className="flex items-center">
              <LogOut className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppHeader;
