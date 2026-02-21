# Interactive Quiz Game-Over Buttons and Session Rollover Flow

## Overview

Redesign the game-over screen in the Interactive Quiz Play Dialog to show different action buttons based on whether the player scored 100% or not. Add a new "Interactive Session" rollover flow where players compete across multiple sessions to earn points and advance through selection/elimination processes.

---

## Changes

### 1. Modify Game-Over Result Screen Buttons

**File:** `src/components/community/mobigate-quiz/InteractiveQuizPlayDialog.tsx`

Replace the single "Take Cash Prize / Exit" button in the `phase === "result"` footer with conditional button sets:

**If player scored 100% (all 15/15 correct):**

- "Rollover Winning to Interactive Session" (amber/orange gradient) -- enters the Interactive Session flow
- "Redeem Prize and Exit" (green gradient) -- opens the existing QuizPrizeRedemptionSheet then closes
- "Redeem Prize and Play Again" (blue outline) -- opens redemption, then resets the quiz for a new game

**If player did NOT score 100%:**

- "Play Again" (blue gradient) -- resets all state and starts a fresh quiz
- "Exit Now" (outline/secondary) -- closes the dialog

The result card content also changes:

- 100%: Show the congratulations card with prize amount, plus an info card explaining what "Rollover" means (you lose current winnings but enter the Interactive Session)
- Below 100%: Show "Better luck next time" with score breakdown only

### 2. New Component: InteractiveSessionDialog

**File:** `src/components/community/mobigate-quiz/InteractiveSessionDialog.tsx` (new)

A full mobile-first dialog that manages the Interactive Session flow after a player rolls over. This is the "Game Show" proper.

**State tracked:**

- `sessionPoints`: number -- earned 1 point per 100% session win
- `sessionsPlayed`: number
- `sessionsWon`: number
- `sessionsLost`: number
- `currentWinnings`: number -- dissolves when continuing to next session
- `sessionPhase`: "lobby" | "playing" | "session_result"
- `isEvicted`: boolean
- `isQualified`: boolean -- reached merchant's qualifying points threshold

**Lobby screen shows:**

- Player's current points (e.g., "7/15 Points")
- Sessions played, won, lost
- Current winnings (with warning: "Continuing dissolves winnings")
- Session fee (from merchant's selection process)
- Three buttons:
  - "Play Next Session" -- starts a new 15-question quiz pack
  - "Quit and Take Winnings" -- exits with current winnings (opens redemption)
  - "Quit Without Winnings" -- exits cleanly

**Session result screen (after each 15-question pack):**

- If 100%: "+1 Point earned!" celebration, updated points tally
- If not 100%: "No point earned" -- still can continue
- Buttons: "Continue to Next Session" (dissolves winnings) or "Quit"

**Eviction rules (shown as info cards):**

- 50+ losses = automatic eviction
- When merchant's entry threshold is reached, bottom 90% of players by points are evicted (top 10% qualify for the Show proper)

**Playing phase:** Reuses the same objective + non-objective quiz flow already built in InteractiveQuizPlayDialog (extracted into a shared sub-component or duplicated with same logic)

### 3. Extract Quiz Play Engine into Shared Component

**File:** `src/components/community/mobigate-quiz/QuizPlayEngine.tsx` (new)

Extract the core quiz gameplay (objective questions -> non-objective questions -> result) from InteractiveQuizPlayDialog into a reusable component so both the initial quiz and session replays can use it.

**Props:**

- `objectiveQuestions`: array
- `nonObjectiveQuestions`: array
- `onComplete`: (result: { totalCorrect: number, percentage: number, objectiveCorrect: number, nonObjectiveCorrect: number }) => void
- `seasonName`: string
- `headerColor`: string (gradient class)

This component handles:

- Timer logic for both objective and non-objective phases
- Answer selection and confirmation
- Progress bar
- Calls `onComplete` when all 15 questions are done

### 4. Wire the Rollover Flow

**File:** `src/components/community/mobigate-quiz/InteractiveQuizPlayDialog.tsx` (modify)

- Add state: `showInteractiveSession` (boolean)
- When "Rollover Winning to Interactive Session" is tapped:
  - Close the current dialog
  - Open InteractiveSessionDialog
- When "Redeem Prize and Play Again" is tapped:
  - Open redemption sheet
  - On redemption close, reset quiz state and restart
- Add `handlePlayAgain()` function that resets all state variables and restarts from objective phase

### 5. Update Data Constants

**File:** `src/data/mobigateInteractiveQuizData.ts` (minor addition)

Add constants:

```
INTERACTIVE_MAX_LOSSES_BEFORE_EVICTION = 50
INTERACTIVE_QUALIFYING_TOP_PERCENT = 10  // top 10% qualify
```

---

## Technical Details

### Button layout in result footer (mobile-optimized)

For 100% score -- 3 vertically stacked buttons:

```text
div (space-y-2 p-4)
  Button "Rollover Winning to Interactive Session"
    (w-full h-12, amber/orange gradient, bold)
  Button "Redeem Prize & Exit"
    (w-full h-11, green gradient)
  Button "Redeem Prize & Play Again"
    (w-full h-11, outline variant, blue text)
```

For below 100% -- 2 buttons side by side:

```text
div (flex gap-3 p-4)
  Button "Play Again" (flex-1 h-12, blue)
  Button "Exit Now" (flex-1 h-12, outline)
```

### InteractiveSessionDialog structure

```text
Dialog (max-h-[95vh], p-0)
  Header (sticky, gradient bg)
    Season name, Points tally, Session count
  Body (overflow-y-auto touch-auto)
    if lobby:
      Points progress card
      Stats row (played/won/lost)
      Current winnings card (with dissolve warning)
      Session fee card
      Eviction rules info
    if playing:
      QuizPlayEngine component
    if session_result:
      Result card (+1 point or no point)
      Updated points
  Footer (sticky)
    Action buttons per phase
```

### QuizPlayEngine component

Extracts lines 84-255 from InteractiveQuizPlayDialog into a self-contained component. The parent dialog only needs to handle:

- Rendering the engine
- Receiving the onComplete callback
- Managing what happens after completion (buttons, navigation)

### Files Created

- `src/components/community/mobigate-quiz/QuizPlayEngine.tsx`
- `src/components/community/mobigate-quiz/InteractiveSessionDialog.tsx`

### Files Modified

- `src/components/community/mobigate-quiz/InteractiveQuizPlayDialog.tsx` -- new result buttons, play again logic, rollover trigger
- `src/data/mobigateInteractiveQuizData.ts` -- add eviction/qualification constants

&nbsp;

Forget desktop entirely focus solely and completely on mobile  ln this design

Implement the plan completely take your time and carefully implement every single thing and integrate all completely no need to rush and report to me just take your loooong time and make everything perfectly