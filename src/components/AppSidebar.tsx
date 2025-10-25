import { LayoutDashboard, Settings, Wallet, Gamepad2, TrendingUp, BookOpen, Store, Users, UserPlus, MessageSquare, Megaphone, Download, FolderOpen, ShieldCheck, RefreshCw, LogOut, ChevronRight, Image, CreditCard, DollarSign, Globe, Library, Heart, Gift, Ticket, ArrowLeftRight, Building2, FileText, UserCheck, Lock, ToggleLeft, MessageCircle, Search, Eye, Ban, AlertTriangle, DollarSign as DollarIcon, Repeat, UserCog, ListChecks } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import mobigateIcon from "@/assets/mobigate-icon.svg";
import mobigateLogo from "@/assets/mobigate-logo.svg";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, useSidebar } from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

// Superadmin Menu Items
const superadminMenuItems = [
  {
    title: "App Settings",
    icon: Settings,
    items: [
      { title: "All Settings", url: "/application/all_settings.php" }
    ]
  },
  {
    title: "Manage Quiz",
    icon: Gamepad2,
    items: [
      { title: "Set Categories", url: "/application/manage_categories.php" },
      { title: "Set Quiz Levels", url: "/application/manage_levels.php" },
      { title: "Set Questions", url: "/application/quiz_questions.php" },
      { title: "Manage Questions", url: "/application/manage_all_questions.php" },
      { title: "Monitor All Quiz", url: "/application/monitor_quiz.php" }
    ]
  },
  {
    title: "Manage e-Library",
    icon: Library,
    items: [
      { title: "Set e-Library Access Fee", url: "/application/all_settings.php#elibrary" },
      { title: "Set e-Library Content Fee", url: "/application/all_settings.php#contentfee" },
      { title: "Set e-Library Income Sharing", url: "/application/all_settings.php#elibrary_income_sharing" },
      { title: "Set Content \"Like\" Fee", url: "/application/all_settings.php#content_like_fee" },
      { title: "Set \"Like\" Fee Sharing", url: "/application/all_settings.php#content_like_fee_sharing" },
      { title: "Set Content Disclaimer", url: "/application/set_content_disclaimer.php" },
      { title: "Set Personalized Content Duration", url: "/application/all_settings.php#personalized_elibrary_content_duration" },
      { title: "View Personalized Contents", url: "/application/personalized_elibrary_contents.php" },
      { title: "Create e-Library Categories", url: "/application/elibrary_categories.php" },
      { title: "Post/Manage e-Library Contents", url: "/application/post_manage_elibrary_articles.php" }
    ]
  },
  {
    title: "Manage Users",
    icon: UserCog,
    items: [
      { title: "View/Manage Users", url: "/application/manage_users.php" },
      { title: "Password Reset Codes", url: "/application/prc.php" },
      { title: "Verify Pending Users", url: "/application/manage_kyc.php" },
      { title: "View Users Wallet", url: "/application/view_users_wallet.php" },
      { title: "Users' Disciplinary System", url: "#" },
      { title: "Moderate e-Library Comments", url: "/application/moderate_elibrary_comments.php" }
    ]
  },
  {
    title: "Search Engine Activities",
    icon: Search,
    items: [
      { title: "elibrary_search_engine_activities", url: "/application/elibrary_search_engine_activities.php" },
      { title: "Site Visitors Record", url: "/application/site_visitors_record.php" },
      { title: "View 3 Pending Tickets", url: "/application/all_support_tickets.php" }
    ]
  },
  {
    title: "Manage Finances",
    icon: DollarIcon,
    items: [
      { title: "Withdrawal Requests", url: "/application/manage_withdrawal_requests.php" },
      { title: "Gifts Account", url: "/application/gift_account.php" },
      { title: "Gifts Liquidations", url: "/application/gift_liquidations.php" },
      { title: "Like Accounts", url: "/application/like_account.php" },
      { title: "Penalty Debits Accounts", url: "/application/penalty_debit_account.php" },
      { title: "Follow Accounts", url: "/application/follow_account.php" },
      { title: "Quiz Game Accounts", url: "/application/account.php" },
      { title: "Transfer Fee Accounts", url: "/application/transfer_fee_account.php" },
      { title: "e-Library Access Accounts", url: "/application/elibrary_account.php" },
      { title: "Debit or Credit User", url: "/application/debit_credit_user.php" },
      { title: "View Users' Fundings", url: "/application/fundings.php" },
      { title: "View All Pay-Out", url: "/application/withdrawals.php" }
    ]
  },
  {
    title: "Manage Adverts",
    icon: Megaphone,
    items: [
      { title: "Set Ad Slot Rate", url: "/application/all_settings.php#advert_slot_fee" },
      { title: "View/Manage All Adverts", url: "/admin/manage-adverts" },
      { title: "Upload/Manage Promotional Ads", url: "/application/upload_manage_promotional_ad.php" }
    ]
  }
];

// Users' Menu Items with nested structure support
interface MenuItem {
  title: string;
  icon?: any;
  url?: string;
  items?: MenuItem[];
}

const menuItems: MenuItem[] = [{
  title: "Wallet Menu",
  icon: Wallet,
  items: [
    { title: "Fund Your Wallet", url: "/application/buy_coins.php" },
    { title: "Wallet Funding History", url: "/application/coins_purchase_history.php" },
    { title: "My Financial Summary", url: "#" }
  ]
}, {
  title: "Quiz Game",
  icon: Gamepad2,
  items: [
    { title: "Play Quiz Game", url: "/application/take_quiz.php" },
    { title: "My Quiz History", url: "/application/my_quiz_account.php" }
  ]
}, {
  title: "Earnings Reports",
  icon: TrendingUp,
  items: [
    { title: "Content Access Earnings", url: "/application/my_content_account.php" },
    { title: "Content \"Likes\" Earnings", url: "/application/likes_income.php" },
    { title: "\"Follow\" Earnings", url: "/application/follow_income.php" },
    { title: "Gifts Income and Expenditure", url: "/application/gifts_income.php" }
  ]
}, {
  title: "e-Library Menu",
  icon: BookOpen,
  items: [
    { title: "Visit e-Library", url: "/application/articles.php" },
    { title: "Submit/Manage My e-Library Content", url: "/application/submit_manage_my_elibrary_content.php" }
  ]
}, {
  title: "Merchants Menu",
  icon: Store,
  items: [
    { title: "Buy Vouchers", url: "#" },
    { 
      title: "View Merchants",
      url: "#",
      items: [
        { 
          title: "By Countries", 
          url: "#",
          items: [
            { 
              title: "By States/Provinces", 
              url: "#",
              items: [
                { title: "By Cities/Counties", url: "#" }
              ]
            }
          ]
        }
      ]
    },
    { 
      title: "Apply for a Merchant Account",
      url: "#",
      items: [
        { title: "Individual Merchant Account", url: "#" },
        { title: "Corporate Merchant Account", url: "#" }
      ]
    }
  ]
}, {
  title: "Friendship Menu",
  icon: Users,
  items: [
    { title: "Find Friends", url: "/application/find_friends.php" },
    { title: "Invite Friends", url: "#" },
    { title: "Sent Requests", url: "/application/manage_sent_friends_requests.php" },
    { title: "View My Friends", url: "/application/my_friends.php" }
  ]
}, {
  title: "My Social Communities",
  icon: Building2,
  url: "#"
}, {
  title: "My Circles",
  icon: Users,
  url: "#"
}, {
  title: "Find Love",
  icon: Heart,
  url: "#"
}, {
  title: "Followers/Following",
  icon: UserPlus,
  items: [
    { title: "My Followers", url: "/application/my_followers.php" },
    { title: "My Followings", url: "/application/my_followings.php" }
  ]
}, {
  title: "Messages/Chats",
  icon: MessageSquare,
  items: [
    { title: "Chat Friends", url: "/application/my_friends.php" },
    { title: "Chat Followers", url: "/application/my_followers.php" },
    { title: "Chat My Followings", url: "/application/my_followings.php" },
    { title: "View All Chats", url: "#" }
  ]
}, {
  title: "Advertisements",
  icon: Megaphone,
  items: [
    { title: "Submit Adverts", url: "/submit-advert" },
    { title: "View/Manage Adverts", url: "/my-adverts" },
    { title: "Advert Subscription Rates", url: "#" },
    { 
      title: "Accredited Advertisers", 
      url: "#",
      items: [
        { title: "Application", url: "#" },
        { 
          title: "View Accredited Advertisers",
          url: "#",
          items: [
            { title: "By Countries", url: "#" },
            { title: "By States/Provinces", url: "#" }
          ]
        }
      ]
    }
  ]
}, {
  title: "Funds Management",
  icon: Download,
  items: [
    { title: "Withdraw Gift", url: "/application/withdraw_my_gift.php" },
    { title: "Withdraw Credit", url: "/application/withdraw_grants.php" },
    { title: "My Withdrawal Requests", url: "/application/my_withdrawal_requests.php" },
    { title: "My Withdrawal History", url: "/application/withdrawal_history.php" },
    { title: "Funds Transfer", url: "/application/transfer.php" },
    { title: "My Transfer History", url: "/application/transfer_history.php" },
    { title: "Transfer Charges", url: "/application/transfer_charges.php" },
    { title: "Exchange Rates", url: "/application/exchange_rates.php" },
    { title: "Account Statement", url: "/application/wallet_activities.php" }
  ]
}, {
  title: "Account Verification",
  icon: ShieldCheck,
  url: "/application/user_kyc.php"
}];
export function AppSidebar() {
  const {
    open,
    setOpenMobile
  } = useSidebar();
  const isMobile = useIsMobile();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  
  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };
  
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

  // Recursive function to render menu items with any depth
  const renderMenuItem = (subItem: MenuItem, itemKey: string): React.ReactNode => {
    const isInternalRoute = subItem.url && subItem.url.startsWith('/') && !subItem.url.includes('.php');
    const isSubExpanded = expandedItems.includes(itemKey);
    
    // If has nested items, render as collapsible
    if (subItem.items && subItem.items.length > 0) {
      return (
        <Collapsible key={subItem.title} open={isSubExpanded} onOpenChange={() => toggleExpand(itemKey)}>
          <SidebarMenuSubItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuSubButton className="transition-all duration-200 h-auto min-h-[1.75rem] py-1.5 hover:bg-accent/30 w-full">
                <span className="flex-1 whitespace-normal break-words leading-tight text-left">{subItem.title}</span>
                <ChevronRight className={cn("ml-auto h-4 w-4 transition-transform duration-200 shrink-0", isSubExpanded && "rotate-90")} />
              </SidebarMenuSubButton>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-1">
              <SidebarMenuSub className="ml-4 border-l-2 border-primary/20 pl-2">
                {subItem.items.map(nestedItem => renderMenuItem(nestedItem, `${itemKey}-${nestedItem.title}`))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuSubItem>
        </Collapsible>
      );
    }
    
    // Otherwise, render as regular link
    return (
      <SidebarMenuSubItem key={subItem.title}>
        <SidebarMenuSubButton asChild className="transition-all duration-200 h-auto min-h-[1.75rem] py-1.5 hover:bg-accent/30">
          {isInternalRoute ? (
            <Link to={subItem.url!} onClick={handleLinkClick}>
              <span className="flex-1 whitespace-normal break-words leading-tight text-left">{subItem.title}</span>
            </Link>
          ) : (
            <a href={subItem.url} onClick={handleLinkClick}>
              <span className="flex-1 whitespace-normal break-words leading-tight text-left">{subItem.title}</span>
            </a>
          )}
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
    );
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
              <SidebarMenuButton asChild tooltip="Dashboard" className="group relative overflow-hidden transition-all duration-200 hover:bg-accent/50">
                <a href="/application/index.php" onClick={handleLinkClick}>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors bg-primary/10 text-primary group-hover:bg-primary/20">
                    <LayoutDashboard className="h-4 w-4" />
                  </div>
                  <span className="font-medium">Dashboard</span>
                </a>
              </SidebarMenuButton>
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
                            {item.items.map(subItem => renderMenuItem(subItem, `${item.title}-${subItem.title}`))}
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
                            {item.items.map(subItem => renderMenuItem(subItem, `${item.title}-${subItem.title}`))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }

                // Items without sub-menu
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title} className="group transition-all duration-200 hover:bg-accent/50">
                      <a href={item.url!} onClick={handleLinkClick}>
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors bg-primary/10 text-primary group-hover:bg-primary/20">
                          <item.icon className="h-4 w-4" />
                        </div>
                        <span className="font-medium">{item.title}</span>
                      </a>
                    </SidebarMenuButton>
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
            <SidebarMenuButton asChild tooltip="Reload" className="group hover:bg-accent/50 transition-all duration-200">
              <a href="/application/all_notifications.php" onClick={handleLinkClick}>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted-foreground/10 text-muted-foreground group-hover:bg-muted-foreground/20">
                  <RefreshCw className="h-4 w-4" />
                </div>
                <span className="font-medium">Reload</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Sign Out" className="group hover:bg-destructive/10 text-destructive transition-all duration-200">
              <a href="/application/logout.php" onClick={handleLinkClick}>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10 text-destructive group-hover:bg-destructive/20">
                  <LogOut className="h-4 w-4" />
                </div>
                <span className="font-medium">Sign Out</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>;
}