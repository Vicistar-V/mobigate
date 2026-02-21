
# Interactive Quiz: 15 Objectives + "Play Only Objectives" Mode

## What This Plan Does

Currently the Interactive Quiz has 10 objective questions and 5 non-objective questions (15 total). This plan increases the **objective question bank to 15**, adds a **"Play Only Objectives" mode** with adjusted prize tiers, and implements the random 10-from-15 selection logic for the default (mixed) mode.

---

## The Two Play Modes

**Default Mode (Objectives + Non-Objectives):**
- 10 objectives randomly selected from the 15 in the bank + 5 non-objectives = 15 total
- Prize tiers remain unchanged (100% = 500%, 90% = 50%, 80% = 20%)

**"Play Only Objectives" Mode:**
- All 15 objective questions, no non-objectives
- Reduced winning prize: 100% correct = **350%** of stake (down from 500%)
- 12-14 correct answers (80-93%) = **20% of stake** consolation prize
- Below 60% still triggers full disqualification and reset

---

## Files and Changes

### 1. Data Constants (`mobigateInteractiveQuizData.ts`)

- Add new constants for "objectives-only" mode:
  - `OBJECTIVES_ONLY_PRIZE_MULTIPLIER = 3.5` (350% of stake)
  - `OBJECTIVES_ONLY_CONSOLATION_MULTIPLIER = 0.2` (20% of stake for 12-14 correct)
  - `INTERACTIVE_FULL_OBJECTIVE_QUESTIONS = 15` (total objectives in bank)
  - `INTERACTIVE_DEFAULT_OBJECTIVE_PICK = 10` (randomly picked for mixed mode)
- Add a new `calculateObjectivesOnlyTier()` function with the adjusted tiers:
  - 15/15 correct (100%) = 3 points, 350% prize
  - 14/15 or 13/15 or 12/15 (80-93%) = 1 point, 20% consolation
  - Below 60% = disqualified, full reset
- Update `INTERACTIVE_OBJECTIVE_QUESTIONS` comment to clarify it means "per session in mixed mode"

### 2. InteractiveQuizPlayDialog (`InteractiveQuizPlayDialog.tsx`)

- Add 5 more objective questions to the hardcoded pool (bringing total to 15)
- Add `playMode` state: `"mixed" | "objectives_only"` (default: `"mixed"`)
- Add a **pre-game phase** (`"mode_select"`) before objectives begin, showing:
  - "Play Objectives + Written" button (default, full prize tiers)
  - "Play Only Objectives" button with attached note: "This option will reduce your Winning Prize from 500% to 350% of Stake"
- When `playMode === "mixed"`: randomly pick 10 from the 15 objectives, then proceed to 5 non-objectives
- When `playMode === "objectives_only"`: use all 15 objectives, skip non-objectives entirely
- Update tier calculation to use `calculateObjectivesOnlyTier()` when in objectives-only mode
- Update result screen to reflect the correct tier labels for objectives-only mode

### 3. InteractiveSessionDialog (`InteractiveSessionDialog.tsx`)

- Add 5 more objective questions to the session pool (15 total)
- Pass a `playMode` prop through to `QuizPlayEngine`
- Add mode selection in the lobby before starting a session
- Update `handleSessionComplete` to use the correct tier function based on play mode
- Update the scoring rules card to mention the "Objectives Only" reduced prize

### 4. QuizPlayEngine (`QuizPlayEngine.tsx`)

- Accept a new optional prop `playMode?: "mixed" | "objectives_only"`
- When `playMode === "objectives_only"`, the engine receives all 15 objectives and 0 non-objectives (handled by parent passing empty array)
- No changes needed to internal logic since it already handles empty non-objective arrays
- Update the `QuizPlayResult` interface to include `playMode` so parent can determine which tier function to use

### 5. InteractiveQuizSeasonSheet (`InteractiveQuizSeasonSheet.tsx`)

- Pass `playMode` selection down to `InteractiveQuizPlayDialog`
- The mode selection happens inside the play dialog itself, so no major changes here beyond ensuring props flow correctly

### 6. Merchant Admin Questions Config (`InteractiveMerchantAdmin.tsx`)

- Update the questions settings display to show "15 Objectives" instead of "10 Objectives"
- Update `DEFAULT_MERCHANT_CONFIG.objectivePerPack` reference to show 15
- Update any UI text referencing "10 Objectives" to "15 Objectives (10 randomly selected for mixed play)"

---

## Technical Details

### Random Selection Logic (Mixed Mode)

```typescript
function pickRandomObjectives(allObjectives: ObjectiveQuestion[], count: number) {
  const shuffled = [...allObjectives].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Usage in InteractiveQuizPlayDialog:
const activeObjectives = playMode === "objectives_only"
  ? allObjectiveQuestions           // all 15
  : pickRandomObjectives(allObjectiveQuestions, 10);  // random 10
```

### Objectives-Only Tier Calculation

```typescript
function calculateObjectivesOnlyTier(percentage: number, correctCount: number, totalCount: number) {
  if (percentage === 100)  return { points: 3, prizeMultiplier: 3.5, tier: "perfect" };      // 350%
  if (correctCount >= 12)  return { points: 1, prizeMultiplier: 0.2, tier: "consolation" };   // 20%
  if (percentage >= 60)    return { points: 0, prizeMultiplier: 0,   tier: "pass" };
  return { points: 0, prizeMultiplier: 0, tier: "disqualified", resetAll: true };
}
```

### Mode Selection UI (Pre-Game)

Before the quiz starts, a card will show two options:
- Primary button: "Play Objectives + Written (15 Questions)" -- full prize tiers
- Secondary button: "Play Only Objectives (15 Questions)" -- with a small amber note card below explaining: "This option reduces your Winning Prize from 500% to 350% of Stake. Getting 12-14 correct earns 20% consolation prize."

### Files Modified (6 total)
- `src/data/mobigateInteractiveQuizData.ts` -- New constants, new tier function
- `src/components/community/mobigate-quiz/InteractiveQuizPlayDialog.tsx` -- 15 objectives, mode select, adjusted scoring
- `src/components/community/mobigate-quiz/InteractiveSessionDialog.tsx` -- 15 objectives, mode select in lobby
- `src/components/community/mobigate-quiz/QuizPlayEngine.tsx` -- playMode in result interface
- `src/components/community/mobigate-quiz/InteractiveQuizSeasonSheet.tsx` -- Props flow
- `src/components/mobigate/InteractiveMerchantAdmin.tsx` -- Updated question count display

### Files Created
- None
