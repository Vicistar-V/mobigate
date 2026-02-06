import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MoreVertical, Settings, Play, LayoutDashboard, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { GuestLoginDialog } from "./GuestLoginDialog";
import { MemberLoginDialog } from "./MemberLoginDialog";
import { AdminLoginDialog } from "./AdminLoginDialog";
import { ChatMembersDialog } from "./ChatMembersDialog";
import { CommunityGiftDrawer } from "./CommunityGiftDrawer";
import { BlockManagementDrawer } from "./BlockManagementDrawer";
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
import { CommunityQuizDialog } from "./CommunityQuizDialog";
import { MobigateQuizDialog } from "./MobigateQuizDialog";
import { MemberPrivacyVotingSheet } from "./settings/MemberPrivacyVotingSheet";
import { CommunitySettingsSheet } from "./settings/CommunitySettingsSheet";
import { DeclarationOfInterestSheet } from "./elections/DeclarationOfInterestSheet";
import { CandidateDashboardSheet } from "./elections/CandidateDashboardSheet";
import { MemberImpeachmentDrawer } from "./elections/MemberImpeachmentDrawer";
import { NominateCandidateSheet } from "./elections/NominateCandidateSheet";
import { VerifyCertificateDrawer } from "./elections/VerifyCertificateDrawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Vote, Settings2, Flag, Gavel, ShieldCheck } from "lucide-react";
import { getPendingProposalsCount } from "@/data/communityDemocraticSettingsData";

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
  const [showCommunityQuiz, setShowCommunityQuiz] = useState(false);
  const [showMobigateQuiz, setShowMobigateQuiz] = useState(false);
  const [showPrivacyVoting, setShowPrivacyVoting] = useState(false);
  const [showCommunitySettings, setShowCommunitySettings] = useState(false);
  const [showDeclarationOfInterest, setShowDeclarationOfInterest] = useState(false);
  const [showCandidateDashboard, setShowCandidateDashboard] = useState(false);
  const [showImpeachment, setShowImpeachment] = useState(false);
  const [impeachmentMode, setImpeachmentMode] = useState<"start" | "view">("view");
  const [showNominateCandidate, setShowNominateCandidate] = useState(false);
  const [showVerifyCertificate, setShowVerifyCertificate] = useState(false);

  const pendingSettingsCount = getPendingProposalsCount();

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

    if (action === "Members") {
      if (onNavigate) {
        onNavigate("membership");
      }
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
        <div className="pb-6 pt-2">
          <Accordion type="single" collapsible className="w-full px-4 space-y-1">
            {/* Community Content - New unified section for top items */}
            <AccordionItem value="community-content" className="border rounded-lg px-3 data-[state=open]:bg-muted/30">
              <AccordionTrigger className="text-base font-semibold">
                Community Content
              </AccordionTrigger>
              <AccordionContent className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4 h-9 transition-colors duration-200"
                  onClick={() => handleMenuClick("Articles")}
                >
                  Articles
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4 h-9 transition-colors duration-200"
                  onClick={() => handleMenuClick("news", true)}
                >
                  News Info
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4 h-9 transition-colors duration-200"
                  onClick={() => handleMenuClick("events", true)}
                >
                  Events
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4 h-9 transition-colors duration-200"
                  onClick={() => handleMenuClick("vibes", true)}
                >
                  Community Vibes
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4 h-9 transition-colors duration-200"
                  onClick={() => handleMenuClick("gallery", true)}
                >
                  Community Gallery
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4 h-9 transition-colors duration-200"
                  onClick={() => handleMenuClick("Inside Community")}
                >
                  Inside Community
                </Button>
                {(isAdmin || isOwner) && (
                  <Button
                    variant="ghost"
                    className="w-full justify-start pl-4 text-primary h-9 transition-colors duration-200"
                    onClick={() => {
                      navigate(`/community/${communityId}/admin/content`);
                      setOpen(false);
                    }}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Manage Content (Admin)
                  </Button>
                )}
              </AccordionContent>
            </AccordionItem>

            {/* Guests Section */}
            <AccordionItem value="guests" className="border rounded-lg px-3 data-[state=open]:bg-muted/30">
              <AccordionTrigger className="text-base">Guests</AccordionTrigger>
              <AccordionContent className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4 h-9 transition-colors duration-200"
                  onClick={() => handleMenuClick("E-Mail Login")}
                >
                  E-Mail Login [OTP]
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4 h-9 transition-colors duration-200"
                  onClick={() => handleMenuClick("Join Community")}
                >
                  Join Community
                </Button>
              </AccordionContent>
            </AccordionItem>

            {/* Members Section */}
            <AccordionItem value="members" className="border rounded-lg px-3 data-[state=open]:bg-muted/30">
              <AccordionTrigger className="text-base">Members</AccordionTrigger>
              <AccordionContent>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4 h-9 transition-colors duration-200"
                  onClick={() => handleMenuClick("Login/Logout")}
                >
                  Login/Logout
                </Button>
                
                <Accordion type="single" collapsible className="pl-2 mt-1">
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
            <AccordionItem value="membership" className="border rounded-lg px-3 data-[state=open]:bg-muted/30">
              <AccordionTrigger className="text-base font-semibold">MEMBERSHIP</AccordionTrigger>
              <AccordionContent>
                <Accordion type="single" collapsible className="pl-2">
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
                  className="w-full justify-start pl-2 mt-1 h-9 transition-colors duration-200"
                  onClick={() => handleMenuClick("Add Friends")}
                >
                  Add Friends
                </Button>
                
                <Accordion type="single" collapsible className="pl-2 mt-1">
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
                    className="w-full justify-start pl-2 mt-1 text-primary h-9 transition-colors duration-200"
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
                    className="w-full justify-start pl-2 mt-1 text-primary h-9 transition-colors duration-200"
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
              <AccordionItem value="admins" className="border rounded-lg px-3 data-[state=open]:bg-muted/30">
                <AccordionTrigger className="text-base">Admins</AccordionTrigger>
                <AccordionContent className="space-y-2">
                  <Button
                    className="w-full justify-start gap-2 bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => {
                      navigate(`/community/${communityId}/admin`);
                      setOpen(false);
                    }}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Admin Dashboard
                    <Badge variant="secondary" className="ml-auto text-[10px] bg-white/20">5</Badge>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start pl-4 h-9 transition-colors duration-200"
                    onClick={() => handleMenuClick("Admin Login")}
                  >
                    Login
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start pl-4 h-9 transition-colors duration-200"
                    onClick={() => handleMenuClick("Admin Logout")}
                  >
                    Logout
                  </Button>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Administration/Leadership */}
            <AccordionItem value="administration" className="border rounded-lg px-3 data-[state=open]:bg-muted/30">
              <AccordionTrigger className="text-base">
                Administration/Leadership
              </AccordionTrigger>
              <AccordionContent className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4 h-9 transition-colors duration-200"
                  onClick={() => handleMenuClick("executive", true)}
                >
                  Management/Executive Committee
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4 h-9 transition-colors duration-200"
                  onClick={() => handleMenuClick("tenure", true)}
                >
                  Office Tenure
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4 h-9 transition-colors duration-200"
                  onClick={() => handleMenuClick("adhoc", true)}
                >
                  Ad-hoc Committees
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4 h-9 transition-colors duration-200"
                  onClick={() => handleMenuClick("staff", true)}
                >
                  Staff & Employees
                </Button>
                {(isAdmin || isOwner) && (
                  <Button
                    variant="ghost"
                    className="w-full justify-start pl-4 text-primary h-9 transition-colors duration-200"
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

            {/* Quiz Game - Positioned above FundRaiser */}
            <AccordionItem value="quiz-game" className="border rounded-lg px-3 data-[state=open]:bg-muted/30">
              <AccordionTrigger className="text-base">Quiz Game</AccordionTrigger>
              <AccordionContent className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4 h-9 transition-colors duration-200 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/30 dark:hover:bg-blue-900/40"
                  onClick={() => {
                    setShowCommunityQuiz(true);
                    setOpen(false);
                  }}
                >
                  <Play className="h-4 w-4 mr-2 text-blue-600" />
                  <span className="text-blue-700 dark:text-blue-400 font-medium">Play Community Quiz</span>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4 h-9 transition-colors duration-200 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/30 dark:hover:bg-amber-900/40"
                  onClick={() => {
                    setShowMobigateQuiz(true);
                    setOpen(false);
                  }}
                >
                  <Play className="h-4 w-4 mr-2 text-amber-600" />
                  <span className="text-amber-700 dark:text-amber-400 font-medium">Play Mobigate Quiz</span>
                </Button>
              </AccordionContent>
            </AccordionItem>

            {/* FundRaiser */}
            <AccordionItem value="fundraiser" className="border rounded-lg px-3 data-[state=open]:bg-muted/30">
              <AccordionTrigger className="text-base">FundRaiser</AccordionTrigger>
              <AccordionContent className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4 h-9 transition-colors duration-200"
                  onClick={() => handleMenuClick("fundraiser-raise", true)}
                >
                  Raise Campaign
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4 h-9 transition-colors duration-200"
                  onClick={() => handleMenuClick("fundraiser-campaigns", true)}
                >
                  View Campaigns
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4 h-9 transition-colors duration-200"
                  onClick={() => handleMenuClick("fundraiser-donors", true)}
                >
                  View Donors
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4 h-9 transition-colors duration-200"
                  onClick={() => handleMenuClick("fundraiser-celebrity", true)}
                >
                  View Celebrity Donors
                </Button>
              </AccordionContent>
            </AccordionItem>

            {/* Election/Voting */}
            <AccordionItem value="election" className="border rounded-lg px-3 data-[state=open]:bg-muted/30">
              <AccordionTrigger className="text-base">
                Election/Voting
              </AccordionTrigger>
              <AccordionContent className="space-y-1">
                {/* Declare for Election - Highlighted Entry Point */}
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4 h-10 transition-colors duration-200 bg-primary/10 hover:bg-primary/20 text-primary font-medium"
                  onClick={() => {
                    setShowDeclarationOfInterest(true);
                    setOpen(false);
                  }}
                >
                  <Flag className="h-4 w-4 mr-2" />
                  Declare for Election (EoI)
                </Button>
                {/* Nominate Candidate - Highlighted Entry Point */}
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4 h-10 transition-colors duration-200 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 font-medium"
                  onClick={() => {
                    setShowNominateCandidate(true);
                    setOpen(false);
                  }}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Nominate Candidate
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4 h-9 transition-colors duration-200"
                  onClick={() => handleMenuClick("election-campaigns", true)}
                >
                  Campaigns
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4 h-9 transition-colors duration-200"
                  onClick={() => handleMenuClick("election-voting", true)}
                >
                  Start Voting
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4 h-9 transition-colors duration-200"
                  onClick={() => handleMenuClick("election-results", true)}
                >
                  View Results
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4 h-9 transition-colors duration-200"
                  onClick={() => handleMenuClick("election-winners", true)}
                >
                  View Winners
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4 h-9 transition-colors duration-200"
                  onClick={() => handleMenuClick("election-opinions", true)}
                >
                  Public Opinions
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4 h-9 transition-colors duration-200"
                  onClick={() => handleMenuClick("election-accreditation", true)}
                >
                  Accreditation
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4 h-9 transition-colors duration-200"
                  onClick={() => handleMenuClick("election-clearances", true)}
                >
                  Clearances
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4 h-9 transition-colors duration-200"
                  onClick={() => handleMenuClick("election-primaries", true)}
                >
                  Nomination Primaries
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4 h-9 transition-colors duration-200"
                  onClick={() => handleMenuClick("election-accredited-voters", true)}
                >
                  Accredited Voters
                </Button>
                {/* Verify Certificate */}
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4 h-9 transition-colors duration-200"
                  onClick={() => {
                    setShowVerifyCertificate(true);
                    setOpen(false);
                  }}
                >
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  Verify Certificate
                </Button>
                {/* Impeachment Sub-Accordion */}
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="impeachment" className="border-none">
                    <AccordionTrigger className="py-2 pl-4 pr-2 text-sm text-red-600 hover:text-red-700 hover:no-underline">
                      <div className="flex items-center gap-2">
                        <Gavel className="h-4 w-4" />
                        Impeachment
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pl-6 space-y-1 pb-2">
                      <Button
                        variant="ghost"
                        className="w-full justify-start h-9 text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => {
                          setImpeachmentMode("start");
                          setShowImpeachment(true);
                          setOpen(false);
                        }}
                      >
                        <Gavel className="h-4 w-4 mr-2" />
                        Start Impeachment Process
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start h-9 text-sm"
                        onClick={() => {
                          setImpeachmentMode("view");
                          setShowImpeachment(true);
                          setOpen(false);
                        }}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="flex items-center">
                            <Gavel className="h-4 w-4 mr-2 text-muted-foreground" />
                            View Impeachment Processes
                          </span>
                          <Badge variant="secondary" className="text-xs ml-2">
                            4
                          </Badge>
                        </div>
                      </Button>
                      {/* Stats Preview */}
                      <div className="grid grid-cols-4 gap-1 mt-2 px-1">
                        <div className="text-center p-1.5 bg-blue-50 rounded">
                          <p className="text-xs font-bold text-blue-600">4</p>
                          <p className="text-[10px] text-muted-foreground">Total</p>
                        </div>
                        <div className="text-center p-1.5 bg-amber-50 rounded">
                          <p className="text-xs font-bold text-amber-600">2</p>
                          <p className="text-[10px] text-muted-foreground">Active</p>
                        </div>
                        <div className="text-center p-1.5 bg-red-50 rounded">
                          <p className="text-xs font-bold text-red-600">1</p>
                          <p className="text-[10px] text-muted-foreground">Impeached</p>
                        </div>
                        <div className="text-center p-1.5 bg-orange-50 rounded">
                          <p className="text-xs font-bold text-orange-600">1</p>
                          <p className="text-[10px] text-muted-foreground">Expired</p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                {(isAdmin || isOwner) && (
                  <Button
                    variant="ghost"
                    className="w-full justify-start pl-4 text-primary h-9 transition-colors duration-200"
                    onClick={() => {
                      navigate(`/community/${communityId}/admin/elections`);
                      setOpen(false);
                    }}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Manage Elections (Admin)
                  </Button>
                )}
              </AccordionContent>
            </AccordionItem>

            {/* Community Meetings - Now includes Roll-Calls */}
            <AccordionItem value="meetings-main" className="border rounded-lg px-3 data-[state=open]:bg-muted/30">
              <AccordionTrigger className="text-base font-semibold">
                Community Meetings
              </AccordionTrigger>
              <AccordionContent>
                <Accordion type="single" collapsible className="pl-2">
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
                        Meeting Voice Notes
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
                        onClick={() => handleMenuClick("meeting-minutes", true)}
                      >
                        Meeting Minutes
                      </Button>
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
                        Meeting Voice Notes
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
                  className="w-full justify-start pl-2 mt-2 h-9 transition-colors duration-200"
                  onClick={() => handleMenuClick("meetings", true)}
                >
                  Join Live Meeting
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-2 mt-1 h-9 transition-colors duration-200"
                  onClick={() => handleMenuClick("rollcalls", true)}
                >
                  Roll-Calls
                </Button>
              </AccordionContent>
            </AccordionItem>

            {/* Finance */}
            <AccordionItem value="finance" className="border rounded-lg px-3 data-[state=open]:bg-muted/30">
              <AccordionTrigger className="text-base">Finance</AccordionTrigger>
              <AccordionContent className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4 h-9 transition-colors duration-200"
                  onClick={() => handleMenuClick("community-accounts", true)}
                >
                  CAM [Community Account Manager]
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4 h-9 transition-colors duration-200"
                  onClick={() => handleMenuClick("Financial Overview/Wallet")}
                >
                  Financial Overview/Wallet
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4 h-9 transition-colors duration-200"
                  onClick={() => handleMenuClick("Financial Obligations")}
                >
                  Financial Obligations
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4 h-9 transition-colors duration-200"
                  onClick={() => handleMenuClick("Financial Status Checker")}
                >
                  Financial Status Checker
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4 h-9 transition-colors duration-200"
                  onClick={() => handleMenuClick("Automated Financial Audit")}
                >
                  Automated Financial Audit
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4 h-9 transition-colors duration-200"
                  onClick={() => handleMenuClick("finance-summary", true)}
                >
                  Financial Summary
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4 h-9 transition-colors duration-200"
                  onClick={() => handleMenuClick("finance-clearances", true)}
                >
                  Financial Clearances
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4 h-9 transition-colors duration-200"
                  onClick={() => handleMenuClick("finance-accreditation", true)}
                >
                  Financial Accreditation
                </Button>
              </AccordionContent>
            </AccordionItem>

            {/* Constitution & By-laws */}
            <AccordionItem value="constitution" className="border rounded-lg px-3 data-[state=open]:bg-muted/30">
              <AccordionTrigger className="text-base">
                Constitution & By-laws
              </AccordionTrigger>
              <AccordionContent className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4 h-9 transition-colors duration-200"
                  onClick={() => handleMenuClick("View Constitution")}
                >
                  View Constitution
                </Button>
              </AccordionContent>
            </AccordionItem>

            {/* Community Resources */}
            <AccordionItem value="resources" className="border rounded-lg px-3 data-[state=open]:bg-muted/30">
              <AccordionTrigger className="text-base">
                Community Resources
              </AccordionTrigger>
              <AccordionContent className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4 h-9 transition-colors duration-200"
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
                    className="w-full justify-start pl-4 text-primary h-9 transition-colors duration-200"
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

            {/* Member Settings - Democratic Voting */}
            <AccordionItem value="member-settings" className="border rounded-lg px-3 data-[state=open]:bg-muted/30 border-primary/20 bg-primary/5">
              <AccordionTrigger className="text-base">
                Member Settings
              </AccordionTrigger>
              <AccordionContent className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4 h-9 transition-colors duration-200 bg-primary/10 hover:bg-primary/20"
                  onClick={() => {
                    setShowPrivacyVoting(true);
                    setOpen(false);
                  }}
                >
                  <Vote className="h-4 w-4 mr-2 text-primary" />
                  <span className="text-primary font-medium">Privacy Settings Voting</span>
                </Button>
                <p className="text-xs text-muted-foreground px-4 pb-2">
                  Vote on community privacy settings. Majority decides.
                </p>
              </AccordionContent>
            </AccordionItem>

            {/* Mobi-Merchant */}
            <AccordionItem value="mobi-merchant" className="border rounded-lg px-3 data-[state=open]:bg-muted/30">
              <AccordionTrigger className="text-base">Mobi-Merchant</AccordionTrigger>
              <AccordionContent className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4 h-9 transition-colors duration-200"
                  onClick={() => handleMenuClick("Create Mobi Quiz-Games")}
                >
                  Create Mobi Quiz-Games
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4 h-9 transition-colors duration-200"
                  onClick={() => handleMenuClick("Subscribe for Voucher Bundles")}
                >
                  Subscribe for Voucher Bundles
                </Button>
              </AccordionContent>
            </AccordionItem>

            {/* Community Settings - Democratic Governance */}
            <AccordionItem value="community-settings" className="border rounded-lg px-3 data-[state=open]:bg-muted/30 border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20 dark:border-emerald-800">
              <AccordionTrigger className="text-base font-semibold py-3">
                <div className="flex items-center justify-between w-full pr-2">
                  <div className="flex items-center gap-2">
                    <Settings2 className="h-4 w-4 text-emerald-600" />
                    <span>Community Settings</span>
                  </div>
                  {pendingSettingsCount > 0 && (
                    <Badge variant="destructive" className="text-xs px-2 py-0.5">
                      {pendingSettingsCount}
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-2 pt-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4 h-10 transition-colors duration-200 bg-emerald-100/50 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50"
                  onClick={() => {
                    setShowCommunitySettings(true);
                    setOpen(false);
                  }}
                >
                  <Settings2 className="h-4 w-4 mr-2 text-emerald-600" />
                  <span className="text-emerald-700 dark:text-emerald-300 font-medium">View All Settings</span>
                  {pendingSettingsCount > 0 && (
                    <Badge className="ml-auto bg-amber-500 text-white text-xs">
                      {pendingSettingsCount} pending
                    </Badge>
                  )}
                </Button>
                <div className="px-4 py-2 rounded-lg bg-muted/30 space-y-1">
                  <p className="text-sm text-muted-foreground">
                    <strong>60% approval</strong> required for all changes
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Members can approve, disapprove & recommend alternatives
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
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
          <DrawerContent className="h-[85vh] overflow-hidden touch-auto">
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
      <CommunityGiftDrawer open={showGiftMembers} onOpenChange={setShowGiftMembers} />
      <BlockManagementDrawer open={showBlockMembers} onOpenChange={setShowBlockMembers} />
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

      {/* Community Quiz Dialog */}
      <CommunityQuizDialog 
        open={showCommunityQuiz} 
        onOpenChange={setShowCommunityQuiz}
      />

      {/* Mobigate Quiz Dialog */}
      <MobigateQuizDialog 
        open={showMobigateQuiz} 
        onOpenChange={setShowMobigateQuiz}
      />

      {/* Member Privacy Voting Sheet */}
      <MemberPrivacyVotingSheet
        open={showPrivacyVoting}
        onOpenChange={setShowPrivacyVoting}
      />

      {/* Community Settings Sheet - Democratic Governance */}
      <CommunitySettingsSheet
        open={showCommunitySettings}
        onOpenChange={setShowCommunitySettings}
      />

      {/* Election Declaration of Interest Sheet */}
      <DeclarationOfInterestSheet
        open={showDeclarationOfInterest}
        onOpenChange={setShowDeclarationOfInterest}
        memberName="John Doe"
        walletBalance={75000}
        onDeclarationComplete={(officeId, ref) => {
          setShowDeclarationOfInterest(false);
          setShowCandidateDashboard(true);
        }}
      />

      {/* Candidate Dashboard Sheet */}
      <CandidateDashboardSheet
        open={showCandidateDashboard}
        onOpenChange={setShowCandidateDashboard}
      />

      {/* Member Impeachment Drawer */}
      <MemberImpeachmentDrawer
        open={showImpeachment}
        onOpenChange={setShowImpeachment}
        initialView={impeachmentMode === "start" ? "start" : "list"}
      />

      {/* Nominate Candidate Sheet */}
      <NominateCandidateSheet
        open={showNominateCandidate}
        onOpenChange={setShowNominateCandidate}
        onNominationComplete={() => setShowNominateCandidate(false)}
      />

      {/* Verify Certificate Drawer */}
      <VerifyCertificateDrawer
        open={showVerifyCertificate}
        onOpenChange={setShowVerifyCertificate}
      />
    </>
  );
}
