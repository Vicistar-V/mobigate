import { useState, useEffect, useCallback } from "react";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import { useCommunityProfile } from "@/hooks/useCommunity";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw, ShieldAlert, Crown } from "lucide-react";
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
import { CommunityFinanceManager } from "@/components/community/CommunityFinanceManager";
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
import { EditCommunityDialog } from "@/components/community/EditCommunityDialog";
import { PendingProfileChangeBanner } from "@/components/community/PendingProfileChangeBanner";
import { PendingPositionAuthorizationBanner } from "@/components/community/PendingPositionAuthorizationBanner";
import { TransferOwnershipDialog } from "@/components/community/TransferOwnershipDialog";
import { useCommunityAuthorizations } from "@/hooks/useCommunityAuthorizations";
import { useCurrentUserId } from "@/hooks/useWindowData";

// Mock Data
import { PendingAction } from "@/data/adminDashboardData";

import communityPerson1 from "@/assets/community-person-1.jpg"; // logo fallback only

// ─────────────────────────────────────────────────────────────────────────────

const CommunityAdminDashboard = () => {
  const { communityId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ── Real dashboard data via hook ──────────────────────────────────────────
  const {
    communityName, communityLogo,
    stats: liveAdminStats,
    pendingActions: livePendingActions,
    activities: liveActivities,
    recentMemberRequests: liveRecentMemberRequests,
    recentContent: liveRecentContent,
    recentTransactions: liveRecentTransactions,
    defaultingMembers: liveDefaultingMembers,
    electionActivities: liveElectionActivities,
    upcomingMeetings: liveUpcomingMeetings,
    loading: dashboardLoading,
    refresh: refreshDashboard,
    logAction,
  } = useAdminDashboard(communityId);

  // ── Real role check — any assigned admin (not just the owner) gets access
  const { profile: roleProfile, loading: roleLoading, refresh: refreshRoleProfile } = useCommunityProfile(communityId);
  const isRealOwner = !!roleProfile?.isOwner;
  const isRealAdmin = isRealOwner || roleProfile?.role === "Admin" || roleProfile?.role === "admin";
  const hasAdminAccess = isRealOwner || isRealAdmin;

  // Pending finance authorizations — used for the Quick Actions badge count
  const { needsMySignatureCount, refresh: refreshAuthorizations } = useCommunityAuthorizations(communityId);

  // Edit Community Profile dialog (moved here from the community profile page's header)
  const [showEditCommunityDialog, setShowEditCommunityDialog] = useState(false);
  const [pendingChangeRefreshKey, setPendingChangeRefreshKey] = useState(0);
  const [positionAuthRefreshKey, setPositionAuthRefreshKey] = useState(0);

  // Transfer Ownership (owner-only)
  const currentUserId = useCurrentUserId();
  const [showTransferOwnership, setShowTransferOwnership] = useState(false);

  // Dialog States
  const [showMembershipRequests, setShowMembershipRequests] = useState(false);
  const [showAllMembers, setShowAllMembers] = useState(false);
  const [showBlockManagement, setShowBlockManagement] = useState(false);
  const [showLeadershipDialog, setShowLeadershipDialog] = useState(false);
  const [showGalleryDialog, setShowGalleryDialog] = useState(false);
  const [showResourcesDialog, setShowResourcesDialog] = useState(false);
  const [showFinancialOverview, setShowFinancialOverview] = useState(false);
  const [showFinanceManager,   setShowFinanceManager]   = useState(false);
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

  // ── Real executives from leadership API ──────────────────────────────────
  const [executives, setExecutives] = useState<ExecutiveMember[]>([]);

  useEffect(() => {
    if (!communityId) return;
    fetch(`/api/community/leadership.php?community_id=${communityId}`, { credentials: "include" })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.executives?.length) {
          setExecutives(data.executives.map((e: any): ExecutiveMember => ({
            id:        e.user_id,
            name:      e.name,
            position:  e.position || "Member",
            tenure:    e.joined_at ? new Date(e.joined_at).getFullYear().toString() : "—",
            imageUrl:  e.profile_photo || "/placeholder.svg",
            level:     (e.admin_rank <= 2 ? "president" : e.admin_rank <= 5 ? "officer" : "member") as any,
            committee: "executive",
          })));
        }
      })
      .catch(() => {});
  }, [communityId]);

  // Profile & Photo Edit States
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showEditPhoto, setShowEditPhoto] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshDashboard();
    setIsRefreshing(false);
    toast({ title: "Dashboard Refreshed", description: "All data has been updated." });
  };

  const handlePendingActionClick = (action: PendingAction) => {
    switch (action.type) {
      case 'membership':
        setShowMembershipRequests(true);
        break;
      case 'content':
        navigate(`/community/${communityId}/admin/content`); logAction('navigated to content moderation', 'Content', 'content');
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

  // ── Real access control: only an assigned admin or the owner may view
  // this dashboard — anyone else is blocked, regardless of how they got here.
  if (!roleLoading && !hasAdminAccess) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
        <ShieldAlert className="h-12 w-12 text-destructive mb-4" />
        <h1 className="text-lg font-bold mb-1">Admin Access Required</h1>
        <p className="text-sm text-muted-foreground mb-6 max-w-xs">
          You need to be an assigned admin or the owner of this community to view this dashboard.
        </p>
        <Button onClick={() => navigate(`/community/${communityId}`)}>Back to Community</Button>
      </div>
    );
  }

  if (roleLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

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
            communityName={communityName}
            communityLogo={communityLogo || communityPerson1}
            stats={liveAdminStats}
            onMembersClick={() => setShowAllMembers(true)}
            onPendingClick={() => setShowMembershipRequests(true)}
            onElectionsClick={() => navigate(`/community/${communityId}/admin/elections`)}
            onBalanceClick={() => setShowFinancialOverview(true)}
          />

          {/* Pending community profile change awaiting other admins' approval */}
          {communityId && (
            <PendingProfileChangeBanner
              key={pendingChangeRefreshKey}
              communityId={communityId}
              isAdmin={hasAdminAccess}
              onApplied={() => { refreshRoleProfile(); refreshDashboard(); }}
            />
          )}

          {/* Pending executive appointments awaiting other admins' approval */}
          {communityId && (
            <PendingPositionAuthorizationBanner
              key={positionAuthRefreshKey}
              communityId={communityId}
              isAdmin={hasAdminAccess}
              onApplied={() => { refreshDashboard(); }}
            />
          )}

          {/* Transfer Ownership — visible only to the current owner/creator */}
          {isRealOwner && (
            <Button
              variant="outline"
              className="w-full justify-start gap-2 border-primary/30 text-primary hover:bg-primary/5"
              onClick={() => setShowTransferOwnership(true)}
            >
              <Crown className="h-4 w-4" />
              Transfer Ownership
            </Button>
          )}

          {/* Quick Actions */}
          <AdminQuickActions
            onManageMembers={() => setShowMembershipRequests(true)}
            onViewFinances={() => setShowFinancialOverview(true)}
            onManageElections={() => navigate(`/community/${communityId}/admin/elections`)}
            onManageContent={() => navigate(`/community/${communityId}/admin/content`)}
            onManageLeadership={() => setShowLeadershipDialog(true)}
            onCommunitySettings={() => setShowSettingsTab(true)}
            onEditProfile={() => setShowEditCommunityDialog(true)}
            onAuthorizations={() => navigate(`/community/${communityId}/admin/authorizations`)}
            pendingMembers={liveAdminStats.pendingRequests}
            pendingContent={liveAdminStats.pendingContent}
            pendingAuthorizations={needsMySignatureCount}
          />

          {/* Pending Actions Card */}
          <AdminPendingActionsCard
            actions={livePendingActions}
            onActionClick={handlePendingActionClick}
          />

          {/* Admin Sections */}
          <div className="space-y-2">
            {/* Membership Management */}
            <AdminMembershipSection
              communityId={communityId}
              stats={liveAdminStats}
              recentRequests={liveRecentMemberRequests}
              onViewAllMembers={() => setShowAllMembers(true)}
              onManageRequests={() => setShowMembershipRequests(true)}
              onViewBlocked={() => setShowBlockManagement(true)}
            />

            {/* Content Management */}
            <AdminContentSection
              communityId={communityId}
              stats={liveAdminStats}
              recentContent={liveRecentContent}
              onManageNews={() => navigate(`/community/${communityId}/admin/content`)}
              onManageEvents={() => navigate(`/community/${communityId}/admin/content`)}
              onManageGallery={() => setShowGalleryDialog(true)}
              onManageResources={() => setShowResourcesDialog(true)}
            />

            {/* Financial Management */}
            <AdminFinanceSection
              communityId={communityId}
              stats={liveAdminStats}
              recentTransactions={liveRecentTransactions}
              defaultingMembers={liveDefaultingMembers}
              onViewOverview={() => setShowFinanceManager(true)}
              onViewAudit={() => {}}
              onViewObligations={() => setShowFinancialObligations(true)}
            />

            {/* Election Management */}
            <AdminElectionSection
              communityId={communityId}
              stats={liveAdminStats}
              electionActivities={liveElectionActivities}
              onViewCampaigns={() => navigate(`/community/${communityId}/admin/elections`)}
              onViewResults={() => navigate(`/community/${communityId}/admin/elections`)}
              onManageAccreditation={() => navigate(`/community/${communityId}/admin/elections`)}
              onProcessClearances={() => navigate(`/community/${communityId}/admin/elections`)}
              onConfigureVoting={() => navigate(`/community/${communityId}/admin/elections`)}
              onAnnounceWinners={() => navigate(`/community/${communityId}/admin/elections`)}
            />

            {/* Meeting Management */}
            <AdminMeetingSection
              communityId={communityId}
              stats={liveAdminStats}
              upcomingMeetings={liveUpcomingMeetings}
              onViewUpcoming={() => setShowUpcomingMeetings(true)}
              onViewPast={() => setShowPastMeetings(true)}
              onViewAttendance={() => setShowAttendance(true)}
              onViewResolutions={() => setShowResolutions(true)}
              onViewConflicts={() => setShowConflicts(true)}
              onManageRollCall={() => setShowRollCall(true)}
            />

            {/* Leadership Management */}
            <AdminLeadershipSection
              communityId={communityId}
              executives={executives}
              onManageLeadership={() => setShowLeadershipDialog(true)}
              onApplyElectionResults={() => { setShowApplyResults(true); refreshDashboard(); }}
              onViewChangeHistory={() => setShowLeadershipHistory(true)}
              onManageAdhoc={() => setShowAdhocCommittees(true)}
              onViewExecutive={(id) => {
                const exec = executives.find(e => e.id === id);
                if (exec) {
                  setSelectedExecutive(exec);
                  setShowExecutiveDetail(true);
                }
              }}
              onAssignmentSubmitted={() => { setPositionAuthRefreshKey((k) => k + 1); refreshAuthorizations(); }}
            />

            {/* Community Settings */}
            <AdminSettingsSection
              communityId={communityId}
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
          <AdminActivityLog activities={liveActivities} maxHeight="350px" />
        </div>
      </ScrollArea>

      {/* Dialogs */}
      <ManageMembershipRequestsDialog
        open={showMembershipRequests}
        onOpenChange={async (v) => { setShowMembershipRequests(v); if (!v) { await logAction("reviewed membership requests", "Membership Applications", "membership"); refreshDashboard(); } }}
        communityId={communityId}
      />

      <BlockManagementDrawer
        open={showBlockManagement}
        onOpenChange={async (v) => { setShowBlockManagement(v); if (!v) { await logAction("managed blocked members", "Block Management", "membership"); refreshDashboard(); } }}
        communityId={communityId}
      />

      <AllMembersDrawer
        open={showAllMembers}
        onOpenChange={(v) => { setShowAllMembers(v); if (!v) refreshDashboard(); }}
        communityId={communityId}
      />

      <ManageLeadershipDialog
        open={showLeadershipDialog}
        onOpenChange={async (v) => { setShowLeadershipDialog(v); if (!v) { await logAction("managed community leadership", "Leadership Management", "leadership"); refreshDashboard(); setPositionAuthRefreshKey((k) => k + 1); refreshAuthorizations(); } }}
        communityId={communityId}
        onActivityLogged={async (action, target) => {
          await logAction(action, target, "leadership");
          refreshDashboard();
          setPositionAuthRefreshKey((k) => k + 1);
          refreshAuthorizations();
        }}
      />

      <ManageCommunityGalleryDialog
        open={showGalleryDialog}
        onOpenChange={setShowGalleryDialog}
        communityId={communityId}
      />

      <ManageCommunityResourcesDialog
        open={showResourcesDialog}
        onOpenChange={setShowResourcesDialog}
        communityId={communityId}
      />

      <FinancialOverviewDialog
        open={showFinancialOverview}
        onOpenChange={async (v) => { setShowFinancialOverview(v); if (!v) { await logAction("viewed financial overview", "Finance", "finance"); refreshDashboard(); } }}
        communityId={communityId}
        isAdmin={isRealAdmin}
        isOwner={isRealOwner}
      />

      {/* FinancialAuditDialog removed - unified into AdminFinancialAuditDialog in AdminFinanceSection */}
      <CommunityFinanceManager
        open={showFinanceManager}
        onOpenChange={async (v) => { setShowFinanceManager(v); if (!v) { await logAction("managed community finances", "Finance Manager", "finance"); refreshDashboard(); } }}
        communityId={communityId}
      />

      <FinancialObligationsDialog
        open={showFinancialObligations}
        onOpenChange={setShowFinancialObligations}
        communityId={communityId}
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
        onOpenChange={(v) => { setShowSettingsTab(v); if (!v) refreshDashboard(); }}
        communityId={communityId}
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

      {/* Edit Community Profile Dialog (moved here from the community page header) */}
      {roleProfile && communityId && (
        <EditCommunityDialog
          open={showEditCommunityDialog}
          onOpenChange={setShowEditCommunityDialog}
          community={{
            id: communityId,
            name: roleProfile.name,
            description: roleProfile.description,
            motto: roleProfile.motto,
            category: roleProfile.category,
            classification: roleProfile.classification,
            location: roleProfile.location,
            telephone: roleProfile.telephone,
            telephone2: roleProfile.telephone2,
            emailAddress: roleProfile.emailAddress,
            visionStatement: roleProfile.visionStatement,
            logoImage: roleProfile.logoImage,
            bannerImage: roleProfile.bannerImage,
            coverImage: roleProfile.coverImage,
          }}
          onSaved={() => { refreshRoleProfile(); refreshDashboard(); }}
          onPendingApproval={() => { setPendingChangeRefreshKey((k) => k + 1); }}
        />
      )}

      {/* Transfer Ownership Dialog */}
      {communityId && (
        <TransferOwnershipDialog
          open={showTransferOwnership}
          onOpenChange={setShowTransferOwnership}
          communityId={communityId}
          currentUserId={currentUserId}
          onTransferred={() => {
            // The current user is no longer the owner — refresh role/profile
            // and dashboard data so the UI (owner-only controls, etc.) updates.
            refreshRoleProfile();
            refreshDashboard();
          }}
        />
      )}

      {/* Executive Detail Sheet */}
      <ExecutiveDetailSheet
        member={selectedExecutive}
        open={showExecutiveDetail}
        onOpenChange={setShowExecutiveDetail}
      />

      {/* Executive Profile Edit (from LeadershipSection click) */}
      {selectedExecutive && (
        <EditCommunityProfileDialog
          open={showExecutiveDetail && showEditProfile}
          onOpenChange={(v) => { if (!v) setShowEditProfile(false); }}
          member={selectedExecutive}
          onSave={(profile, milestones) => {
            toast({ title: "Executive profile updated" });
            setShowEditProfile(false);
          }}
        />
      )}

      {/* Community Photo Edit (from Settings) */}
      <EditCommunityPhotoDialog
        open={showEditPhoto}
        onOpenChange={setShowEditPhoto}
        currentImage={communityLogo || communityPerson1}
        onSave={async (newImage) => {
          if (communityId) {
            try {
              await fetch("/api/community/leadership.php", {
                method: "POST", credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "update_community_profile", community_id: communityId, logo: newImage }),
              });
              toast({ title: "Community photo updated" });
            } catch {}
          }
          setShowEditPhoto(false);
        }}
      />
    </div>
  );
};

export default CommunityAdminDashboard;