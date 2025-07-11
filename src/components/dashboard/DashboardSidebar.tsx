
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
import { Home, MessageCircle, Bot, GraduationCap, Settings, Users, Calculator, ClipboardList, BarChart3, Package, Calendar } from 'lucide-react';

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
    <Sidebar className="bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 z-50">
      <SidebarHeader className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
        <div className="flex items-center gap-2 px-2 py-2">
          <SidebarTrigger className="h-8 w-8" />
          <div className="flex items-center space-x-1">
            <div className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              FixOps
            </div>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="bg-white dark:bg-slate-900">
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.value}>
                  <SidebarMenuButton
                    isActive={activeTab === item.value}
                    onClick={() => handleTabChange(item.value)}
                    className="w-full hover:bg-slate-100 dark:hover:bg-slate-800 data-[active=true]:bg-purple-100 dark:data-[active=true]:bg-purple-900/20 data-[active=true]:text-purple-700 dark:data-[active=true]:text-purple-300"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
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
