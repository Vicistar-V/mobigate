// Nomination Fees Data - Office-specific nomination fees

import { NominationFeeStructure, DeclarationOfInterest, NominationPeriodConfig, CandidateDashboard } from "@/types/nominationProcess";

/**
 * Office-specific nomination fees
 * All fees in Mobi (M) with 1:1 NGN rate
 */
export const nominationFeeStructures: NominationFeeStructure[] = [
  {
    officeId: "president",
    officeName: "President General",
    officeDescription: "Chief executive officer of the community. Presides over all meetings and represents the community externally.",
    feeInMobi: 50000,
    processingFee: 2500,
    totalFee: 52500,
    category: "executive",
    requiresPrimary: true,
    maxCandidates: 20,
  },
  {
    officeId: "vice_president",
    officeName: "Vice President",
    officeDescription: "Deputy to the President. Acts in the President's absence and oversees special projects.",
    feeInMobi: 40000,
    processingFee: 2000,
    totalFee: 42000,
    category: "executive",
    requiresPrimary: true,
    maxCandidates: 20,
  },
  {
    officeId: "secretary",
    officeName: "Secretary General",
    officeDescription: "Chief administrative officer. Manages records, correspondence, and meeting documentation.",
    feeInMobi: 30000,
    processingFee: 1500,
    totalFee: 31500,
    category: "executive",
    requiresPrimary: true,
    maxCandidates: 20,
  },
  {
    officeId: "assistant_secretary",
    officeName: "Assistant Secretary",
    officeDescription: "Supports the Secretary General in administrative duties and record keeping.",
    feeInMobi: 20000,
    processingFee: 1000,
    totalFee: 21000,
    category: "administrative",
  },
  {
    officeId: "treasurer",
    officeName: "Treasurer",
    officeDescription: "Chief financial officer. Manages community funds, investments, and financial reporting.",
    feeInMobi: 35000,
    processingFee: 1750,
    totalFee: 36750,
    category: "executive",
    requiresPrimary: true,
    maxCandidates: 20,
  },
  {
    officeId: "financial_secretary",
    officeName: "Financial Secretary",
    officeDescription: "Manages dues collection, payment records, and financial member engagement.",
    feeInMobi: 25000,
    processingFee: 1250,
    totalFee: 26250,
    category: "administrative",
  },
  {
    officeId: "publicity_secretary",
    officeName: "Publicity Secretary (PRO)",
    officeDescription: "Public relations officer. Manages community communications and media relations.",
    feeInMobi: 20000,
    processingFee: 1000,
    totalFee: 21000,
    category: "administrative",
  },
  {
    officeId: "director_socials",
    officeName: "Director of Socials",
    officeDescription: "Plans and coordinates community events, celebrations, and social activities.",
    feeInMobi: 18000,
    processingFee: 900,
    totalFee: 18900,
    category: "administrative",
  },
  {
    officeId: "welfare_officer",
    officeName: "Welfare Officer",
    officeDescription: "Coordinates member welfare programs, support systems, and assistance initiatives.",
    feeInMobi: 15000,
    processingFee: 750,
    totalFee: 15750,
    category: "support",
  },
  {
    officeId: "legal_adviser",
    officeName: "Legal Adviser",
    officeDescription: "Provides legal guidance, reviews documents, and ensures compliance with regulations.",
    feeInMobi: 25000,
    processingFee: 1250,
    totalFee: 26250,
    category: "executive",
  },
  {
    officeId: "provost",
    officeName: "Provost",
    officeDescription: "Maintains order during meetings and community events. Enforces community rules.",
    feeInMobi: 12000,
    processingFee: 600,
    totalFee: 12600,
    category: "support",
  },
  {
    officeId: "auditor",
    officeName: "Internal Auditor",
    officeDescription: "Reviews financial records and ensures transparency in community finances.",
    feeInMobi: 15000,
    processingFee: 750,
    totalFee: 15750,
    category: "administrative",
  },
];

/**
 * Get fee structure for a specific office
 */
export function getNominationFee(officeId: string): NominationFeeStructure | undefined {
  return nominationFeeStructures.find(f => f.officeId === officeId);
}

/**
 * Get all executive positions
 */
export function getExecutivePositions(): NominationFeeStructure[] {
  return nominationFeeStructures.filter(f => f.category === "executive");
}

/**
 * Mock active nomination period
 */
export const mockNominationPeriod: NominationPeriodConfig = {
  id: "nom-2025-001",
  electionId: "elec-2025",
  electionName: "2025 Community Leadership Elections",
  openDate: new Date("2025-01-15"),
  closeDate: new Date("2025-02-15"),
  status: "open",
  totalDeclarations: 47,
  officesAvailable: nominationFeeStructures.map(f => f.officeId),
  primaryThreshold: 20,
};

/**
 * Mock declarations for display
 */
export const mockDeclarations: DeclarationOfInterest[] = [
  {
    id: "decl-001",
    memberId: "mem-001",
    memberName: "Chief Adebayo Okonkwo",
    memberAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
    officeId: "president",
    officeName: "President General",
    declarationDate: new Date("2025-01-18"),
    feeAmount: 50000,
    processingFee: 2500,
    totalFeesPaid: 52500,
    paymentStatus: "paid",
    paymentTransactionId: "TXN-PG5X2K-ABC1",
    paymentDate: new Date("2025-01-18"),
    campaignTriggered: true,
    campaignId: "camp-001",
    status: "active",
    clearanceStatus: "cleared",
    clearanceDate: new Date("2025-01-20"),
    clearanceOfficer: "Electoral Committee",
  },
  {
    id: "decl-002",
    memberId: "mem-002",
    memberName: "Dr. Amina Bello",
    memberAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
    officeId: "vice_president",
    officeName: "Vice President",
    declarationDate: new Date("2025-01-19"),
    feeAmount: 40000,
    processingFee: 2000,
    totalFeesPaid: 42000,
    paymentStatus: "paid",
    paymentTransactionId: "TXN-VP3Y7M-DEF2",
    paymentDate: new Date("2025-01-19"),
    campaignTriggered: true,
    campaignId: "camp-002",
    status: "active",
    clearanceStatus: "cleared",
    clearanceDate: new Date("2025-01-21"),
    clearanceOfficer: "Electoral Committee",
  },
  {
    id: "decl-003",
    memberId: "mem-003",
    memberName: "Barr. Samuel Okoro",
    memberAvatar: "https://randomuser.me/api/portraits/men/45.jpg",
    officeId: "president",
    officeName: "President General",
    declarationDate: new Date("2025-01-20"),
    feeAmount: 50000,
    processingFee: 2500,
    totalFeesPaid: 0,
    paymentStatus: "pending",
    campaignTriggered: false,
    status: "pending_payment",
    clearanceStatus: "pending",
  },
];

/**
 * Mock candidate dashboard for current user
 */
export const mockCandidateDashboard: CandidateDashboard = {
  declaration: mockDeclarations[0],
  campaignStatus: "active",
  campaignId: "camp-001",
  canCreateCampaign: true,
  receipts: [
    {
      id: "rcpt-001",
      type: "nomination_fee",
      amount: 52500,
      date: new Date("2025-01-18"),
      reference: "TXN-PG5X2K-ABC1",
      description: "Declaration of Interest - President General",
    },
    {
      id: "rcpt-002",
      type: "campaign_fee",
      amount: 4250,
      date: new Date("2025-01-25"),
      reference: "TXN-CAMP-GH7J",
      description: "Campaign Fee - 21 Days, Multi-audience",
    },
  ],
  analytics: {
    totalViews: 1247,
    totalClicks: 389,
    feedbackCount: 28,
    engagementRate: 31.2,
    lastUpdated: new Date(),
  },
};

/**
 * Get declarations count by office
 */
export function getDeclarationsCountByOffice(officeId: string): number {
  return mockDeclarations.filter(d => d.officeId === officeId && d.status === "active").length;
}

/**
 * Check if primary election is required for an office
 */
export function isPrimaryRequired(officeId: string): boolean {
  const count = getDeclarationsCountByOffice(officeId);
  const feeStructure = getNominationFee(officeId);
  
  if (!feeStructure) return false;
  
  return feeStructure.requiresPrimary && count > (feeStructure.maxCandidates || 20);
}

/**
 * Mobiface platform nomination configuration
 * Only accessible to Mobiface Admin
 *
 * Community Override Policy controls whether communities can deviate from the
 * system-wide minimum nomination fees:
 *  - "enforce_minimum"  — community fee must be ≥ system minimum (default)
 *  - "allow_below"      — community fee may go BELOW the system minimum
 *  - "free_for_all"     — community sets any fee; system value is suggestion only
 */
export type CommunityFeePolicy = "enforce_minimum" | "allow_below" | "free_for_all";

export const mobifaceNominationConfig = {
  serviceChargePercent: 20, // 15-30% range
  minimumServiceChargePercent: 15,
  maximumServiceChargePercent: 30,
  /** How much room communities have over their own nomination fees. */
  communityFeePolicy: "enforce_minimum" as CommunityFeePolicy,
  /** Absolute floor for any nomination fee — applies even under "allow_below". */
  absoluteMinimumFee: 1000,
  lastUpdatedAt: new Date("2025-01-01"),
  lastUpdatedBy: "Mobiface Admin",
};

/**
 * Per-community per-office fee overrides.
 * Shape: { [communityId]: { [officeId]: feeInMobi } }
 * Mock data — in production this would be persisted in the community's settings.
 */
export const communityNominationFeeOverrides: Record<string, Record<string, number>> = {
  "comm-lagos-devs": {
    president: 75000,         // raised above system minimum (50k)
    vice_president: 60000,
    treasurer: 50000,
  },
  "comm-abuja-pros": {
    president: 30000,         // BELOW system minimum (only valid under allow_below/free_for_all)
    welfare_officer: 8000,
  },
};

/** Get the system-mandated MINIMUM fee for an office. */
export function getMinimumNominationFee(officeId: string): number {
  return getNominationFee(officeId)?.feeInMobi ?? 0;
}

/** Get the EFFECTIVE fee a candidate will be charged in a given community. */
export function getEffectiveNominationFee(officeId: string, communityId?: string): number {
  const systemMin = getMinimumNominationFee(officeId);
  if (!communityId) return systemMin;
  const override = communityNominationFeeOverrides[communityId]?.[officeId];
  if (override === undefined) return systemMin;

  const policy = mobifaceNominationConfig.communityFeePolicy;
  if (policy === "free_for_all") {
    return Math.max(override, mobifaceNominationConfig.absoluteMinimumFee);
  }
  if (policy === "allow_below") {
    return Math.max(override, mobifaceNominationConfig.absoluteMinimumFee);
  }
  // enforce_minimum
  return Math.max(override, systemMin);
}

/** Update / set a community's per-office nomination fee. */
export function setCommunityNominationFee(communityId: string, officeId: string, fee: number) {
  if (!communityNominationFeeOverrides[communityId]) {
    communityNominationFeeOverrides[communityId] = {};
  }
  communityNominationFeeOverrides[communityId][officeId] = fee;
}

/**
 * Validate a community's proposed fee against the current policy.
 * Returns null on OK, or an error message string.
 */
export function validateCommunityNominationFee(officeId: string, fee: number): string | null {
  if (fee < mobifaceNominationConfig.absoluteMinimumFee) {
    return `Fee cannot be below the absolute floor of M${mobifaceNominationConfig.absoluteMinimumFee.toLocaleString()}.`;
  }
  const policy = mobifaceNominationConfig.communityFeePolicy;
  if (policy === "enforce_minimum") {
    const min = getMinimumNominationFee(officeId);
    if (fee < min) return `System policy: this office requires at least M${min.toLocaleString()}.`;
  }
  return null;
}

/**
 * Calculate total nomination cost.
 *
 * NOTE: "Service Charge" and "Processing Fee" are the SAME single charge — a
 * unified Service Charge / Processing Fee computed as a single percentage of
 * the nomination fee. It is debited from BOTH the Community Wallet AND the
 * Candidate's Wallet (each pays the charge once).
 *
 * Pass `communityId` to apply that community's per-office fee override
 * (subject to the active CommunityFeePolicy).
 */
export function calculateTotalNominationCost(officeId: string, communityId?: string): {
  nominationFee: number;
  /** Unified Service Charge / Processing Fee (single value). */
  serviceCharge: number;
  /** Kept for backwards-compatible callers — equals serviceCharge. */
  processingFee: number;
  totalDebited: number;
  /** What the candidate's wallet is debited: nomination fee + service charge. */
  candidateDebited: number;
  /** What the community wallet is debited: service charge only. */
  communityDebited: number;
  /** Net community receives: nomination fee − community-side service charge. */
  communityReceives: number;
  /** Mobiface receives both sides of the service charge. */
  mobifaceReceives: number;
  /** True if the community has overridden the system minimum for this office. */
  isCommunityOverride: boolean;
  /** The system-mandated minimum, for transparency. */
  systemMinimum: number;
} {
  const systemMinimum = getMinimumNominationFee(officeId);
  const base = getEffectiveNominationFee(officeId, communityId);
  const isCommunityOverride =
    !!communityId && communityNominationFeeOverrides[communityId]?.[officeId] !== undefined;

  const serviceCharge = base * (mobifaceNominationConfig.serviceChargePercent / 100);

  const candidateDebited = base + serviceCharge;
  const communityDebited = serviceCharge;

  return {
    nominationFee: base,
    serviceCharge,
    processingFee: serviceCharge, // alias — same charge
    totalDebited: candidateDebited + communityDebited,
    candidateDebited,
    communityDebited,
    communityReceives: base - communityDebited,
    mobifaceReceives: serviceCharge * 2, // collected from both wallets
    isCommunityOverride,
    systemMinimum,
  };
}


