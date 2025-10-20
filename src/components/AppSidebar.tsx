import { LayoutDashboard, Settings, Wallet, Gamepad2, TrendingUp, BookOpen, Store, Users, UserPlus, MessageSquare, Megaphone, Download, FolderOpen, ShieldCheck, RefreshCw, LogOut, ChevronRight, Image, CreditCard, DollarSign, Globe, Library, Heart, Gift, Ticket, ArrowLeftRight, Building2, FileText, UserCheck, Lock, ToggleLeft, MessageCircle, Search, Eye, Ban, AlertTriangle, DollarSign as DollarIcon, Repeat, UserCog, ListChecks } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import mobigateIcon from "@/assets/mobigate-icon.svg";
import mobigateLogo from "@/assets/mobigate-logo.svg";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, useSidebar } from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

// Superadmin Menu Items
const superadminMenuItems = [
  {
    title: "App Settings",
    icon: Settings,
    items: [
      { title: "All Settings", url: "/superadmin/settings/all" }
    ]
  },
  {
    title: "Manage Quiz",
    icon: Gamepad2,
    items: [
      { title: "Set Categories", url: "/superadmin/quiz/categories" },
      { title: "Set Quiz Levels", url: "/superadmin/quiz/levels" },
      { title: "Set Questions", url: "/superadmin/quiz/set-questions" },
      { title: "Manage Questions", url: "/superadmin/quiz/manage-questions" },
      { title: "Monitor All Quiz", url: "/superadmin/quiz/monitor" }
    ]
  },
  {
    title: "Manage e-Library",
    icon: Library,
    items: [
      { title: "Set e-Library Access Fee", url: "/superadmin/elibrary/access-fee" },
      { title: "Set e-Library Content Fee", url: "/superadmin/elibrary/content-fee" },
      { title: "Set e-Library Income Sharing", url: "/superadmin/elibrary/income-sharing" },
      { title: "Set Content \"Like\" Fee", url: "/superadmin/elibrary/like-fee" },
      { title: "Set \"Like\" Fee Sharing", url: "/superadmin/elibrary/like-sharing" },
      { title: "Set Content Disclaimer", url: "/superadmin/elibrary/disclaimer" },
      { title: "Set Personalized Content Duration", url: "/superadmin/elibrary/content-duration" },
      { title: "View Personalized Contents", url: "/superadmin/elibrary/personalized" },
      { title: "Create e-Library Categories", url: "/superadmin/elibrary/create-categories" },
      { title: "Post/Manage e-Library Contents", url: "/superadmin/elibrary/manage-contents" }
    ]
  },
  {
    title: "Manage Users",
    icon: UserCog,
    items: [
      { title: "View/Manage Users", url: "/superadmin/users/manage" },
      { title: "Password Reset Codes", url: "/superadmin/users/password-reset" },
      { title: "Verify Pending Users", url: "/superadmin/users/verify" },
      { title: "View Users Wallet", url: "/superadmin/users/wallets" },
      { title: "Users' Disciplinary System", url: "/superadmin/users/disciplinary" },
      { title: "Moderate e-Library Comments", url: "/superadmin/users/moderate-comments" }
    ]
  },
  {
    title: "Search Engine Activities",
    icon: Search,
    items: [
      { title: "Site Visitors Record", url: "/superadmin/search/visitors" },
      { title: "View 3 Pending Tickets", url: "/superadmin/search/tickets" }
    ]
  },
  {
    title: "Manage Finances",
    icon: DollarIcon,
    items: [
      { title: "Withdrawal Requests", url: "/superadmin/finances/withdrawals" },
      { title: "Gifts Account", url: "/superadmin/finances/gifts" },
      { title: "Gifts Liquidations", url: "/superadmin/finances/gifts-liquidations" },
      { title: "Like Accounts", url: "/superadmin/finances/likes" },
      { title: "Penalty Debits Accounts", url: "/superadmin/finances/penalties" },
      { title: "Follow Accounts", url: "/superadmin/finances/follows" },
      { title: "Quiz Game Accounts", url: "/superadmin/finances/quiz" },
      { title: "Transfer Fee Accounts", url: "/superadmin/finances/transfer-fees" },
      { title: "e-Library Access Accounts", url: "/superadmin/finances/elibrary-access" },
      { title: "Debit or Credit User", url: "/superadmin/finances/debit-credit" },
      { title: "View Users' Fundings", url: "/superadmin/finances/fundings" },
      { title: "View All Pay-Out", url: "/superadmin/finances/payouts" }
    ]
  },
  {
    title: "Manage Adverts",
    icon: Megaphone,
    items: [
      { title: "Set Ad Slot Rate", url: "/superadmin/adverts/slot-rate" },
      { title: "View/Manage All Adverts", url: "/superadmin/adverts/manage" },
      { title: "Upload/Manage Promotional Ads", url: "/superadmin/adverts/promotional" }
    ]
  },
  {
    title: "Manage Communities",
    icon: Users,
    url: "/superadmin/communities"
  },
  {
    title: "Manage Mobi Circles",
    icon: UserPlus,
    url: "/superadmin/mobi-circles"
  },
  {
    title: "Manage Biz-catalogue",
    icon: Store,
    url: "/superadmin/biz-catalogue"
  },
  {
    title: "Manage FundRaiser",
    icon: TrendingUp,
    url: "/superadmin/fundraiser"
  },
  {
    title: "Manage Others",
    icon: ListChecks,
    url: "/superadmin/others"
  }
];

// Users' Menu Items
const menuItems = [{
  title: "Wallet Menu",
  icon: Wallet,
  items: [
    { title: "Fund Your Wallet", url: "/wallet/fund" },
    { title: "Wallet Funding History", url: "/wallet/history" },
    { title: "My Financial Summary", url: "/wallet/summary" }
  ]
}, {
  title: "Quiz Game",
  icon: Gamepad2,
  items: [
    { title: "Play Quiz Game", url: "/quiz/play" },
    { title: "My Quiz History", url: "/quiz/history" }
  ]
}, {
  title: "Earnings Reports",
  icon: TrendingUp,
  items: [
    { title: "Content Access Earnings", url: "/earnings/content-access" },
    { title: "Content \"Likes\" Earnings", url: "/earnings/likes" },
    { title: "\"Follow\" Earnings", url: "/earnings/follow" },
    { title: "Gifts Income and Expenditure", url: "/earnings/gifts" }
  ]
}, {
  title: "e-Library Menu",
  icon: BookOpen,
  items: [
    { title: "Visit e-Library", url: "/library" },
    { title: "Submit/Manage My e-Library Content", url: "/library/manage" }
  ]
}, {
  title: "Merchants Menu",
  icon: Store,
  items: [
    { title: "Apply as Individual Merchant", url: "/merchants/apply-individual" },
    { title: "Apply as Corporate Merchant", url: "/merchants/apply-corporate" }
  ]
}, {
  title: "Friendship Menu",
  icon: Users,
  items: [
    { title: "Find Friends", url: "/friends/find" },
    { title: "Invite Friends", url: "/friends/invite" },
    { title: "2 Sent Requests", url: "/friends/requests" },
    { title: "View My 17 Friends", url: "/friends" }
  ]
}, {
  title: "Followers/Following",
  icon: UserPlus,
  items: [
    { title: "My Followers", url: "/followers" },
    { title: "My Followings", url: "/following" }
  ]
}, {
  title: "Messages/Chats",
  icon: MessageSquare,
  items: [
    { title: "Chat Friends", url: "/messages/friends" },
    { title: "Chat Followers (15)", url: "/messages/followers" },
    { title: "Chat My Followings", url: "/messages/following" },
    { title: "View All Chats", url: "/messages" }
  ]
}, {
  title: "Advertisements",
  icon: Megaphone,
  items: [
    { title: "Submit Advert", url: "/ads/submit" },
    { title: "View/Manage My Adverts", url: "/ads/manage" }
  ]
}, {
  title: "Funds Management",
  icon: Download,
  items: [
    { title: "Withdraw Gift", url: "/funds/withdraw-gift" },
    { title: "Withdraw Credit", url: "/funds/withdraw-credit" },
    { title: "My Withdrawal Requests", url: "/funds/withdrawal-requests" },
    { title: "My Withdrawal History", url: "/funds/withdrawal-history" },
    { title: "Funds Transfer", url: "/funds/transfer" },
    { title: "My Transfer History", url: "/funds/transfer-history" },
    { title: "Transfer Charges", url: "/funds/charges" },
    { title: "Exchange Rates", url: "/funds/exchange-rates" },
    { title: "Account Statement", url: "/funds/statement" }
  ]
}, {
  title: "Account Verification",
  icon: ShieldCheck,
  url: "/verification"
}];
export function AppSidebar() {
  const {
    open
  } = useSidebar();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const toggleExpand = (title: string) => {
    setExpandedItems(prev => prev.includes(title) ? prev.filter(item => item !== title) : [...prev, title]);
  };
  return <Sidebar collapsible="icon" className="border-r border-border/50 bg-gradient-to-b from-card to-muted/30">
      <SidebarHeader className="border-b border-border/50 px-4 py-4">
        <div className="flex items-center gap-3">
          {open ? <>
              
              <img src={mobigateLogo} alt="Mobigate" className="h-10 w-auto" />
            </> : <img src={mobigateIcon} alt="Mobigate" className="h-10 w-10" />}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        {/* Dashboard Section - Standalone */}
        <SidebarGroup className="mb-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <NavLink to="/" end>
                {({ isActive }) => (
                  <SidebarMenuButton tooltip="Dashboard" className={cn("group relative overflow-hidden transition-all duration-200", isActive ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-md hover:shadow-lg" : "hover:bg-accent/50")}>
                    <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg transition-colors", isActive ? "bg-primary text-primary-foreground shadow-md" : "bg-primary/10 text-primary group-hover:bg-primary/20")}>
                      <LayoutDashboard className="h-4 w-4" />
                    </div>
                    <span className="font-medium">Dashboard</span>
                    {isActive && open && <div className="absolute right-0 top-0 h-full w-1 bg-primary-foreground rounded-l-full" />}
                  </SidebarMenuButton>
                )}
              </NavLink>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* ADMIN MENU Section */}
        <SidebarGroup className="mb-4">
          <SidebarGroupLabel className="text-base font-bold text-muted-foreground/70 uppercase tracking-widest px-3 mb-2">
            Admin Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {superadminMenuItems.map(item => {
                const isExpanded = expandedItems.includes(item.title);

                // Items with sub-menu
                if (item.items) {
                  return (
                    <Collapsible key={item.title} open={isExpanded} onOpenChange={() => toggleExpand(item.title)}>
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton tooltip={item.title} className="group hover:bg-accent/50 transition-all duration-200 h-auto min-h-[2.5rem] py-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors shrink-0">
                              <item.icon className="h-4 w-4" />
                            </div>
                            <span className="font-medium flex-1 whitespace-normal break-words leading-tight text-left">{item.title}</span>
                            <ChevronRight className={cn("ml-auto h-4 w-4 transition-transform duration-200 shrink-0", isExpanded && "rotate-90")} />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-1">
                          <SidebarMenuSub className="ml-6 border-l-2 border-primary/20 pl-2">
                            {item.items.map(subItem => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <NavLink to={subItem.url}>
                                  {({ isActive }) => (
                                    <SidebarMenuSubButton className={cn("transition-all duration-200 h-auto min-h-[1.75rem] py-1.5 [&>span:last-child]:!whitespace-normal [&>span:last-child]:!overflow-visible [&>span:last-child]:!text-clip", isActive ? "bg-primary/10 text-primary font-medium border-l-2 border-primary" : "hover:bg-accent/30")}>
                                      <span className="flex-1 whitespace-normal break-words leading-tight text-left">{subItem.title}</span>
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
                        <SidebarMenuButton tooltip={item.title} className={cn("group transition-all duration-200", isActive ? "bg-primary/10 text-primary font-medium" : "hover:bg-accent/50")}>
                          <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg transition-colors", isActive ? "bg-primary text-primary-foreground shadow-md" : "bg-primary/10 text-primary group-hover:bg-primary/20")}>
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

        {/* USERS' MENU Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-base font-bold text-muted-foreground/70 uppercase tracking-widest px-3 mb-2">
            Users' Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map(item => {
                const isExpanded = expandedItems.includes(item.title);

                // Items with sub-menu
                if (item.items) {
                  return (
                    <Collapsible key={item.title} open={isExpanded} onOpenChange={() => toggleExpand(item.title)}>
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton tooltip={item.title} className="group hover:bg-accent/50 transition-all duration-200 h-auto min-h-[2.5rem] py-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors shrink-0">
                              <item.icon className="h-4 w-4" />
                            </div>
                            <span className="font-medium flex-1 whitespace-normal break-words leading-tight text-left">{item.title}</span>
                            <ChevronRight className={cn("ml-auto h-4 w-4 transition-transform duration-200 shrink-0", isExpanded && "rotate-90")} />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-1">
                          <SidebarMenuSub className="ml-6 border-l-2 border-primary/20 pl-2">
                            {item.items.map(subItem => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <NavLink to={subItem.url}>
                                  {({ isActive }) => (
                                    <SidebarMenuSubButton className={cn("transition-all duration-200 h-auto min-h-[1.75rem] py-1.5 [&>span:last-child]:!whitespace-normal [&>span:last-child]:!overflow-visible [&>span:last-child]:!text-clip", isActive ? "bg-primary/10 text-primary font-medium border-l-2 border-primary" : "hover:bg-accent/30")}>
                                      <span className="flex-1 whitespace-normal break-words leading-tight text-left">{subItem.title}</span>
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
                        <SidebarMenuButton tooltip={item.title} className={cn("group transition-all duration-200", isActive ? "bg-primary/10 text-primary font-medium" : "hover:bg-accent/50")}>
                          <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg transition-colors", isActive ? "bg-primary text-primary-foreground shadow-md" : "bg-primary/10 text-primary group-hover:bg-primary/20")}>
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
            <SidebarMenuButton tooltip="Reload" onClick={() => window.location.reload()} className="group hover:bg-accent/50 transition-all duration-200">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted-foreground/10 text-muted-foreground group-hover:bg-muted-foreground/20">
                <RefreshCw className="h-4 w-4" />
              </div>
              <span className="font-medium">Reload</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Sign Out" onClick={() => {
            console.log("Sign out clicked");
          }} className="group hover:bg-destructive/10 text-destructive transition-all duration-200">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10 text-destructive group-hover:bg-destructive/20">
                <LogOut className="h-4 w-4" />
              </div>
              <span className="font-medium">Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>;
}