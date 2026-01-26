// Primary Election Advancement Utilities
// Rules:
// 1. Candidates with ≥25% of votes automatically qualify
// 2. Maximum 4 candidates can advance
// 3. Minimum 2 candidates must advance (fill with top vote-getters)

import { PrimaryCandidate } from "@/types/electionProcesses";

export interface AdvancementConfig {
  autoQualifyThreshold: number; // default: 25
  minimumAdvancing: number; // default: 2
  maximumAdvancing: number; // default: 4
}

export const DEFAULT_ADVANCEMENT_CONFIG: AdvancementConfig = {
  autoQualifyThreshold: 25,
  minimumAdvancing: 2,
  maximumAdvancing: 4,
};

export type AdvancementReason = 'auto_qualified' | 'top_votes' | 'not_advancing';

export interface AdvancementResult {
  advancingCandidates: PrimaryCandidate[];
  autoQualifiedCount: number;
  topVoteFilledCount: number;
  totalAdvancing: number;
  advancementReasons: Map<string, AdvancementReason>;
}

/**
 * Calculate which candidates advance from Primary to General Election
 * 
 * Algorithm:
 * 1. Sort candidates by votes (descending)
 * 2. Find auto-qualified candidates (≥25% threshold)
 * 3. If auto-qualified > max (4), take top 4 by votes
 * 4. If auto-qualified < min (2), fill remaining slots with top vote-getters
 * 5. If auto-qualified ≥ min and ≤ max, use all auto-qualified
 */
export function calculateAdvancingCandidates(
  candidates: PrimaryCandidate[],
  config: AdvancementConfig = DEFAULT_ADVANCEMENT_CONFIG
): AdvancementResult {
  const { autoQualifyThreshold, minimumAdvancing, maximumAdvancing } = config;
  
  // Sort by votes (descending)
  const sorted = [...candidates].sort((a, b) => b.votes - a.votes);
  
  // Find auto-qualified candidates (≥ threshold percentage)
  const autoQualified = sorted.filter(c => c.percentage >= autoQualifyThreshold);
  
  const advancementReasons = new Map<string, AdvancementReason>();
  let advancingCandidates: PrimaryCandidate[] = [];
  let autoQualifiedCount = 0;
  let topVoteFilledCount = 0;
  
  if (autoQualified.length > maximumAdvancing) {
    // More than max auto-qualify: take top 4 by votes
    advancingCandidates = autoQualified.slice(0, maximumAdvancing);
    autoQualifiedCount = maximumAdvancing;
    advancingCandidates.forEach(c => advancementReasons.set(c.id, 'auto_qualified'));
  } else if (autoQualified.length >= minimumAdvancing) {
    // Between min and max auto-qualify: use all auto-qualified (up to max)
    advancingCandidates = autoQualified.slice(0, maximumAdvancing);
    autoQualifiedCount = advancingCandidates.length;
    advancingCandidates.forEach(c => advancementReasons.set(c.id, 'auto_qualified'));
  } else {
    // Less than minimum auto-qualify: fill remaining slots with top vote-getters
    autoQualifiedCount = autoQualified.length;
    autoQualified.forEach(c => advancementReasons.set(c.id, 'auto_qualified'));
    
    const remaining = sorted.filter(c => !autoQualified.includes(c));
    const slotsToFill = minimumAdvancing - autoQualified.length;
    const fillers = remaining.slice(0, slotsToFill);
    topVoteFilledCount = fillers.length;
    fillers.forEach(c => advancementReasons.set(c.id, 'top_votes'));
    
    advancingCandidates = [...autoQualified, ...fillers];
  }
  
  // Mark non-advancing candidates
  sorted.forEach(c => {
    if (!advancementReasons.has(c.id)) {
      advancementReasons.set(c.id, 'not_advancing');
    }
  });
  
  return {
    advancingCandidates,
    autoQualifiedCount,
    topVoteFilledCount,
    totalAdvancing: advancingCandidates.length,
    advancementReasons,
  };
}

/**
 * Get human-readable advancement status text for a candidate
 */
export function getAdvancementStatusText(
  candidate: PrimaryCandidate,
  reason: AdvancementReason
): string {
  switch (reason) {
    case 'auto_qualified':
      return `Auto-Qualified (${candidate.percentage.toFixed(1)}%)`;
    case 'top_votes':
      return 'Advances (Top Votes)';
    case 'not_advancing':
      return 'Did Not Advance';
  }
}

/**
 * Get compact badge text for mobile display
 */
export function getAdvancementBadgeText(
  reason: AdvancementReason,
  percentage: number
): string {
  switch (reason) {
    case 'auto_qualified':
      return `25%+ ✓`;
    case 'top_votes':
      return 'Top 4';
    case 'not_advancing':
      return '';
  }
}

/**
 * Check if a candidate advances to the main election
 */
export function doesCandidateAdvance(
  candidateId: string,
  result: AdvancementResult
): boolean {
  const reason = result.advancementReasons.get(candidateId);
  return reason === 'auto_qualified' || reason === 'top_votes';
}

/**
 * Apply advancement calculation to candidates and update their advancedToMain flag
 */
export function applyAdvancementToCandidate(
  candidate: PrimaryCandidate,
  result: AdvancementResult
): PrimaryCandidate {
  const reason = result.advancementReasons.get(candidate.id);
  return {
    ...candidate,
    advancedToMain: reason === 'auto_qualified' || reason === 'top_votes',
    autoQualified: reason === 'auto_qualified',
  };
}
