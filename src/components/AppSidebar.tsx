import {
  LayoutDashboard,
  Wallet,
  Gamepad2,
  TrendingUp,
  BookOpen,
  Store,
  Users,
  UserPlus,
  MessageSquare,
  Megaphone,
  Download,
  FolderOpen,
  ThumbsUp,
  RefreshCw,
  Power,
  ChevronDown,
} from "lucide-react";
import { NavLink } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const menuItems = [
  {
    title: "Wallet Menu",
    icon: Wallet,
    items: [
      { title: "My Wallet", url: "/wallet" },
      { title: "Top Up", url: "/wallet/topup" },
      { title: "Withdraw", url: "/wallet/withdraw" },
    ],
  },
  {
    title: "Quiz Game",
    icon: Gamepad2,
    items: [
      { title: "Play Quiz", url: "/quiz" },
      { title: "Leaderboard", url: "/quiz/leaderboard" },
    ],
  },
  {
    title: "Earnings Reports",
    icon: TrendingUp,
    items: [
      { title: "View Reports", url: "/earnings" },
      { title: "Monthly Stats", url: "/earnings/monthly" },
    ],
  },
  {
    title: "e-Library Menu",
    icon: BookOpen,
    items: [
      { title: "Browse Library", url: "/library" },
      { title: "My Books", url: "/library/mybooks" },
    ],
  },
  {
    title: "Merchants Menu",
    icon: Store,
    items: [
      { title: "Browse Merchants", url: "/merchants" },
      { title: "My Shop", url: "/merchants/myshop" },
    ],
  },
  {
    title: "Friendship Menu",
    icon: Users,
    items: [
      { title: "My Friends", url: "/friends" },
      { title: "Friend Requests", url: "/friends/requests" },
    ],
  },
  { title: "Followers/Following", icon: UserPlus, url: "/followers" },
  { title: "Messages/Chats", icon: MessageSquare, url: "/messages" },
  {
    title: "Advertisements",
    icon: Megaphone,
    items: [
      { title: "Browse Ads", url: "/ads" },
      { title: "Create Ad", url: "/ads/create" },
    ],
  },
  { title: "Funds Management", icon: Download, url: "/funds" },
  { title: "Account Statement", icon: FolderOpen, url: "/statement" },
  { title: "Account Verification", icon: ThumbsUp, url: "/verification" },
];

export function AppSidebar() {
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon" className="border-r bg-sidebar">
      <SidebarContent>
        {/* Dashboard Section */}
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Dashboard">
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      : ""
                  }
                >
                  <LayoutDashboard className="h-5 w-5" />
                  <span>Dashboard</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* USERS' MENU Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            USERS' MENU
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                // Items with sub-menu
                if (item.items) {
                  return (
                    <Collapsible key={item.title} asChild defaultOpen={false}>
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton tooltip={item.title}>
                            <item.icon className="h-5 w-5" />
                            <span>{item.title}</span>
                            <ChevronDown className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton asChild>
                                  <NavLink
                                    to={subItem.url}
                                    className={({ isActive }) =>
                                      isActive
                                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                                        : ""
                                    }
                                  >
                                    <span>{subItem.title}</span>
                                  </NavLink>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }

                // Items without sub-menu
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <NavLink
                        to={item.url!}
                        className={({ isActive }) =>
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                            : ""
                        }
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer Actions */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Reload"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="h-5 w-5" />
              <span>Reload</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Sign Out"
              onClick={() => {
                // Add sign out logic here
                console.log("Sign out clicked");
              }}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Power className="h-5 w-5" />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
