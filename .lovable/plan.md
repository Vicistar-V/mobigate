

# Merchant Question Bank: Switch from Create to Integrate + Add Initialization Fee

## Overview

Two key changes to the Merchant Quizzes Management page:

1. **Questions Tab**: Merchants should NOT create questions from scratch. The admin already creates questions via `INITIAL_ADMIN_QUESTIONS`. Instead, merchants should **browse and integrate (select)** existing admin-created questions into their quiz seasons -- both objective and non-objective (writing) versions.

2. **Season Entry / Initialization Fee**: When a user enters an interactive quiz season, there is a fixed initialization fee of **₦200 (M200)**. The total initial registrations/subscriptions per season is capped at **10,000 participants at ₦200 each** (totaling ₦2,000,000 initial registration revenue).

---

## Changes to Questions Tab (Tab 3)

### Current Behavior (Remove)
- Merchant can create, edit, and delete questions with full form (text, options A-H, correct answer, etc.)
- This duplicates the admin's job

### New Behavior (Integrate Questions)
- The tab title changes to **"Question Integration"**
- Sub-tabs remain: **Main Objective**, **Non-Objective**, **Bonus Objective**
- Instead of a "create question" form, the merchant sees:
  - **"Available Questions"** section: A browsable list of all admin-created questions from `INITIAL_ADMIN_QUESTIONS` (filtered by active status)
  - Each question card has an **"Integrate"** toggle/button to add it to the merchant's quiz bank
  - **"My Integrated Questions"** section: Shows questions the merchant has already selected
  - A **"Remove"** button on each integrated question to deselect it
- Questions are displayed read-only (no editing of question text, options, or correct answers)
- Merchant can see: question text, category, difficulty, time limit, options (for objectives), but cannot modify them
- A counter at the top shows: "X of Y questions integrated" for each sub-tab
- For **Non-Objective** questions: The merchant can set/edit the **Alternative Answers** (2-5 words/phrases) when integrating, since these are merchant-specific acceptable answers for written responses. This is the only editable field.

### Data Flow
- Source: `INITIAL_ADMIN_QUESTIONS` from `mobigateQuizQuestionsData.ts` (admin-created, objective questions with A-H options)
- For non-objective and bonus questions, continue using `mockQuestions` from `mobigateInteractiveQuizData.ts` as the available pool
- Integrated questions are stored in local state (UI template, no backend)

---

## Changes to Season Entry Fee / Initialization

### Season Creation Form Updates
- The **Entry Fee** field in the Season creation form defaults to **₦200** and displays a label: "Initialization Fee (per participant)"
- Add a new field: **"Maximum Initial Participants"** defaulting to **10,000**
- Display a calculated **"Total Initial Registration Revenue"**: Entry Fee x Max Participants (e.g., ₦200 x 10,000 = ₦2,000,000)
- This info is also shown on each season card in the seasons list

### Season Card Display Updates
- Show "Initialization Fee: ₦200.00 (M200)" on each season card
- Show "Max Participants: 10,000" 
- Show "Registration Revenue: ₦2,000,000.00" as a calculated line

### Mock Data Update
- Update `mockSeasons` entry fees to ₦200 where applicable
- Update `totalParticipants` caps and `minimumTargetParticipants` to reflect the 10,000 limit

---

## Files Modified

1. **`src/pages/MerchantPage.tsx`**:
   - Complete rewrite of `QuestionBankTab` into `QuestionIntegrationTab` -- browse and integrate admin questions instead of creating them
   - Update `SeasonsTab` create form to include initialization fee defaults (₦200) and max participants (10,000) with revenue calculation
   - Update season card display to show initialization fee and participant cap
   - Rename tab trigger from "Questions" to "Questions" (keep label, change internal component)

2. **`src/data/mobigateInteractiveQuizData.ts`**:
   - Update mock season data: set `entryFee: 200` uniformly and add max participant references where relevant

---

## Technical Notes

- `INITIAL_ADMIN_QUESTIONS` provides the pool of objective questions merchants can integrate
- `mockQuestions` provides non-objective and bonus questions for integration
- The integration UI uses checkbox/toggle pattern -- tap to add, tap to remove
- Alternative Answers for non-objective questions remain editable by the merchant (this is their only creative input on questions)
- All currency displays follow Local-First Dual Currency Protocol: ₦200.00 (M200)
- Mobile-first: all cards and toggles have min 44px touch targets
- Toast feedback on all integrate/remove actions

