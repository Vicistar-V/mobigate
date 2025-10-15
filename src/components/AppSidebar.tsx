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
  ShieldCheck,
  RefreshCw,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import mobigateIcon from "@/assets/mobigate-icon.svg";
import mobigateLogo from "@/assets/mobigate-logo.svg";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
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
import { cn } from "@/lib/utils";

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
  { title: "Account Verification", icon: ShieldCheck, url: "/verification" },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border/50 bg-gradient-to-b from-card to-muted/30">
      <SidebarHeader className="border-b border-border/50 px-4 py-4">
        <div className="flex items-center gap-3">
          {open ? (
            <>
              <img 
                src={mobigateIcon} 
                alt="Mobigate Icon" 
                className="h-10 w-10"
              />
              <img 
                src={mobigateLogo} 
                alt="Mobigate" 
                className="h-10 w-auto"
              />
            </>
          ) : (
            <img 
              src={mobigateIcon} 
              alt="Mobigate" 
              className="h-10 w-10"
            />
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        {/* Dashboard Section */}
        <SidebarGroup className="mb-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <NavLink to="/" end>
                {({ isActive }) => (
                  <SidebarMenuButton
                    tooltip="Dashboard"
                    className={cn(
                      "group relative overflow-hidden transition-all duration-200",
                      isActive
                        ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-md hover:shadow-lg"
                        : "hover:bg-accent/50"
                    )}
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    <span className="font-medium">Dashboard</span>
                    {isActive && open && (
                      <div className="absolute right-0 top-0 h-full w-1 bg-primary-foreground rounded-l-full" />
                    )}
                  </SidebarMenuButton>
                )}
              </NavLink>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* USERS' MENU Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-bold text-muted-foreground/70 uppercase tracking-widest px-3 mb-2">
            Users' Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => {
                const isExpanded = expandedItems.includes(item.title);

                // Items with sub-menu
                if (item.items) {
                  return (
                    <Collapsible
                      key={item.title}
                      open={isExpanded}
                      onOpenChange={() => toggleExpand(item.title)}
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            tooltip={item.title}
                            className="group hover:bg-accent/50 transition-all duration-200"
                          >
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                              <item.icon className="h-4 w-4" />
                            </div>
                            <span className="font-medium">{item.title}</span>
                            <ChevronRight
                              className={cn(
                                "ml-auto h-4 w-4 transition-transform duration-200",
                                isExpanded && "rotate-90"
                              )}
                            />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-1">
                          <SidebarMenuSub className="ml-6 border-l-2 border-primary/20 pl-2">
                            {item.items.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <NavLink to={subItem.url}>
                                  {({ isActive }) => (
                                    <SidebarMenuSubButton
                                      className={cn(
                                        "transition-all duration-200",
                                        isActive
                                          ? "bg-primary/10 text-primary font-medium border-l-2 border-primary"
                                          : "hover:bg-accent/30"
                                      )}
                                    >
                                      <span>{subItem.title}</span>
                                    </SidebarMenuSubButton>
                                  )}
                                </NavLink>
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
                    <NavLink to={item.url!}>
                      {({ isActive }) => (
                        <SidebarMenuButton
                          tooltip={item.title}
                          className={cn(
                            "group transition-all duration-200",
                            isActive
                              ? "bg-primary/10 text-primary font-medium"
                              : "hover:bg-accent/50"
                          )}
                        >
                          <div
                            className={cn(
                              "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                              isActive
                                ? "bg-primary text-primary-foreground shadow-md"
                                : "bg-primary/10 text-primary group-hover:bg-primary/20"
                            )}
                          >
                            <item.icon className="h-4 w-4" />
                          </div>
                          <span className="font-medium">{item.title}</span>
                        </SidebarMenuButton>
                      )}
                    </NavLink>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer Actions */}
      <SidebarFooter className="border-t border-border/50 px-3 py-3 bg-muted/30">
        <SidebarMenu className="space-y-1">
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Reload"
              onClick={() => window.location.reload()}
              className="group hover:bg-accent/50 transition-all duration-200"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted-foreground/10 text-muted-foreground group-hover:bg-muted-foreground/20">
                <RefreshCw className="h-4 w-4" />
              </div>
              <span className="font-medium">Reload</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Sign Out"
              onClick={() => {
                console.log("Sign out clicked");
              }}
              className="group hover:bg-destructive/10 text-destructive transition-all duration-200"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10 text-destructive group-hover:bg-destructive/20">
                <LogOut className="h-4 w-4" />
              </div>
              <span className="font-medium">Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
