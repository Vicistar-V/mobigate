// Merges the static settings catalog (src/data/adminSettingsData.ts — names,
// descriptions, preset options, multi-sig flags) with the live per-community
// data returned by /api/community/settings.php (actual stored values, open
// proposals, member recommendations). The catalog defines *what* settings
// exist; the API defines *what a given community has actually set*.

import { AdminSetting, getAllSettings } from "@/data/adminSettingsData";
import {
  ActiveCommunitySetting,
  AdminSettingProposal,
  MemberRecommendation,
  CommunitySettingCategory,
  DemocraticSettingStatus,
} from "@/types/communityDemocraticSettings";

export interface RawCommunitySettingsData {
  settings: Array<{
    setting_key: string;
    setting_name: string | null;
    setting_value: string | null;
    updated_by: string | null;
    updated_at: string;
  }>;
  proposals: Array<{
    id: string;
    setting_key: string;
    setting_name: string | null;
    setting_description: string | null;
    setting_category: string | null;
    current_value: string | null;
    proposed_value: string | null;
    proposed_by: string;
    proposed_by_name: string | null;
    proposed_by_avatar: string | null;
    proposed_by_role: string | null;
    proposed_at: string;
    status: string;
    expires_at: string | null;
    approval_count: number;
    disapproval_count: number;
    my_vote: "approve" | "disapprove" | null;
  }>;
  recommendations: Array<{
    id: string;
    proposal_id: string | null;
    setting_key: string;
    setting_name: string | null;
    recommended_value: string;
    current_value: string | null;
    reason: string | null;
    recommended_by: string;
    recommended_by_name: string | null;
    recommended_by_avatar: string | null;
    recommended_by_member_number: number | null;
    recommended_at: string;
    support_count: number;
    is_active: number | boolean;
    has_supported: string | null;
  }>;
  totalMembers: number;
}

const pct = (count: number, total: number) => (total > 0 ? Math.round((count / total) * 100) : 0);

/** Admin catalog + live values → what AdminSettingsTab renders. */
export function buildMergedAdminSettings(data: RawCommunitySettingsData | null): AdminSetting[] {
  const catalog = getAllSettings();
  if (!data) return catalog;

  const liveByKey = new Map(data.settings.map((s) => [s.setting_key, s]));
  const pendingByKey = new Map(
    data.proposals.filter((p) => p.status === "pending_approval").map((p) => [p.setting_key, p])
  );

  return catalog.map((setting) => {
    const live = liveByKey.get(setting.key);
    const pending = pendingByKey.get(setting.key);

    return {
      ...setting,
      currentValue: live?.setting_value ?? setting.currentValue,
      hasPendingChange: !!pending,
      approvalPercentage: pending
        ? pct(pending.approval_count, data.totalMembers)
        : setting.approvalPercentage,
      lastUpdated: live ? new Date(live.updated_at) : setting.lastUpdated,
    };
  });
}

/** Admin catalog + live values → member-facing "Active Settings" list. */
export function buildActiveCommunitySettings(data: RawCommunitySettingsData | null): ActiveCommunitySetting[] {
  const catalog = getAllSettings();
  if (!data) {
    return catalog.map((s) => ({
      settingKey: s.key,
      settingName: s.name,
      settingDescription: s.description,
      category: s.category,
      currentValue: s.currentValue,
      valueOptions: s.options.map((o) => o.value),
      approvalPercentage: s.approvalPercentage,
      lastUpdatedAt: s.lastUpdated,
      source: "default",
      hasPendingChange: s.hasPendingChange,
    }));
  }

  const liveByKey = new Map(data.settings.map((s) => [s.setting_key, s]));
  const pendingByKey = new Map(
    data.proposals.filter((p) => p.status === "pending_approval").map((p) => [p.setting_key, p])
  );
  // A recommendation currently controls the setting once it has crossed the
  // 60% support threshold — same rule the backend uses to auto-apply it.
  const overriddenKeys = new Set(
    data.recommendations
      .filter((r) => r.is_active && pct(r.support_count, data.totalMembers) >= 60)
      .map((r) => r.setting_key)
  );

  return catalog.map((setting) => {
    const live = liveByKey.get(setting.key);
    const pending = pendingByKey.get(setting.key);
    const isOverride = overriddenKeys.has(setting.key);

    return {
      settingKey: setting.key,
      settingName: setting.name,
      settingDescription: setting.description,
      category: setting.category,
      currentValue: live?.setting_value ?? setting.currentValue,
      valueOptions: setting.options.map((o) => o.value),
      approvalPercentage: pending ? pct(pending.approval_count, data.totalMembers) : setting.approvalPercentage,
      lastUpdatedAt: live ? new Date(live.updated_at) : setting.lastUpdated,
      source: isOverride ? "member_override" : live ? "admin" : "default",
      hasPendingChange: !!pending,
    };
  });
}

/** Live proposals → AdminSettingProposalCard-ready objects. */
export function buildAdminProposals(data: RawCommunitySettingsData | null): AdminSettingProposal[] {
  if (!data) return [];
  const catalog = getAllSettings();
  const catalogByKey = new Map(catalog.map((s) => [s.key, s]));
  const recommendedProposalIds = new Set(
    data.recommendations.filter((r) => r.proposal_id).map((r) => r.proposal_id as string)
  );

  return data.proposals.map((p) => {
    const catalogEntry = catalogByKey.get(p.setting_key);
    const approvalPercentage = pct(p.approval_count, data.totalMembers);
    const disapprovalPercentage = pct(p.disapproval_count, data.totalMembers);

    return {
      proposalId: p.id,
      settingKey: p.setting_key,
      settingName: p.setting_name || catalogEntry?.name || p.setting_key,
      settingDescription: p.setting_description || catalogEntry?.description || "",
      settingCategory: (p.setting_category || catalogEntry?.category || "general_settings") as CommunitySettingCategory,
      currentValue: p.current_value ?? "",
      proposedValue: p.proposed_value ?? "",
      valueOptions: catalogEntry?.options.map((o) => o.value),
      isNumericSetting: false,
      proposedBy: {
        id: p.proposed_by,
        name: p.proposed_by_name?.trim() || "Community Admin",
        role: p.proposed_by_role || "admin",
        avatar: p.proposed_by_avatar || undefined,
      },
      proposedAt: new Date(p.proposed_at),
      approvalCount: p.approval_count,
      disapprovalCount: p.disapproval_count,
      totalVotes: p.approval_count + p.disapproval_count,
      totalValidMembers: data.totalMembers,
      approvalPercentage,
      disapprovalPercentage,
      status: p.status as DemocraticSettingStatus,
      expiresAt: p.expires_at ? new Date(p.expires_at) : new Date(),
      memberVote: p.my_vote ?? null,
      hasRecommendation: recommendedProposalIds.has(p.id),
    };
  });
}

/** Live recommendations → MemberRecommendationsList-ready objects. */
export function buildMemberRecommendations(data: RawCommunitySettingsData | null): MemberRecommendation[] {
  if (!data) return [];

  return data.recommendations.map((r) => ({
    recommendationId: r.id,
    settingKey: r.setting_key,
    settingName: r.setting_name || r.setting_key,
    proposalId: r.proposal_id ?? undefined,
    recommendedValue: r.recommended_value,
    currentValue: r.current_value ?? "",
    reason: r.reason ?? undefined,
    recommendedBy: {
      id: r.recommended_by,
      name: r.recommended_by_name?.trim() || "Member",
      memberNumber: r.recommended_by_member_number ? `#${r.recommended_by_member_number}` : r.recommended_by.slice(0, 8),
      avatar: r.recommended_by_avatar || undefined,
    },
    recommendedAt: new Date(r.recommended_at),
    supportCount: r.support_count,
    totalValidMembers: data.totalMembers,
    supportPercentage: pct(r.support_count, data.totalMembers),
    isActive: !!r.is_active,
    hasSupported: !!r.has_supported,
  }));
}

export function groupSettingsByCategory(
  settings: ActiveCommunitySetting[]
): Record<string, ActiveCommunitySetting[]> {
  return settings.reduce((acc, setting) => {
    if (!acc[setting.category]) acc[setting.category] = [];
    acc[setting.category].push(setting);
    return acc;
  }, {} as Record<string, ActiveCommunitySetting[]>);
}

export function computeSettingsStats(data: RawCommunitySettingsData | null) {
  const catalog = getAllSettings();
  const pendingApprovals = data ? data.proposals.filter((p) => p.status === "pending_approval").length : 0;
  const memberRecommendations = data ? data.recommendations.filter((r) => r.is_active).length : 0;
  const approved = catalog.filter((s) => s.approvalPercentage >= 60).length;
  const needsReview = catalog.length - approved;

  return {
    total: catalog.length,
    pending: pendingApprovals,
    approved,
    needsReview,
    totalSettings: catalog.length,
    pendingApprovals,
    memberRecommendations,
  };
}
