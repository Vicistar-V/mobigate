
# Fix: Debit Player on Subsequent Sessions + Track Total Staked + Admin Setting

## Problem
1. When a player clicks "Skip Prize, Keep Playing" (or "Continue to Next Session"), subsequent sessions (2nd to 7th+) are NOT debiting the player 50% of the original stake as required.
2. Statistics don't show "Total Staked" alongside Points, Accrued Wins, and Sessions.
3. Admin cannot set/edit the "Continue Playing Stake %" percentage.

## Changes

### 1. Add Admin Setting: `continuePlayingStakePercent` (platformSettingsData.ts)
- Add new `PlatformContinueStakeSettings` interface with `continuePlayingStakePercent` (default 50%), min 10%, max 100%.
- Add getter `getContinuePlayingStakePercent()` and setter `setContinuePlayingStakePercent()`.

### 2. Add Admin Slider to QuizSettingsCard.tsx
- Add a new slider section for "Continue Playing Stake %" between existing settings.
- Range: 10%-100%, step 5%, default 50%.
- Description: "Percentage of original stake charged each time a player continues to the next session."
- Wire into the save handler.

### 3. Fix InteractiveQuizPlayDialog.tsx (Standard Interactive Quiz)
- Add `totalStaked` state, initialized to `season.entryFee` (the first session stake) when the game opens.
- In `handleSkipPrizeContinuePlaying`: calculate the continuation fee as `season.entryFee * (continuePlayingStakePercent / 100)`, add it to `totalStaked`, and show a toast confirming the debit.
- In the result phase stats card (the 3-column grid showing Points / Accrued Wins / Sessions): change to a 4-column or 2x2 grid adding "Total Staked" with the running total formatted in Mobi.

### 4. Fix InteractiveSessionDialog.tsx (Session-based Quiz)
- Add `totalStaked` state, initialized to `sessionFee` when the first session starts.
- In `handleContinueToNext`: calculate the continuation fee as `sessionFee * (continuePlayingStakePercent / 100)`, add it to `totalStaked`, and show a toast confirming the debit.
- Add "Total Staked" to the lobby stats grid (currently 3-column: Played/Won/Lost) -- make it a 4-column or add a row.
- Add "Total Staked" to the session_result stats section as well.
- Include `totalStaked` in the saved session data so it persists across save/resume.

### 5. Update Save/Resume to include totalStaked
- Both dialogs' `savedSession` state will include `totalStaked`.
- Resume restores it; the save confirmation screen displays it.

## Technical Details

### platformSettingsData.ts
```text
New interface: PlatformContinueStakeSettings
  continuePlayingStakePercent: 50 (default)
  continuePlayingStakePercentMin: 10
  continuePlayingStakePercentMax: 100

New exports:
  platformContinueStakeSettings (constant)
  getContinuePlayingStakePercent(): number
  setContinuePlayingStakePercent(value: number): void
```

### InteractiveQuizPlayDialog.tsx
- New state: `const [totalStaked, setTotalStaked] = useState(season.entryFee)`
- `handleSkipPrizeContinuePlaying` updated:
  ```text
  const continueFee = Math.round(season.entryFee * getContinuePlayingStakePercent() / 100)
  setTotalStaked(prev => prev + continueFee)
  toast: "Debited {continueFee} for next session"
  resetAllState()
  ```
- Result stats grid updated from 3 cols to 2x2 grid with Total Staked added.
- Save/resume includes totalStaked.

### InteractiveSessionDialog.tsx
- New state: `const [totalStaked, setTotalStaked] = useState(0)` (set to sessionFee on first play)
- `handleStartSession`: if first play, set totalStaked to sessionFee.
- `handleContinueToNext` updated:
  ```text
  const continueFee = Math.round(sessionFee * getContinuePlayingStakePercent() / 100)
  setTotalStaked(prev => prev + continueFee)
  toast: "Debited {continueFee} for next session"
  ```
- Lobby and result stats grids updated to show Total Staked.
- savedSession type extended with `totalStaked`.

### QuizSettingsCard.tsx
- New local state: `continueStake` initialized from `getContinuePlayingStakePercent()`.
- New slider section with Zap icon, range 10-100%, step 5%.
- `handleSave` calls `setContinuePlayingStakePercent(continueStake)`.
- `hasChanges` checks include the new setting.

## Files Modified
1. `src/data/platformSettingsData.ts` -- new setting
2. `src/components/mobigate/QuizSettingsCard.tsx` -- admin slider
3. `src/components/community/mobigate-quiz/InteractiveQuizPlayDialog.tsx` -- debit logic + stats
4. `src/components/community/mobigate-quiz/InteractiveSessionDialog.tsx` -- debit logic + stats
