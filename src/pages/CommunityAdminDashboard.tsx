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
import { AdminSettingsTab } from "@/components/admin/settings/AdminSettingsTab";

// Meeting Management Drawers
import {
  AdminUpcomingMeetingsSheet,
  AdminPastMeetingsSheet,
  AdminAttendanceSheet,
  AdminResolutionsSheet,
  AdminConflictsSheet,
  AdminRollCallSheet,
} from "@/components/admin/AdminMeetingsDrawers";

// Existing Community Dialogs
import { ManageMembershipRequestsDialog } from "@/components/community/ManageMembershipRequestsDialog";
import { BlockManagementDrawer } from "@/components/community/BlockManagementDrawer";
import { AllMembersDrawer } from "@/components/community/AllMembersDrawer";
import { ManageLeadershipDialog } from "@/components/community/leadership/ManageLeadershipDialog";
import { ManageCommunityGalleryDialog } from "@/components/community/ManageCommunityGalleryDialog";
import { ManageCommunityResourcesDialog } from "@/components/community/ManageCommunityResourcesDialog";
import { FinancialOverviewDialog } from "@/components/community/finance/FinancialOverviewDialog";
import { FinancialObligationsDialog } from "@/components/community/finance/FinancialObligationsDialog";
import { ConstitutionViewer } from "@/components/community/ConstitutionViewer";
import { AdminConstitutionManagementSheet } from "@/components/admin/settings/AdminConstitutionManagementSheet";

// Leadership Sheets
import { ApplyElectionResultsSheet } from "@/components/admin/leadership/ApplyElectionResultsSheet";
import { LeadershipHistorySheet } from "@/components/admin/leadership/LeadershipHistorySheet";
import { AdhocCommitteesSheet } from "@/components/admin/leadership/AdhocCommitteesSheet";

// Executive Detail
import { ExecutiveDetailSheet } from "@/components/community/ExecutiveDetailSheet";
import { ExecutiveMember } from "@/data/communityExecutivesData";

// Edit Dialogs
import { EditCommunityProfileDialog } from "@/components/community/EditCommunityProfileDialog";
import { EditCommunityPhotoDialog } from "@/components/community/EditCommunityPhotoDialog";

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

// Mock executives for leadership section (extended with ExecutiveMember type properties)
const mockExecutives: ExecutiveMember[] = [
  { id: "exec-1", name: "Chief Emeka Obi", position: "President", imageUrl: communityPerson1, tenure: "2024-2028", level: "topmost", committee: "executive" },
  { id: "exec-2", name: "Dr. Amaka Eze", position: "Vice President", imageUrl: communityPerson2, tenure: "2024-2028", level: "deputy", committee: "executive" },
  { id: "exec-3", name: "Barr. Ngozi Okonkwo", position: "Secretary", imageUrl: communityPerson3, tenure: "2024-2028", level: "officer", committee: "executive" },
  { id: "exec-4", name: "Mr. Chidi Okoro", position: "Treasurer", imageUrl: communityPerson4, tenure: "2024-2028", level: "officer", committee: "executive" },
  { id: "exec-5", name: "Mrs. Ada Nwosu", position: "PRO", imageUrl: communityPerson5, tenure: "2024-2028", level: "officer", committee: "executive" },
  { id: "exec-6", name: "Engr. Obinna Ibe", position: "Welfare", imageUrl: communityPerson6, tenure: "2024-2028", level: "officer", committee: "executive" },
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
  const [showConstitutionManagement, setShowConstitutionManagement] = useState(false);
  const [showDemocraticPrivacy, setShowDemocraticPrivacy] = useState(false);
  const [showSettingsTab, setShowSettingsTab] = useState(false);

  // Meeting Management Dialog States
  const [showUpcomingMeetings, setShowUpcomingMeetings] = useState(false);
  const [showPastMeetings, setShowPastMeetings] = useState(false);
  const [showAttendance, setShowAttendance] = useState(false);
  const [showResolutions, setShowResolutions] = useState(false);
  const [showConflicts, setShowConflicts] = useState(false);
  const [showRollCall, setShowRollCall] = useState(false);

  // Leadership Sheet States
  const [showApplyResults, setShowApplyResults] = useState(false);
  const [showLeadershipHistory, setShowLeadershipHistory] = useState(false);
  const [showAdhocCommittees, setShowAdhocCommittees] = useState(false);
  const [selectedExecutive, setSelectedExecutive] = useState<ExecutiveMember | null>(null);
  const [showExecutiveDetail, setShowExecutiveDetail] = useState(false);

  // Profile & Photo Edit States
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showEditPhoto, setShowEditPhoto] = useState(false);

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

      {/* Main Content - Reduced horizontal padding for more content space */}
      <ScrollArea className="h-[calc(100vh-64px)] touch-auto overscroll-contain">
        <div className="px-3 py-3 space-y-3 pb-24">
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
            onCommunitySettings={() => setShowSettingsTab(true)}
            pendingMembers={mockAdminStats.pendingRequests}
            pendingContent={mockAdminStats.pendingContent}
          />

          {/* Pending Actions Card */}
          <AdminPendingActionsCard
            actions={mockPendingActions}
            onActionClick={handlePendingActionClick}
          />

          {/* Admin Sections */}
          <div className="space-y-2">
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
              onViewUpcoming={() => setShowUpcomingMeetings(true)}
              onViewPast={() => setShowPastMeetings(true)}
              onViewAttendance={() => setShowAttendance(true)}
              onViewResolutions={() => setShowResolutions(true)}
              onViewConflicts={() => setShowConflicts(true)}
              onManageRollCall={() => setShowRollCall(true)}
            />

            {/* Leadership Management */}
            <AdminLeadershipSection
              executives={mockExecutives}
              onManageLeadership={() => setShowLeadershipDialog(true)}
              onApplyElectionResults={() => setShowApplyResults(true)}
              onViewChangeHistory={() => setShowLeadershipHistory(true)}
              onManageAdhoc={() => setShowAdhocCommittees(true)}
              onViewExecutive={(id) => {
                const exec = mockExecutives.find(e => e.id === id);
                if (exec) {
                  setSelectedExecutive(exec);
                  setShowExecutiveDetail(true);
                }
              }}
            />

            {/* Community Settings */}
            <AdminSettingsSection
              onEditProfile={() => setShowEditProfile(true)}
              onEditPhotos={() => setShowEditPhoto(true)}
              onManageConstitution={() => setShowConstitution(true)}
              onManageConstitutionAdmin={() => setShowConstitutionManagement(true)}
              onManageResources={() => setShowResourcesDialog(true)}
              onPrivacySettings={() => setShowSettingsTab(true)}
              onNotificationSettings={() => setShowSettingsTab(true)}
              onCommunityRules={() => setShowSettingsTab(true)}
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
        isAdmin={true}
        isOwner={true}
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

      <AdminConstitutionManagementSheet
        open={showConstitutionManagement}
        onOpenChange={setShowConstitutionManagement}
      />

      <MemberPrivacyVotingSheet
        open={showDemocraticPrivacy}
        onOpenChange={setShowDemocraticPrivacy}
      />

      <AdminSettingsTab
        open={showSettingsTab}
        onOpenChange={setShowSettingsTab}
      />

      {/* Meeting Management Drawers */}
      <AdminUpcomingMeetingsSheet
        open={showUpcomingMeetings}
        onOpenChange={setShowUpcomingMeetings}
      />
      <AdminPastMeetingsSheet
        open={showPastMeetings}
        onOpenChange={setShowPastMeetings}
      />
      <AdminAttendanceSheet
        open={showAttendance}
        onOpenChange={setShowAttendance}
      />
      <AdminResolutionsSheet
        open={showResolutions}
        onOpenChange={setShowResolutions}
      />
      <AdminConflictsSheet
        open={showConflicts}
        onOpenChange={setShowConflicts}
      />
      <AdminRollCallSheet
        open={showRollCall}
        onOpenChange={setShowRollCall}
      />

      {/* Leadership Management Sheets */}
      <ApplyElectionResultsSheet
        open={showApplyResults}
        onOpenChange={setShowApplyResults}
      />
      <LeadershipHistorySheet
        open={showLeadershipHistory}
        onOpenChange={setShowLeadershipHistory}
      />
      <AdhocCommitteesSheet
        open={showAdhocCommittees}
        onOpenChange={setShowAdhocCommittees}
      />

      {/* Executive Detail Sheet */}
      <ExecutiveDetailSheet
        member={selectedExecutive}
        open={showExecutiveDetail}
        onOpenChange={setShowExecutiveDetail}
      />

      {/* Profile & Photo Edit Dialogs */}
      {selectedExecutive && (
        <>
          <EditCommunityProfileDialog
            open={showEditProfile}
            onOpenChange={setShowEditProfile}
            member={selectedExecutive}
            onSave={(profile, milestones) => {
              console.log("Saved profile:", profile, milestones);
            }}
          />
          <EditCommunityPhotoDialog
            open={showEditPhoto}
            onOpenChange={setShowEditPhoto}
            currentImage={selectedExecutive.imageUrl}
            onSave={(newImage) => {
              console.log("Saved photo:", newImage);
            }}
          />
        </>
      )}
    </div>
  );
};

export default CommunityAdminDashboard;
