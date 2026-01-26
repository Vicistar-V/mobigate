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
 * Mobigate platform nomination configuration
 * Only accessible to Mobigate Admin
 */
export const mobigateNominationConfig = {
  serviceChargePercent: 20, // 15-30% range
  minimumServiceChargePercent: 15,
  maximumServiceChargePercent: 30,
  lastUpdatedAt: new Date("2025-01-01"),
  lastUpdatedBy: "Mobigate Admin",
};

/**
 * Calculate total nomination cost including service charge
 */
export function calculateTotalNominationCost(officeId: string): {
  nominationFee: number;
  processingFee: number;
  serviceCharge: number;
  totalDebited: number;
  communityReceives: number;
  mobigateReceives: number;
} | null {
  const fee = getNominationFee(officeId);
  if (!fee) return null;
  
  const serviceCharge = fee.feeInMobi * (mobigateNominationConfig.serviceChargePercent / 100);
  
  return {
    nominationFee: fee.feeInMobi,
    processingFee: fee.processingFee,
    serviceCharge,
    totalDebited: fee.feeInMobi + fee.processingFee + serviceCharge,
    communityReceives: fee.feeInMobi + fee.processingFee,
    mobigateReceives: serviceCharge,
  };
}
