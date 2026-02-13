
# Add Question Status Filters (Active / Frozen / Suspended) + Suspend Action

## Overview
Add a status system to quiz questions with three states: **Active**, **Frozen**, and **Suspended**. Include status filter tabs on the Manage Questions page and a Suspend/Reactivate action button on each question card.

---

## Data Model Changes

**File: `src/data/mobigateQuizQuestionsData.ts`**
- Add `status` field to `AdminQuizQuestion` interface: `"active" | "frozen" | "suspended"`
- Add `timesAsked` field (number) to track how many times a question has been used (frozen at 3)
- Add `suspendedUntil` field (optional string/date) for admin-set reactivation date
- Add `freezeCount` field (number, default 0) to count freeze cycles
- Populate mock data with varied statuses -- most active, a few frozen (timesAsked = 3), one or two suspended

---

## Filter Tabs on Manage Questions Page

**File: `src/pages/admin/quiz/ManageQuestionsPage.tsx`**
- Add a tab row between the Stats card and the Category/Search filters with three tabs: **Active**, **Frozen**, **Suspended**
- Each tab shows its count as a badge (e.g., "Active (15)")
- Default tab: Active
- Filtering logic in `useMemo` incorporates the selected status tab
- Stats card updates to show 3 columns: Active count, Frozen count, Suspended count (replacing current 2-col layout)

---

## Question Card Updates

**File: `src/components/mobigate/QuizQuestionCard.tsx`**
- Add new props: `onSuspend(id)` and `onReactivate(id)`
- Show a small status indicator badge at the top-right of the card:
  - Active: green dot/badge
  - Frozen: blue/cyan "Frozen" badge with snowflake-like styling
  - Suspended: red "Suspended" badge
- For **Active** questions: Show 3 buttons -- Edit, Suspend, Delete
- For **Frozen** questions: Show info text like "Asked 3 times -- Frozen until period ends" and Edit + Delete buttons (no suspend needed, it is automatic)
- For **Suspended** questions: Replace Edit+Delete row with "Suspended" label + "Reactivate" button (green/emerald). Also keep Delete available
- Show `timesAsked` count as a small label (e.g., "Asked: 2/3")

---

## Suspend/Reactivate Logic

**File: `src/pages/admin/quiz/ManageQuestionsPage.tsx`**
- `handleSuspend(id)`: Sets question status to `"suspended"`, shows a toast
- `handleReactivate(id)`: Sets question status back to `"active"`, resets `timesAsked` to 0, shows a toast
- Pass these handlers down to `QuizQuestionCard`

---

## Technical Details

### Updated `AdminQuizQuestion` interface:
```text
status: "active" | "frozen" | "suspended"
timesAsked: number        // auto-freezes at 3
suspendedUntil?: string   // optional date for auto-reactivation
freezeCount: number       // how many times this question has been frozen
```

### Tab layout (mobile-first):
```text
[ Active (15) ] [ Frozen (3) ] [ Suspended (2) ]
```
- Uses the existing Tabs component from the project
- Full-width, horizontally scrollable if needed

### Card action button layouts:
- **Active**: `[ Edit ] [ Suspend ] [ Delete ]` -- 3 buttons in a row
- **Frozen**: `[ Edit ] [ Delete ]` with a frozen info banner above
- **Suspended**: `[ Reactivate ] [ Delete ]` with suspended badge prominent

### Files to edit:
1. `src/data/mobigateQuizQuestionsData.ts` -- add status fields + update mock data
2. `src/pages/admin/quiz/ManageQuestionsPage.tsx` -- add status tabs, handlers
3. `src/components/mobigate/QuizQuestionCard.tsx` -- add status display + suspend/reactivate buttons
