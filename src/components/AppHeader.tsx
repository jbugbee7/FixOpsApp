
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Search } from 'lucide-react';
import { SidebarTrigger } from "@/components/ui/sidebar";
import GlobalSearch from './GlobalSearch';
import logo from '@/assets/fixops-logo.png';

interface AppHeaderProps {
  isOnline: boolean;
  onHomeClick: () => void;
  onSignOut: () => void;
  onNavigate: (tab: string) => void;
}

const AppHeader = ({ isOnline, onHomeClick, onSignOut, onNavigate }: AppHeaderProps) => {
  const [searchOpen, setSearchOpen] = useState(false);

  // Keyboard shortcut for search (Cmd+K or Ctrl+K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <>
      <header className="bg-background border-b border-border/50 sticky top-0 z-50">
        <div className="flex justify-between items-center h-16 px-4">
          {/* Left side - Logo */}
          <div className="flex items-center">
            <img src={logo} alt="FixOps" className="h-10 w-auto" />
          </div>
          
          {/* Right side - Search and Sidebar trigger */}
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              className="h-9 w-9 rounded-xl hover:bg-muted/50 transition-colors"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-5 w-5 text-gun-metal dark:text-gun-metal" />
            </Button>
            <SidebarTrigger className="h-9 w-9 rounded-xl hover:bg-muted/50 transition-colors" />
          </div>
        </div>
      </header>

      <GlobalSearch 
        open={searchOpen} 
        onOpenChange={setSearchOpen}
        onNavigate={onNavigate}
      />
    </>
  );
};

export default AppHeader;
