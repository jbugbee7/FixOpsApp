
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Home, MessageCircle, Bot, GraduationCap, Settings, Users, Calculator, ClipboardList, BarChart3, Package, Calendar, Wrench, LogOut } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface DashboardSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  {
    title: "Dashboard",
    value: "dashboard",
    icon: BarChart3,
  },
  {
    title: "Work Order",
    value: "work-order",
    icon: ClipboardList,
  },
  {
    title: "Training",
    value: "training",
    icon: GraduationCap,
  },
  {
    title: "CRM",
    value: "crm",
    icon: Users,
  },
  {
    title: "Inventory Tracker",
    value: "inventory",
    icon: Package,
  },
  {
    title: "Accounting",
    value: "accounting",
    icon: Calculator,
  },
  {
    title: "Scheduling",
    value: "scheduling",
    icon: Calendar,
  },
  {
    title: "Settings",
    value: "settings",
    icon: Settings,
  },
  {
    title: "Logout",
    value: "logout",
    icon: LogOut,
  },
];

const mobileOnlyItems = [
  {
    title: "AI Assistant",
    value: "ai-assistant",
    icon: Bot,
  },
];

const DashboardSidebar = ({ activeTab, onTabChange }: DashboardSidebarProps) => {
  const { isMobile, setOpenMobile } = useSidebar();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Filter menu items for mobile - only show Dashboard, Work Order, AI Assistant, Settings, Logout
  const mobileAllowedTabs = ['dashboard', 'work-order', 'ai-assistant', 'settings', 'logout'];
  const displayMenuItems = isMobile 
    ? [...menuItems.filter(item => mobileAllowedTabs.includes(item.value)), ...mobileOnlyItems]
    : menuItems;

  const handleTabChange = (tab: string) => {
    if (tab === 'logout') {
      handleLogout();
      return;
    }
    onTabChange(tab);
    // Close mobile sidebar when an item is clicked
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      navigate('/auth');
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Sidebar side="right" className="bg-card/95 dark:bg-background/95 backdrop-blur-xl border-l border-border/50 z-50">
      <SidebarHeader className="bg-card/90 dark:bg-card/50 backdrop-blur-xl">
        <div className="flex items-center gap-3 px-4 py-1.5">
          {isMobile && <SidebarTrigger className="h-8 w-8 rounded-xl hover:bg-muted/50 transition-colors" />}
          <div className="text-sm font-bold text-foreground">
            FixOps
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="bg-card/80 dark:bg-card/30 p-2">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {displayMenuItems.map((item) => (
                <SidebarMenuItem key={item.value}>
                  <SidebarMenuButton
                    isActive={activeTab === item.value}
                    onClick={() => handleTabChange(item.value)}
                    className={
                      item.value === 'logout'
                        ? "rounded-xl hover:bg-destructive/10 text-foreground hover:text-destructive transition-all duration-200 h-11"
                        : "rounded-xl hover:bg-primary/10 text-foreground data-[active=true]:bg-gradient-to-r data-[active=true]:from-primary data-[active=true]:to-accent data-[active=true]:text-primary-foreground data-[active=true]:shadow-lg data-[active=true]:shadow-primary/30 transition-all duration-200 h-11"
                    }
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="font-medium">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default DashboardSidebar;
