
# Live Scoreboard with Fan Engagement for Interactive Quiz

## Overview

This plan adds a **Live Scoreboard** system to the Interactive Quiz that displays the top 15 leading players during active games. Viewers (non-players and other players) can interact with contestants through **Comment**, **Share**, **Like**, and **Join Fans** actions -- each of which debits a small token fee from the viewer's wallet. Admin can configure these fan engagement charges.

---

## What Gets Built

### 1. Live Scoreboard Display
- A real-time leaderboard showing the **top 15 players** currently playing any active Interactive Quiz game
- Each player entry shows: rank, avatar, name, points earned, current session, win streak, and merchant/season name
- Visible to both active players and spectators viewing any active game
- Accessible from the Interactive Quiz Merchant Sheet and Season Sheet via a "Live Scoreboard" button

### 2. Fan Engagement Actions (with Wallet Charges)
On each player's scoreboard entry, viewers can:
- **Like** a contestant (heart icon) -- debits a small fee
- **Comment** on a contestant (opens a mini comment input) -- debits a fee per comment
- **Share** a contestant (share icon) -- debits a fee
- **Join Fans** of a contestant (star/follow icon) -- debits a one-time fee per contestant

Each action shows a confirmation toast with the amount charged.

### 3. Admin-Configurable Fan Engagement Fees
In the Mobigate Admin panel (alongside existing Quiz Settings), a new **"Fan Engagement Charges"** settings card where admin can set/modify:
- Like Fee (default: M50, range: M10 - M500)
- Comment Fee (default: M100, range: M20 - M1,000)
- Share Fee (default: M75, range: M10 - M500)
- Join Fans Fee (default: M200, range: M50 - M2,000)

---

## Files and Changes

### New Files (3)

**`src/data/liveScoreboardData.ts`**
- `LiveScoreboardPlayer` interface: id, name, avatar, merchantName, seasonName, points, currentSession, winStreak, totalCorrect, totalPlayed, fanCount, likes, comments, shares, isOnline, lastActivityTime
- `FanEngagementSettings` interface with fees for like, comment, share, joinFans (each with value, min, max)
- Default `fanEngagementSettings` object with initial values
- Getter/setter functions: `getFanLikeFee()`, `setFanLikeFee()`, etc.
- `mockLiveScoreboardPlayers`: 15 mock players with realistic data for display
- `FanAction` type: `"like" | "comment" | "share" | "join_fans"`

**`src/components/community/mobigate-quiz/LiveScoreboardDrawer.tsx`**
- Mobile-first Drawer component showing the live scoreboard
- Sticky header with "Live Scoreboard" title, pulsing red "LIVE" badge, and player count
- ScrollArea listing top 15 players as cards, each showing:
  - Rank badge (#1 gold, #2 silver, #3 bronze, rest neutral)
  - Avatar, player name, merchant/season
  - Points, session number, win streak
  - Fan engagement action bar: Like (heart), Comment (message), Share (share), Join Fans (star)
- Each action button shows the fee amount in tiny text below the icon
- On tap: confirmation toast showing "Liked PlayerName -- M50 charged" (or similar)
- Comment action opens a small inline input field for typing a comment before submitting
- "Join Fans" toggles to "Joined" state after first tap (one-time charge per player)
- Fan counts displayed next to each player

**`src/components/mobigate/FanEngagementSettingsCard.tsx`**
- Admin settings card (same pattern as QuizSettingsCard) with sliders for:
  - Like Fee (M10 - M500, step M10)
  - Comment Fee (M20 - M1,000, step M10)
  - Share Fee (M10 - M500, step M10)
  - Join Fans Fee (M50 - M2,000, step M50)
- Preview section showing current fee structure
- Save button that updates `fanEngagementSettings`

### Modified Files (3)

**`src/components/community/mobigate-quiz/InteractiveQuizMerchantSheet.tsx`**
- Add a "Live Scoreboard" button at the top of the merchant list (below the header)
- Pulsing red dot + "LIVE" badge to indicate active games
- Tapping opens `LiveScoreboardDrawer`
- Import and render `LiveScoreboardDrawer` with open/close state

**`src/components/community/mobigate-quiz/InteractiveQuizSeasonSheet.tsx`**
- Add a smaller "View Live Scoreboard" link/button in the season detail view
- Opens the same `LiveScoreboardDrawer`

**`src/components/mobigate/QuizAdminDrawer.tsx`** (or the page that renders QuizSettingsCard)
- Import and render `FanEngagementSettingsCard` alongside existing admin settings
- Add it in the Interactive Quiz admin section or general quiz settings area

---

## Technical Details

### Scoreboard Player Interface

```text
LiveScoreboardPlayer {
  id: string
  name: string
  avatar: string
  merchantName: string
  seasonName: string
  points: number
  currentSession: number
  winStreak: number
  totalCorrect: number
  totalPlayed: number
  fanCount: number
  likes: number
  comments: number
  shares: number
  isOnline: boolean
  lastActivityTime: string
}
```

### Fan Engagement Fee Structure

```text
Like:       M50   (range M10 - M500)
Comment:    M100  (range M20 - M1,000)
Share:      M75   (range M10 - M500)
Join Fans:  M200  (range M50 - M2,000)
```

### Fan Action Flow

```text
Viewer taps "Like" on Player X
  --> Show fee confirmation in toast: "Like PlayerX? M50 will be charged"
  --> Debit wallet (mock: toast confirmation)
  --> Increment like count on player card
  --> Toast: "Liked PlayerX! M50 charged from your wallet"
```

### Scoreboard Ranking Logic

Players are sorted by `points` (descending), then by `winStreak` (descending) as tiebreaker. Only top 15 are displayed.

### Files Summary
- **Created**: `src/data/liveScoreboardData.ts`, `src/components/community/mobigate-quiz/LiveScoreboardDrawer.tsx`, `src/components/mobigate/FanEngagementSettingsCard.tsx`
- **Modified**: `src/components/community/mobigate-quiz/InteractiveQuizMerchantSheet.tsx`, `src/components/community/mobigate-quiz/InteractiveQuizSeasonSheet.tsx`, `src/components/mobigate/QuizAdminDrawer.tsx`
