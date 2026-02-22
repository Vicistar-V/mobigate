

## Plan: Enhance Winner Cards with Tier, Followers, Fans, Share + Fix Profile Drawer

### What Changes

**1. Add fields to `SeasonWinner` interface** (`src/data/mobigateInteractiveQuizData.ts`)
- Add `tier: number` (1-7), `followers: number`, `fans: number` to `SeasonWinner`
- Update all `mockSeasonWinners` entries with realistic values

**2. Enhance Winner Cards in MerchantPage WinnersTab** (`src/pages/MerchantPage.tsx`)
- Each top winner card (1st/2nd/3rd) shows new inline stats row: Tier badge (T1-T7), followers count, fans count, share button
- Tapping a winner card opens `QuizWinnerProfileDrawer` (currently only the highlight star is there, no card click opens drawer)
- Add state for `selectedWinner` and `drawerOpen`, wire card `onClick` to open the drawer
- Import `Share2` icon for share button

**3. Enhance Winner Cards in HighlightedWinnersCarousel** (`src/components/community/mobigate-quiz/HighlightedWinnersCarousel.tsx`)
- Add tier badge and compact followers/fans count to each carousel card
- Ensure clicking the card still opens the `QuizWinnerProfileDrawer` (already works)

**4. Enhance QuizWinnerProfileDrawer** (`src/components/community/mobigate-quiz/QuizWinnerProfileDrawer.tsx`)
- Add Tier badge display (e.g., "Tier 5" with shield icon)
- Add followers and fans counts in the details section
- Add Share button to actions grid (using native share or copy link with toast)
- Add "View on Mobigate" button that navigates to the merchant/quiz area
- Ensure the drawer actually opens when cards are tapped (fix any missing wiring)

### What Each Card Shows (Mobile Layout)

**WinnersTab card (per winner):**
```text
[Trophy] [Name............] [Pending]
         Lagos, Nigeria
         NN8,000,000  Score: 97%
         T5 | 234 fans | 1.2K followers | [Share]
         Dec 20, 2025
```

**Highlighted Carousel card (compact):**
```text
[Crown]
 [OB]
 Oluwas...
 T5 · 234 fans
 [Fan M200]
```

**Profile Drawer adds:**
- Tier badge next to position badge
- Followers / Fans row in details card
- Share + "View on Mobigate" buttons in action grid

### Technical Details

**`src/data/mobigateInteractiveQuizData.ts`**
- Add to `SeasonWinner`: `tier: number; followers: number; fans: number;`
- Update all 12 mock entries with tier (1-7), followers (100-5000), fans (50-2000)

**`src/pages/MerchantPage.tsx` (WinnersTab)**
- Add `selectedWinner` / `drawerOpen` state
- Wrap each top winner card in a clickable container that sets `selectedWinner` and opens drawer
- Add a stats row below the prize line: tier badge, fans, followers, share icon button
- Render `QuizWinnerProfileDrawer` at bottom of WinnersTab
- Import `Share2, Shield` icons

**`src/components/community/mobigate-quiz/HighlightedWinnersCarousel.tsx`**
- Show tier + fans count below player name (replace "position + merchant" line with "T{tier} . {fans} fans")
- Keep existing click-to-open-drawer behavior

**`src/components/community/mobigate-quiz/QuizWinnerProfileDrawer.tsx`**
- Add tier display (Shield icon + "Tier X") as a badge next to position badge
- Add followers/fans rows in the details card
- Expand action grid from 2x2 to 3x2: add Share button and "View on Mobigate" button
- Share button uses `navigator.share` or copies link with toast fallback

