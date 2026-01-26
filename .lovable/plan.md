
# Primary Election Advancement Rules Implementation

## Overview

This plan implements the new Primary Election advancement rules for the community election system. The rules state:

1. **Automatic Qualification**: Any candidate who secures **25% or more** of votes in Primary Elections automatically qualifies for the General Election
2. **Maximum Candidates**: General Elections can only accommodate a **maximum of 4** candidates
3. **Minimum Candidates**: General Elections require a **minimum of 2** candidates with the highest votes

## Current State Analysis

### Existing Implementation
- `PrimaryCandidate` type has `advancedToMain: boolean` field
- `ElectionProcessSettings` has `primaryAdvancementCount` (default: 2) and `primaryThreshold` (default: 20)
- Mock data currently has 2 candidates advancing (top 2 by votes)
- UI shows "Advances to Main" badge and green highlighting for advancing candidates

### Gap Identified
- No logic for the **25% threshold** rule
- No validation for the **min 2, max 4** candidate constraints
- No UI to explain the advancement rules to users
- Admin management sheet hardcodes 4 finalists without the 25% logic

---

## Implementation Plan

### Phase 1: Update Types & Configuration

**File: `src/types/electionProcesses.ts`**

Add new fields to `ElectionProcessSettings`:
```typescript
export interface ElectionProcessSettings {
  // ... existing fields
  primaryAdvancementMinimum: number; // minimum candidates to advance (default: 2)
  primaryAdvancementMaximum: number; // maximum candidates to advance (default: 4)
  primaryAdvancementThreshold: number; // percentage threshold for auto-qualification (default: 25)
}
```

Add new fields to `PrimaryCandidate`:
```typescript
export interface PrimaryCandidate {
  // ... existing fields
  autoQualified: boolean; // true if candidate met 25% threshold
}
```

### Phase 2: Create Advancement Calculation Utility

**New File: `src/lib/primaryElectionUtils.ts`**

Create utility functions for calculating advancement:

```typescript
interface AdvancementResult {
  advancingCandidates: PrimaryCandidate[];
  autoQualifiedCount: number;
  topVoteCount: number;
  totalAdvancing: number;
  advancementReason: Map<string, 'auto_qualified' | 'top_votes'>;
}

/**
 * Calculate which candidates advance from Primary to General Election
 * 
 * Rules:
 * 1. Candidates with ≥25% of votes automatically qualify
 * 2. Maximum 4 candidates can advance
 * 3. Minimum 2 candidates must advance (fill with top vote-getters)
 * 4. If more than 4 auto-qualify, take top 4 by votes
 */
export function calculateAdvancingCandidates(
  candidates: PrimaryCandidate[],
  config: {
    autoQualifyThreshold: number; // default: 25
    minimumAdvancing: number; // default: 2
    maximumAdvancing: number; // default: 4
  }
): AdvancementResult

/**
 * Get advancement status text for a candidate
 */
export function getAdvancementReason(
  candidate: PrimaryCandidate,
  result: AdvancementResult
): string // e.g., "Auto-qualified (34.2%)" or "Top 4 by votes"
```

### Phase 3: Update Mock Data

**File: `src/data/electionProcessesData.ts`**

Update mock data to reflect the new rules:

1. Update `mockPrimaryElections` candidates to include `autoQualified` field
2. Apply the 25% rule to the existing data:
   - Paulson (42.3%) - Auto-qualified ✅
   - Jerome (34.2%) - Auto-qualified ✅
   - Emmanuel (15.4%) - Does NOT meet 25%, but needs to check if we need more candidates
   - Daniel (8.1%) - Does NOT qualify

3. Update `mockElectionProcessSettings` with new fields:
```typescript
primaryAdvancementMinimum: 2,
primaryAdvancementMaximum: 4,
primaryAdvancementThreshold: 25,
```

### Phase 4: Update Admin Primary Elections Section UI

**File: `src/components/admin/election/AdminPrimaryElectionsSection.tsx`**

1. Import the new utility functions
2. Update candidate cards to show advancement reason:
   - Green badge: "Auto-Qualified (42.3%)" for candidates ≥25%
   - Amber badge: "Advances (Top 4)" for candidates who advance by position
   - No badge for candidates who don't advance

3. Add info card explaining the rules:
```text
📋 Advancement Rules
• ≥25% votes = Auto-qualifies for General Election
• Maximum 4 candidates advance
• Minimum 2 candidates required
```

### Phase 5: Update Admin Primary Management Sheet

**File: `src/components/admin/election/AdminPrimaryManagementSheet.tsx`**

1. Update the info card explaining the threshold:
```text
Primary Advancement Rules:
• Candidates with 25%+ votes automatically qualify
• Maximum 4 candidates can advance to General Election
• Minimum 2 candidates required for General Election
```

2. Update the candidate selection logic:
   - Auto-select candidates who meet 25% threshold
   - Allow manual selection for remaining slots (up to max 4)
   - Prevent reducing below minimum 2

3. Add visual indicators:
   - ⭐ Auto-Qualified badge for ≥25% candidates
   - Checkbox for manual selection of remaining slots
   - Progress indicator: "2/4 candidates advancing (2 auto-qualified)"

### Phase 6: Update Primary Election Detail Sheet

**File: `src/components/admin/election/AdminPrimaryElectionsSection.tsx`** (detail sheet section)

1. Add advancement threshold line at 25% on progress bars
2. Update badges to differentiate:
   - "🏆 Auto-Qualified" (green) - ≥25%
   - "📊 Advances to Main" (amber) - by position
3. Add footer summary:
   - "2 candidates auto-qualified (≥25%)"
   - "Total advancing to General Election: 2"

---

## Technical Details

### Advancement Calculation Algorithm

```typescript
function calculateAdvancingCandidates(candidates, config) {
  const { autoQualifyThreshold, minimumAdvancing, maximumAdvancing } = config;
  
  // Sort by votes (descending)
  const sorted = [...candidates].sort((a, b) => b.votes - a.votes);
  
  // Step 1: Find auto-qualified candidates (≥25%)
  const autoQualified = sorted.filter(c => c.percentage >= autoQualifyThreshold);
  
  // Step 2: If more than max auto-qualify, take top by votes
  if (autoQualified.length > maximumAdvancing) {
    return autoQualified.slice(0, maximumAdvancing);
  }
  
  // Step 3: If auto-qualified meets or exceeds minimum, use them (up to max)
  if (autoQualified.length >= minimumAdvancing) {
    return autoQualified.slice(0, maximumAdvancing);
  }
  
  // Step 4: Fill remaining slots from top vote-getters
  const remaining = sorted.filter(c => !autoQualified.includes(c));
  const slotsToFill = minimumAdvancing - autoQualified.length;
  
  return [...autoQualified, ...remaining.slice(0, slotsToFill)];
}
```

### Example Scenarios

**Scenario 1: Current Mock Data (President General)**
- Paulson: 42.3% → Auto-qualified ✅
- Jerome: 34.2% → Auto-qualified ✅
- Emmanuel: 15.4% → Does NOT meet 25%
- Daniel: 8.1% → Does NOT meet 25%

Result: 2 candidates advance (both auto-qualified)

**Scenario 2: Only 1 candidate meets 25%**
- Candidate A: 45% → Auto-qualified ✅
- Candidate B: 20% → Top vote-getter (fills minimum)
- Candidate C: 18%
- Candidate D: 17%

Result: 2 candidates advance (1 auto + 1 top)

**Scenario 3: 5 candidates meet 25%**
- All 5 candidates have ≥25%
- Take top 4 by votes

Result: 4 candidates advance (capped at maximum)

---

## Files to Create

| File | Purpose |
|------|---------|
| `src/lib/primaryElectionUtils.ts` | Advancement calculation utility functions |

## Files to Modify

| File | Changes |
|------|---------|
| `src/types/electionProcesses.ts` | Add new config fields and `autoQualified` to PrimaryCandidate |
| `src/data/electionProcessesData.ts` | Update mock data with new fields |
| `src/components/admin/election/AdminPrimaryElectionsSection.tsx` | Update UI with advancement rules |
| `src/components/admin/election/AdminPrimaryManagementSheet.tsx` | Update management UI with rules |

---

## Mobile-First UI Considerations

- Compact badge display: "25%+ ✓" instead of full text on mobile
- Stacked layout for advancement reason below candidate name
- Touch-friendly selection checkboxes (min 44px)
- Progress bar with 25% threshold marker
- Collapsible rules info card

---

## Verification Checklist

After implementation, verify:
- [ ] Candidates with ≥25% show "Auto-Qualified" badge
- [ ] Maximum 4 candidates can advance regardless of 25% count
- [ ] Minimum 2 candidates advance even if none meet 25%
- [ ] Progress bars show 25% threshold line
- [ ] Admin management sheet explains rules clearly
- [ ] Advancement calculation works for all edge cases
- [ ] Mock data correctly reflects new rules
