/**
 * Monetization Policy — admin-configurable thresholds & fees
 * ──────────────────────────────────────────────────────────
 * Governs:
 *  1. Who can publish Monetized Posts (eligibility gating)
 *  2. Friend-add / Friend-request fee tiers (charged on user's Mobi Wallet)
 *  3. Maximum friendship & followership caps
 *  4. Per-type fees for NON-MONETIZED posts (company revenue, no creator share)
 *
 * All numeric fields are tunable by Mobigate Admin within the provided
 * (Min ↔ Max) ranges. UI surfaces should use the getters/helpers so admin
 * edits flow through automatically.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1.  ELIGIBILITY THRESHOLDS for MONETIZED POSTS
// ─────────────────────────────────────────────────────────────────────────────
export interface PostMonetizationEligibilitySettings {
  minFriends: number;
  minFriendsRange: [number, number];

  minFollowers: number;
  minFollowersRange: [number, number];

  minFollowing: number;          // users this user is following
  minFollowingRange: [number, number];

  requireVerifiedAccount: boolean;

  lastUpdatedAt: Date;
  lastUpdatedBy: string;
}

export const postMonetizationEligibilitySettings: PostMonetizationEligibilitySettings = {
  minFriends:      1000,
  minFriendsRange: [500, 5000],

  minFollowers:      100,
  minFollowersRange: [50, 1000],

  minFollowing:      100,
  minFollowingRange: [50, 1000],

  requireVerifiedAccount: true,

  lastUpdatedAt: new Date(),
  lastUpdatedBy: "Mobigate Admin",
};

export interface MonetizationProfileSnapshot {
  friendsCount:   number;
  followersCount: number;
  followingCount: number;
  verified:       boolean;
}

export interface MonetizationEligibilityCheck {
  eligible: boolean;
  requirements: Array<{
    id: "friends" | "followers" | "following" | "verified";
    label: string;
    current: number | boolean;
    required: number | boolean;
    met: boolean;
    /** Progress 0-100 (only meaningful for numeric reqs) */
    progressPct: number;
    /** Friendly remaining-distance string, e.g. "830 to go". */
    remainingHint?: string;
  }>;
  unmetCount: number;
}

export function checkPostMonetizationEligibility(
  p: MonetizationProfileSnapshot,
): MonetizationEligibilityCheck {
  const s = postMonetizationEligibilitySettings;

  const numericReq = (
    id: "friends" | "followers" | "following",
    label: string,
    current: number,
    required: number,
  ) => {
    const met = current >= required;
    const progressPct = required > 0 ? Math.min(100, Math.round((current / required) * 100)) : 100;
    const remaining = Math.max(0, required - current);
    return {
      id, label, current, required, met, progressPct,
      remainingHint: met ? "Met ✓" : `${remaining.toLocaleString()} to go`,
    };
  };

  const reqs: MonetizationEligibilityCheck["requirements"] = [
    numericReq("friends",   `${s.minFriends.toLocaleString()} Friends`,         p.friendsCount,   s.minFriends),
    numericReq("followers", `${s.minFollowers.toLocaleString()} Followers`,     p.followersCount, s.minFollowers),
    numericReq("following", `Following ${s.minFollowing.toLocaleString()} Users`, p.followingCount, s.minFollowing),
  ];

  if (s.requireVerifiedAccount) {
    reqs.push({
      id: "verified",
      label: "Verified Account",
      current: p.verified,
      required: true,
      met: !!p.verified,
      progressPct: p.verified ? 100 : 0,
      remainingHint: p.verified ? "Verified ✓" : "Get verified",
    });
  }

  const unmetCount = reqs.filter(r => !r.met).length;
  return { eligible: unmetCount === 0, requirements: reqs, unmetCount };
}

// ─────────────────────────────────────────────────────────────────────────────
// 2.  FRIEND-ADD / FRIEND-REQUEST FEE TIERS
//     (charged on User's Mobi Wallet when they add a friend or send a request)
// ─────────────────────────────────────────────────────────────────────────────
export interface FriendInteractionFeeTier {
  id:          string;
  label:       string;
  fromCount:   number;   // inclusive, 1-indexed (e.g. 1 means 1st interaction)
  toCount:     number;   // inclusive; Infinity = open-ended
  feeMobi:     number;   // current fee in Mobi
  feeRange:    [number, number];   // admin can set within this range
}

export interface FriendInteractionFeeSettings {
  tiers: FriendInteractionFeeTier[];
  lastUpdatedAt: Date;
  lastUpdatedBy: string;
}

export const friendInteractionFeeSettings: FriendInteractionFeeSettings = {
  tiers: [
    {
      id: "tier-free",
      label: "First 500 — Free",
      fromCount: 1,
      toCount: 500,
      feeMobi: 0,
      feeRange: [0, 0],   // always free
    },
    {
      id: "tier-2",
      label: "501 – 2,000",
      fromCount: 501,
      toCount: 2000,
      feeMobi: 2,
      feeRange: [1, 10],
    },
    {
      id: "tier-3",
      label: "2,001 – 5,000",
      fromCount: 2001,
      toCount: 5000,
      feeMobi: 5,
      feeRange: [5, 10],
    },
    {
      id: "tier-4",
      label: "5,001 +",
      fromCount: 5001,
      toCount: Infinity,
      feeMobi: 15,
      feeRange: [15, 25],
    },
  ],
  lastUpdatedAt: new Date(),
  lastUpdatedBy: "Mobigate Admin",
};

/**
 * Returns the Mobi fee that will be charged when the user performs the
 * (currentCount + 1)-th friend-add / friend-request interaction.
 */
export function getFriendInteractionFee(currentInteractionCount: number): {
  fee: number;
  tier: FriendInteractionFeeTier;
} {
  const nextIndex = currentInteractionCount + 1;
  const tier =
    friendInteractionFeeSettings.tiers.find(
      t => nextIndex >= t.fromCount && nextIndex <= t.toCount,
    ) ?? friendInteractionFeeSettings.tiers[friendInteractionFeeSettings.tiers.length - 1];
  return { fee: tier.feeMobi, tier };
}

export function setFriendInteractionFee(tierId: string, newFee: number): boolean {
  const t = friendInteractionFeeSettings.tiers.find(x => x.id === tierId);
  if (!t) return false;
  const [min, max] = t.feeRange;
  if (newFee < min || newFee > max) return false;
  t.feeMobi = newFee;
  friendInteractionFeeSettings.lastUpdatedAt = new Date();
  return true;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3.  MAXIMUM CAPS
// ─────────────────────────────────────────────────────────────────────────────
export interface FriendshipCapSettings {
  maxFriends:        number;   // 10,000
  maxFriendRequests: number;   //  5,000
  maxFollowing:      number;   //  5,000
  // Followers is intentionally unlimited.
}

export const friendshipCapSettings: FriendshipCapSettings = {
  maxFriends:        10000,
  maxFriendRequests: 5000,
  maxFollowing:      5000,
};

// ─────────────────────────────────────────────────────────────────────────────
// 4.  NON-MONETIZED POST FEES (per-type, company keeps 100%)
// ─────────────────────────────────────────────────────────────────────────────
export type NonMonetizedPostType =
  | "Video"
  | "Audio"
  | "Photo"
  | "Article"
  | "PDF"
  | "URL";

export interface NonMonetizedPostFeeSettings {
  fees: Record<NonMonetizedPostType, { feeMobi: number; feeRange: [number, number] }>;
  lastUpdatedAt: Date;
  lastUpdatedBy: string;
}

export const nonMonetizedPostFeeSettings: NonMonetizedPostFeeSettings = {
  fees: {
    Video:   { feeMobi: 5, feeRange: [1, 20] },
    Audio:   { feeMobi: 3, feeRange: [1, 15] },
    Photo:   { feeMobi: 1, feeRange: [1, 10] },
    Article: { feeMobi: 1, feeRange: [1, 10] },
    PDF:     { feeMobi: 1, feeRange: [1, 10] },
    URL:     { feeMobi: 1, feeRange: [1, 10] },
  },
  lastUpdatedAt: new Date(),
  lastUpdatedBy: "Mobigate Admin",
};

export function getNonMonetizedPostFee(type: NonMonetizedPostType | string): number {
  const entry = (nonMonetizedPostFeeSettings.fees as Record<string, { feeMobi: number }>)[type];
  return entry?.feeMobi ?? 1;
}
