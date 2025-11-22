
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
import logo from '@/assets/fixops-logo.png';
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
    title: "FixChat",
    value: "fixchat",
    icon: MessageCircle,
  },
  {
    title: "AI Assistant",
    value: "ai-assistant",
    icon: Bot,
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

const DashboardSidebar = ({ activeTab, onTabChange }: DashboardSidebarProps) => {
  const { isMobile, setOpenMobile } = useSidebar();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Filter menu items for mobile - only show Dashboard, Work Order, AI Assistant, Settings, Logout
  const mobileAllowedTabs = ['dashboard', 'work-order', 'ai-assistant', 'settings', 'logout'];
  const displayMenuItems = isMobile 
    ? menuItems.filter(item => mobileAllowedTabs.includes(item.value))
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
    <Sidebar side="right" className="bg-white/95 dark:bg-card/80 backdrop-blur-xl border-l border-border/50 z-50">
      <SidebarHeader className="border-b border-border/50 bg-white/90 dark:bg-card/50 backdrop-blur-xl">
        <div className="flex items-center gap-3 px-4 py-4">
          <SidebarTrigger className="h-9 w-9 rounded-xl hover:bg-muted/50 transition-colors" />
          <div className="flex items-center gap-2">
            <img src={logo} alt="FixOps" className="h-8 w-auto" />
            <div className="text-base font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              FixOps
            </div>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="bg-white/80 dark:bg-card/30 p-2">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs font-semibold text-slate-700 dark:text-foreground/70 uppercase tracking-wider">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {displayMenuItems.map((item) => (
                <SidebarMenuItem key={item.value}>
                  <SidebarMenuButton
                    isActive={activeTab === item.value}
                    onClick={() => handleTabChange(item.value)}
                    className={
                      item.value === 'logout'
                        ? "rounded-xl hover:bg-destructive/10 text-slate-900 dark:text-foreground hover:text-destructive transition-all duration-200 h-11"
                        : "rounded-xl hover:bg-primary/10 text-slate-900 dark:text-foreground data-[active=true]:bg-gradient-to-r data-[active=true]:from-primary data-[active=true]:to-accent data-[active=true]:text-white data-[active=true]:shadow-lg data-[active=true]:shadow-primary/30 transition-all duration-200 h-11"
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
