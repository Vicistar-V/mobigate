

## Plan: Highlighted Winners Carousel + Fan System

### What It Does

Two interconnected features:

1. **Merchant Highlights (Winners Tab)** -- Merchants can tap a "Highlight" button on any winner card in the Winners tab to mark them as highlighted. Highlighted winners get a golden star badge on their card.

2. **Highlighted Winners Carousel (InteractiveQuizMerchantSheet)** -- On the screen where users browse merchant quizzes, a horizontally auto-scrolling carousel of rounded-square cards appears at the top (after the header, before the merchant list). Each card shows the highlighted winner's avatar, rank, name, merchant name, and a "Become Fan" button costing M200. Tapping on a card opens a profile info drawer with winner details and actions.

### Detailed UI

**Winners Tab -- Highlight Toggle (MerchantPage.tsx)**
- Each top winner card (1st, 2nd, 3rd) gets a small "Highlight" star button in the top-right corner
- Tapping it toggles the winner as highlighted (golden star fills in, toast confirms)
- State is tracked locally: `highlightedWinners: Set<string>`
- Consolation winners do NOT get a highlight option

**Highlighted Carousel (InteractiveQuizMerchantSheet.tsx)**
- Appears between the Live Scoreboard button and the merchant list
- Only shows if there are highlighted winners (from mock data -- we add an `isHighlighted` field to some `mockSeasonWinners`)
- Auto-scrolls horizontally every 3 seconds using CSS animation
- Each item is a rounded-square card (~80x100px) showing:
  - Position icon (trophy/crown/medal)
  - Player initials avatar
  - Player name (truncated)
  - Rank + merchant name (tiny text)
  - "Fan" button with star icon
- Tapping a card opens a **QuizWinnerProfileDrawer** (new component)
- Tapping "Fan" costs M200, shows toast, button changes to "Fanned" (disabled)

**QuizWinnerProfileDrawer (New Component)**
- Similar pattern to the existing `WinnerProfileSheet` for elections
- Shows: avatar, player name, position badge, merchant name, season name, score, prize won, payout status, completion date
- Action buttons: View Profile, Add Friend, Message, Become Fan (M200)
- Uses the Drawer pattern consistent with the rest of the app

### Data Changes

**`src/data/mobigateInteractiveQuizData.ts`**
- Add `isHighlighted?: boolean` field to `SeasonWinner` interface
- Set `isHighlighted: true` on 4-5 winners across seasons (the top 3 from s1 and s2)

### Technical Details

**File: `src/data/mobigateInteractiveQuizData.ts`**
- Add `isHighlighted?: boolean` to `SeasonWinner` interface
- Set `isHighlighted: true` on winners w1, w2, w3, w7, w8 (top winners from both seasons)

**File: `src/components/community/mobigate-quiz/QuizWinnerProfileDrawer.tsx` (NEW)**
- Props: `{ winner: SeasonWinner | null; open: boolean; onOpenChange: (open: boolean) => void; merchantName?: string; seasonName?: string }`
- Drawer with winner info display: large avatar initials, position badge, name, state/country, prize, score, completion date, payout status
- Action buttons: View Profile (navigates to `/profile/winner-id`), Add Friend (toast), Message (toast), Become Fan (M200 fee, toast with deduction message)
- Follows WinnerProfileSheet pattern

**File: `src/components/community/mobigate-quiz/HighlightedWinnersCarousel.tsx` (NEW)**
- Props: `{ onFanClick?: (winner: SeasonWinner) => void }`
- Collects all `mockSeasonWinners` where `isHighlighted === true`
- Renders a horizontally scrolling container with `overflow-x-auto snap-x snap-mandatory` and CSS `@keyframes` auto-scroll
- Each item: rounded-xl card (w-20, h-24) with position icon, initials circle, name, "Fan M200" mini button
- Tapping the card opens `QuizWinnerProfileDrawer`
- Fan state tracked in local `Set<string>`
- Fan action costs 200 Mobi, shows toast
- Auto-scroll implemented with `useEffect` + `setInterval` scrolling the container by card width every 3s

**File: `src/components/community/mobigate-quiz/InteractiveQuizMerchantSheet.tsx`**
- Import and render `HighlightedWinnersCarousel` between the Live Scoreboard button and the merchant list
- Only renders if highlighted winners exist

**File: `src/pages/MerchantPage.tsx`**
- In `WinnersTab`, add `highlightedWinners` state (`Set<string>`)
- Add a star toggle button on each top winner (1st/2nd/3rd) card
- Tapping fills the star and adds to set, toasts "Winner highlighted! They will appear in the quiz carousel"
- Tapping again removes highlight, toasts "Highlight removed"

### Mobile Focus
- Carousel uses `touch-pan-x` for smooth swipe
- Cards have `snap-center` for snappy scroll stops
- All tap targets are minimum 44px
- Auto-scroll pauses on touch interaction
- No horizontal overflow on the page -- carousel is contained
- Profile drawer uses `max-h-[92vh]` with native scroll

