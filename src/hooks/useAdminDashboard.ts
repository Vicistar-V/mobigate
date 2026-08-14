// src/hooks/useAdminDashboard.ts
// Powers the entire admin dashboard from real APIs only — no mock data
import { useState, useEffect, useCallback } from "react";
import {
  AdminStats, PendingAction, AdminActivity, RecentMemberRequest,
  RecentContent, RecentTransaction, DefaultingMember, ElectionActivity,
  UpcomingMeeting,
} from "@/data/adminDashboardData";

const API = "/api/community";

const EMPTY_STATS: AdminStats = {
  totalMembers:      0, activeMembers:    0, pendingRequests:   0, blockedUsers:     0,
  activeElections:   0, upcomingMeetings: 0, walletBalance:     0, pendingContent:   0,
  totalNews:         0, totalEvents:      0, totalArticles:     0, totalVibes:       0,
  monthlyIncome:     0, monthlyExpenses:  0, pendingPayments:   0, accreditedVoters: 0,
  clearedCandidates: 0, scheduledMeetings:0, completedMeetings: 0, avgAttendanceRate:0,
  memberTrend:       0,
};

export type AdminDashboardData = {
  communityName:        string;
  communityLogo?:       string;
  stats:                AdminStats;
  pendingActions:       PendingAction[];
  activities:           AdminActivity[];
  recentMemberRequests: RecentMemberRequest[];
  recentContent:        RecentContent[];
  recentTransactions:   RecentTransaction[];
  defaultingMembers:    DefaultingMember[];
  electionActivities:   ElectionActivity[];
  upcomingMeetings:     UpcomingMeeting[];
  loading:              boolean;
  error:                string | null;
  refresh:              () => void;
  logAction:            (activity: string, target: string, type: string) => Promise<void>;
};

function mapDate(d: string | Date | null | undefined): Date {
  if (!d) return new Date();
  if (d instanceof Date) return d;
  return new Date(d);
}

export function useAdminDashboard(communityId: string | undefined): AdminDashboardData {
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  // All initial state is EMPTY — no mock data shown before API responds
  const [communityName,  setCommunityName]  = useState("Community");
  const [communityLogo,  setCommunityLogo]  = useState<string | undefined>(undefined);
  const [stats,          setStats]          = useState<AdminStats>(EMPTY_STATS);
  const [pendingActions, setPendingActions] = useState<PendingAction[]>([]);
  const [activities,     setActivities]     = useState<AdminActivity[]>([]);
  const [recentMemberRequests, setRecentMemberRequests] = useState<RecentMemberRequest[]>([]);
  const [recentContent,        setRecentContent]        = useState<RecentContent[]>([]);
  const [recentTransactions,   setRecentTransactions]   = useState<RecentTransaction[]>([]);
  const [defaultingMembers,    setDefaultingMembers]    = useState<DefaultingMember[]>([]);
  const [electionActivities,   setElectionActivities]   = useState<ElectionActivity[]>([]);
  const [upcomingMeetings,     setUpcomingMeetings]     = useState<UpcomingMeeting[]>([]);

  const fetchAll = useCallback(async () => {
    if (!communityId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/admin_dashboard.php?community_id=${communityId}`, { credentials: "include" });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const d = await res.json();

      // Community info
      setCommunityName(d.community?.name ?? "Community");
      setCommunityLogo(d.community?.logo  ?? undefined);

      // Real stats — only from API, zero if not provided
      setStats(d.stats ? {
        totalMembers:      d.stats.totalMembers      ?? 0,
        activeMembers:     d.stats.activeMembers     ?? 0,
        pendingRequests:   d.stats.pendingRequests   ?? 0,
        blockedUsers:      d.stats.blockedUsers      ?? 0,
        activeElections:   d.stats.activeElections   ?? 0,
        upcomingMeetings:  d.stats.upcomingMeetings  ?? 0,
        walletBalance:     d.stats.walletBalance     ?? 0,
        pendingContent:    d.stats.pendingContent    ?? 0,
        totalNews:         d.stats.totalNews         ?? 0,
        totalEvents:       d.stats.totalEvents       ?? 0,
        totalArticles:     d.stats.totalArticles     ?? 0,
        totalVibes:        d.stats.totalVibes        ?? 0,
        monthlyIncome:     d.stats.monthlyIncome     ?? 0,
        monthlyExpenses:   d.stats.monthlyExpenses   ?? 0,
        pendingPayments:   d.stats.pendingPayments   ?? 0,
        accreditedVoters:  d.stats.accreditedVoters  ?? 0,
        clearedCandidates: d.stats.clearedCandidates ?? 0,
        scheduledMeetings: d.stats.scheduledMeetings ?? 0,
        completedMeetings: d.stats.completedMeetings ?? 0,
        avgAttendanceRate: d.stats.avgAttendanceRate ?? 0,
        memberTrend:       d.stats.memberTrend       ?? 0,
      } : EMPTY_STATS);

      // Pending actions — real counts only
      setPendingActions(Array.isArray(d.pendingActions)
        ? d.pendingActions.map((a: any): PendingAction => ({
            id: a.id, type: a.type, title: a.title,
            description: a.description, count: a.count ?? 0, urgent: a.urgent ?? false,
          }))
        : []);

      // Activities — empty if none logged yet
      setActivities(Array.isArray(d.activities)
        ? d.activities.map((a: any): AdminActivity => ({
            id:          a.id,
            adminName:   a.admin_name ?? "Admin",
            adminAvatar: a.admin_avatar ?? "/placeholder.svg",
            action:      a.action,
            target:      a.target ?? "",
            // Use unix_ts (epoch seconds) for accurate timezone-independent time
            timestamp:   a.unix_ts ? new Date(a.unix_ts * 1000) : mapDate(a.created_at),
            type:        a.type ?? "content",
          }))
        : []);

      // Recent member requests
      setRecentMemberRequests(Array.isArray(d.recentMemberRequests)
        ? d.recentMemberRequests.map((r: any): RecentMemberRequest => ({
            id: r.id, name: r.name, avatar: r.avatar ?? "/placeholder.svg",
            requestDate: mapDate(r.requestDate ?? r.applied_at), status: "pending",
          }))
        : []);

      // Recent content
      setRecentContent(Array.isArray(d.recentContent)
        ? d.recentContent.map((c: any): RecentContent => ({
            id: c.id, title: c.title, type: c.type, author: c.author ?? "Unknown",
            authorAvatar: c.authorAvatar ?? "/placeholder.svg",
            createdAt: mapDate(c.createdAt ?? c.created_at),
            status: c.status ?? "pending",
          }))
        : []);

      // Recent transactions
      setRecentTransactions(Array.isArray(d.recentTransactions)
        ? d.recentTransactions.map((t: any): RecentTransaction => ({
            id: t.id, type: t.type, description: t.description,
            amount: parseFloat(t.amount ?? 0),
            date: mapDate(t.created_at ?? t.date),
            status: t.status ?? "completed",
            memberName: t.member_name ?? t.memberName,
          }))
        : []);

      // Defaulting members
      setDefaultingMembers(Array.isArray(d.defaultingMembers)
        ? d.defaultingMembers.map((m: any): DefaultingMember => ({
            id: m.id, name: m.name, avatar: m.avatar ?? "/placeholder.svg",
            amountOwed: parseFloat(m.amountOwed ?? 0),
            dueDate: mapDate(m.dueDate), obligation: m.obligation ?? "",
          }))
        : []);

      // Election activities
      setElectionActivities(Array.isArray(d.electionActivities)
        ? d.electionActivities.map((e: any): ElectionActivity => ({
            id: e.id, action: e.action, candidate: e.candidate,
            position: e.position, timestamp: mapDate(e.timestamp),
          }))
        : []);

      // Upcoming meetings
      setUpcomingMeetings(Array.isArray(d.upcomingMeetings)
        ? d.upcomingMeetings.map((m: any): UpcomingMeeting => ({
            id: m.id, title: m.title, date: mapDate(m.date ?? m.meeting_date),
            attendees: m.attendees ?? 0, status: m.status ?? "scheduled",
          }))
        : []);

    } catch (e: any) {
      setError(e.message);
      // On error: keep zeros/empty — do NOT fall back to mock data
    } finally {
      setLoading(false);
    }
  }, [communityId]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const logAction = useCallback(async (activity: string, target: string, type: string): Promise<void> => {
    if (!communityId) return;
    try {
      const res = await fetch(`${API}/admin_dashboard.php?community_id=${communityId}`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "log", community_id: communityId, activity, target, type }),
      });
      if (!res.ok) {
        console.error("[AdminLog] POST failed:", res.status);
      }
    } catch (e) {
      console.error("[AdminLog] Network error:", e);
    }
  }, [communityId]);

  return {
    communityName, communityLogo, stats, pendingActions, activities,
    recentMemberRequests, recentContent, recentTransactions, defaultingMembers,
    electionActivities, upcomingMeetings, loading, error, refresh: fetchAll, logAction,
  };
}
