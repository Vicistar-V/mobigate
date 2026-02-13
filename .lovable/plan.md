
# "View All Games Played" -- Full Player History Page per Game Mode

## Overview
When clicking any game mode card (Group Quiz, Standard Solo, Interactive, Food for Home, Scholarship), instead of the current simple stats drawer, it will navigate to a dedicated **full-page view** showing all games played for that mode, with detailed player info, win/loss records, stakes, dates, and advanced filtering/sorting.

---

## What Changes

### 1. New Mock Data File: `src/data/quizGamesPlayedData.ts`
- Create rich mock data for individual game records with:
  - **Game ID** (e.g., `QG-2024-00142`) -- linkable
  - **Player Name**, **State/Country**
  - **Game Mode** (to filter by mode)
  - **Result**: Win or Loss
  - **Stake Paid** (in Mobi)
  - **Prize Won** (in Mobi)
  - **Category**, **Difficulty**
  - **Date Played** (full timestamp for filtering by year/month/day)
  - **Score**
- ~20-25 records spread across modes with varied dates for realistic filtering

### 2. New Page: `src/pages/admin/quiz/QuizGamesPlayedPage.tsx`
Route: `/mobigate-admin/quiz/games-played?mode=Standard Solo` (mode passed as query param)

**Layout (mobile-first, vertical stacking):**

- **Header**: Back arrow + "Standard Solo -- Games Played" title
- **Summary Stats Row**: 2-col grid showing Total Games, Total Players, Total Stakes, Win Rate
- **Filter/Sort Section**:
  - Sort dropdown with options: Newest Play, Oldest Play, Wins First, Losses First
  - Date filter: Year picker, Month picker, Day picker (vertical stack, full-width selects)
  - Search by player name
- **Games List**: Vertically stacked cards, each showing:
  - Row 1: Player Name (full, wrapped with `break-words`) + Win/Loss badge
  - Row 2: Game ID (styled as a tappable link in primary color) + State/Country
  - Row 3: Stake Paid + Prize Won
  - Row 4: Category + Difficulty badge + Date
- Tapping a card opens a **detail drawer** with all fields in one-stat-per-row layout

### 3. New Component: `src/components/mobigate/QuizGameDetailDrawer.tsx`
Mobile drawer (92vh) showing full details for a single game record:
- Game ID (linkable/copyable)
- Player Name, State, Country
- Game Mode, Category, Difficulty
- Score, Result (Win/Loss)
- Stake Paid, Prize Won, Net Position
- Date and Time Played

### 4. Update `MonitorQuizPage.tsx`
- Change game mode card `onClick` from opening the drawer to navigating via `useNavigate` to `/mobigate-admin/quiz/games-played?mode={modeName}`
- Keep the "Recent Results" cards opening the existing `MonitorDetailDrawer` as-is
- Add a "View All Games Played" link/button visible at the top or within each mode card

### 5. Register New Route
- Add route for `/mobigate-admin/quiz/games-played` in the app router

---

## Technical Details

**Filter implementation:**
- All filtering/sorting is client-side using the mock data array
- `useState` for sort order, year/month/day filters, and search text
- `useMemo` to derive filtered + sorted list
- Sort options: `newest` (default), `oldest`, `wins-first`, `losses-first`
- Date filters: Extract unique years/months from data for dropdown options; day is a number input 1-31

**Card layout pattern (per game record):**
```text
+---------------------------------------------+
| Adebayo Johnson                   [Won]     |
| QG-2024-00142  |  Lagos, Nigeria            |
| Stake: M5,000  |  Prize: M12,000            |
| Sports  |  Medium  |  Jan 15, 2025           |
+---------------------------------------------+
```

**Mobile patterns followed:**
- All containers use `break-words` for text
- Full-width selects and inputs for filters
- Vertical stacking throughout
- Drawer uses `max-h-[92vh]`, `overflow-y-auto`, `touch-auto`
- No horizontal scroll anywhere

**Files to create:**
1. `src/data/quizGamesPlayedData.ts`
2. `src/pages/admin/quiz/QuizGamesPlayedPage.tsx`
3. `src/components/mobigate/QuizGameDetailDrawer.tsx`

**Files to edit:**
1. `src/pages/admin/quiz/MonitorQuizPage.tsx` -- change mode card click to navigate
2. App router file -- add new route
