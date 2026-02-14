
# Add Per-Question Timer to Interactive Quiz Non-Objective Questions

## Problem
The 5 non-objective (written) questions in the Interactive Quiz all appear simultaneously with a single "Submit All Answers" button and no timer. They should appear **one at a time**, each with a **15-second countdown timer**, advancing automatically when the user submits an answer or when time runs out.

## Changes

### File: `src/components/community/mobigate-quiz/InteractiveQuizPlayDialog.tsx`

**New state variables:**
- `currentNonObjQ` (number, default 0) -- tracks which non-objective question is currently shown (0-4)
- `nonObjTimeRemaining` (number, default 15) -- countdown timer for the current non-objective question
- `nonObjShowResult` (boolean) -- briefly shows correct/incorrect before advancing

**New timer effect (for non-objective phase):**
- Runs when `phase === "non_objective"` and the current question hasn't been answered yet
- Counts down from 15 to 0
- At 0, auto-locks the current answer (empty string if nothing typed), shows result briefly, then advances to the next question
- When all 5 are done, tallies correct answers and moves to the "result" phase

**New answer submission logic:**
- When user types an answer and presses "Confirm Answer" (or timer expires), the current answer is locked
- A brief 1.5s result display shows correct/incorrect
- Then advances `currentNonObjQ` to the next question, resets `nonObjTimeRemaining` to 15
- After question 5 (index 4), calculates `nonObjectiveCorrect` and transitions to "result" phase

**Updated non-objective UI:**
- Replace the `.map()` that renders all 5 questions with a single-question view showing only `interactiveNonObjectiveQuestions[currentNonObjQ]`
- Add timer display (same clock style as objective phase) above the question
- Show progress indicator: "Q11/15", "Q12/15", etc.
- Show a "Confirm Answer" button instead of "Submit All Answers"
- The `NonObjectiveQuestionCard` renders for only the current question, with `disabled` when result is showing

**Updated header subtitle:**
- Change from static "Q11-15 (Type Your Answer)" to dynamic `Q${11 + currentNonObjQ}/15 (Type Your Answer)`

**Updated progress bar:**
- Reflect per-question progress in non-objective phase: `((10 + currentNonObjQ + (nonObjShowResult ? 1 : 0)) / totalQuestions) * 100`

**Reset logic:**
- Add `currentNonObjQ`, `nonObjTimeRemaining`, `nonObjShowResult` to the reset effect when dialog closes

**Timer value (15s):**
- Use a constant `NON_OBJECTIVE_TIME_PER_QUESTION = 15` at the top of the file for easy editing

### No changes to `NonObjectiveQuestionCard.tsx`
The existing component already supports all needed props (`disabled`, `showResult`, `isCorrect`, `onAnswer`). It will be reused as-is, just rendered one at a time instead of in a loop.

## Technical Details
- The per-question timer uses the same `setInterval` pattern already used for objective questions
- Answer locking works by saving into the `nonObjectiveAnswers` array at index `currentNonObjQ`
- The `NonObjectiveQuestionCard` needs a `key={currentNonObjQ}` to force remount (fresh input) for each new question
- Scoring logic remains identical -- just runs after the 5th question instead of on a "Submit All" button press
