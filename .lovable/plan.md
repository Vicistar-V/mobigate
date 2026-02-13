
# Enhance Monitor Quiz Detail Drawer + Player Profile Links

## What the user wants
1. The Game Mode cards on Monitor Quiz should **still open the MonitorDetailDrawer** (showing stats like Active Sessions, Total Players, etc.) but with a **"View All Games Played" button** at the bottom that navigates to the new games-played page
2. Clicking on a **player's name** (in the games list cards or in the detail drawer) should open their **profile preview** (MemberPreviewDialog)

## Changes

### 1. Revert MonitorQuizPage mode card click back to drawer
**File:** `src/pages/admin/quiz/MonitorQuizPage.tsx`
- Change mode card `onClick` back to `setDrawerData({ type: "mode", data: m })` instead of navigating directly
- Keep the `useNavigate` import (it will be used by the drawer)
- Remove the `ChevronRight` icon from mode cards (optional, or keep it)

### 2. Add "View All Games Played" button to MonitorDetailDrawer
**File:** `src/components/mobigate/MonitorDetailDrawer.tsx`
- Add `useNavigate` from react-router-dom
- In `ModeContent`, add a full-width "View All Games Played" button at the bottom that navigates to `/mobigate-admin/quiz/games-played?mode={modeName}`
- Style it prominently (primary button, full width)

### 3. Make player names tappable in QuizGamesPlayedPage
**File:** `src/pages/admin/quiz/QuizGamesPlayedPage.tsx`
- Add `MemberPreviewDialog` integration
- Create a mock `ExecutiveMember` object from the game record's player data (name, state, country) when tapped
- Clicking the player name in a game card opens the profile preview
- Clicking the card itself (other areas) still opens the QuizGameDetailDrawer

### 4. Make player name tappable in QuizGameDetailDrawer
**File:** `src/components/mobigate/QuizGameDetailDrawer.tsx`
- Make the "Player Name" row value a tappable link that opens MemberPreviewDialog
- Add state + dialog for the member preview within the drawer

### Technical Notes
- The `MemberPreviewDialog` requires an `ExecutiveMember` object. Since quiz players aren't in the executives data, we create a lightweight mock member from the game record (id, name, position set to player's state, imageUrl as placeholder)
- Player name tap uses `e.stopPropagation()` to prevent the card's onClick from also firing
- The MonitorDetailDrawer needs an `onClose` callback or `useNavigate` to handle the "View All Games Played" navigation (close drawer first, then navigate)

### Files to edit
1. `src/pages/admin/quiz/MonitorQuizPage.tsx` -- revert mode card click to open drawer
2. `src/components/mobigate/MonitorDetailDrawer.tsx` -- add "View All Games Played" button + pass mode name
3. `src/pages/admin/quiz/QuizGamesPlayedPage.tsx` -- add player name tap to open profile
4. `src/components/mobigate/QuizGameDetailDrawer.tsx` -- add player name tap to open profile
