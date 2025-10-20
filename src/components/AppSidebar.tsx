import { LayoutDashboard, Settings, Wallet, Gamepad2, TrendingUp, BookOpen, Store, Users, UserPlus, MessageSquare, Megaphone, Download, FolderOpen, ShieldCheck, RefreshCw, LogOut, ChevronRight, Image, CreditCard, DollarSign, Globe, Library, Heart, Gift, Ticket, ArrowLeftRight, Building2, FileText, UserCheck, Lock, ToggleLeft, MessageCircle, Search, Eye, Ban, AlertTriangle, DollarSign as DollarIcon, Repeat, UserCog, ListChecks } from "lucide-react";
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
      { title: "All Settings", url: "all_settings.php" }
    ]
  },
  {
    title: "Manage Quiz",
    icon: Gamepad2,
    items: [
      { title: "Set Categories", url: "manage_categories.php" },
      { title: "Set Quiz Levels", url: "manage_levels.php" },
      { title: "Set Questions", url: "quiz_questions.php" },
      { title: "Manage Questions", url: "manage_all_questions.php" },
      { title: "Monitor All Quiz", url: "monitor_quiz.php" }
    ]
  },
  {
    title: "Manage e-Library",
    icon: Library,
    items: [
      { title: "Set e-Library Access Fee", url: "all_settings.php#elibrary" },
      { title: "Set e-Library Content Fee", url: "all_settings.php#contentfee" },
      { title: "Set e-Library Income Sharing", url: "all_settings.php#elibrary_income_sharing" },
      { title: "Set Content \"Like\" Fee", url: "all_settings.php#content_like_fee" },
      { title: "Set \"Like\" Fee Sharing", url: "all_settings.php#content_like_fee_sharing" },
      { title: "Set Content Disclaimer", url: "set_content_disclaimer.php" },
      { title: "Set Personalized Content Duration", url: "all_settings.php#personalized_elibrary_content_duration" },
      { title: "View Personalized Contents", url: "personalized_elibrary_contents.php" },
      { title: "Create e-Library Categories", url: "elibrary_categories.php" },
      { title: "Post/Manage e-Library Contents", url: "post_manage_elibrary_articles.php" }
    ]
  },
  {
    title: "Manage Users",
    icon: UserCog,
    items: [
      { title: "View/Manage Users", url: "manage_users.php" },
      { title: "Password Reset Codes", url: "prc.php" },
      { title: "Verify Pending Users", url: "manage_kyc.php" },
      { title: "View Users Wallet", url: "view_users_wallet.php" },
      { title: "Users' Disciplinary System", url: "#" },
      { title: "Moderate e-Library Comments", url: "moderate_elibrary_comments.php" }
    ]
  },
  {
    title: "Search Engine Activities",
    icon: Search,
    items: [
      { title: "elibrary_search_engine_activities", url: "elibrary_search_engine_activities.php" },
      { title: "Site Visitors Record", url: "site_visitors_record.php" },
      { title: "View 3 Pending Tickets", url: "all_support_tickets.php" }
    ]
  },
  {
    title: "Manage Finances",
    icon: DollarIcon,
    items: [
      { title: "Withdrawal Requests", url: "manage_withdrawal_requests.php" },
      { title: "Gifts Account", url: "gift_account.php" },
      { title: "Gifts Liquidations", url: "gift_liquidations.php" },
      { title: "Like Accounts", url: "like_account.php" },
      { title: "Penalty Debits Accounts", url: "penalty_debit_account.php" },
      { title: "Follow Accounts", url: "follow_account.php" },
      { title: "Quiz Game Accounts", url: "account.php" },
      { title: "Transfer Fee Accounts", url: "transfer_fee_account.php" },
      { title: "e-Library Access Accounts", url: "elibrary_account.php" },
      { title: "Debit or Credit User", url: "debit_credit_user.php" },
      { title: "View Users' Fundings", url: "fundings.php" },
      { title: "View All Pay-Out", url: "withdrawals.php" }
    ]
  },
  {
    title: "Manage Adverts",
    icon: Megaphone,
    items: [
      { title: "Set Ad Slot Rate", url: "all_settings.php#advert_slot_fee" },
      { title: "View/Manage All Adverts", url: "adverts_management.php" },
      { title: "Upload/Manage Promotional Ads", url: "upload_manage_promotional_ad.php" }
    ]
  }
];

// Users' Menu Items
const menuItems = [{
  title: "Wallet Menu",
  icon: Wallet,
  items: [
    { title: "Fund Your Wallet", url: "buy_coins.php" },
    { title: "Wallet Funding History", url: "coins_purchase_history.php" },
    { title: "My Financial Summary", url: "#" }
  ]
}, {
  title: "Quiz Game",
  icon: Gamepad2,
  items: [
    { title: "Play Quiz Game", url: "take_quiz.php" },
    { title: "My Quiz History", url: "my_quiz_account.php" }
  ]
}, {
  title: "Earnings Reports",
  icon: TrendingUp,
  items: [
    { title: "Content Access Earnings", url: "my_content_account.php" },
    { title: "Content \"Likes\" Earnings", url: "likes_income.php" },
    { title: "\"Follow\" Earnings", url: "follow_income.php" },
    { title: "Gifts Income and Expenditure", url: "gifts_income.php" }
  ]
}, {
  title: "e-Library Menu",
  icon: BookOpen,
  items: [
    { title: "Visit e-Library", url: "articles.php" },
    { title: "Submit/Manage My e-Library Content", url: "submit_manage_my_elibrary_content.php" }
  ]
}, {
  title: "Merchants Menu",
  icon: Store,
  items: [
    { title: "Apply as Individual Merchant", url: "#" },
    { title: "Apply as Corporate Merchant", url: "#" }
  ]
}, {
  title: "Friendship Menu",
  icon: Users,
  items: [
    { title: "Find Friends", url: "find_friends.php" },
    { title: "Invite Friends", url: "#" },
    { title: "2 Sent Requests", url: "manage_sent_friends_requests.php" },
    { title: "View My 17 Friends", url: "my_friends.php" }
  ]
}, {
  title: "Followers/Following",
  icon: UserPlus,
  items: [
    { title: "My Followers", url: "my_followers.php" },
    { title: "My Followings", url: "my_followings.php" }
  ]
}, {
  title: "Messages/Chats",
  icon: MessageSquare,
  items: [
    { title: "Chat Friends", url: "my_friends.php" },
    { title: "Chat Followers", url: "my_followers.php" },
    { title: "Chat My Followings", url: "my_followings.php" },
    { title: "View All Chats", url: "#" }
  ]
}, {
  title: "Advertisements",
  icon: Megaphone,
  items: [
    { title: "Submit Advert", url: "submit_manage_advert.php" },
    { title: "View/Manage My Adverts", url: "submit_manage_advert.php" }
  ]
}, {
  title: "Funds Management",
  icon: Download,
  items: [
    { title: "Withdraw Gift", url: "withdraw_my_gift.php" },
    { title: "Withdraw Credit", url: "withdraw_grants.php" },
    { title: "My Withdrawal Requests", url: "my_withdrawal_requests.php" },
    { title: "My Withdrawal History", url: "withdrawal_history.php" },
    { title: "Funds Transfer", url: "transfer.php" },
    { title: "My Transfer History", url: "transfer_history.php" },
    { title: "Transfer Charges", url: "transfer_charges.php" },
    { title: "Exchange Rates", url: "exchange_rates.php" },
    { title: "Account Statement", url: "wallet_activities.php" }
  ]
}, {
  title: "Account Verification",
  icon: ShieldCheck,
  url: "user_kyc.php"
}];
export function AppSidebar() {
  const {
    open
  } = useSidebar();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  
  const toggleExpand = (title: string) => {
    setExpandedItems(prev => {
      if (prev.includes(title)) {
        // Close this item and all its children
        return prev.filter(item => !item.startsWith(title));
      } else {
        // Close other items at the same level, keep children of other parents
        const level = title.split('-').length;
        const filtered = prev.filter(item => {
          const itemLevel = item.split('-').length;
          // Keep items that are children of this item's ancestors
          if (level > 1) {
            const parentPrefix = title.substring(0, title.lastIndexOf('-'));
            return item.startsWith(parentPrefix + '-') && itemLevel > level;
          }
          // For top level, only keep nested children
          return itemLevel > 1 && prev.some(p => p !== item && item.startsWith(p + '-'));
        });
        return [...filtered, title];
      }
    });
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
              <a href="index.php">
                <SidebarMenuButton tooltip="Dashboard" className="group relative overflow-hidden transition-all duration-200 hover:bg-accent/50">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors bg-primary/10 text-primary group-hover:bg-primary/20">
                    <LayoutDashboard className="h-4 w-4" />
                  </div>
                  <span className="font-medium">Dashboard</span>
                </SidebarMenuButton>
              </a>
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
                              <a href={subItem.url}>
                                <SidebarMenuSubButton className="transition-all duration-200 h-auto min-h-[1.75rem] py-1.5 [&>span:last-child]:!whitespace-normal [&>span:last-child]:!overflow-visible [&>span:last-child]:!text-clip hover:bg-accent/30">
                                  <span className="flex-1 whitespace-normal break-words leading-tight text-left">{subItem.title}</span>
                                </SidebarMenuSubButton>
                              </a>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
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
                                <a href={subItem.url}>
                                  <SidebarMenuSubButton className="transition-all duration-200 h-auto min-h-[1.75rem] py-1.5 [&>span:last-child]:!whitespace-normal [&>span:last-child]:!overflow-visible [&>span:last-child]:!text-clip hover:bg-accent/30">
                                    <span className="flex-1 whitespace-normal break-words leading-tight text-left">{subItem.title}</span>
                                  </SidebarMenuSubButton>
                                </a>
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
                    <a href={item.url!}>
                      <SidebarMenuButton tooltip={item.title} className="group transition-all duration-200 hover:bg-accent/50">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors bg-primary/10 text-primary group-hover:bg-primary/20">
                          <item.icon className="h-4 w-4" />
                        </div>
                        <span className="font-medium">{item.title}</span>
                      </SidebarMenuButton>
                    </a>
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
            <a href="/application/all_notifications.php">
              <SidebarMenuButton tooltip="Reload" className="group hover:bg-accent/50 transition-all duration-200">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted-foreground/10 text-muted-foreground group-hover:bg-muted-foreground/20">
                  <RefreshCw className="h-4 w-4" />
                </div>
                <span className="font-medium">Reload</span>
              </SidebarMenuButton>
            </a>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <a href="logout.php">
              <SidebarMenuButton tooltip="Sign Out" className="group hover:bg-destructive/10 text-destructive transition-all duration-200">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10 text-destructive group-hover:bg-destructive/20">
                  <LogOut className="h-4 w-4" />
                </div>
                <span className="font-medium">Sign Out</span>
              </SidebarMenuButton>
            </a>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>;
}