

# Quiz Timing and Question Structure -- Full Audit and Fix

## Overview

A thorough inspection reveals that **every quiz dialog** has incorrect hardcoded timers (all set to 15s for objectives instead of 10s), none read from the admin-configurable settings, and two quiz types (Group and Standard Solo) are missing their 5 non-objective questions entirely. This plan corrects all of these issues across all files.

---

## Problems Found

1. **Objective timer is wrong everywhere** -- hardcoded to 15s in all 6 quiz dialogs, should be 10s by default
2. **No quiz dialog reads admin settings** -- the admin can set time per question in QuizSettingsCard, but no play dialog actually uses `getDefaultTimePerQuestion()`
3. **Only one timer setting exists** -- the spec requires separate timers: 10s for Objective, 15s for Non-Objective, both admin-editable
4. **Group Quiz has only 10 objective questions** -- missing 5 non-objective questions
5. **Standard Solo Quiz has only 10 objective questions** -- missing 5 non-objective questions
6. **QuizPlayEngine** (shared component) also hardcodes 15s for objectives

---

## Changes

### 1. Split Platform Timer Settings into Two

**File:** `src/data/platformSettingsData.ts`

Replace the single `defaultTimePerQuestion` with two separate settings:

- `objectiveTimePerQuestion`: default 10s (range 5-30s)
- `nonObjectiveTimePerQuestion`: default 15s (range 10-60s)

Add corresponding getter/setter functions:
- `getObjectiveTimePerQuestion()`
- `setObjectiveTimePerQuestion()`
- `getNonObjectiveTimePerQuestion()`
- `setNonObjectiveTimePerQuestion()`

Keep backward compatibility by keeping `getDefaultTimePerQuestion()` as an alias for `getObjectiveTimePerQuestion()`.

### 2. Update Admin QuizSettingsCard with Two Timer Sliders

**File:** `src/components/mobigate/QuizSettingsCard.tsx`

Replace the single "Time Per Question" slider with two:

- "Objective Time" slider (5-30s, step 1s, default 10s)
- "Non-Objective Time" slider (10-60s, step 5s, default 15s)

Both display their current values prominently and save independently.

### 3. Fix All Quiz Play Dialogs to Use Admin Settings

Update every quiz dialog to import and use the admin-configurable timers instead of hardcoded values.

**Files affected:**

**a) `InteractiveQuizPlayDialog.tsx`**
- Replace `setTimeRemaining(15)` with `setTimeRemaining(getObjectiveTimePerQuestion())` (4 occurrences)
- Replace `NON_OBJECTIVE_TIME_PER_QUESTION = 15` with `getNonObjectiveTimePerQuestion()`

**b) `QuizPlayEngine.tsx`**
- Replace `setTimeRemaining(15)` with `setTimeRemaining(getObjectiveTimePerQuestion())`
- Replace `NON_OBJECTIVE_TIME_PER_QUESTION = 15` with `getNonObjectiveTimePerQuestion()`

**c) `GroupQuizPlayDialog.tsx`**
- Replace `setTimeRemaining(15)` with `setTimeRemaining(getObjectiveTimePerQuestion())` (3 occurrences)
- Add 5 non-objective questions with their own 15s (admin-editable) timer phase
- Add non-objective UI section (timer, NonObjectiveQuestionCard, sequential flow)
- Update total question count from 10 to 15

**d) `StandardQuizContinueSheet.tsx`**
- Replace `setTimeRemaining(15)` with `setTimeRemaining(getObjectiveTimePerQuestion())` (4 occurrences)
- Add 5 non-objective questions with sequential timed flow
- Update total question count from 10 to 15

**e) `ScholarshipQuizPlayDialog.tsx`**
- Replace `setTimeRemaining(15)` with `setTimeRemaining(getObjectiveTimePerQuestion())` (2 occurrences)
- Add per-question timed non-objective flow (currently does bulk submission)

**f) `FoodQuizPlayDialog.tsx`**
- Replace `setTimeRemaining(15)` with `setTimeRemaining(getObjectiveTimePerQuestion())` (2 occurrences)
- Non-objective already has 15s timer -- update to use `getNonObjectiveTimePerQuestion()`

### 4. Add Non-Objective Questions to Group Quiz

**File:** `GroupQuizPlayDialog.tsx`

Add:
- 5 mock non-objective questions
- Phase management ("objective" -> "non_objective" -> "game_over")
- Per-question sequential timer (15s default, from admin settings)
- NonObjectiveQuestionCard rendering
- Updated score breakdown showing objective and written scores separately

### 5. Add Non-Objective Questions to Standard Solo Quiz

**File:** `StandardQuizContinueSheet.tsx`

Add:
- 5 mock non-objective questions
- Phase management with non-objective phase between objective and session result
- Per-question sequential timer
- NonObjectiveQuestionCard rendering
- Updated scoring to include both objective and written scores

---

## Technical Details

### Platform Settings (platformSettingsData.ts)

```text
Remove:
  defaultTimePerQuestion: 10
  timePerQuestionMin: 5
  timePerQuestionMax: 60

Add:
  objectiveTimePerQuestion: 10     (default)
  objectiveTimeMin: 5
  objectiveTimeMax: 30
  nonObjectiveTimePerQuestion: 15  (default)
  nonObjectiveTimeMin: 10
  nonObjectiveTimeMax: 60

Functions:
  getObjectiveTimePerQuestion() -> number
  setObjectiveTimePerQuestion(time) -> void
  getNonObjectiveTimePerQuestion() -> number
  setNonObjectiveTimePerQuestion(time) -> void
  getDefaultTimePerQuestion() -> number  (alias, backward compat)
```

### Timer Usage Pattern (all dialogs)

```text
import { getObjectiveTimePerQuestion, getNonObjectiveTimePerQuestion } from "@/data/platformSettingsData";

// In state init:
const [timeRemaining, setTimeRemaining] = useState(getObjectiveTimePerQuestion());

// In nextObjective():
setTimeRemaining(getObjectiveTimePerQuestion());

// For non-objective:
const [nonObjTimeRemaining, setNonObjTimeRemaining] = useState(getNonObjectiveTimePerQuestion());
setNonObjTimeRemaining(getNonObjectiveTimePerQuestion());
```

### Group Quiz Non-Objective Questions (mock)

```text
5 questions like:
- "Name the largest country in Africa by land area" -> ["algeria"]
- "What does DNA stand for?" -> ["deoxyribonucleic acid", "deoxyribonucleic"]
- etc.
```

### Standard Solo Quiz Non-Objective Questions (mock)

```text
5 questions like:
- "Name the first President of Nigeria" -> ["nnamdi azikiwe", "azikiwe"]
- "What does CPU stand for?" -> ["central processing unit"]
- etc.
```

### Files Modified
- `src/data/platformSettingsData.ts` -- split timer into objective/non-objective
- `src/components/mobigate/QuizSettingsCard.tsx` -- two timer sliders
- `src/components/community/mobigate-quiz/QuizPlayEngine.tsx` -- use admin timers
- `src/components/community/mobigate-quiz/InteractiveQuizPlayDialog.tsx` -- use admin timers
- `src/components/community/mobigate-quiz/InteractiveSessionDialog.tsx` -- inherits via QuizPlayEngine
- `src/components/community/mobigate-quiz/GroupQuizPlayDialog.tsx` -- add non-objective phase + admin timers
- `src/components/community/mobigate-quiz/StandardQuizContinueSheet.tsx` -- add non-objective phase + admin timers
- `src/components/community/mobigate-quiz/ScholarshipQuizPlayDialog.tsx` -- use admin timers
- `src/components/community/mobigate-quiz/FoodQuizPlayDialog.tsx` -- use admin timers

### Files Created
- None
