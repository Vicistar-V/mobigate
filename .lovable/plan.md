
# Interactive Quiz Merchant Admin -- Complete Overhaul

## Summary

Rebuild the Interactive Quiz Merchant Admin system to reflect the full Game Show specification. Merchants are approved (not added), and each merchant configures their own quiz platform with custom settings, selection processes, question databases, billing, and seasons.

---

## 1. Expanded Data Model

**File: `src/data/mobigateInteractiveQuizData.ts`** -- Complete rewrite

### QuizMerchant (enhanced)
Add merchant-level quiz configuration fields:
- `applicationStatus`: "pending" | "approved" | "suspended"
- `winPercentageThreshold`: number (25-50%) -- what players earn on correct answers
- `fairAnswerPercentage`: number (fixed 20%) -- AA match credit
- `bonusGamesAfter`: number (default 50) -- after how many games to grant bonus
- `bonusGamesCount`: [min, max] (5-10) -- number of bonus games granted
- `bonusDiscountRange`: [min, max] (25-50%) -- discount on bonus game costs
- `qualifyingPoints`: number (default 15) -- points needed to enter Game Show
- `questionsPerPack`: number (default 15)
- `objectivePerPack`: number (default 10)
- `nonObjectivePerPack`: number (default 5)
- `objectiveOptions`: number (8-10) -- min 8, max 10 selectable answers
- `alternativeAnswersRange`: [min, max] (2-5) -- AA count for non-objective
- `costPerQuestion`: number -- what player pays per question

### QuizSeason (enhanced)
Add:
- `duration`: number (months: 4, 6, or 12)
- `selectionProcesses`: SelectionProcess[] -- the elimination funnel
- `tvShowRounds`: TVShowRound[] -- post-selection TV rounds

### New types
```
SelectionProcess {
  round: number
  entriesSelected: number
  entryFee: number
}

TVShowRound {
  round: number
  entriesSelected: number
  entryFee: number
  label: string (e.g. "Semi-Final", "Grand Finale")
}

MerchantQuestion {
  id, question, options[], correctAnswerIndex,
  category, difficulty, type: "objective" | "non_objective" | "bonus_objective",
  alternativeAnswers?: string[] (for non-objective),
  merchantId, timeLimit, costPerQuestion
}
```

### Mock data
- 5 merchants with varied config values and "approved" status (1 pending, 1 suspended for variety)
- 2 seasons with full selection process arrays
- 3 separate question arrays per merchant concept: Main Objective, Main Non-Objective, Bonus Objective

---

## 2. Merchant Admin Component Overhaul

**File: `src/components/mobigate/InteractiveMerchantAdmin.tsx`** -- Major rewrite

### Merchant List View (replaces current)
- Remove "Add New Merchant" button entirely
- Show merchant cards with `applicationStatus` badge (Approved/Pending/Suspended)
- Admin can toggle status between Approved/Suspended (not add)
- Stats row: Total Merchants, Approved, Active Seasons
- Each card shows: name, category, verified badge, seasons count, status badge, tap to drill in

### Merchant Detail View (replaces current)
When tapping a merchant, show a tabbed/sectioned view with:

**Section A: Platform Settings** (new Drawer)
- Quiz Pack Config: Questions per pack, Objective count, Non-Objective count, Objective options (8-10)
- Billing: Cost per question
- Win Thresholds: Win percentage (25-50%), Fair Answer % (20%)
- Alternative Answers: AA count range (2-5)
- Qualifying Points: Min points to enter Game Show (default 15)
- Bonus Config: Games before bonus (50), bonus games count (5-10), discount range (25-50%)

**Section B: Seasons** (existing, enhanced)
- Enhanced season cards showing duration, processes count
- "Add Season" drawer with:
  - Season Name, Type (Short/Medium/Complete)
  - Duration auto-set: Short=4mo, Medium=6mo, Complete=12mo
  - Process count auto-set: Short=3, Medium=5, Complete=7
  - Entry fee for initial registration

**Section C: Selection Process Builder** (new, per-season)
- Tap a season to see/configure its selection funnel
- Visual step-by-step card list showing each elimination round
- Each round: Round number, entries selected, entry fee
- "Add Round" and "Remove Round" controls
- TV Show rounds section below (with labels like "Semi-Final", "Grand Finale")
- Final 3 entries auto-labeled as 1st/2nd/3rd Prize Winners

**Section D: Question Banks** (new)
- 3 tabs: "Main Objective", "Main Non-Objective", "Bonus Objective"
- Question count per bank shown as badge
- Tap to see list, with Add Question drawer
- Non-Objective question form includes "Alternative Answers" field (2-5 entries)

---

## 3. New Components

### `MerchantPlatformSettingsDrawer.tsx`
Mobile drawer (92vh) for editing the merchant's quiz configuration:
- All the settings from Section A above
- Numeric inputs with proper mobile patterns (touch-manipulation, inputMode)
- Sliders for percentage ranges

### `MerchantSelectionProcessDrawer.tsx`
Mobile drawer for building/viewing the elimination funnel for a season:
- Step cards showing the funnel visually
- Add/remove rounds
- TV Show rounds with customizable labels
- Grand Finale section showing 1st/2nd/3rd winners

### `MerchantQuestionBankDrawer.tsx`
Mobile drawer for managing a merchant's 3 question databases:
- Tab navigation: Main Objective | Main Non-Objective | Bonus Objective
- Question list with status badges
- Add Question form (adapts per question type)
- Non-Objective form has extra "Alternative Answers" multi-input (2-5 entries)

---

## 4. Files to Create
- `src/components/mobigate/MerchantPlatformSettingsDrawer.tsx`
- `src/components/mobigate/MerchantSelectionProcessDrawer.tsx`
- `src/components/mobigate/MerchantQuestionBankDrawer.tsx`

## 5. Files to Modify
- `src/data/mobigateInteractiveQuizData.ts` -- Expand types and mock data
- `src/components/mobigate/InteractiveMerchantAdmin.tsx` -- Complete rewrite of merchant list and detail views
- `src/pages/admin/quiz/InteractiveMerchantsPage.tsx` -- Minor: update heading text

## 6. Files NOT Changed
- `src/components/community/mobigate-quiz/InteractiveQuizMerchantSheet.tsx` -- Player-facing, not admin
- `src/components/community/mobigate-quiz/InteractiveQuizPlayDialog.tsx` -- Player-facing gameplay
- `src/components/mobigate/QuizAdminDrawer.tsx` -- Already links to merchants page correctly
- All other quiz type admin pages -- Unaffected

---

## Mobile Patterns Applied Throughout
- All drawers: max-h-[92vh], p-0, overflow-y-auto touch-auto overscroll-contain
- All inputs: h-11 or h-12, touch-manipulation, onPointerDown stopPropagation
- Numeric inputs: type="text" with inputMode="numeric" and regex filtering
- Cards: active:scale-[0.98] for tactile feedback
- No ScrollArea -- native overflow-y-auto only
