// Nomination Process & Declaration of Interest Types

/**
 * Office positions available for nomination with fee structure
 */
export interface NominationFeeStructure {
  officeId: string;
  officeName: string;
  officeDescription: string;
  feeInMobi: number;
  processingFee: number;
  totalFee: number;
  category: 'executive' | 'administrative' | 'support';
  requiresPrimary?: boolean; // If >20 candidates declare
  maxCandidates?: number;
}

/**
 * Declaration of Interest record
 */
export interface DeclarationOfInterest {
  id: string;
  memberId: string;
  memberName: string;
  memberAvatar?: string;
  officeId: string;
  officeName: string;
  declarationDate: Date;
  feeAmount: number;
  processingFee: number;
  totalFeesPaid: number;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentTransactionId?: string;
  paymentDate?: Date;
  campaignTriggered: boolean;
  campaignId?: string;
  status: 'pending_payment' | 'active' | 'withdrawn' | 'disqualified' | 'cleared' | 'elected';
  disqualificationReason?: string;
  clearanceStatus: 'pending' | 'cleared' | 'rejected';
  clearanceDate?: Date;
  clearanceOfficer?: string;
}

/**
 * Nomination period configuration
 */
export interface NominationPeriodConfig {
  id: string;
  electionId: string;
  electionName: string;
  openDate: Date;
  closeDate: Date;
  status: 'upcoming' | 'open' | 'closed';
  totalDeclarations: number;
  officesAvailable: string[];
  primaryThreshold: number; // Default: 20 candidates triggers primary
}

/**
 * Primary election configuration (triggered when >20 candidates)
 */
export interface PrimaryElectionConfig {
  officeId: string;
  officeName: string;
  totalCandidates: number;
  advancementSlots: number; // Default: 4 advance to main election
  primaryDate?: Date;
  status: 'not_required' | 'scheduled' | 'ongoing' | 'completed';
}

/**
 * Candidate dashboard data
 */
export interface CandidateDashboard {
  declaration: DeclarationOfInterest;
  campaignStatus: 'not_created' | 'draft' | 'pending_payment' | 'active' | 'ended';
  campaignId?: string;
  canCreateCampaign: boolean; // True after successful declaration payment
  receipts: CandidateReceipt[];
  analytics?: CandidateAnalytics;
}

/**
 * Receipt for candidate fees
 */
export interface CandidateReceipt {
  id: string;
  type: 'nomination_fee' | 'campaign_fee' | 'processing_fee';
  amount: number;
  date: Date;
  reference: string;
  description: string;
}

/**
 * Campaign analytics for candidate dashboard
 */
export interface CandidateAnalytics {
  totalViews: number;
  totalClicks: number;
  feedbackCount: number;
  engagementRate: number;
  lastUpdated: Date;
}

/**
 * Mobigate platform nomination configuration
 * Only visible to Mobigate Admin (not Community Admins)
 */
export interface MobigateNominationConfig {
  serviceChargePercent: number; // 15-30%
  minimumServiceChargePercent: number; // 15
  maximumServiceChargePercent: number; // 30
  lastUpdatedAt: Date;
  lastUpdatedBy: string;
}

/**
 * Calculate total nomination cost including service charge
 */
export interface NominationCostBreakdown {
  nominationFee: number;
  processingFee: number;
  serviceCharge: number;
  totalDebited: number;
  communityReceives: number;
  mobigateReceives: number;
}
