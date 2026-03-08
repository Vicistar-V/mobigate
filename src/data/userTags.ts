// ─── User/Merchant Tag System ───
// Tags are NEVER permanently deleted. They auto-hide after 12 months of no new offences,
// can be manually hidden by admin, and reappear (with full history) on new offences.

export type TagType = "penalised" | "reported";
export type PenaltySubType = "warning" | "suspended" | "banned" | "deactivated";

export interface TagEntry {
  id: string;
  date: string;
  description: string;
  by: string;
  penaltySubType?: PenaltySubType;
  duration?: string; // e.g. "30 Days", "6 Months"
}

export interface UserTag {
  userId: string;
  type: TagType;
  count: number;
  entries: TagEntry[];
  manuallyHidden: boolean;
  lastOffenceDate: string;
}

// Duration progression mapping: nth offence → default duration value
const DURATION_PROGRESSION: { value: string; label: string }[] = [
  { value: "30d", label: "30 Days" },
  { value: "60d", label: "60 Days" },
  { value: "90d", label: "90 Days" },
  { value: "120d", label: "120 Days" },
  { value: "6m", label: "6 Months" },
  { value: "12m", label: "12 Months" },
  { value: "18m", label: "18 Months" },
  { value: "24m", label: "24 Months" },
];

/** Get the default duration for the nth suspension or ban (1-indexed). */
export function getDefaultDurationForNth(n: number): string {
  const idx = Math.min(n - 1, DURATION_PROGRESSION.length - 1);
  return DURATION_PROGRESSION[Math.max(0, idx)].value;
}

/** Count how many times a user has been suspended. */
export function getSuspensionCount(userId: string): number {
  const tag = tagsStore.find((t) => t.userId === userId && t.type === "penalised");
  if (!tag) return 0;
  return tag.entries.filter((e) => e.penaltySubType === "suspended").length;
}

/** Count how many times a user has been banned. */
export function getBanCount(userId: string): number {
  const tag = tagsStore.find((t) => t.userId === userId && t.type === "penalised");
  if (!tag) return 0;
  return tag.entries.filter((e) => e.penaltySubType === "banned").length;
}

/** Get penalty breakdown for display: grouped by sub-type with details. */
export function getPenaltyBreakdown(userId: string): { subType: PenaltySubType; entries: TagEntry[] }[] {
  const tag = tagsStore.find((t) => t.userId === userId && t.type === "penalised");
  if (!tag) return [];
  
  const groups: Record<string, TagEntry[]> = {};
  for (const entry of tag.entries) {
    const st = entry.penaltySubType || "warning";
    if (!groups[st]) groups[st] = [];
    groups[st].push(entry);
  }
  
  const order: PenaltySubType[] = ["warning", "suspended", "banned", "deactivated"];
  return order
    .filter((st) => groups[st]?.length)
    .map((st) => ({ subType: st, entries: groups[st] }));
}

// ─── Mock data ───
const mockTags: UserTag[] = [
  {
    userId: "m1", type: "reported", count: 10,
    manuallyHidden: false, lastOffenceDate: "2026-03-02",
    entries: [
      { id: "r1", date: "2025-06-10", description: "Scam report — fake product delivery", by: "Aisha Bello" },
      { id: "r2", date: "2025-07-22", description: "Fraud report — double-charged customer", by: "Chinedu Obi" },
      { id: "r3", date: "2025-08-15", description: "Deception — counterfeit items sold as original", by: "Fatima Yusuf" },
      { id: "r4", date: "2025-09-05", description: "Scam — non-delivery after payment", by: "Anonymous" },
      { id: "r5", date: "2025-10-12", description: "Fraud — fake tracking numbers provided", by: "David Eze" },
      { id: "r6", date: "2025-11-20", description: "Deception — misleading product photos", by: "Anonymous" },
      { id: "r7", date: "2025-12-03", description: "Harassment — threatened customer who complained", by: "Grace Nweke" },
      { id: "r8", date: "2026-01-14", description: "Scam — bait-and-switch pricing", by: "Ibrahim Musa" },
      { id: "r9", date: "2026-02-08", description: "Fraud — unauthorized card charges", by: "Adebayo Johnson" },
      { id: "r10", date: "2026-03-02", description: "Scam — counterfeit Samsung Galaxy sold", by: "Ibrahim Musa" },
    ],
  },
  {
    userId: "m1", type: "penalised", count: 12,
    manuallyHidden: false, lastOffenceDate: "2026-02-28",
    entries: [
      { id: "p1", date: "2024-03-15", description: "Official warning — first complaint", by: "Admin Chidi", penaltySubType: "warning" },
      { id: "p2", date: "2024-05-20", description: "Official warning — repeated complaints", by: "Admin Funke", penaltySubType: "warning" },
      { id: "p3", date: "2024-07-10", description: "Suspended for 30 Days — fraud pattern", by: "Admin Chidi", penaltySubType: "suspended", duration: "30 Days" },
      { id: "p4", date: "2024-09-25", description: "Official warning — misleading ads", by: "Admin Funke", penaltySubType: "warning" },
      { id: "p5", date: "2024-11-30", description: "Suspended for 60 Days — counterfeit goods", by: "Admin Chidi", penaltySubType: "suspended", duration: "60 Days" },
      { id: "p6", date: "2025-02-14", description: "Official warning — customer harassment", by: "Admin Funke", penaltySubType: "warning" },
      { id: "p7", date: "2025-04-20", description: "Suspended for 90 Days — repeat fraud", by: "Admin Chidi", penaltySubType: "suspended", duration: "90 Days" },
      { id: "p8", date: "2025-07-15", description: "Official warning — false advertising", by: "Admin Funke", penaltySubType: "warning" },
      { id: "p9", date: "2025-09-10", description: "Suspended for 120 Days — non-delivery", by: "Admin Chidi", penaltySubType: "suspended", duration: "120 Days" },
      { id: "p10", date: "2025-11-05", description: "Official warning — pricing manipulation", by: "Admin Funke", penaltySubType: "warning" },
      { id: "p11", date: "2026-01-20", description: "Suspended for 6 Months — bait-and-switch", by: "Admin Chidi", penaltySubType: "suspended", duration: "6 Months" },
      { id: "p12", date: "2026-02-28", description: "Suspended for 12 Months — counterfeit devices", by: "Admin Chidi", penaltySubType: "suspended", duration: "12 Months" },
    ],
  },
  {
    userId: "m2", type: "reported", count: 4,
    manuallyHidden: false, lastOffenceDate: "2026-03-03",
    entries: [
      { id: "r11", date: "2025-11-15", description: "Deception — selling regular produce as organic", by: "Anonymous" },
      { id: "r12", date: "2025-12-20", description: "Falsehood — misleading product labels", by: "Kemi Ade" },
      { id: "r13", date: "2026-02-27", description: "Deception — premium prices for regular items", by: "Anonymous" },
      { id: "r14", date: "2026-03-03", description: "Nuisance — loud music beyond licensed hours", by: "Anonymous" },
    ],
  },
  {
    userId: "m2", type: "penalised", count: 2,
    manuallyHidden: false, lastOffenceDate: "2026-01-10",
    entries: [
      { id: "p13", date: "2025-12-01", description: "Official warning — deceptive labelling", by: "Admin Funke", penaltySubType: "warning" },
      { id: "p14", date: "2026-01-10", description: "Suspended for 30 Days — repeat deception", by: "Admin Chidi", penaltySubType: "suspended", duration: "30 Days" },
    ],
  },
  {
    userId: "m3", type: "reported", count: 3,
    manuallyHidden: false, lastOffenceDate: "2026-02-28",
    entries: [
      { id: "r15", date: "2025-10-05", description: "Harassment — verbal abuse towards customer", by: "Ngozi Obi" },
      { id: "r16", date: "2026-01-18", description: "Bullying — intimidating customers", by: "Emeka Nwa" },
      { id: "r17", date: "2026-02-28", description: "Threat — physical harm threat over return dispute", by: "Chioma Eze" },
    ],
  },
  {
    userId: "m4", type: "reported", count: 2,
    manuallyHidden: false, lastOffenceDate: "2026-02-20",
    entries: [
      { id: "r18", date: "2025-12-10", description: "Assault — staff pushed customer during dispute", by: "Anonymous" },
      { id: "r19", date: "2026-02-20", description: "Assault — physical altercation with customer", by: "Ngozi Okafor" },
    ],
  },
  {
    userId: "m4", type: "penalised", count: 1,
    manuallyHidden: false, lastOffenceDate: "2026-02-25",
    entries: [
      { id: "p15", date: "2026-02-25", description: "Official warning — staff suspended, ₦15k credit issued", by: "Admin Funke", penaltySubType: "warning" },
    ],
  },
  {
    userId: "m8", type: "reported", count: 5,
    manuallyHidden: false, lastOffenceDate: "2026-02-10",
    entries: [
      { id: "r20", date: "2025-08-20", description: "Scam — voucher fraud scheme", by: "Anonymous" },
      { id: "r21", date: "2025-10-15", description: "Fraud — bulk voucher non-delivery", by: "John Doe" },
      { id: "r22", date: "2025-12-05", description: "Scam — payment collected, no delivery", by: "Mary Ada" },
      { id: "r23", date: "2026-01-22", description: "Fraud — identical scam pattern reported", by: "Peter Obi" },
      { id: "r24", date: "2026-02-10", description: "Scam — bulk voucher fraud over 3 weeks", by: "Emeka Nwosu" },
    ],
  },
  {
    userId: "m8", type: "penalised", count: 3,
    manuallyHidden: false, lastOffenceDate: "2026-02-28",
    entries: [
      { id: "p16", date: "2025-09-01", description: "Official warning — first fraud complaint", by: "Admin Chidi", penaltySubType: "warning" },
      { id: "p17", date: "2025-11-15", description: "Suspended for 60 Days — repeat fraud", by: "Admin Funke", penaltySubType: "suspended", duration: "60 Days" },
      { id: "p18", date: "2026-02-28", description: "Suspended for 90 Days — confirmed fraud pattern", by: "Admin Chidi", penaltySubType: "suspended", duration: "90 Days" },
    ],
  },
  // User with manually hidden tags (old offences, >12 months ago with no new ones)
  {
    userId: "m5", type: "reported", count: 1,
    manuallyHidden: true, lastOffenceDate: "2025-02-15",
    entries: [
      { id: "r25", date: "2025-02-15", description: "Social abuse — posted personal info online", by: "Emeka Nwankwo" },
    ],
  },
  // Current user mock tags
  {
    userId: "current", type: "reported", count: 2,
    manuallyHidden: false, lastOffenceDate: "2026-01-15",
    entries: [
      { id: "r26", date: "2025-08-20", description: "Inappropriate content posted in community", by: "Anonymous" },
      { id: "r27", date: "2026-01-15", description: "Spam messages to multiple users", by: "Community Mod" },
    ],
  },
];

// In-memory store (simulates persistence)
let tagsStore = [...mockTags];

function monthsSince(dateStr: string): number {
  const d = new Date(dateStr);
  const now = new Date("2026-03-06"); // Current date
  return (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth());
}

/** Get visible tags for a userId. Auto-hidden if >12 months since last offence. */
export function getVisibleTags(userId: string): UserTag[] {
  return tagsStore.filter(
    (t) => t.userId === userId && !t.manuallyHidden && monthsSince(t.lastOffenceDate) < 12
  );
}

/** Get ALL tags for a userId (including hidden — for admin history view). */
export function getAllTags(userId: string): UserTag[] {
  return tagsStore.filter((t) => t.userId === userId);
}

/** Admin manually hides a tag. */
export function hideTag(userId: string, type: TagType): void {
  tagsStore = tagsStore.map((t) =>
    t.userId === userId && t.type === type ? { ...t, manuallyHidden: true } : t
  );
}

/** Admin manually unhides a tag. */
export function unhideTag(userId: string, type: TagType): void {
  tagsStore = tagsStore.map((t) =>
    t.userId === userId && t.type === type ? { ...t, manuallyHidden: false } : t
  );
}

/** Add a new offence — unhides everything and adds entry. */
export function addOffence(userId: string, type: TagType, description: string, by: string, penaltySubType?: PenaltySubType, duration?: string): void {
  const now = new Date().toISOString().split("T")[0];
  const existing = tagsStore.find((t) => t.userId === userId && t.type === type);
  if (existing) {
    existing.count += 1;
    existing.manuallyHidden = false; // Force reappear
    existing.lastOffenceDate = now;
    existing.entries.push({ id: `auto-${Date.now()}`, date: now, description, by, penaltySubType, duration });
  } else {
    tagsStore.push({
      userId, type, count: 1, manuallyHidden: false, lastOffenceDate: now,
      entries: [{ id: `auto-${Date.now()}`, date: now, description, by, penaltySubType, duration }],
    });
  }
}

/** Check if a tag is hidden (either manually or auto-expired). */
export function isTagHidden(userId: string, type: TagType): boolean {
  const tag = tagsStore.find((t) => t.userId === userId && t.type === type);
  if (!tag) return true;
  return tag.manuallyHidden || monthsSince(tag.lastOffenceDate) >= 12;
}
