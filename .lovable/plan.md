
# Fix Quiz Games Sidebar Links

## Problem
The "Play Quiz Games" and "My Quiz History" links in the sidebar navigate to dead PHP URLs (`/take_quiz.php` and `/my_quiz_account.php`) that don't exist in the React app. They need to be connected to actual quiz functionality.

## Changes

### 1. `src/components/AppSidebar.tsx`

**Add `onClick` handler support to menu items:**
- Extend the `MenuItem` interface to include an optional `onClick?: () => void` property.
- Update the `renderMenuItem` function: when an item has an `onClick`, render a `<button>` instead of an `<a>` or `<Link>`, calling `onClick` (and `handleLinkClick` to close the mobile sidebar).

**Convert "Play Quiz Games" to use `onClick`:**
- Instead of `url: "/take_quiz.php"`, set an `onClick` that opens the `QuizSelectionSheet`.
- Add `QuizSelectionSheet` state (`quizSelectionOpen`) inside `AppSidebar`.
- Render `<QuizSelectionSheet>` at the bottom of the sidebar component.

**Convert "My Quiz History" to an internal route:**
- Change `url` from `/my_quiz_account.php` to an internal route `/my-quiz-history`.

### 2. New Page: `src/pages/MyQuizHistory.tsx`

Create a mobile-optimized "My Quiz History" page displaying the player's quiz game history with:
- Summary stats cards (Total Games, Wins, Losses, Win Rate)
- A list of past game results with game mode, date, score, and win/loss status
- Mock data consistent with existing quiz data patterns
- Uses existing `Header` component and standard page layout

### 3. `src/App.tsx`

- Add route: `/my-quiz-history` mapped to the new `MyQuizHistory` page.

## Technical Details

- The `MenuItem` interface gains `onClick?: () => void`.
- In `renderMenuItem`, items with `onClick` and no sub-items render as a clickable `<button>` element styled with `SidebarMenuSubButton`.
- The `QuizSelectionSheet` is imported with `showCommunityQuiz={false}` since this is outside a community context (only Mobi Quiz available from global sidebar). Or `showCommunityQuiz={true}` to allow both -- will use `true` since the user may belong to a community.
- The history page uses mock data and follows the same card-based layout patterns used throughout the app.
