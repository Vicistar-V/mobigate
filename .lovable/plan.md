

# Toggle Quiz -- High-Stakes Escalating Sessions with All-or-Nothing Gamble

## What This Plan Does

Adds a brand-new **"Toggle Quiz"** game mode to the Mobigate Quiz Hub. This is a distinct, escalating risk/reward quiz where players answer questions across up to 7 sessions. After each 100%-correct session win, the player must decide: **take the prize and leave**, or **"Toggle"** into the next session for a higher multiplier -- but risk losing everything previously won. The stake is re-charged each session. Completing all 7 sessions earns a **Mobi Celebrity** badge.

---

## The 7 Toggle Sessions

| Session | Objectives | Non-Objectives | Total Qs | Win Multiplier | Prize (on M500 stake) |
|---------|-----------|---------------|----------|---------------|----------------------|
| 1       | 7         | 3             | 10       | 5x (500%)     | M2,500               |
| 2       | 10        | 4             | 14       | 7x (700%)     | M3,500               |
| 3       | 12        | 5             | 17       | 8x (800%)     | M4,000               |
| 4       | 14        | 6             | 20       | 9x (900%)     | M4,500               |
| 5       | 14        | 6             | 20       | 10x (1000%)   | M5,000               |
| 6       | 15        | 7             | 22       | 12x (1200%)   | M6,000               |
| 7       | 20        | 10            | 30       | 15x (1500%)   | M7,500               |

**Rules:**
- Only 100% correct answers win a session
- "Toggling" to the next session cancels ALL previous winnings -- only the new session's prize matters
- Stake is re-charged for every Toggle session
- If the player fails any session (less than 100%), they lose everything
- Completing all 7 sessions awards the "Mobi Celebrity" badge

---

## Files Created (2)

### 1. `src/data/toggleQuizData.ts`
New data file containing:
- `TOGGLE_SESSIONS` array defining all 7 sessions with their objective count, non-objective count, and multiplier
- Large question pools: 20+ objective questions and 10+ non-objective questions (the engine picks the required count per session)
- `pickToggleQuestions(sessionIndex)` helper that randomly selects the correct number of objectives and non-objectives for the given session
- Type exports: `ToggleSession`, `ToggleQuizState`

### 2. `src/components/community/mobigate-quiz/ToggleQuizPlayDialog.tsx`
New full-screen dialog component (mobile-first) implementing the complete Toggle Quiz flow:

**Phases:**
- `"playing"` -- Objective questions with timer (reuses existing timer/answer patterns from StandardQuizContinueSheet)
- `"non_objective"` -- Written questions with timer (reuses NonObjectiveQuestionCard)
- `"session_win"` -- 100% correct: shows current prize, "Take Prize and Exit" vs "Toggle to Session X" choice
- `"session_fail"` -- Less than 100%: shows "You Lost Everything", exit button
- `"celebrity"` -- All 7 sessions completed: shows Mobi Celebrity badge award, celebration UI

**Key logic:**
- Tracks `currentSession` (1-7), `currentPrize` (only the latest session's prize, not cumulative)
- On Toggle: previous winnings are wiped, stake is re-charged, new questions are loaded
- On session fail: `currentPrize = 0`, game over
- On session 7 win: award Mobi Celebrity badge, show special celebration

**UI structure (mobile-first):**
- Sticky gradient header (teal/cyan theme to differentiate from Standard's amber)
- Session indicator: "Toggle Session 2/7 -- 700% Prize"
- Timer, question card, answer grid (same patterns as StandardQuizContinueSheet)
- Session result cards with clear Toggle/Exit choice
- Warning text: "Toggling will cancel your current M2,500 win. New prize: M3,500"
- Celebrity badge reveal animation on final completion

---

## Files Modified (2)

### 3. `src/components/community/mobigate-quiz/MobigateQuizHub.tsx`
- Add "Toggle Quiz" to the `GAME_MODES` array with:
  - id: `"toggle"`
  - title: "Toggle Quiz"
  - description: "Win 500% or risk it all for up to 1500%! Toggle through 7 sessions -- each one higher stakes. Complete all to earn Mobi Celebrity!"
  - icon: `Repeat` (from lucide-react)
  - gradient: `"from-teal-500 to-cyan-600"`
  - badge: "Toggle Risk"
  - minStake: 500
- Add the `ToggleQuizPlayDialog` flow sheet: `<ToggleQuizPlayDialog open={activeFlow === "toggle"} onOpenChange={...} />`
- Import `ToggleQuizPlayDialog` and `Repeat` icon

### 4. `src/components/mobigate/InteractiveMerchantAdmin.tsx` (minor)
- No changes needed -- Toggle Quiz is a standalone mode, not merchant-dependent

---

## Technical Details

### Session Configuration

```typescript
export const TOGGLE_SESSIONS = [
  { session: 1, objectives: 7,  nonObjectives: 3,  total: 10, multiplier: 5,  label: "500%" },
  { session: 2, objectives: 10, nonObjectives: 4,  total: 14, multiplier: 7,  label: "700%" },
  { session: 3, objectives: 12, nonObjectives: 5,  total: 17, multiplier: 8,  label: "800%" },
  { session: 4, objectives: 14, nonObjectives: 6,  total: 20, multiplier: 9,  label: "900%" },
  { session: 5, objectives: 14, nonObjectives: 6,  total: 20, multiplier: 10, label: "1000%" },
  { session: 6, objectives: 15, nonObjectives: 7,  total: 22, multiplier: 12, label: "1200%" },
  { session: 7, objectives: 20, nonObjectives: 10, total: 30, multiplier: 15, label: "1500%" },
];
```

### Toggle Decision Logic

```typescript
// After 100% correct session:
const currentPrize = stake * TOGGLE_SESSIONS[currentSession].multiplier;
// If player toggles:
previousWinnings = 0; // cancelled
stakeCharged += stake; // re-charged
// Load new questions for next session
```

### Question Selection Per Session

```typescript
function pickToggleQuestions(sessionIndex: number) {
  const config = TOGGLE_SESSIONS[sessionIndex];
  const shuffledObj = [...allObjectiveQuestions].sort(() => Math.random() - 0.5);
  const shuffledNonObj = [...allNonObjectiveQuestions].sort(() => Math.random() - 0.5);
  return {
    objectives: shuffledObj.slice(0, config.objectives),
    nonObjectives: shuffledNonObj.slice(0, config.nonObjectives),
  };
}
```

### Mobi Celebrity Badge Logic

```typescript
if (currentSession === 6 && isSessionPerfect) {
  // Session 7 (index 6) completed with 100%
  awardMobiCelebrityBadge = true;
  // Show celebration UI with badge
}
```

### Files Summary
- **Created**: `src/data/toggleQuizData.ts`, `src/components/community/mobigate-quiz/ToggleQuizPlayDialog.tsx`
- **Modified**: `src/components/community/mobigate-quiz/MobigateQuizHub.tsx`

