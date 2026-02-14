
# Separate Quiz Admin Systems Per Quiz Type + Interactive Quiz Merchant Admin

## Current State

Right now, there is **one centralized** admin question management system under "Manage Quiz" in the Mobigate Admin sidebar. All five quiz types (Group, Standard Solo, Interactive, Food for Home, Scholarship) share the same:
- Categories page
- Levels page
- Question creation form
- Question management page
- Monitor page

The Interactive Quiz has a player-facing merchant/season flow (InteractiveQuizMerchantSheet -> InteractiveQuizSeasonSheet -> InteractiveQuizPlayDialog) but **no merchant admin area** where merchants can manage their own questions, seasons, or settings.

## What This Plan Delivers

### 1. Restructured Admin Sidebar: Per-Quiz-Type Admin Sections

Replace the single "Manage Quiz" menu with **five separate sub-menus** under a "Quiz Administration" parent, one per quiz type:

- **Group Quiz Admin** -- Categories, Levels, Questions, Monitor
- **Standard Solo Admin** -- Categories, Levels, Questions, Monitor
- **Interactive Quiz Admin** -- Merchant Management, Categories, Levels, Questions, Monitor
- **Food for Home Admin** -- Categories, Levels, Questions, Monitor
- **Scholarship Quiz Admin** -- Categories, Levels, Questions, Monitor

Each links to its own dedicated route namespace (e.g., `/mobigate-admin/quiz/group/questions`, `/mobigate-admin/quiz/interactive/merchants`).

### 2. New: Interactive Quiz Merchant Admin Page

A dedicated page at `/mobigate-admin/quiz/interactive/merchants` that lets the Mobigate admin (and in future, merchants themselves) manage Interactive Quiz platforms:

- **Merchant list** with status, seasons count, prize pool stats
- **Add/Edit Merchant** form (name, category, logo, verification status)
- **Per-merchant drill-down** showing their seasons with settings (season name, type, entry fee, levels, prize per level, live/status toggle)
- **Merchant Question Management**: A dedicated question management interface scoped to the Interactive Quiz, with the additional twist that questions can be tagged to specific merchants or marked as "Global Pool"

### 3. Quiz-Type-Scoped Question Pages

Each quiz type gets its own Create Question and Manage Questions pages. The key differences:

- The **question form** will include a "Quiz Type" field pre-filled and locked to the current type
- The **data layer** uses type-scoped mock data arrays (e.g., `INITIAL_GROUP_QUIZ_QUESTIONS`, `INITIAL_INTERACTIVE_QUESTIONS`, etc.)
- Interactive Quiz questions have an extra "Merchant" selector and a toggle for "Mixed Categories" (random from all categories vs. single category)
- All other quiz types keep the same form structure (Category, Difficulty, Level, Options A-H, etc.)

### 4. Updated Mobigate Admin Dashboard Quiz Tab

The Quiz tab on the admin dashboard will show the five quiz types as top-level cards, each expanding into their respective admin sections instead of the current flat list.

### 5. Updated Routes (App.tsx)

New routes following the pattern `/mobigate-admin/quiz/:quizType/:action`:

```text
/mobigate-admin/quiz/group/categories
/mobigate-admin/quiz/group/levels
/mobigate-admin/quiz/group/questions/create
/mobigate-admin/quiz/group/questions
/mobigate-admin/quiz/group/monitor

/mobigate-admin/quiz/standard/categories
/mobigate-admin/quiz/standard/levels
/mobigate-admin/quiz/standard/questions/create
/mobigate-admin/quiz/standard/questions
/mobigate-admin/quiz/standard/monitor

/mobigate-admin/quiz/interactive/merchants
/mobigate-admin/quiz/interactive/categories
/mobigate-admin/quiz/interactive/levels
/mobigate-admin/quiz/interactive/questions/create
/mobigate-admin/quiz/interactive/questions
/mobigate-admin/quiz/interactive/monitor

/mobigate-admin/quiz/food/categories
/mobigate-admin/quiz/food/levels
/mobigate-admin/quiz/food/questions/create
/mobigate-admin/quiz/food/questions
/mobigate-admin/quiz/food/monitor

/mobigate-admin/quiz/scholarship/categories
/mobigate-admin/quiz/scholarship/levels
/mobigate-admin/quiz/scholarship/questions/create
/mobigate-admin/quiz/scholarship/questions
/mobigate-admin/quiz/scholarship/monitor
```

## Technical Approach

### Reusable Wrapper Components
To avoid duplicating entire page components 5 times, a wrapper pattern will be used:

- **QuizTypeAdminPage** -- A wrapper that accepts `quizType` as a prop/URL param and renders the appropriate scoped version of Categories, Levels, Questions, or Monitor pages
- The existing `CreateQuizQuestionForm`, `AdminQuizQuestionsManager`, `MobigateQuizLevelsManagement` components will be refactored to accept a `quizType` prop that scopes their mock data and display

### New Mock Data Structure
```text
src/data/quizTypeQuestionsData.ts
  - INITIAL_GROUP_QUESTIONS[]
  - INITIAL_STANDARD_QUESTIONS[]
  - INITIAL_INTERACTIVE_QUESTIONS[] (with merchantId field)
  - INITIAL_FOOD_QUESTIONS[]
  - INITIAL_SCHOLARSHIP_QUESTIONS[]
```

### New Components
- `InteractiveQuizMerchantAdmin.tsx` -- Merchant list, add/edit forms, season management
- `InteractiveQuizMerchantDetailPage.tsx` -- Per-merchant drill-down with seasons and question management

### Modified Files
- `src/App.tsx` -- Add all new quiz-type-scoped routes
- `src/components/AppSidebar.tsx` -- Replace single "Manage Quiz" with 5 sub-menus
- `src/pages/admin/MobigateAdminDashboard.tsx` -- Restructure Quiz tab into 5 quiz-type cards
- `src/pages/admin/quiz/CreateQuestionPage.tsx` -- Accept quizType param, lock the type field
- `src/pages/admin/quiz/ManageQuestionsPage.tsx` -- Accept quizType param, filter data by type
- `src/pages/admin/quiz/QuizCategoriesPage.tsx` -- Accept quizType param
- `src/pages/admin/quiz/QuizLevelsPage.tsx` -- Accept quizType param
- `src/pages/admin/quiz/MonitorQuizPage.tsx` -- Accept quizType param, filter monitored data by type
- `src/components/mobigate/CreateQuizQuestionForm.tsx` -- Add quizType prop, add merchant selector for Interactive
- `src/components/mobigate/AdminQuizQuestionsManager.tsx` -- Scope to quizType

### New Files
- `src/pages/admin/quiz/InteractiveMerchantsPage.tsx`
- `src/components/mobigate/InteractiveMerchantAdmin.tsx`
- `src/data/quizTypeQuestionsData.ts`

All pages are mobile-first with the established design patterns (drawers, cards, touch targets, overflow-y-auto, max-h constraints).
