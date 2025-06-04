
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ChatLayoutProps {
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;
  sidebar: React.ReactNode;
  children: React.ReactNode;
}

const ChatLayout = ({ 
  mobileSidebarOpen, 
  setMobileSidebarOpen, 
  sidebar, 
  children 
}: ChatLayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="h-screen flex bg-slate-50 dark:bg-slate-900">
      {/* Mobile Sidebar Overlay */}
      {isMobile && mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`${
        isMobile 
          ? `fixed left-0 top-0 h-full z-50 transform transition-transform duration-300 ${
              mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`
          : 'relative'
      }`}>
        {sidebar}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {children}
      </div>
    </div>
  );
};

export default ChatLayout;
