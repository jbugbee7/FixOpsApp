
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
} from "@/components/ui/sidebar";
import { Home, MessageCircle, Bot, GraduationCap, Settings, Users } from 'lucide-react';

interface DashboardSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  {
    title: "Dashboard",
    value: "dashboard",
    icon: Home,
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
    title: "Settings",
    value: "settings",
    icon: Settings,
  },
];

const DashboardSidebar = ({ activeTab, onTabChange }: DashboardSidebarProps) => {
  return (
    <Sidebar>
      <SidebarHeader className="border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2 px-2 py-2">
          <SidebarTrigger className="h-8 w-8" />
          <div className="flex items-center space-x-1">
            <div className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              FixOps
            </div>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.value}>
                  <SidebarMenuButton
                    isActive={activeTab === item.value}
                    onClick={() => onTabChange(item.value)}
                    className="w-full"
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
