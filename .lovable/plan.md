
# Fix Sidebar Routing and Add Admin Quiz Question Creation

## Part 1: Fix Sidebar Routing

### Problem
The sidebar menu (`AppSidebar.tsx`) routes all items through `/application/*.php` paths. Routes that have been built as React pages should navigate internally, and unbuilt routes should drop the `/application` prefix (just `/*.php`).

### Built Routes to Fix
These sidebar items will be updated from `/application/*.php` to their actual React routes:

| Sidebar Item | Current URL | Corrected URL |
|---|---|---|
| My Social Communities | `/community` | `/community` (already correct) |
| Submit Adverts | `/submit-advert` | `/submit-advert` (already correct) |
| View/Manage Adverts (user) | `/my-adverts` | `/my-adverts` (already correct) |
| View/Manage All Adverts (admin) | `/admin/manage-adverts` | `/admin/manage-adverts` (already correct) |

These are already correctly set. The remaining `/application/*.php` URLs will have the `/application` prefix removed, becoming just `/*.php` (e.g., `/application/buy_coins.php` becomes `/buy_coins.php`).

### Files Modified
- `src/components/AppSidebar.tsx` -- Remove `/application` prefix from all `.php` URLs

---

## Part 2: Admin Quiz Question Creation and Management

### Problem
The admin "Quiz" tab only manages quiz levels (category + tier + stake). There is no way for admins to create the actual quiz questions (question text, 8 answer options, correct answer, category assignment).

### Solution
Add two new sections to the existing Mobigate Admin Quiz tab:

**A. "Create Questions" sub-tab** -- A form for admins to create individual quiz questions:
- Select Category (from the same 23 preset categories)
- Select Difficulty (Easy, Medium, Hard, Expert)
- Question Text (textarea)
- 8 Answer Options (A through H, text inputs)
- Select Correct Answer (dropdown A-H)
- Time Limit (seconds, default 10)
- Points (default 10)
- "Create Question" button

**B. "Manage Questions" sub-tab** -- A list view of all created questions:
- Filter by category
- Search by question text
- Each question card shows: question text (truncated), category badge, difficulty badge, correct answer highlighted
- Edit and Delete actions per question
- Stats: total questions, questions per category

### Data Structure
A new data file `src/data/mobigateQuizQuestionsData.ts` with:
- Interface `AdminQuizQuestion` (id, question, options[8], correctAnswerIndex, category, difficulty, timeLimit, points, createdAt)
- Pre-populated with the existing ~20 questions from `mobigateQuizData.ts` so the system starts with content
- Export functions for filtering and searching

### Component Structure

**New files:**
- `src/data/mobigateQuizQuestionsData.ts` -- Question data store with pre-populated questions
- `src/components/mobigate/CreateQuizQuestionForm.tsx` -- Question creation form
- `src/components/mobigate/QuizQuestionCard.tsx` -- Individual question display card
- `src/components/mobigate/QuizQuestionFilters.tsx` -- Filter/search for questions
- `src/components/mobigate/AdminQuizQuestionsManager.tsx` -- Orchestrator for question CRUD

**Modified files:**
- `src/components/AppSidebar.tsx` -- Fix routing (remove `/application` prefix)
- `src/components/mobigate/MobigateQuizManagement.tsx` -- Add inner tabs: "Levels" (existing) and "Questions" (new)

### Admin Quiz Tab Layout (after changes)
```text
Quiz Tab
  |-- Sub-tab: Levels (existing content - create/manage levels)
  |-- Sub-tab: Questions (new)
        |-- Create Question Form
        |-- Stats Summary (total, by category)
        |-- Filters (category, search)
        |-- Question Cards List (with edit/delete)
```

### Mobile-First Design
- All inputs use h-12 and text-base for touch-friendliness
- Sub-tabs use a simple toggle button group (Levels | Questions)
- Question cards show truncated question text with "View Full" expand
- Answer options displayed in a 2-column grid (A-D, E-H) on the creation form
- ScrollArea for the questions list

## Technical Notes
- All data is mock/static (UI template, no backend)
- State managed with useState for CRUD operations
- Toast notifications for create, edit, and delete actions
- Pre-populated questions sourced from existing `mobigateQuizData.ts` question arrays
- The sidebar routing fix applies globally to all `.php` links (about 40+ URLs)
