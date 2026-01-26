// Democratic Settings Utility Functions
// Core calculation logic for the 60% threshold governance system

import {
  AdminSettingProposal,
  MemberRecommendation,
  DemocraticSettingStatus,
  DEMOCRATIC_SETTINGS_CONFIG,
} from '@/types/communityDemocraticSettings';

const { APPROVAL_THRESHOLD, DISAPPROVAL_THRESHOLD, RECOMMENDATION_THRESHOLD, MIN_VOTES_REQUIRED } = DEMOCRATIC_SETTINGS_CONFIG;

/**
 * Calculate if a setting has reached 60% approval
 */
export function hasReached60PercentApproval(
  approvalCount: number,
  totalValidMembers: number
): boolean {
  if (totalValidMembers < MIN_VOTES_REQUIRED) return false;
  const percentage = (approvalCount / totalValidMembers) * 100;
  return percentage >= APPROVAL_THRESHOLD;
}

/**
 * Calculate if a setting has reached 60% disapproval
 */
export function hasReached60PercentDisapproval(
  disapprovalCount: number,
  totalValidMembers: number
): boolean {
  if (totalValidMembers < MIN_VOTES_REQUIRED) return false;
  const percentage = (disapprovalCount / totalValidMembers) * 100;
  return percentage >= DISAPPROVAL_THRESHOLD;
}

/**
 * Calculate approval percentage
 */
export function calculateApprovalPercentage(
  approvalCount: number,
  totalValidMembers: number
): number {
  if (totalValidMembers === 0) return 0;
  return Math.round((approvalCount / totalValidMembers) * 100);
}

/**
 * Calculate disapproval percentage
 */
export function calculateDisapprovalPercentage(
  disapprovalCount: number,
  totalValidMembers: number
): number {
  if (totalValidMembers === 0) return 0;
  return Math.round((disapprovalCount / totalValidMembers) * 100);
}

/**
 * Calculate support percentage for a member recommendation
 */
export function calculateSupportPercentage(
  supportCount: number,
  totalValidMembers: number
): number {
  if (totalValidMembers === 0) return 0;
  return Math.round((supportCount / totalValidMembers) * 100);
}

/**
 * Get the winning recommendation (highest support among 60%+ recommendations)
 */
export function getWinningRecommendation(
  recommendations: MemberRecommendation[],
  totalValidMembers: number
): MemberRecommendation | null {
  if (recommendations.length === 0) return null;

  // Filter recommendations that have reached 60% support
  const qualifiedRecommendations = recommendations.filter(
    (rec) => calculateSupportPercentage(rec.supportCount, totalValidMembers) >= RECOMMENDATION_THRESHOLD
  );

  if (qualifiedRecommendations.length === 0) return null;

  // Return the one with highest support
  return qualifiedRecommendations.reduce((highest, current) =>
    current.supportCount > highest.supportCount ? current : highest
  );
}

/**
 * Determine the final setting value based on votes
 */
export function determineFinalSettingValue(
  proposal: AdminSettingProposal,
  recommendations: MemberRecommendation[],
  totalValidMembers: number
): { value: string; source: 'admin' | 'member_recommendation' | 'unchanged' } {
  // Check for winning member recommendation first
  const winningRecommendation = getWinningRecommendation(recommendations, totalValidMembers);
  if (winningRecommendation) {
    return {
      value: winningRecommendation.recommendedValue,
      source: 'member_recommendation',
    };
  }

  // Check if admin proposal has 60% approval
  if (hasReached60PercentApproval(proposal.approvalCount, totalValidMembers)) {
    return {
      value: proposal.proposedValue,
      source: 'admin',
    };
  }

  // Check if admin proposal has 60% disapproval
  if (hasReached60PercentDisapproval(proposal.disapprovalCount, totalValidMembers)) {
    return {
      value: proposal.currentValue,
      source: 'unchanged',
    };
  }

  // No decision yet
  return {
    value: proposal.currentValue,
    source: 'unchanged',
  };
}

/**
 * Determine the status of a proposal based on votes
 */
export function determineProposalStatus(
  proposal: AdminSettingProposal,
  recommendations: MemberRecommendation[]
): DemocraticSettingStatus {
  const { approvalCount, disapprovalCount, totalValidMembers, expiresAt } = proposal;

  // Check if expired
  if (new Date() > new Date(expiresAt)) {
    return 'expired';
  }

  // Check for member override first
  const winningRecommendation = getWinningRecommendation(recommendations, totalValidMembers);
  if (winningRecommendation) {
    return 'member_override';
  }

  // Check approval threshold
  if (hasReached60PercentApproval(approvalCount, totalValidMembers)) {
    return 'active';
  }

  // Check disapproval threshold
  if (hasReached60PercentDisapproval(disapprovalCount, totalValidMembers)) {
    return 'disapproved';
  }

  return 'pending_approval';
}

/**
 * Get all proposals that require member attention (unvoted)
 */
export function getPendingProposalsForMember(
  proposals: AdminSettingProposal[],
  memberId: string
): AdminSettingProposal[] {
  return proposals.filter(
    (proposal) =>
      proposal.status === 'pending_approval' &&
      proposal.memberVote === null
  );
}

/**
 * Calculate how many more votes are needed for approval
 */
export function votesNeededForApproval(proposal: AdminSettingProposal): number {
  const targetVotes = Math.ceil((proposal.totalValidMembers * APPROVAL_THRESHOLD) / 100);
  return Math.max(0, targetVotes - proposal.approvalCount);
}

/**
 * Calculate how many more votes are needed for disapproval
 */
export function votesNeededForDisapproval(proposal: AdminSettingProposal): number {
  const targetVotes = Math.ceil((proposal.totalValidMembers * DISAPPROVAL_THRESHOLD) / 100);
  return Math.max(0, targetVotes - proposal.disapprovalCount);
}

/**
 * Calculate how many more votes are needed for a recommendation to win
 */
export function votesNeededForRecommendation(
  recommendation: MemberRecommendation
): number {
  const targetVotes = Math.ceil((recommendation.totalValidMembers * RECOMMENDATION_THRESHOLD) / 100);
  return Math.max(0, targetVotes - recommendation.supportCount);
}

/**
 * Format the progress text for approval
 */
export function formatApprovalProgress(proposal: AdminSettingProposal): string {
  const percentage = calculateApprovalPercentage(proposal.approvalCount, proposal.totalValidMembers);
  const needed = votesNeededForApproval(proposal);
  
  if (percentage >= APPROVAL_THRESHOLD) {
    return `Approved (${percentage}%)`;
  }
  
  return `${percentage}% approved (${needed} more votes needed)`;
}

/**
 * Check if member can still vote on a proposal
 */
export function canVoteOnProposal(proposal: AdminSettingProposal): boolean {
  return (
    proposal.status === 'pending_approval' &&
    new Date() < new Date(proposal.expiresAt)
  );
}

/**
 * Get days remaining until proposal expires
 */
export function getDaysUntilExpiry(expiresAt: Date): number {
  const now = new Date();
  const expiry = new Date(expiresAt);
  const diffTime = expiry.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
}
