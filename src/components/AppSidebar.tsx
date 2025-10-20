import { LayoutDashboard, Settings, Wallet, Gamepad2, TrendingUp, BookOpen, Store, Users, UserPlus, MessageSquare, Megaphone, Download, FolderOpen, ShieldCheck, RefreshCw, LogOut, ChevronRight, Image, CreditCard, DollarSign, Globe, Library, Heart, Gift, Ticket, ArrowLeftRight, Building2, FileText, UserCheck, Lock, ToggleLeft, MessageCircle } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import mobigateIcon from "@/assets/mobigate-icon.svg";
import mobigateLogo from "@/assets/mobigate-logo.svg";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, useSidebar } from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

const applicationSettings = {
  title: "Application Settings",
  icon: Settings,
  items: [{
    title: "Logo Settings",
    icon: Image,
    items: [{
      title: "Upload Your Main Logo",
      url: "/settings/logo/main"
    }, {
      title: "Upload Dashboard Logo",
      url: "/settings/logo/dashboard"
    }]
  }, {
    title: "Bank & Payment",
    icon: CreditCard,
    items: [{
      title: "Set Your Company Bank Details",
      url: "/settings/bank/details"
    }, {
      title: "Set Your Paystack Gateway Live Key",
      url: "/settings/bank/paystack"
    }]
  }, {
    title: "Amount Limits",
    icon: DollarSign,
    items: [{
      title: "Set Maximum Withdrawal Amount",
      url: "/settings/limits/max-withdrawal"
    }, {
      title: "Set Maximum Transfer Amount",
      url: "/settings/limits/max-transfer"
    }, {
      title: "Set Minimum Transfer Amount",
      url: "/settings/limits/min-transfer"
    }, {
      title: "Set Minimum Account Balance",
      url: "/settings/limits/min-balance"
    }, {
      title: "Set Minimum Funding Amount",
      url: "/settings/limits/min-funding"
    }]
  }, {
    title: "Site Settings",
    icon: Globe,
    items: [{
      title: "Set Site Title",
      url: "/settings/site/title"
    }, {
      title: "Set Site Footer",
      url: "/settings/site/footer"
    }, {
      title: "Set User Support Details",
      url: "/settings/site/support"
    }]
  }, {
    title: "e-Library Settings",
    icon: Library,
    items: [{
      title: "Set Minimum e-Library Access Fee",
      url: "/settings/elibrary/min-access-fee"
    }, {
      title: "Set e-Library Content Fee",
      url: "/settings/elibrary/content-fee"
    }, {
      title: "Set e-Library Income Sharing System (Percentage)",
      url: "/settings/elibrary/income-sharing"
    }, {
      title: "Set Personalized e-Library Content Duration",
      url: "/settings/elibrary/content-duration"
    }, {
      title: "Set Minimum Active e-Library Contents for the title of \"Content Creator\"",
      url: "/settings/elibrary/min-content-creator"
    }]
  }, {
    title: "Fee Settings",
    icon: Heart,
    items: [{
      title: "Set Fee for Liking a content",
      url: "/settings/fees/like-fee"
    }, {
      title: "Set Content Like Fee Sharing Formular",
      url: "/settings/fees/like-sharing"
    }, {
      title: "Set Fee for following another user",
      url: "/settings/fees/follow-fee"
    }, {
      title: "Set Follow Fee Sharing Formular",
      url: "/settings/fees/follow-sharing"
    }]
  }, {
    title: "Gifts & Currencies",
    icon: Gift,
    items: [{
      title: "Create Digital Gifts",
      url: "/settings/gifts/create"
    }, {
      title: "Manage All Digital Gifts",
      url: "/settings/gifts/manage"
    }, {
      title: "Create and Manage Currencies",
      url: "/settings/currencies/manage"
    }, {
      title: "Funding Currency",
      url: "/settings/currencies/funding"
    }]
  }, {
    title: "Voucher Settings",
    icon: Ticket,
    items: [{
      title: "Create Voucher Denomination",
      url: "/settings/voucher/denomination"
    }, {
      title: "Set Voucher Amount for Each Currency",
      url: "/settings/voucher/amounts"
    }]
  }, {
    title: "Transfer Settings",
    icon: ArrowLeftRight,
    items: [{
      title: "Switch Credit Transfer ON or OFF",
      url: "/settings/transfer/toggle"
    }, {
      title: "Create transfer amount range for transfer charge",
      url: "/settings/transfer/charge-range"
    }]
  }, {
    title: "Merchant Settings",
    icon: Building2,
    items: [{
      title: "Set Merchant Application Fee",
      url: "/settings/merchant/application-fee"
    }, {
      title: "Set Minimum Wallet Balance for Merchant Application",
      url: "/settings/merchant/min-wallet"
    }, {
      title: "Set Minimum Days of Account Opening Before Merchant Application",
      url: "/settings/merchant/min-days"
    }, {
      title: "Set Merchant Initial Voucher Deposit Balance",
      url: "/settings/merchant/initial-deposit"
    }, {
      title: "Other Merchant Application Eligibility Terms and Conditions",
      url: "/settings/merchant/eligibility"
    }, {
      title: "Set Corporate Merchants Application Terms and Conditions",
      url: "/settings/merchant/corporate-terms"
    }, {
      title: "Set Commission (in %) for Merchants on every voucher sold to users and recharged",
      url: "/settings/merchant/commission"
    }]
  }, {
    title: "Advertisement",
    icon: Megaphone,
    items: [{
      title: "Set Advertisement Slot Rate",
      url: "/settings/ads/slot-rate"
    }]
  }, {
    title: "Quiz",
    icon: Gamepad2,
    items: [{
      title: "Set Quiz Terms and Conditions",
      url: "/settings/quiz/terms"
    }]
  }, {
    title: "Friends Invitation",
    icon: UserCheck,
    items: [{
      title: "Set Friends Invitation Text",
      url: "/settings/invitation/text"
    }, {
      title: "Upload Friends Invitation Whatsapp Logo",
      url: "/settings/invitation/whatsapp-logo"
    }]
  }, {
    title: "Privacy & Security",
    icon: Lock,
    items: [{
      title: "Default Privacy Settings",
      url: "/settings/privacy/defaults"
    }, {
      title: "Set Default Penalty Notification Text",
      url: "/settings/privacy/penalty-text"
    }]
  }, {
    title: "System Controls",
    icon: ToggleLeft,
    items: [{
      title: "Switch Withdrawal ON or OFF",
      url: "/settings/system/withdrawal-toggle"
    }, {
      title: "Switch Credit Transfer ON or OFF",
      url: "/settings/system/transfer-toggle"
    }]
  }, {
    title: "Status Content",
    icon: MessageCircle,
    items: [{
      title: "Set status content posting and viewing fees",
      url: "/settings/status/fees"
    }]
  }]
};

const menuItems = [{
  title: "Wallet Menu",
  icon: Wallet,
  items: [{
    title: "Fund Your Wallet",
    url: "/wallet/fund"
  }, {
    title: "Wallet Funding History",
    url: "/wallet/history"
  }, {
    title: "My Financial Summary",
    url: "/wallet/summary"
  }]
}, {
  title: "Quiz Game",
  icon: Gamepad2,
  items: [{
    title: "Play Quiz Game",
    url: "/quiz"
  }]
}, {
  title: "Earnings Reports",
  icon: TrendingUp,
  items: [{
    title: "Content Access Earnings",
    url: "/earnings/content-access"
  }, {
    title: "Content \"Likes\" Earnings",
    url: "/earnings/likes"
  }, {
    title: "\"Follow\" Earnings",
    url: "/earnings/follow"
  }, {
    title: "Gifts Income and Expenditure",
    url: "/earnings/gifts"
  }]
}, {
  title: "e-Library Menu",
  icon: BookOpen,
  items: [{
    title: "Visit e-Library",
    url: "/library"
  }, {
    title: "Submit/Manage My e-Library Content",
    url: "/library/manage"
  }]
}, {
  title: "Merchants Menu",
  icon: Store,
  items: [{
    title: "Do Account Verification before applying",
    url: "/merchants/verification"
  }]
}, {
  title: "Friendship Menu",
  icon: Users,
  items: [{
    title: "Find Friends",
    url: "/friends/find"
  }, {
    title: "Invite Friends",
    url: "/friends/invite"
  }, {
    title: "View My 1 Friends",
    url: "/friends"
  }]
}, {
  title: "Followers/Following",
  icon: UserPlus,
  items: [{
    title: "My Followers",
    url: "/followers"
  }]
}, {
  title: "Messages/Chats",
  icon: MessageSquare,
  items: [{
    title: "Chat Friends",
    url: "/messages/friends"
  }, {
    title: "Chat Followers(1 )",
    url: "/messages/followers"
  }, {
    title: "View All Chats",
    url: "/messages"
  }]
}, {
  title: "Advertisements",
  icon: Megaphone,
  items: [{
    title: "Submit Advert",
    url: "/ads/submit"
  }]
}, {
  title: "Funds Management",
  icon: Download,
  items: [{
    title: "Do Account Verification",
    url: "/funds/verification"
  }]
}, {
  title: "Account Statement",
  icon: FolderOpen,
  url: "/statement"
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
        {/* Dashboard Section */}
        <SidebarGroup className="mb-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <NavLink to="/" end>
                {({
                isActive
              }) => <SidebarMenuButton tooltip="Dashboard" className={cn("group relative overflow-hidden transition-all duration-200", isActive ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-md hover:shadow-lg" : "hover:bg-accent/50")}>
                    <LayoutDashboard className="h-5 w-5" />
                    <span className="font-medium">Dashboard</span>
                    {isActive && open && <div className="absolute right-0 top-0 h-full w-1 bg-primary-foreground rounded-l-full" />}
                  </SidebarMenuButton>}
              </NavLink>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Application Settings Section */}
        <SidebarGroup className="mb-2">
          <SidebarMenu>
            <Collapsible open={expandedItems.includes(applicationSettings.title)} onOpenChange={() => toggleExpand(applicationSettings.title)}>
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={applicationSettings.title} className="group hover:bg-accent/50 transition-all duration-200 h-auto min-h-[2.5rem] py-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors shrink-0">
                      <applicationSettings.icon className="h-4 w-4" />
                    </div>
                    <span className="font-medium flex-1 whitespace-normal break-words leading-tight text-left">{applicationSettings.title}</span>
                    <ChevronRight className={cn("ml-auto h-4 w-4 transition-transform duration-200 shrink-0", expandedItems.includes(applicationSettings.title) && "rotate-90")} />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-1">
                  <SidebarMenuSub className="ml-6 border-l-2 border-primary/20 pl-2">
                    {applicationSettings.items.map(subItem => {
                      const subIsExpanded = expandedItems.includes(`${applicationSettings.title}-${subItem.title}`);
                      
                      return <Collapsible key={subItem.title} open={subIsExpanded} onOpenChange={() => toggleExpand(`${applicationSettings.title}-${subItem.title}`)}>
                        <SidebarMenuSubItem>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuSubButton className="group hover:bg-accent/50 transition-all duration-200 h-auto min-h-[2rem] py-1.5">
                              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors shrink-0">
                                <subItem.icon className="h-3 w-3" />
                              </div>
                              <span className="flex-1 whitespace-normal break-words leading-tight text-left text-sm">{subItem.title}</span>
                              <ChevronRight className={cn("ml-auto h-3 w-3 transition-transform duration-200 shrink-0", subIsExpanded && "rotate-90")} />
                            </SidebarMenuSubButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="mt-1">
                            <SidebarMenuSub className="ml-4 border-l-2 border-primary/10 pl-2">
                              {subItem.items.map(nestedItem => (
                                <SidebarMenuSubItem key={nestedItem.title}>
                                  <NavLink to={nestedItem.url}>
                                    {({ isActive }) => (
                                      <SidebarMenuSubButton className={cn("transition-all duration-200 text-xs", isActive ? "bg-primary/10 text-primary font-medium border-l-2 border-primary" : "hover:bg-accent/30")}>
                                        <span className="whitespace-normal break-words leading-tight">{nestedItem.title}</span>
                                      </SidebarMenuSubButton>
                                    )}
                                  </NavLink>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </SidebarMenuSubItem>
                      </Collapsible>;
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
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
                return <Collapsible key={item.title} open={isExpanded} onOpenChange={() => toggleExpand(item.title)}>
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
                            {item.items.map(subItem => {
                              const subIsExpanded = expandedItems.includes(`${item.title}-${subItem.title}`);
                              
                              // Nested expandable items (with icon and items properties)
                              if ('items' in subItem && subItem.items && 'icon' in subItem && subItem.icon) {
                                const SubIcon = subItem.icon as any;
                                const nestedItems = subItem.items as { title: string; url: string }[];
                                
                                return <Collapsible key={subItem.title} open={subIsExpanded} onOpenChange={() => toggleExpand(`${item.title}-${subItem.title}`)}>
                                  <SidebarMenuSubItem>
                                    <CollapsibleTrigger asChild>
                                      <SidebarMenuSubButton className="group hover:bg-accent/50 transition-all duration-200 h-auto min-h-[2rem] py-1.5">
                                        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors shrink-0">
                                          <SubIcon className="h-3 w-3" />
                                        </div>
                                        <span className="flex-1 whitespace-normal break-words leading-tight text-left text-sm">{subItem.title}</span>
                                        <ChevronRight className={cn("ml-auto h-3 w-3 transition-transform duration-200 shrink-0", subIsExpanded && "rotate-90")} />
                                      </SidebarMenuSubButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="mt-1">
                                      <SidebarMenuSub className="ml-4 border-l-2 border-primary/10 pl-2">
                                        {nestedItems.map(nestedItem => (
                                          <SidebarMenuSubItem key={nestedItem.title}>
                                            <NavLink to={nestedItem.url}>
                                              {({ isActive }) => (
                                                <SidebarMenuSubButton className={cn("transition-all duration-200 text-xs", isActive ? "bg-primary/10 text-primary font-medium border-l-2 border-primary" : "hover:bg-accent/30")}>
                                                  <span className="whitespace-normal break-words leading-tight">{nestedItem.title}</span>
                                                </SidebarMenuSubButton>
                                              )}
                                            </NavLink>
                                          </SidebarMenuSubItem>
                                        ))}
                                      </SidebarMenuSub>
                                    </CollapsibleContent>
                                  </SidebarMenuSubItem>
                                </Collapsible>;
                              }
                              
                              // Regular sub-items (simple title and url)
                              const regularItem = subItem as { title: string; url: string };
                              return <SidebarMenuSubItem key={regularItem.title}>
                                <NavLink to={regularItem.url}>
                                  {({ isActive }) => (
                                    <SidebarMenuSubButton className={cn("transition-all duration-200", isActive ? "bg-primary/10 text-primary font-medium border-l-2 border-primary" : "hover:bg-accent/30")}>
                                      <span>{regularItem.title}</span>
                                    </SidebarMenuSubButton>
                                  )}
                                </NavLink>
                              </SidebarMenuSubItem>;
                            })}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>;
              }

              // Items without sub-menu
              return <SidebarMenuItem key={item.title}>
                    <NavLink to={item.url!}>
                      {({
                    isActive
                  }) => <SidebarMenuButton tooltip={item.title} className={cn("group transition-all duration-200", isActive ? "bg-primary/10 text-primary font-medium" : "hover:bg-accent/50")}>
                          <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg transition-colors", isActive ? "bg-primary text-primary-foreground shadow-md" : "bg-primary/10 text-primary group-hover:bg-primary/20")}>
                            <item.icon className="h-4 w-4" />
                          </div>
                          <span className="font-medium">{item.title}</span>
                        </SidebarMenuButton>}
                    </NavLink>
                  </SidebarMenuItem>;
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