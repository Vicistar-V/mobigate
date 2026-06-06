// Sundry tool service charges
// ----------------------------
// Every interactive "sundry" tool on a post/banner (Like, Comment, Share,
// Follow, Gift, Report) attracts a small Service Charge that is set/edited by
// the platform Admins. The frontend reads these rates from the PHP-injected
// global `window.__SUNDRY_CHARGES__` when available, then falls back to an
// admin-editable localStorage override, and finally to sensible defaults.
//
// Mobi is the platform currency (1 Mobi = 1 NGN base rate).

export type SundryAction =
  | "like"
  | "comment"
  | "share"
  | "follow"
  | "gift"
  | "report";

export interface SundryChargeMap {
  like: number;
  comment: number;
  share: number;
  follow: number;
  gift: number;
  report: number;
}

// Platform defaults (in Mobi) — used until Admins configure their own rates.
export const DEFAULT_SUNDRY_CHARGES: SundryChargeMap = {
  like: 5,
  comment: 10,
  share: 15,
  follow: 20,
  gift: 0, // gift charge is the gift's own value, handled in the gift flow
  report: 25,
};

const STORAGE_KEY = "mobiface.sundryCharges.v1";

declare global {
  interface Window {
    __SUNDRY_CHARGES__?: Partial<SundryChargeMap>;
  }
}

/** Read the full charge map, merging defaults < PHP globals < local override. */
export function getSundryCharges(): SundryChargeMap {
  let merged: SundryChargeMap = { ...DEFAULT_SUNDRY_CHARGES };

  if (typeof window !== "undefined" && window.__SUNDRY_CHARGES__) {
    merged = { ...merged, ...window.__SUNDRY_CHARGES__ };
  }

  try {
    const raw =
      typeof localStorage !== "undefined"
        ? localStorage.getItem(STORAGE_KEY)
        : null;
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<SundryChargeMap>;
      merged = { ...merged, ...parsed };
    }
  } catch {
    /* ignore malformed storage */
  }

  return merged;
}

/** Charge (in Mobi) for a single action. */
export function getSundryCharge(action: SundryAction): number {
  return getSundryCharges()[action] ?? 0;
}

/** Admin helper — persist an updated charge map locally. */
export function saveSundryCharges(next: Partial<SundryChargeMap>): void {
  try {
    const current = getSundryCharges();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...next }));
    window.dispatchEvent(new CustomEvent("sundry-charges-changed"));
  } catch {
    /* ignore */
  }
}

export const SUNDRY_LABELS: Record<SundryAction, string> = {
  like: "Like",
  comment: "Comment",
  share: "Share",
  follow: "Follow",
  gift: "Gift",
  report: "Report",
};
