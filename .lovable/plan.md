

# Full Restructure: Quiz Management System

## Current Problem
All 5 sidebar items under "Manage Quiz" point to the same single page (`/mobigate-admin/quiz`), which bundles everything into one monolithic view with sub-tabs. This defeats the purpose of having distinct sidebar menu items. Each menu item should lead to its own dedicated page.

## New Route Structure

| Sidebar Item | Route | Page | Content |
|---|---|---|---|
| Set Categories | `/mobigate-admin/quiz/categories` | Dedicated category management | Create, enable/disable, delete quiz categories |
| Set Quiz Levels | `/mobigate-admin/quiz/levels` | Dedicated level management | Existing `MobigateQuizLevelsManagement` component (create levels, set stakes, toggle active) |
| Set Questions | `/mobigate-admin/quiz/questions/create` | Question creation page | The `CreateQuizQuestionForm` as the hero of its own page |
| Manage Questions | `/mobigate-admin/quiz/questions` | Question list + management | Existing `AdminQuizQuestionsManager` (filters, cards, edit, delete) |
| Monitor All Quiz | `/mobigate-admin/quiz/monitor` | Live quiz monitoring dashboard | Active sessions, player counts, stakes in play, recent results |

## New Pages to Create

### 1. Quiz Categories Page (`/mobigate-admin/quiz/categories`)
- Full-screen mobile page with `MobigateAdminHeader`
- List all 23 preset categories with toggle switches (active/inactive)
- "Add Custom Category" form at top (text input + create button)
- Stats: total categories, active count
- Each card shows category name, question count in that category, and a delete action for custom ones

### 2. Quiz Levels Page (`/mobigate-admin/quiz/levels`)
- Wraps existing `MobigateQuizLevelsManagement` in its own page with header
- Already fully functional -- just needs its own route

### 3. Create Questions Page (`/mobigate-admin/quiz/questions/create`)
- Dedicated page for the `CreateQuizQuestionForm`
- After successful creation, shows a toast with option to "Create Another" or "View All Questions"
- Clean, focused single-purpose page

### 4. Manage Questions Page (`/mobigate-admin/quiz/questions`)
- The existing `AdminQuizQuestionsManager` minus the create form (moved to its own page)
- Filters, search, question cards with edit/delete
- A prominent "Create New Question" button at top linking to the create page

### 5. Monitor Quiz Page (`/mobigate-admin/quiz/monitor`)
- New dashboard showing mock live quiz data:
  - Active quiz sessions count
  - Total players currently in games
  - Total stakes in play
  - Recent completed quizzes (last 10) with results
  - Breakdown by game mode (Group, Solo, Interactive, Food, Scholarship)

## Changes to Existing Files

### Sidebar (`AppSidebar.tsx`)
- Update each "Manage Quiz" sub-item URL to its dedicated route

### Admin Dashboard (`MobigateAdminDashboard.tsx`)
- Update the Quiz tab's "Open Quiz Management" to show quick-link cards to all 5 sub-pages instead of one button

### Routes (`App.tsx`)
- Replace single `/mobigate-admin/quiz` route with 5 new routes
- Remove old `MobigateQuizManagementPage`

### `AdminQuizQuestionsManager.tsx`
- Remove embedded `CreateQuizQuestionForm` (it gets its own page)
- Add a "Create New Question" navigation button at top

### `MobigateQuizManagement.tsx`
- Remove (no longer needed -- replaced by individual pages)

### `MobigateQuizManagementPage.tsx`
- Remove (replaced by individual pages)

## Files Summary

**New files (5 pages):**
- `src/pages/admin/quiz/QuizCategoriesPage.tsx`
- `src/pages/admin/quiz/QuizLevelsPage.tsx`
- `src/pages/admin/quiz/CreateQuestionPage.tsx`
- `src/pages/admin/quiz/ManageQuestionsPage.tsx`
- `src/pages/admin/quiz/MonitorQuizPage.tsx`

**Modified files:**
- `src/components/AppSidebar.tsx` -- 5 unique routes
- `src/App.tsx` -- register 5 new routes, remove old one
- `src/pages/admin/MobigateAdminDashboard.tsx` -- Quiz tab shows 5 quick-link cards
- `src/components/mobigate/AdminQuizQuestionsManager.tsx` -- remove embedded create form, add nav button

**Removed files:**
- `src/components/mobigate/MobigateQuizManagement.tsx` (no longer needed)
- `src/pages/admin/MobigateQuizManagementPage.tsx` (replaced by individual pages)

