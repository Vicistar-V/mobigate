

# Direct Mobi Quiz Access and Quiz Games Page

## What's Changing

Two issues need fixing:

1. **Sidebar "Play Quiz Games"** currently opens a selection sheet with both Community Quiz and Mobi Quiz options. Since Community Quiz is only for community members within that community's interface, the sidebar should go directly to Mobi Quiz -- no selection sheet needed.

2. **Dashboard "..." menu** has a "Mobi Quiz Games" link pointing to `/mobi-quiz-game`, but that route doesn't exist -- tapping it leads to a blank page.

## Plan

### 1. Create a new Mobi Quiz Games page (`src/pages/MobiQuizGames.tsx`)

A dedicated mobile-optimized page at `/mobi-quiz-games` that serves as the hub for Mobigate Quiz Games. It will feature:

- A header with back navigation and page title
- The `MobiQuizGameDialog` content embedded directly (or launched via a prominent "Start Playing" button)
- Quick stats section (games played, win rate, etc.)
- Links to Quiz History
- The five game mode cards (Group, Standard Solo, Interactive, Food for Home, Scholarship) for browsing

### 2. Update Sidebar (`src/components/AppSidebar.tsx`)

- Remove `QuizSelectionSheet` import and state
- Instead, change "Play Quiz Games" from an `onClick` handler to a simple link pointing to `/mobi-quiz-games`
- This eliminates the unnecessary selection step

### 3. Update Dashboard More Menu (`src/components/GreetingCard.tsx`)

- Change the "Mobi Quiz Games" href from `/mobi-quiz-game` to `/mobi-quiz-games` (matching the new route)

### 4. Register Route (`src/App.tsx`)

- Add `/mobi-quiz-games` route mapped to the new `MobiQuizGames` page

## Technical Details

- The new page will import `MobiQuizGameDialog` and open it when the user taps "Start Playing" or a game mode card
- The page uses the existing `Header` component and follows the same card-based layout as other pages
- Game mode cards will be styled with the established amber/orange theme for Mobi Quiz
- Stats section uses mock data consistent with the quiz history page
- Mobile-first layout with proper touch targets and scroll behavior
