
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
    <Sidebar className="bg-card/50 backdrop-blur-xl border-r border-border/50 z-50">
      <SidebarHeader className="border-b border-border/50 bg-card/30 backdrop-blur-xl">
        <div className="flex items-center gap-3 px-4 py-4">
          <SidebarTrigger className="h-9 w-9 rounded-xl hover:bg-muted/50 transition-colors" />
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-red-600 to-red-700 dark:from-red-600 dark:to-white rounded-xl shadow-lg shadow-red-500/20">
              <Wrench className="h-4 w-4 text-white" />
            </div>
            <div className="text-base font-bold bg-gradient-to-r from-red-600 to-black dark:from-red-600 dark:to-white bg-clip-text text-transparent">
              FixOps
            </div>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="bg-transparent p-2">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.value}>
                  <SidebarMenuButton
                    isActive={activeTab === item.value}
                    onClick={() => handleTabChange(item.value)}
                    className="rounded-xl hover:bg-muted/50 data-[active=true]:bg-gradient-to-r data-[active=true]:from-red-600 data-[active=true]:to-red-700 data-[active=true]:text-white data-[active=true]:shadow-lg data-[active=true]:shadow-red-500/30 transition-all duration-200 h-11"
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
