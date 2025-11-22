
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
  useSidebar,
} from "@/components/ui/sidebar";
import { Home, MessageCircle, Bot, GraduationCap, Settings, Users, Calculator, ClipboardList, BarChart3, Package, Calendar, Wrench } from 'lucide-react';

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
];

const DashboardSidebar = ({ activeTab, onTabChange }: DashboardSidebarProps) => {
  const { isMobile, setOpenMobile } = useSidebar();

  const handleTabChange = (tab: string) => {
    onTabChange(tab);
    // Close mobile sidebar when an item is clicked
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar className="bg-white/95 dark:bg-card/80 backdrop-blur-xl border-r border-border/50 z-50">
      <SidebarHeader className="border-b border-border/50 bg-white/90 dark:bg-card/50 backdrop-blur-xl">
        <div className="flex items-center gap-3 px-4 py-4">
          <SidebarTrigger className="h-9 w-9 rounded-xl hover:bg-muted/50 transition-colors" />
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl shadow-lg shadow-purple-500/20">
              <Wrench className="h-4 w-4 text-white" />
            </div>
            <div className="text-base font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
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
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.value}>
                  <SidebarMenuButton
                    isActive={activeTab === item.value}
                    onClick={() => handleTabChange(item.value)}
                    className="rounded-xl hover:bg-purple-100 dark:hover:bg-muted/80 text-slate-900 dark:text-foreground data-[active=true]:bg-gradient-to-r data-[active=true]:from-purple-600 data-[active=true]:to-pink-600 data-[active=true]:text-white data-[active=true]:shadow-lg data-[active=true]:shadow-purple-500/30 transition-all duration-200 h-11"
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
