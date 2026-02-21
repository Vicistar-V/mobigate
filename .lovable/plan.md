

# Interactive Quiz Sessions -- Complete Scoring, Points, Prizes, and Game Show Entry System

## What This Plan Does

This plan rewrites the Interactive Quiz scoring engine and session flow to match the full game show progression rules you described. Currently, the system only awards points for 100% correct answers and has a simple pass/fail result. The new system introduces tiered scoring, tiered instant prizes, a disqualification penalty for poor performance, a 300-point Game Show entry threshold with action choices, and proper selection/eviction process modeling.

---

## Changes Overview

### 1. Data Model Updates (`mobigateInteractiveQuizData.ts`)

- Change `qualifyingPoints` default from `15` to `300` in `DEFAULT_MERCHANT_CONFIG`
- Add new exported constants:
  - `POINTS_FOR_100_PERCENT = 3`
  - `POINTS_FOR_90_PERCENT = 2`
  - `POINTS_FOR_80_PERCENT = 1`
  - `DISQUALIFY_THRESHOLD = 60` (below 60% resets everything)
  - `GAME_SHOW_ENTRY_POINTS = 300`
  - `INSTANT_PRIZE_100 = 5.0` (500% of stake)
  - `INSTANT_PRIZE_90 = 0.5` (50% of stake)
  - `INSTANT_PRIZE_80 = 0.2` (20% of stake)
- Add `consolationPrizesEnabled: boolean` and `consolationPrizePool: number` fields to `QuizSeason` interface
- Update mock seasons with the new fields and realistic consolation prize settings

### 2. Interactive Quiz Play Dialog (`InteractiveQuizPlayDialog.tsx`)

**Scoring tier logic** -- Replace the binary pass/fail with tiered results:
- 100% correct: 3 points earned, prize = 500% of stake
- 90%+ correct: 2 points earned, prize = 50% of stake
- 80%+ correct: 1 point earned, prize = 20% of stake
- 60-79% correct: 0 points, no prize, but player continues
- Below 60%: DISQUALIFIED -- all accrued points and prizes reset to zero, player starts fresh

**Result screen redesign** (mobile-first):
- Show the tier achieved (e.g., "3 Points Earned!" or "DISQUALIFIED!")
- Show instant prize amount based on tier
- Warning card explaining that taking the instant prize disqualifies from Game Show entry and dissolves all accrued points
- Three action buttons for qualifying players:
  - "Redeem Instant Prize and Exit" (disqualifies from show)
  - "Redeem Instant Prize and Play Again" (disqualifies from show, restarts fresh)
  - "Skip Prize, Continue Playing" (keeps points, no prize taken)
- For disqualified players (<60%): Show reset warning, "Play Again (Fresh Start)" button

**300-Point Game Show threshold** -- When accumulated points reach 300+, show a special milestone card with three options:
- "Enter Show Now" -- A journey to becoming a Mobi Celebrity
- "Redeem Accrued Won Prize (M258,000 won in 10 Sessions)" -- with actual accumulated amount
- "Continue Playing More Quiz" -- keep accumulating

### 3. Interactive Session Dialog (`InteractiveSessionDialog.tsx`)

**Replace the current scoring logic** which only awards 1 point for 100%:
- Apply same tiered point system (3/2/1/0/disqualify)
- Apply same tiered instant prize system (500%/50%/20%/0)
- Below 60% resets session points AND current winnings to zero

**Update the points progress bar**:
- Change target from 15 to 300 (or merchant's `qualifyingPoints`)
- Show milestone markers at key thresholds

**Update session rules card**:
- List the 4 scoring tiers with their point values
- Explain the <60% disqualification and reset penalty
- Explain instant prize trade-off (taking prize = no Game Show)

**Update the result screen**:
- Show tier achieved with appropriate styling
- Show instant prize earned (if any)
- If points >= 300, show the Game Show entry milestone with the 3 action buttons
- "Continue to Next Session" dissolves instant prize but keeps points
- "Take Instant Prize" adds to vault but blocks Game Show entry

**Eviction update**:
- Keep the loss-based eviction but also add the <60% reset mechanic
- Clarify that eviction from losses is separate from <60% point reset

### 4. Season Sheet Player View (`InteractiveQuizSeasonSheet.tsx`)

- Show selection process stages with entry fees in the season cards
- Display consolation prize indicator if merchant has enabled it
- Add local currency equivalents alongside Mobi amounts for entry fees and prizes

### 5. Merchant Admin -- Selection Process View (`MerchantSelectionProcessDrawer.tsx`)

- Add consolation prizes toggle and pool amount field for the TV Show rounds
- Add note that consolation prizes are optional and apply to the 12 evicted players from the first TV show
- Show the Grand Finale as always FREE entry with 1st, 2nd, 3rd prize positions

---

## Technical Details

### Scoring Calculation Logic (shared helper)

```typescript
function calculateQuizTier(percentage: number) {
  if (percentage === 100) return { points: 3, prizeMultiplier: 5.0, tier: "perfect" };
  if (percentage >= 90)  return { points: 2, prizeMultiplier: 0.5, tier: "excellent" };
  if (percentage >= 80)  return { points: 1, prizeMultiplier: 0.2, tier: "good" };
  if (percentage >= 60)  return { points: 0, prizeMultiplier: 0,   tier: "pass" };
  return { points: 0, prizeMultiplier: 0, tier: "disqualified", resetAll: true };
}
```

### Game Show Entry Check

```typescript
const hasReachedGameShow = accumulatedPoints >= GAME_SHOW_ENTRY_POINTS;
const accumulatedWinnings = totalWonAcrossSessions; // tracked in state
```

### Files Modified (6 total)
- `src/data/mobigateInteractiveQuizData.ts` -- New constants, updated defaults, consolation fields
- `src/components/community/mobigate-quiz/InteractiveQuizPlayDialog.tsx` -- Tiered scoring, 300-point milestone, instant prize trade-off
- `src/components/community/mobigate-quiz/InteractiveSessionDialog.tsx` -- Tiered session scoring, <60% reset, Game Show entry threshold
- `src/components/community/mobigate-quiz/InteractiveQuizSeasonSheet.tsx` -- Selection process display, dual currency
- `src/components/mobigate/MerchantSelectionProcessDrawer.tsx` -- Consolation prize toggle and Grand Finale labels
- `src/components/mobigate/InteractiveMerchantAdmin.tsx` -- Updated qualifying points display to show 300

### Files Created
- None

