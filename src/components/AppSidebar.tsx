import { LayoutDashboard, Settings, Wallet, Gamepad2, TrendingUp, BookOpen, Store, Users, UserPlus, MessageSquare, Megaphone, Download, FolderOpen, ShieldCheck, RefreshCw, LogOut, ChevronRight, Image, CreditCard, DollarSign, Globe, Library, Heart, Gift, Ticket, ArrowLeftRight, Building2, FileText, UserCheck, Lock, ToggleLeft, MessageCircle, Search, Eye, Ban, AlertTriangle, DollarSign as DollarIcon, Repeat, UserCog, ListChecks } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import mobigateIcon from "@/assets/mobigate-icon.svg";
import mobigateLogo from "@/assets/mobigate-logo.svg";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, useSidebar } from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { QuizAdminDrawer } from "@/components/mobigate/QuizAdminDrawer";

// Superadmin Menu Items
const superadminMenuItems = [
  {
    title: "Mobigate Admin Dashboard",
    icon: LayoutDashboard,
    items: [
      { title: "Overview", url: "/mobigate-admin" }
    ]
  },
  {
    icon: Settings,
    items: [
      { title: "All Settings", url: "/all_settings.php" }
    ]
  },
  {
    title: "Manage Quiz",
    icon: Gamepad2,
    isDrawerTrigger: true,
  },
  {
    title: "Manage e-Library",
    icon: Library,
    items: [
      { title: "Set e-Library Access Fee", url: "/all_settings.php#elibrary" },
      { title: "Set e-Library Content Fee", url: "/all_settings.php#contentfee" },
      { title: "Set e-Library Income Sharing", url: "/all_settings.php#elibrary_income_sharing" },
      { title: "Set Content \"Like\" Fee", url: "/all_settings.php#content_like_fee" },
      { title: "Set \"Like\" Fee Sharing", url: "/all_settings.php#content_like_fee_sharing" },
      { title: "Set Content Disclaimer", url: "/set_content_disclaimer.php" },
      { title: "Set Personalized Content Duration", url: "/all_settings.php#personalized_elibrary_content_duration" },
      { title: "View Personalized Contents", url: "/personalized_elibrary_contents.php" },
      { title: "Create e-Library Categories", url: "/elibrary_categories.php" },
      { title: "Post/Manage e-Library Contents", url: "/post_manage_elibrary_articles.php" }
    ]
  },
  {
    title: "Manage Users",
    icon: UserCog,
    items: [
      { title: "View/Manage Users", url: "/manage_users.php" },
      { title: "Password Reset Codes", url: "/prc.php" },
      { title: "Verify Pending Users", url: "/manage_kyc.php" },
      { title: "View Users Wallet", url: "/view_users_wallet.php" },
      { title: "Users' Disciplinary System", url: "#" },
      { title: "Moderate e-Library Comments", url: "/moderate_elibrary_comments.php" }
    ]
  },
  {
    title: "Search Engine Activities",
    icon: Search,
    items: [
      { title: "elibrary_search_engine_activities", url: "/elibrary_search_engine_activities.php" },
      { title: "Site Visitors Record", url: "/site_visitors_record.php" },
      { title: "View 3 Pending Tickets", url: "/all_support_tickets.php" }
    ]
  },
  {
    title: "Manage Finances",
    icon: DollarIcon,
    items: [
      { title: "Withdrawal Requests", url: "/manage_withdrawal_requests.php" },
      { title: "Gifts Account", url: "/gift_account.php" },
      { title: "Gifts Liquidations", url: "/gift_liquidations.php" },
      { title: "Like Accounts", url: "/like_account.php" },
      { title: "Penalty Debits Accounts", url: "/penalty_debit_account.php" },
      { title: "Follow Accounts", url: "/follow_account.php" },
      { title: "Quiz Games Accounts", url: "/account.php" },
      { title: "Transfer Fee Accounts", url: "/transfer_fee_account.php" },
      { title: "e-Library Access Accounts", url: "/elibrary_account.php" },
      { title: "Debit or Credit User", url: "/debit_credit_user.php" },
      { title: "View Users' Fundings", url: "/fundings.php" },
      { title: "View All Pay-Out", url: "/withdrawals.php" }
    ]
  },
  {
    title: "Manage Adverts",
    icon: Megaphone,
    items: [
      { title: "Set Ad Slot Rate", url: "/mobigate-admin/adverts/slot-rates" },
      { title: "View/Manage All Adverts", url: "/mobigate-admin/adverts/manage" },
      { title: "Upload/Manage Promotional Ads", url: "/mobigate-admin/adverts/promotional" }
    ]
  }
];

// Users' Menu Items with nested structure support
interface MenuItem {
  title: string;
  icon?: any;
  url?: string;
  items?: MenuItem[];
  onClick?: () => void;
}

const menuItems: MenuItem[] = [{
  title: "Wallet Menu",
  icon: Wallet,
  items: [
    { title: "Fund Your Wallet", url: "/buy_coins.php" },
    { title: "Wallet Funding History", url: "/coins_purchase_history.php" },
    { title: "My Financial Summary", url: "#" }
  ]
}, {
  title: "Quiz Games",
  icon: Gamepad2,
  items: [
    { title: "Play Quiz Games", url: "/mobi-quiz-games" },
    { title: "My Quiz History", url: "/my-quiz-history" }
  ]
}, {
  title: "Earnings Reports",
  icon: TrendingUp,
  items: [
    { title: "Content Access Earnings", url: "/my_content_account.php" },
    { title: "Content \"Likes\" Earnings", url: "/likes_income.php" },
    { title: "\"Follow\" Earnings", url: "/follow_income.php" },
    { title: "Gifts Income and Expenditure", url: "/gifts_income.php" }
  ]
}, {
  title: "e-Library Menu",
  icon: BookOpen,
  items: [
    { title: "Visit e-Library", url: "/articles.php" },
    { title: "Submit/Manage My e-Library Content", url: "/submit_manage_my_elibrary_content.php" }
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
    },
    {
      title: "Merchant Quizzes Management",
      url: "/merchant-page",
    }
  ]
}, {
  title: "Friendship Menu",
  icon: Users,
  items: [
    { title: "Find Friends", url: "/find_friends.php" },
    { title: "Invite Friends", url: "#" },
    { title: "Sent Requests", url: "/manage_sent_friends_requests.php" },
    { title: "View My Friends", url: "/my_friends.php" }
  ]
}, {
  title: "My Social Communities",
  icon: Building2,
  url: "/community"
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
    { title: "My Followers", url: "/my_followers.php" },
    { title: "My Followings", url: "/my_followings.php" }
  ]
}, {
  title: "Messages/Chats",
  icon: MessageSquare,
  items: [
    { title: "Chat Friends", url: "/my_friends.php" },
    { title: "Chat Followers", url: "/my_followers.php" },
    { title: "Chat My Followings", url: "/my_followings.php" },
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
        }
      ]
    }
  ]
}, {
  title: "Funds Management",
  icon: Download,
  items: [
    { title: "Withdraw Gift", url: "/withdraw_my_gift.php" },
    { title: "Withdraw Credit", url: "/withdraw_grants.php" },
    { title: "My Withdrawal Requests", url: "/my_withdrawal_requests.php" },
    { title: "My Withdrawal History", url: "/withdrawal_history.php" },
    { title: "Funds Transfer", url: "/transfer.php" },
    { title: "My Transfer History", url: "/transfer_history.php" },
    { title: "Transfer Charges", url: "/transfer_charges.php" },
    { title: "Exchange Rates", url: "/exchange_rates.php" },
    { title: "Account Statement", url: "/wallet_activities.php" }
  ]
}, {
  title: "Account Verification",
  icon: ShieldCheck,
  url: "/user_kyc.php"
}];
export function AppSidebar() {
  const {
    open,
    setOpenMobile
  } = useSidebar();
  const isMobile = useIsMobile();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [showQuizDrawer, setShowQuizDrawer] = useState(false);
  
  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };
  
  const toggleExpand = (title: string) => {
    setExpandedItems(prev => {
      if (prev.includes(title)) {
        // Close this item AND all its descendants
        return prev.filter(item => !item.startsWith(title) && item !== title);
      } else {
        // Just add this item to the expanded list
        return [...prev, title];
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
    
    // If has onClick handler, render as button
    if (subItem.onClick) {
      return (
        <SidebarMenuSubItem key={subItem.title}>
          <SidebarMenuSubButton
            className="transition-all duration-200 h-auto min-h-[1.75rem] py-1.5 hover:bg-accent/30 cursor-pointer w-full"
            onClick={() => { subItem.onClick!(); handleLinkClick(); }}
          >
            <span className="flex-1 whitespace-normal break-words leading-tight text-left">{subItem.title}</span>
          </SidebarMenuSubButton>
        </SidebarMenuSubItem>
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
  return <><Sidebar collapsible="icon" className="border-r border-border/50 bg-gradient-to-b from-card to-muted/30">
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
                <a href="/index.php" onClick={handleLinkClick}>
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

                // Drawer trigger item (Manage Quiz)
                if ((item as any).isDrawerTrigger) {
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        tooltip={item.title}
                        className="group hover:bg-accent/50 transition-all duration-200 h-auto min-h-[2.5rem] py-2"
                        onClick={() => { setShowQuizDrawer(true); handleLinkClick(); }}
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors shrink-0">
                          <item.icon className="h-4 w-4" />
                        </div>
                        <span className="font-medium flex-1 whitespace-normal break-words leading-tight text-left">{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }

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
                            {(item as any).items.map((subItem: any) => renderMenuItem(subItem, `${item.title}-${subItem.title}`))}
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
                const isInternalRoute = item.url && item.url.startsWith('/') && !item.url.includes('.php');
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title} className="group transition-all duration-200 hover:bg-accent/50">
                      {isInternalRoute ? (
                        <Link to={item.url!} onClick={handleLinkClick}>
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors bg-primary/10 text-primary group-hover:bg-primary/20">
                            <item.icon className="h-4 w-4" />
                          </div>
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      ) : (
                        <a href={item.url!} onClick={handleLinkClick}>
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors bg-primary/10 text-primary group-hover:bg-primary/20">
                            <item.icon className="h-4 w-4" />
                          </div>
                          <span className="font-medium">{item.title}</span>
                        </a>
                      )}
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
              <a href="/all_notifications.php" onClick={handleLinkClick}>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted-foreground/10 text-muted-foreground group-hover:bg-muted-foreground/20">
                  <RefreshCw className="h-4 w-4" />
                </div>
                <span className="font-medium">Reload</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Sign Out" className="group hover:bg-destructive/10 text-destructive transition-all duration-200">
              <a href="/logout.php" onClick={handleLinkClick}>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10 text-destructive group-hover:bg-destructive/20">
                  <LogOut className="h-4 w-4" />
                </div>
                <span className="font-medium">Sign Out</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
    <QuizAdminDrawer open={showQuizDrawer} onOpenChange={setShowQuizDrawer} />
  </>;
}