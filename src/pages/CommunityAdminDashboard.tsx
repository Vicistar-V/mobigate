import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { MemberPrivacyVotingSheet } from "@/components/community/settings/MemberPrivacyVotingSheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

// Admin Components
import { AdminDashboardHeader } from "@/components/admin/AdminDashboardHeader";
import { AdminQuickActions } from "@/components/admin/AdminQuickActions";
import { AdminPendingActionsCard } from "@/components/admin/AdminPendingActionsCard";
import { AdminActivityLog } from "@/components/admin/AdminActivityLog";
import { AdminMembershipSection } from "@/components/admin/AdminMembershipSection";
import { AdminContentSection } from "@/components/admin/AdminContentSection";
import { AdminFinanceSection } from "@/components/admin/AdminFinanceSection";
import { AdminElectionSection } from "@/components/admin/AdminElectionSection";
import { AdminMeetingSection } from "@/components/admin/AdminMeetingSection";
import { AdminLeadershipSection } from "@/components/admin/AdminLeadershipSection";
import { AdminSettingsSection } from "@/components/admin/AdminSettingsSection";

// Existing Community Dialogs
import { ManageMembershipRequestsDialog } from "@/components/community/ManageMembershipRequestsDialog";
import { BlockManagementDrawer } from "@/components/community/BlockManagementDrawer";
import { AllMembersDrawer } from "@/components/community/AllMembersDrawer";
import { ManageLeadershipDialog } from "@/components/community/leadership/ManageLeadershipDialog";
import { ManageCommunityGalleryDialog } from "@/components/community/ManageCommunityGalleryDialog";
import { ManageCommunityResourcesDialog } from "@/components/community/ManageCommunityResourcesDialog";
import { FinancialOverviewDialog } from "@/components/community/finance/FinancialOverviewDialog";
// FinancialAuditDialog removed - now handled by AdminFinancialAuditDialog in AdminFinanceSection
import { FinancialObligationsDialog } from "@/components/community/finance/FinancialObligationsDialog";
import { ConstitutionViewer } from "@/components/community/ConstitutionViewer";

// Mock Data
import {
  mockAdminStats,
  mockPendingActions,
  mockAdminActivities,
  mockRecentMemberRequests,
  mockRecentContent,
  mockRecentTransactions,
  mockDefaultingMembers,
  mockElectionActivities,
  mockUpcomingMeetings,
  PendingAction,
} from "@/data/adminDashboardData";

import communityPerson1 from "@/assets/community-person-1.jpg";
import communityPerson2 from "@/assets/community-person-2.jpg";
import communityPerson3 from "@/assets/community-person-3.jpg";
import communityPerson4 from "@/assets/community-person-4.jpg";
import communityPerson5 from "@/assets/community-person-5.jpg";
import communityPerson6 from "@/assets/community-person-6.jpg";

// Mock executives for leadership section
const mockExecutives = [
  { id: "exec-1", name: "Chief Emeka Obi", position: "President", avatar: communityPerson1 },
  { id: "exec-2", name: "Dr. Amaka Eze", position: "Vice President", avatar: communityPerson2 },
  { id: "exec-3", name: "Barr. Ngozi Okonkwo", position: "Secretary", avatar: communityPerson3 },
  { id: "exec-4", name: "Mr. Chidi Okoro", position: "Treasurer", avatar: communityPerson4 },
  { id: "exec-5", name: "Mrs. Ada Nwosu", position: "PRO", avatar: communityPerson5 },
  { id: "exec-6", name: "Engr. Obinna Ibe", position: "Welfare", avatar: communityPerson6 },
];

const CommunityAdminDashboard = () => {
  const { communityId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Dialog States
  const [showMembershipRequests, setShowMembershipRequests] = useState(false);
  const [showAllMembers, setShowAllMembers] = useState(false);
  const [showBlockManagement, setShowBlockManagement] = useState(false);
  const [showLeadershipDialog, setShowLeadershipDialog] = useState(false);
  const [showGalleryDialog, setShowGalleryDialog] = useState(false);
  const [showResourcesDialog, setShowResourcesDialog] = useState(false);
  const [showFinancialOverview, setShowFinancialOverview] = useState(false);
  // showFinancialAudit removed - now handled by AdminFinanceSection's AdminFinancialAuditDialog
  const [showFinancialObligations, setShowFinancialObligations] = useState(false);
  const [showConstitution, setShowConstitution] = useState(false);
  const [showDemocraticPrivacy, setShowDemocraticPrivacy] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
    toast({
      title: "Dashboard Refreshed",
      description: "All data has been updated.",
    });
  };

  const handlePendingActionClick = (action: PendingAction) => {
    switch (action.type) {
      case 'membership':
        setShowMembershipRequests(true);
        break;
      case 'content':
        navigate(`/community/${communityId}/admin/content`);
        break;
      case 'clearance':
        navigate(`/community/${communityId}/admin/elections`);
        break;
      case 'finance':
        setShowFinancialObligations(true);
        break;
      case 'conflict':
        toast({ title: "Conflicts of Interest", description: "Opening conflicts management..." });
        break;
    }
  };

  const showToast = (title: string, description: string) => {
    toast({ title, description });
  };

  return (
    <div className="min-h-screen bg-background w-full overflow-x-hidden">
      {/* Fixed Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex items-center gap-3 px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 h-9 w-9"
            onClick={() => navigate(`/community/${communityId}`)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="font-semibold truncate">Admin Dashboard</h1>
            <p className="text-xs text-muted-foreground">Manage your community</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 h-9 w-9"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Main Content - Safe horizontal padding */}
      <ScrollArea className="h-[calc(100vh-64px)] touch-auto">
        <div className="px-4 py-4 space-y-4 pb-24">
          {/* Dashboard Header with Stats */}
          <AdminDashboardHeader
            communityName="Ndigbo Unity Association"
            communityLogo={communityPerson1}
            stats={mockAdminStats}
            onMembersClick={() => setShowAllMembers(true)}
            onPendingClick={() => setShowMembershipRequests(true)}
            onElectionsClick={() => navigate(`/community/${communityId}/admin/elections`)}
            onBalanceClick={() => setShowFinancialOverview(true)}
          />

          {/* Quick Actions */}
          <AdminQuickActions
            onManageMembers={() => setShowMembershipRequests(true)}
            onViewFinances={() => setShowFinancialOverview(true)}
            onManageElections={() => navigate(`/community/${communityId}/admin/elections`)}
            onManageContent={() => navigate(`/community/${communityId}/admin/content`)}
            onManageLeadership={() => setShowLeadershipDialog(true)}
            onCommunitySettings={() => showToast("Settings", "Opening community settings...")}
            pendingMembers={mockAdminStats.pendingRequests}
            pendingContent={mockAdminStats.pendingContent}
          />

          {/* Pending Actions Card */}
          <AdminPendingActionsCard
            actions={mockPendingActions}
            onActionClick={handlePendingActionClick}
          />

          {/* Admin Sections */}
          <div className="space-y-3">
            {/* Membership Management */}
            <AdminMembershipSection
              stats={mockAdminStats}
              recentRequests={mockRecentMemberRequests}
              onViewAllMembers={() => setShowAllMembers(true)}
              onManageRequests={() => setShowMembershipRequests(true)}
              onViewBlocked={() => setShowBlockManagement(true)}
            />

            {/* Content Management */}
            <AdminContentSection
              stats={mockAdminStats}
              recentContent={mockRecentContent}
              onManageNews={() => navigate(`/community/${communityId}/admin/content`)}
              onManageEvents={() => navigate(`/community/${communityId}/admin/content`)}
              onManageGallery={() => setShowGalleryDialog(true)}
              onManageResources={() => setShowResourcesDialog(true)}
            />

            {/* Financial Management */}
            <AdminFinanceSection
              stats={mockAdminStats}
              recentTransactions={mockRecentTransactions}
              defaultingMembers={mockDefaultingMembers}
              onViewOverview={() => setShowFinancialOverview(true)}
              onViewAudit={() => {}}
              onViewObligations={() => setShowFinancialObligations(true)}
            />

            {/* Election Management */}
            <AdminElectionSection
              stats={mockAdminStats}
              electionActivities={mockElectionActivities}
              onViewCampaigns={() => navigate(`/community/${communityId}/admin/elections`)}
              onViewResults={() => navigate(`/community/${communityId}/admin/elections`)}
              onManageAccreditation={() => navigate(`/community/${communityId}/admin/elections`)}
              onProcessClearances={() => navigate(`/community/${communityId}/admin/elections`)}
              onConfigureVoting={() => navigate(`/community/${communityId}/admin/elections`)}
              onAnnounceWinners={() => navigate(`/community/${communityId}/admin/elections`)}
            />

            {/* Meeting Management */}
            <AdminMeetingSection
              stats={mockAdminStats}
              upcomingMeetings={mockUpcomingMeetings}
              onViewUpcoming={() => showToast("Upcoming", "Opening upcoming meetings...")}
              onViewPast={() => showToast("Past Meetings", "Opening past meetings...")}
              onViewAttendance={() => showToast("Attendance", "Opening attendance records...")}
              onViewResolutions={() => showToast("Resolutions", "Opening resolutions...")}
              onViewConflicts={() => showToast("Conflicts", "Opening conflicts of interest...")}
              onManageRollCall={() => showToast("Roll-Call", "Opening roll-call management...")}
            />

            {/* Leadership Management */}
            <AdminLeadershipSection
              executives={mockExecutives}
              onManageLeadership={() => setShowLeadershipDialog(true)}
              onApplyElectionResults={() => showToast("Apply Results", "Opening election results application...")}
              onViewChangeHistory={() => showToast("History", "Opening leadership change history...")}
              onManageAdhoc={() => showToast("Ad-hoc", "Opening ad-hoc committees...")}
              onViewExecutive={(id) => showToast("Executive", `Viewing executive ${id}...`)}
            />

            {/* Community Settings */}
            <AdminSettingsSection
              onEditProfile={() => showToast("Profile", "Opening profile editor...")}
              onEditPhotos={() => showToast("Photos", "Opening photo editor...")}
              onManageConstitution={() => setShowConstitution(true)}
              onManageResources={() => setShowResourcesDialog(true)}
              onPrivacySettings={() => showToast("Privacy", "Opening privacy settings...")}
              onNotificationSettings={() => showToast("Notifications", "Opening notification settings...")}
              onCommunityRules={() => showToast("Rules", "Opening community rules...")}
              onDemocraticPrivacy={() => setShowDemocraticPrivacy(true)}
            />
          </div>

          {/* Activity Log */}
          <AdminActivityLog activities={mockAdminActivities} maxHeight="350px" />
        </div>
      </ScrollArea>

      {/* Dialogs */}
      <ManageMembershipRequestsDialog
        open={showMembershipRequests}
        onOpenChange={setShowMembershipRequests}
      />

      <BlockManagementDrawer
        open={showBlockManagement}
        onOpenChange={setShowBlockManagement}
      />

      <AllMembersDrawer
        open={showAllMembers}
        onOpenChange={setShowAllMembers}
      />

      <ManageLeadershipDialog
        open={showLeadershipDialog}
        onOpenChange={setShowLeadershipDialog}
      />

      <ManageCommunityGalleryDialog
        open={showGalleryDialog}
        onOpenChange={setShowGalleryDialog}
      />

      <ManageCommunityResourcesDialog
        open={showResourcesDialog}
        onOpenChange={setShowResourcesDialog}
      />

      <FinancialOverviewDialog
        open={showFinancialOverview}
        onOpenChange={setShowFinancialOverview}
      />

      {/* FinancialAuditDialog removed - unified into AdminFinancialAuditDialog in AdminFinanceSection */}

      <FinancialObligationsDialog
        open={showFinancialObligations}
        onOpenChange={setShowFinancialObligations}
      />

      <ConstitutionViewer
        open={showConstitution}
        onOpenChange={setShowConstitution}
      />

      <MemberPrivacyVotingSheet
        open={showDemocraticPrivacy}
        onOpenChange={setShowDemocraticPrivacy}
      />
    </div>
  );
};

export default CommunityAdminDashboard;
