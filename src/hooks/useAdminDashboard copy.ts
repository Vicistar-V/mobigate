// src/hooks/useAdminDashboard.ts
// Centralised hook that powers the entire admin dashboard from real APIs
import { useState, useEffect, useCallback } from "react";
import {
  AdminStats, PendingAction, AdminActivity, RecentMemberRequest,
  RecentContent, RecentTransaction, DefaultingMember, ElectionActivity,
  UpcomingMeeting, mockAdminStats, mockPendingActions, mockAdminActivities,
  mockRecentMemberRequests, mockRecentContent, mockRecentTransactions,
  mockDefaultingMembers, mockElectionActivities, mockUpcomingMeetings,
} from "@/data/adminDashboardData";

const API = "/api/community";

type AdminDashboardData = {
  communityName:   string;
  communityLogo?:  string;
  stats:           AdminStats;
  pendingActions:  PendingAction[];
  activities:      AdminActivity[];
  recentMemberRequests: RecentMemberRequest[];
  recentContent:   RecentContent[];
  recentTransactions:  RecentTransaction[];
  defaultingMembers:   DefaultingMember[];
  electionActivities:  ElectionActivity[];
  upcomingMeetings:    UpcomingMeeting[];
  loading:         boolean;
  error:           string | null;
  refresh:         () => void;
  logAction:       (activity: string, target: string, type: string) => void;
};

function mapDate(d: string | Date | null | undefined): Date {
  if (!d) return new Date();
  if (d instanceof Date) return d;
  return new Date(d);
}

export function useAdminDashboard(communityId: string | undefined): AdminDashboardData {
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const [data,    setData]    = useState<Omit<AdminDashboardData, "loading" | "error" | "refresh" | "logAction">>({
    communityName:  "Community",
    stats:          mockAdminStats,
    pendingActions: mockPendingActions,
    activities:     mockAdminActivities,
    recentMemberRequests: mockRecentMemberRequests,
    recentContent:  mockRecentContent,
    recentTransactions:  mockRecentTransactions,
    defaultingMembers:   mockDefaultingMembers,
    electionActivities:  mockElectionActivities,
    upcomingMeetings:    mockUpcomingMeetings,
  });

  const fetchAll = useCallback(async () => {
    if (!communityId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/admin_dashboard.php?community_id=${communityId}`, { credentials: "include" });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const d = await res.json();

      setData({
        communityName:  d.community?.name ?? "Community",
        communityLogo:  d.community?.logo  ?? undefined,
        stats: d.stats ? {
          ...mockAdminStats,   // fallback for any missing field
          totalMembers:     d.stats.totalMembers     ?? 0,
          activeMembers:    d.stats.activeMembers    ?? 0,
          pendingRequests:  d.stats.pendingRequests  ?? 0,
          blockedUsers:     d.stats.blockedUsers     ?? 0,
          activeElections:  d.stats.activeElections  ?? 0,
          upcomingMeetings: d.stats.upcomingMeetings ?? 0,
          walletBalance:    d.stats.walletBalance    ?? 0,
          pendingContent:   d.stats.pendingContent   ?? 0,
          totalNews:        d.stats.totalNews        ?? 0,
          totalEvents:      d.stats.totalEvents      ?? 0,
          totalArticles:    d.stats.totalArticles    ?? 0,
          totalVibes:       d.stats.totalVibes       ?? 0,
          monthlyIncome:    d.stats.monthlyIncome    ?? 0,
          monthlyExpenses:  d.stats.monthlyExpenses  ?? 0,
          pendingPayments:  d.stats.pendingPayments  ?? 0,
          accreditedVoters: d.stats.accreditedVoters ?? 0,
          clearedCandidates:d.stats.clearedCandidates?? 0,
          scheduledMeetings:d.stats.scheduledMeetings?? 0,
          completedMeetings:d.stats.completedMeetings?? 0,
          avgAttendanceRate:d.stats.avgAttendanceRate ?? 0,
          memberTrend:      d.stats.memberTrend      ?? 0,
        } : mockAdminStats,
        pendingActions: Array.isArray(d.pendingActions)
          ? d.pendingActions.map((a: any): PendingAction => ({
              id: a.id, type: a.type, title: a.title,
              description: a.description, count: a.count ?? 0, urgent: a.urgent ?? false,
            }))
          : mockPendingActions,
        activities: Array.isArray(d.activities) && d.activities.length > 0
          ? d.activities.map((a: any): AdminActivity => ({
              id: a.id, adminName: a.admin_name ?? "Admin",
              adminAvatar: a.admin_avatar ?? "/placeholder.svg",
              action: a.action, target: a.target ?? "",
              timestamp: mapDate(a.created_at), type: a.type ?? "content",
            }))
          : mockAdminActivities,
        recentMemberRequests: Array.isArray(d.recentMemberRequests)
          ? d.recentMemberRequests.map((r: any): RecentMemberRequest => ({
              id: r.id, name: r.name, avatar: r.avatar ?? "/placeholder.svg",
              requestDate: mapDate(r.requestDate ?? r.applied_at), status: "pending",
            }))
          : mockRecentMemberRequests,
        recentContent: Array.isArray(d.recentContent)
          ? d.recentContent.map((c: any): RecentContent => ({
              id: c.id, title: c.title, type: c.type, author: c.author ?? "Unknown",
              authorAvatar: c.authorAvatar ?? "/placeholder.svg",
              createdAt: mapDate(c.createdAt ?? c.created_at),
              status: c.status ?? "pending",
            }))
          : mockRecentContent,
        recentTransactions: Array.isArray(d.recentTransactions)
          ? d.recentTransactions.map((t: any): RecentTransaction => ({
              id: t.id, type: t.type, description: t.description,
              amount: parseFloat(t.amount ?? 0),
              date: mapDate(t.created_at ?? t.date),
              status: t.status ?? "completed",
              memberName: t.member_name ?? t.memberName,
            }))
          : mockRecentTransactions,
        defaultingMembers: Array.isArray(d.defaultingMembers)
          ? d.defaultingMembers.map((m: any): DefaultingMember => ({
              id: m.id, name: m.name, avatar: m.avatar ?? "/placeholder.svg",
              amountOwed: parseFloat(m.amountOwed ?? 0),
              dueDate: mapDate(m.dueDate), obligation: m.obligation ?? "",
            }))
          : mockDefaultingMembers,
        electionActivities: Array.isArray(d.electionActivities)
          ? d.electionActivities.map((e: any): ElectionActivity => ({
              id: e.id, action: e.action, candidate: e.candidate,
              position: e.position, timestamp: mapDate(e.timestamp),
            }))
          : mockElectionActivities,
        upcomingMeetings: Array.isArray(d.upcomingMeetings)
          ? d.upcomingMeetings.map((m: any): UpcomingMeeting => ({
              id: m.id, title: m.title, date: mapDate(m.date ?? m.meeting_date),
              attendees: m.attendees ?? 0, status: m.status ?? "scheduled",
            }))
          : mockUpcomingMeetings,
      });
    } catch (e: any) {
      setError(e.message);
      // Keep showing mock data on error so UI doesn't break
    } finally {
      setLoading(false);
    }
  }, [communityId]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const logAction = useCallback(async (activity: string, target: string, type: string) => {
    if (!communityId) return;
    try {
      await fetch(`${API}/admin_dashboard.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "log", community_id: communityId, activity, target, type }),
      });
    } catch {}
  }, [communityId]);

  return { ...data, loading, error, refresh: fetchAll, logAction };
}
