import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MoreVertical } from "lucide-react";
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
import { QuizCreationDialog } from "./QuizCreationDialog";
import { VoucherBundlesDialog } from "./VoucherBundlesDialog";

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

  const handleLoginSuccess = (role: "guest" | "member" | "admin") => {
    if (!onNavigate) return;
    
    setOpen(false);
    
    // Navigate based on role
    if (role === "guest" || role === "member") {
      onNavigate("status"); // Navigate to community home
    } else if (role === "admin") {
      onNavigate("administration"); // Navigate to admin dashboard
    }
  };

  const handleMenuClick = (action: string, isNavigable?: boolean) => {
    // Handle login dialogs
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

    // Handle new membership dialogs
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

    // Handle finance dialogs
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

    // Handle constitution and resources
    if (action === "View Constitution") {
      setShowConstitution(true);
      setOpen(false);
      return;
    }

    // Handle mobi-merchant
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

    // Handle new page routes
    if (action === "Articles" && communityId) {
      navigate(`/community/${communityId}/articles`);
      setOpen(false);
      return;
    }
    if (action === "Inside Community" && communityId) {
      navigate(`/community/${communityId}/inside`);
      setOpen(false);
      return;
    }

    // Handle navigation
    if (isNavigable && onNavigate) {
      onNavigate(action);
      setOpen(false);
    } else {
      toast({
        title: action,
        description: "This feature is coming soon!",
      });
      setOpen(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh] p-0">
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle>Community Menu</SheetTitle>
        </SheetHeader>
        
        <div className="overflow-y-auto h-[calc(85vh-73px)]">
          {/* Direct Menu Items - Articles, News Info, Events */}
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
          </div>

          <Separator className="my-2" />

          <Accordion type="multiple" className="w-full px-4">

            {/* Guests Section */}
            <AccordionItem value="guests">
              <AccordionTrigger className="text-base">Guests</AccordionTrigger>
              <AccordionContent>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4"
                  onClick={() => handleMenuClick("E-Mail Login")}
                >
                  E-Mail Login [OTP]
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
                
                {/* Nested accordion for Exit Community */}
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
                {/* Nested accordion for View Members */}
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
                
                {/* Single item: Add Friends */}
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-2 mt-1"
                  onClick={() => handleMenuClick("Add Friends")}
                >
                  Add Friends
                </Button>
                
                {/* Nested accordion for Invite Members */}
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
              </AccordionContent>
            </AccordionItem>

            {/* Admins Section - Only show if user is admin */}
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
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Separator className="my-2" />

          {/* Community Meetings - Expanded Accordion */}
          <Accordion type="multiple" className="w-full px-4">
            <AccordionItem value="meetings-main">
            <AccordionTrigger className="text-base font-semibold">
              Community Meetings
            </AccordionTrigger>
            <AccordionContent>
              {/* Recent Meetings Sub-Accordion */}
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

                {/* Previous Meetings Sub-Accordion */}
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

              {/* Live Meeting Button */}
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

          {/* Roll-Calls (kept as single item) */}
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
      </SheetContent>

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
    </Sheet>
  );
}
