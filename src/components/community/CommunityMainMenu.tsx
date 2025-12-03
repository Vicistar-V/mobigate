import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MoreVertical, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { GuestLoginDialog } from "./GuestLoginDialog";
import { MemberLoginDialog } from "./MemberLoginDialog";
import { AdminLoginDialog } from "./AdminLoginDialog";
import { ChatMembersDialog } from "./ChatMembersDialog";
import { GiftMembersDialog } from "./GiftMembersDialog";
import { BlockMembersDialog } from "./BlockMembersDialog";
import { AddFriendsDialog } from "./AddFriendsDialog";
import { InviteMembersDialog } from "./InviteMembersDialog";
import { ExitCommunityDialog } from "./ExitCommunityDialog";
import { FinancialOverviewDialog } from "./finance/FinancialOverviewDialog";
import { FinancialObligationsDialog } from "./finance/FinancialObligationsDialog";
import { FinancialStatusDialog } from "./finance/FinancialStatusDialog";
import { FinancialAuditDialog } from "./finance/FinancialAuditDialog";
import { ConstitutionViewer } from "./ConstitutionViewer";
import { CommunityResourcesDialog } from "./CommunityResourcesDialog";
import { ManageCommunityResourcesDialog } from "./ManageCommunityResourcesDialog";
import { ManageMembershipRequestsDialog } from "./ManageMembershipRequestsDialog";
import { ManageCommunityGalleryDialog } from "./ManageCommunityGalleryDialog";
import { QuizCreationDialog } from "./QuizCreationDialog";
import { VoucherBundlesDialog } from "./VoucherBundlesDialog";
import { MembershipApplicationDrawer } from "./MembershipApplicationDrawer";
import { ManageLeadershipDialog } from "./leadership/ManageLeadershipDialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";

interface CommunityMainMenuProps {
  isOwner?: boolean;
  isAdmin?: boolean;
  isMember?: boolean;
  onNavigate?: (section: string) => void;
}

export function CommunityMainMenu({
  isOwner = false,
  isAdmin = false,
  isMember = false,
  onNavigate,
}: CommunityMainMenuProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { communityId } = useParams<{ communityId: string }>();
  const [open, setOpen] = useState(false);
  const [showGuestLogin, setShowGuestLogin] = useState(false);
  const [showMemberLogin, setShowMemberLogin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showChatMembers, setShowChatMembers] = useState(false);
  const [showGiftMembers, setShowGiftMembers] = useState(false);
  const [showBlockMembers, setShowBlockMembers] = useState(false);
  const [showAddFriends, setShowAddFriends] = useState(false);
  const [showInviteMembers, setShowInviteMembers] = useState(false);
  const [showExitCommunity, setShowExitCommunity] = useState(false);
  const [showFinancialOverview, setShowFinancialOverview] = useState(false);
  const [showFinancialObligations, setShowFinancialObligations] = useState(false);
  const [showFinancialStatus, setShowFinancialStatus] = useState(false);
  const [showFinancialAudit, setShowFinancialAudit] = useState(false);
  const [showConstitution, setShowConstitution] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const [showQuizCreation, setShowQuizCreation] = useState(false);
  const [showVoucherBundles, setShowVoucherBundles] = useState(false);
  const [showJoinCommunity, setShowJoinCommunity] = useState(false);
  const [showManageLeadership, setShowManageLeadership] = useState(false);
  const [showManageResources, setShowManageResources] = useState(false);
  const [showManageMembershipRequests, setShowManageMembershipRequests] = useState(false);
  const [showManageGallery, setShowManageGallery] = useState(false);

  const handleLoginSuccess = (role: "guest" | "member" | "admin") => {
    if (!onNavigate) return;
    
    setOpen(false);
    
    if (role === "guest" || role === "member") {
      onNavigate("status");
    } else if (role === "admin") {
      onNavigate("administration");
    }
  };

  const handleMenuClick = (action: string, isNavigable?: boolean) => {
    if (action === "Join Community") {
      setShowJoinCommunity(true);
      setOpen(false);
      return;
    }
    
    if (action === "E-Mail Login") {
      setShowGuestLogin(true);
      setOpen(false);
      return;
    }
    if (action === "Login/Logout") {
      setShowMemberLogin(true);
      setOpen(false);
      return;
    }
    if (action === "Admin Login") {
      setShowAdminLogin(true);
      setOpen(false);
      return;
    }

    if (action === "Chat Members") {
      setShowChatMembers(true);
      setOpen(false);
      return;
    }
    if (action === "Gift Members") {
      setShowGiftMembers(true);
      setOpen(false);
      return;
    }
    if (action === "Block Members") {
      setShowBlockMembers(true);
      setOpen(false);
      return;
    }
    if (action === "Add Friends") {
      setShowAddFriends(true);
      setOpen(false);
      return;
    }
    if (action === "Invite Mobigate Users" || action === "Invite Non-Mobigate Users") {
      setShowInviteMembers(true);
      setOpen(false);
      return;
    }
    if (action === "Exit Request") {
      setShowExitCommunity(true);
      setOpen(false);
      return;
    }

    if (action === "Financial Overview/Wallet") {
      setShowFinancialOverview(true);
      setOpen(false);
      return;
    }
    if (action === "Financial Obligations") {
      setShowFinancialObligations(true);
      setOpen(false);
      return;
    }
    if (action === "Financial Status Checker") {
      setShowFinancialStatus(true);
      setOpen(false);
      return;
    }
    if (action === "Automated Financial Audit") {
      setShowFinancialAudit(true);
      setOpen(false);
      return;
    }

    if (action === "View Constitution") {
      setShowConstitution(true);
      setOpen(false);
      return;
    }

    if (action === "Create Mobi Quiz-Games") {
      setShowQuizCreation(true);
      setOpen(false);
      return;
    }
    if (action === "Subscribe for Voucher Bundles") {
      setShowVoucherBundles(true);
      setOpen(false);
      return;
    }

    if (action === "Articles") {
      if (onNavigate) onNavigate("articles");
      setOpen(false);
      return;
    }
    if (action === "Inside Community") {
      if (onNavigate) onNavigate("inside-community");
      setOpen(false);
      return;
    }
    if (action === "rollcalls") {
      if (onNavigate) onNavigate("rollcalls");
      setOpen(false);
      return;
    }

    if (action === "Admin Logout") {
      toast({
        title: "Logged Out",
        description: "You have been logged out from admin mode",
      });
      setOpen(false);
      return;
    }

    if (isNavigable && onNavigate) {
      onNavigate(action);
      setOpen(false);
    } else {
      toast({
        title: "Feature Not Available",
        description: `"${action}" feature is currently under development`,
      });
      setOpen(false);
    }
  };

  const MenuContent = () => (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-6 py-4 border-b flex-shrink-0">
        <h2 className="text-lg font-semibold">Community Menu</h2>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="pb-6">
          {/* Direct Menu Items */}
          <div className="px-4 py-2 space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => handleMenuClick("Articles")}
            >
              Articles
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => handleMenuClick("news", true)}
            >
              News Info
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => handleMenuClick("events", true)}
            >
              Events
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => handleMenuClick("vibes", true)}
            >
              Community Vibes
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => handleMenuClick("gallery", true)}
            >
              Community Gallery
            </Button>
          </div>

          <Separator className="my-2" />

          <Accordion type="multiple" className="w-full px-4">
            {/* Guests Section */}
            <AccordionItem value="guests">
              <AccordionTrigger className="text-base">Guests</AccordionTrigger>
              <AccordionContent className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4"
                  onClick={() => handleMenuClick("E-Mail Login")}
                >
                  E-Mail Login [OTP]
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4"
                  onClick={() => handleMenuClick("Join Community")}
                >
                  Join Community
                </Button>
              </AccordionContent>
            </AccordionItem>

            {/* Members Section */}
            <AccordionItem value="members">
              <AccordionTrigger className="text-base">Members</AccordionTrigger>
              <AccordionContent>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4"
                  onClick={() => handleMenuClick("Login/Logout")}
                >
                  Login/Logout
                </Button>
                
                <Accordion type="multiple" className="pl-2 mt-1">
                  <AccordionItem value="exit-community" className="border-none">
                    <AccordionTrigger className="text-sm py-2">Exit Community</AccordionTrigger>
                    <AccordionContent className="space-y-1">
                      <Button
                        variant="ghost"
                        className="w-full justify-start pl-4 text-sm h-8"
                        onClick={() => handleMenuClick("Exit Request")}
                      >
                        Exit Request
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </AccordionContent>
            </AccordionItem>

            {/* MEMBERSHIP Section */}
            <AccordionItem value="membership">
              <AccordionTrigger className="text-base font-semibold">MEMBERSHIP</AccordionTrigger>
              <AccordionContent>
                <Accordion type="multiple" className="pl-2">
                  <AccordionItem value="view-members" className="border-none">
                    <AccordionTrigger className="text-sm py-2">View Members</AccordionTrigger>
                    <AccordionContent className="space-y-1">
                      <Button
                        variant="ghost"
                        className="w-full justify-start pl-4 text-sm h-8"
                        onClick={() => handleMenuClick("Members")}
                      >
                        Members
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start pl-4 text-sm h-8"
                        onClick={() => handleMenuClick("Chat Members")}
                      >
                        Chat Members
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start pl-4 text-sm h-8"
                        onClick={() => handleMenuClick("Gift Members")}
                      >
                        Gift Members
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start pl-4 text-sm h-8"
                        onClick={() => handleMenuClick("Block Members")}
                      >
                        Block Members
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-2 mt-1"
                  onClick={() => handleMenuClick("Add Friends")}
                >
                  Add Friends
                </Button>
                
                <Accordion type="multiple" className="pl-2 mt-1">
                  <AccordionItem value="invite-members" className="border-none">
                    <AccordionTrigger className="text-sm py-2">Invite Members</AccordionTrigger>
                    <AccordionContent className="space-y-1">
                      <Button
                        variant="ghost"
                        className="w-full justify-start pl-4 text-sm h-8"
                        onClick={() => handleMenuClick("Invite Mobigate Users")}
                      >
                        Invite Mobigate Users
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start pl-4 text-sm h-8"
                        onClick={() => handleMenuClick("Invite Non-Mobigate Users")}
                      >
                        Invite Non-Mobigate Users
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                
                {(isAdmin || isOwner) && (
                  <Button
                    variant="ghost"
                    className="w-full justify-start pl-2 mt-1 text-primary"
                    onClick={() => {
                      setShowManageMembershipRequests(true);
                      setOpen(false);
                    }}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Manage Membership Requests (Admin)
                  </Button>
                )}

                {(isAdmin || isOwner) && (
                  <Button
                    variant="ghost"
                    className="w-full justify-start pl-2 mt-1 text-primary"
                    onClick={() => {
                      setShowManageGallery(true);
                      setOpen(false);
                    }}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Manage Community Gallery (Admin)
                  </Button>
                )}
              </AccordionContent>
            </AccordionItem>

            {/* Admins Section */}
            {(isAdmin || isOwner) && (
              <AccordionItem value="admins">
                <AccordionTrigger className="text-base">Admins</AccordionTrigger>
                <AccordionContent className="space-y-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-start pl-4"
                    onClick={() => handleMenuClick("Admin Login")}
                  >
                    Login
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start pl-4"
                    onClick={() => handleMenuClick("Admin Logout")}
                  >
                    Logout
                  </Button>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Administration/Leadership */}
            <AccordionItem value="administration">
              <AccordionTrigger className="text-base">
                Administration/Leadership
              </AccordionTrigger>
              <AccordionContent className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4"
                  onClick={() => handleMenuClick("executive", true)}
                >
                  Management/Executive Committee
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4"
                  onClick={() => handleMenuClick("tenure", true)}
                >
                  Office Tenure
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4"
                  onClick={() => handleMenuClick("adhoc", true)}
                >
                  Ad-hoc Committees
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4"
                  onClick={() => handleMenuClick("staff", true)}
                >
                  Staff & Employees
                </Button>
                {(isAdmin || isOwner) && (
                  <Button
                    variant="ghost"
                    className="w-full justify-start pl-4 text-primary"
                    onClick={() => {
                      setShowManageLeadership(true);
                      setOpen(false);
                    }}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Manage Leadership (Admin)
                  </Button>
                )}
              </AccordionContent>
            </AccordionItem>

            {/* FundRaiser */}
            <AccordionItem value="fundraiser">
              <AccordionTrigger className="text-base">FundRaiser</AccordionTrigger>
              <AccordionContent className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4"
                  onClick={() => handleMenuClick("fundraiser-raise", true)}
                >
                  Raise Campaign
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4"
                  onClick={() => handleMenuClick("fundraiser-campaigns", true)}
                >
                  View Campaigns
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4"
                  onClick={() => handleMenuClick("fundraiser-donors", true)}
                >
                  View Donors
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4"
                  onClick={() => handleMenuClick("fundraiser-celebrity", true)}
                >
                  View Celebrity Donors
                </Button>
              </AccordionContent>
            </AccordionItem>

            {/* Election/Voting */}
            <AccordionItem value="election">
              <AccordionTrigger className="text-base">
                Election/Voting
              </AccordionTrigger>
              <AccordionContent className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4"
                  onClick={() => handleMenuClick("election-campaigns", true)}
                >
                  Campaigns
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4"
                  onClick={() => handleMenuClick("election-voting", true)}
                >
                  Start Voting
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4"
                  onClick={() => handleMenuClick("election-results", true)}
                >
                  View Results
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4"
                  onClick={() => handleMenuClick("election-winners", true)}
                >
                  View Winners
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4"
                  onClick={() => handleMenuClick("election-opinions", true)}
                >
                  Public Opinions
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4"
                  onClick={() => handleMenuClick("election-accreditation", true)}
                >
                  Accreditation
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4"
                  onClick={() => handleMenuClick("election-clearances", true)}
                >
                  Clearances
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4"
                  onClick={() => handleMenuClick("election-primaries", true)}
                >
                  Nomination Primaries
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4"
                  onClick={() => handleMenuClick("election-accredited-voters", true)}
                >
                  Accredited Voters
                </Button>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Separator className="my-2" />

          {/* Community Meetings */}
          <Accordion type="multiple" className="w-full px-4">
            <AccordionItem value="meetings-main">
            <AccordionTrigger className="text-base font-semibold">
              Community Meetings
            </AccordionTrigger>
            <AccordionContent>
              <Accordion type="multiple" className="pl-2">
                <AccordionItem value="recent-meetings" className="border-none">
                  <AccordionTrigger className="text-sm py-2">
                    + Recent Meetings
                  </AccordionTrigger>
                  <AccordionContent className="space-y-1">
                    <Button
                      variant="ghost"
                      className="w-full justify-start pl-4 text-sm h-8"
                      onClick={() => handleMenuClick("meeting-proceedings", true)}
                    >
                      Download Meeting Proceedings
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start pl-4 text-sm h-8"
                      onClick={() => handleMenuClick("meeting-headline", true)}
                    >
                      Meeting Headline/Theme
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start pl-4 text-sm h-8"
                      onClick={() => handleMenuClick("meeting-resolutions", true)}
                    >
                      Meeting Resolutions
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start pl-4 text-sm h-8"
                      onClick={() => handleMenuClick("meeting-conflicts", true)}
                    >
                      Conflicts of Interests
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start pl-4 text-sm h-8"
                      onClick={() => handleMenuClick("meeting-chats", true)}
                    >
                      Meeting Chats
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start pl-4 text-sm h-8"
                      onClick={() => handleMenuClick("meeting-vote-notes", true)}
                    >
                      Meeting Vote Notes
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start pl-4 text-sm h-8"
                      onClick={() => handleMenuClick("meeting-lighter-moods", true)}
                    >
                      Lighter Moods
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start pl-4 text-sm h-8"
                      onClick={() => handleMenuClick("meeting-attendance", true)}
                    >
                      Attendance Roll-Calls
                    </Button>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="previous-meetings" className="border-none">
                  <AccordionTrigger className="text-sm py-2">
                    + Previous Meetings
                  </AccordionTrigger>
                  <AccordionContent className="space-y-1">
                    <Button
                      variant="ghost"
                      className="w-full justify-start pl-4 text-sm h-8"
                      onClick={() => handleMenuClick("meeting-proceedings", true)}
                    >
                      Download Meeting Proceedings
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start pl-4 text-sm h-8"
                      onClick={() => handleMenuClick("meeting-headline", true)}
                    >
                      Meeting Headline/Theme
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start pl-4 text-sm h-8"
                      onClick={() => handleMenuClick("meeting-resolutions", true)}
                    >
                      Meeting Resolutions
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start pl-4 text-sm h-8"
                      onClick={() => handleMenuClick("meeting-conflicts", true)}
                    >
                      Conflicts of Interests
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start pl-4 text-sm h-8"
                      onClick={() => handleMenuClick("meeting-chats", true)}
                    >
                      Meeting Chats
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start pl-4 text-sm h-8"
                      onClick={() => handleMenuClick("meeting-vote-notes", true)}
                    >
                      Meeting Vote Notes
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start pl-4 text-sm h-8"
                      onClick={() => handleMenuClick("meeting-lighter-moods", true)}
                    >
                      Lighter Moods
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start pl-4 text-sm h-8"
                      onClick={() => handleMenuClick("meeting-attendance", true)}
                    >
                      Attendance Roll-Calls
                    </Button>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Button
                variant="ghost"
                className="w-full justify-start pl-2 mt-2"
                onClick={() => handleMenuClick("meetings", true)}
              >
                Join Live Meeting
              </Button>
            </AccordionContent>
          </AccordionItem>
          </Accordion>

          {/* Roll-Calls */}
          <div className="px-4 mt-2">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => handleMenuClick("rollcalls", true)}
            >
              Roll-Calls
            </Button>
          </div>

          <Separator className="my-2" />

          <Accordion type="multiple" className="w-full px-4">
            {/* Finance */}
            <AccordionItem value="finance">
              <AccordionTrigger className="text-base">Finance</AccordionTrigger>
              <AccordionContent className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4"
                  onClick={() => handleMenuClick("community-accounts", true)}
                >
                  CAM [Community Account Manager]
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4"
                  onClick={() => handleMenuClick("Financial Overview/Wallet")}
                >
                  Financial Overview/Wallet
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4"
                  onClick={() => handleMenuClick("Financial Obligations")}
                >
                  Financial Obligations
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4"
                  onClick={() => handleMenuClick("Financial Status Checker")}
                >
                  Financial Status Checker
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4"
                  onClick={() => handleMenuClick("Automated Financial Audit")}
                >
                  Automated Financial Audit
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4"
                  onClick={() => handleMenuClick("finance-summary", true)}
                >
                  Financial Summary
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4"
                  onClick={() => handleMenuClick("finance-clearances", true)}
                >
                  Financial Clearances
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4"
                  onClick={() => handleMenuClick("finance-accreditation", true)}
                >
                  Financial Accreditation
                </Button>
              </AccordionContent>
            </AccordionItem>

            {/* Constitution & By-laws */}
            <AccordionItem value="constitution">
              <AccordionTrigger className="text-base">
                Constitution & By-laws
              </AccordionTrigger>
              <AccordionContent className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4"
                  onClick={() => handleMenuClick("View Constitution")}
                >
                  View Constitution
                </Button>
              </AccordionContent>
            </AccordionItem>

            {/* Community Resources */}
            <AccordionItem value="resources">
              <AccordionTrigger className="text-base">
                Community Resources
              </AccordionTrigger>
              <AccordionContent className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4"
                  onClick={() => {
                    setShowResources(true);
                    setOpen(false);
                  }}
                >
                  View Resources Section
                </Button>
                {(isAdmin || isOwner) && (
                  <Button
                    variant="ghost"
                    className="w-full justify-start pl-4 text-primary"
                    onClick={() => {
                      setShowManageResources(true);
                      setOpen(false);
                    }}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Manage Resources (Admin)
                  </Button>
                )}
              </AccordionContent>
            </AccordionItem>

            {/* Mobi-Merchant */}
            <AccordionItem value="mobi-merchant">
              <AccordionTrigger className="text-base">Mobi-Merchant</AccordionTrigger>
              <AccordionContent className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4"
                  onClick={() => handleMenuClick("Create Mobi Quiz-Games")}
                >
                  Create Mobi Quiz-Games
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4"
                  onClick={() => handleMenuClick("Subscribe for Voucher Bundles")}
                >
                  Subscribe for Voucher Bundles
                </Button>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Separator className="my-2" />

          {/* Inside Community */}
          <div className="px-4 pb-6">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => handleMenuClick("Inside Community")}
            >
              Inside Community
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );

  return (
    <>
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setOpen(true)}>
        <MoreVertical className="h-4 w-4" />
      </Button>

      {isMobile ? (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent className="h-[85vh] overflow-hidden">
            <MenuContent />
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-md max-h-[85vh] overflow-hidden p-0">
            <MenuContent />
          </DialogContent>
        </Dialog>
      )}

      {/* Login Dialogs */}
      <GuestLoginDialog
        open={showGuestLogin}
        onOpenChange={setShowGuestLogin}
        onLoginSuccess={handleLoginSuccess}
      />
      <MemberLoginDialog
        open={showMemberLogin}
        onOpenChange={setShowMemberLogin}
        onLoginSuccess={handleLoginSuccess}
      />
      <AdminLoginDialog
        open={showAdminLogin}
        onOpenChange={setShowAdminLogin}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Membership & Social Dialogs */}
      <ChatMembersDialog open={showChatMembers} onOpenChange={setShowChatMembers} />
      <GiftMembersDialog open={showGiftMembers} onOpenChange={setShowGiftMembers} />
      <BlockMembersDialog open={showBlockMembers} onOpenChange={setShowBlockMembers} />
      <AddFriendsDialog open={showAddFriends} onOpenChange={setShowAddFriends} />
      <InviteMembersDialog open={showInviteMembers} onOpenChange={setShowInviteMembers} />
      <ExitCommunityDialog open={showExitCommunity} onOpenChange={setShowExitCommunity} />

      {/* Finance Dialogs */}
      <FinancialOverviewDialog open={showFinancialOverview} onOpenChange={setShowFinancialOverview} />
      <FinancialObligationsDialog open={showFinancialObligations} onOpenChange={setShowFinancialObligations} />
      <FinancialStatusDialog open={showFinancialStatus} onOpenChange={setShowFinancialStatus} />
      <FinancialAuditDialog open={showFinancialAudit} onOpenChange={setShowFinancialAudit} />

      {/* Constitution & Resources Dialogs */}
      <ConstitutionViewer open={showConstitution} onOpenChange={setShowConstitution} />
      <CommunityResourcesDialog open={showResources} onOpenChange={setShowResources} />

      {/* Mobi-Merchant Dialogs */}
      <QuizCreationDialog open={showQuizCreation} onOpenChange={setShowQuizCreation} />
      <VoucherBundlesDialog open={showVoucherBundles} onOpenChange={setShowVoucherBundles} />

      {/* Membership Application Drawer */}
      <MembershipApplicationDrawer 
        open={showJoinCommunity} 
        onOpenChange={setShowJoinCommunity}
      />

      {/* Leadership Management Dialog (Admin Only) */}
      <ManageLeadershipDialog 
        open={showManageLeadership} 
        onOpenChange={setShowManageLeadership}
      />

      {/* Resource Management Dialog (Admin Only) */}
      <ManageCommunityResourcesDialog 
        open={showManageResources} 
        onOpenChange={setShowManageResources}
        isOwner={isOwner}
      />

      {/* Membership Requests Management Dialog (Admin Only) */}
      <ManageMembershipRequestsDialog 
        open={showManageMembershipRequests} 
        onOpenChange={setShowManageMembershipRequests}
        isOwner={isOwner}
      />

      {/* Gallery Management Dialog (Admin Only) */}
      <ManageCommunityGalleryDialog 
        open={showManageGallery} 
        onOpenChange={setShowManageGallery}
        isOwner={isOwner}
      />
    </>
  );
}
