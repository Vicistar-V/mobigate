// Certificate of Return Types

/**
 * Certificate of Return - Official document for election winners
 * Serves as verified evidence of leadership for community records
 */
export interface CertificateOfReturn {
  id: string;
  certificateNumber: string; // Format: COR-{YEAR}-{COMMUNITY_CODE}-{SEQ}
  
  // Community Information
  communityId: string;
  communityName: string;
  communityLocation?: string;
  
  // Winner Information
  winnerId: string;
  winnerName: string;
  winnerAvatar?: string;
  
  // Office Information
  officePosition: string;
  officeCategory: 'executive' | 'administrative' | 'support';
  
  // Election Details
  electionId: string;
  electionName: string;
  electionDate: Date;
  totalVotesReceived: number;
  totalVotesCast: number;
  votePercentage: number;
  
  // Tenure Information
  tenureStart: Date;
  tenureEnd: Date;
  tenureDurationYears: number;
  
  // Certificate Metadata
  issuedDate: Date;
  issuedBy: string; // Mobigate or specific admin
  digitalSignature: string; // Simulated signature hash
  verificationCode: string; // For authenticity verification
  qrCodeData?: string;
  
  // Status
  status: 'draft' | 'issued' | 'revoked' | 'expired';
  revocationReason?: string;
  revocationDate?: Date;
}

/**
 * Certificate generation request
 */
export interface CertificateGenerationRequest {
  electionId: string;
  winnerId: string;
  officePosition: string;
  tenureStartDate: Date;
  tenureEndDate: Date;
  issuedBy: string;
}

/**
 * Certificate template configuration
 */
export interface CertificateTemplate {
  id: string;
  name: string;
  headerLogo: string;
  footerText: string;
  watermark?: string;
  primaryColor: string;
  secondaryColor: string;
  signatureStyle: 'digital' | 'manual' | 'both';
}

/**
 * Voter transparency settings for post-election
 */
export interface VoterTransparencySettings {
  electionId: string;
  displayMode: 'anonymous' | 'identified' | 'partial';
  showAccreditationNumbers: boolean;
  showVoterNames: boolean;
  showVoteTimestamps: boolean;
  antiIntimidationNotice: boolean;
  noticeText?: string;
}

/**
 * Certificate verification result
 */
export interface CertificateVerificationResult {
  isValid: boolean;
  certificateNumber: string;
  winnerName: string;
  officePosition: string;
  communityName: string;
  tenureStart: Date;
  tenureEnd: Date;
  verifiedAt: Date;
  verificationMethod: 'qr_code' | 'manual' | 'api';
}
