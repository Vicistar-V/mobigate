

# Replace Interactive Merchant Admin with User-Facing Merchant Page

## Overview
Remove the entire admin system for Interactive Quiz Merchants and replace it with a beautiful, mobile-first user-facing **Merchant Page**. When users click "Merchant Page" from the sidebar, they'll see a list of approved merchants. Tapping a merchant reveals their quiz seasons, pricing, prizes, and game show details -- all read-only, no admin controls.

## What Gets Deleted

1. **`src/components/mobigate/InteractiveMerchantAdmin.tsx`** (1024-line admin component) -- entirely removed
2. **`src/pages/admin/quiz/InteractiveMerchantsPage.tsx`** -- entirely removed  
3. **`src/components/mobigate/MerchantPlatformSettingsDrawer.tsx`** -- admin-only, removed
4. **`src/components/mobigate/MerchantSelectionProcessDrawer.tsx`** -- admin-only, removed
5. **`src/components/mobigate/MerchantQuestionBankDrawer.tsx`** -- admin-only, removed

## What Gets Created

### New Page: `src/pages/MerchantPage.tsx`
A mobile-optimized, user-facing page (not admin) that shows:

- **Header** with back navigation and title "Quiz Merchants"
- **Merchant List** -- all approved/verified merchants displayed as rich cards:
  - Merchant avatar, name, category, verified badge
  - Number of active seasons, total participants
  - Best season's total prize pool as a headline number
- **Merchant Detail Drawer** -- tapping a merchant opens a bottom drawer showing:
  - Merchant info card (name, category, verified status)
  - Merchant settings summary (read-only): questions per pack, cost per question, win percentage threshold, qualifying points, bonus games info
  - **Seasons list** -- each season card shows:
    - Season name, type badge (Short/Medium/Complete), LIVE indicator
    - Full prize breakdown (1st, 2nd, 3rd, consolation)
    - Total prize pool
    - Entry fee
    - Selection process stages (rounds with entries and fees)
    - TV Show rounds (1st Show, Semi-Final, Grand Finale)
    - Participant count and current level progress bar
  - **"Join Season" button** at the bottom to enter the play flow (opens existing `InteractiveQuizSeasonSheet` or `InteractiveQuizPlayDialog`)
- **Live Scoreboard** button at the top (reuses existing `LiveScoreboardDrawer`)

### Design Principles (Mobile-First)
- Full-width cards with generous padding (p-4)
- All text minimum `text-xs`, primary content `text-sm` to `text-base`
- Native scrolling (`overflow-y-auto touch-auto overscroll-contain`)
- Touch-friendly tap targets (min 44px height)
- Gradient prize sections with amber/gold theme
- `max-h-[92vh]` drawer constraint
- No horizontal overflow on 360px viewport

## What Gets Updated

### `src/App.tsx`
- Remove `InteractiveMerchantsPage` import
- Change route `/mobigate-admin/quiz/interactive/merchants` to render new `MerchantPage`

### `src/components/AppSidebar.tsx`
- Rename "Manage Merchant Quiz" to "Merchant Page"
- Update URL to `/merchant-page` (new user-facing route)

### `src/components/mobigate/QuizAdminDrawer.tsx`
- Remove "Merchant Management" link from the interactive quiz section (it's no longer an admin function)

### `src/pages/admin/MobigateAdminDashboard.tsx`
- Update the "Merchants" card under Interactive Quiz to navigate to `/merchant-page` instead of the old admin route

## Technical Details

- The new `MerchantPage` uses the same `mockMerchants`, `mockSeasons` data from `mobigateInteractiveQuizData.ts`
- Filters to show only `applicationStatus === "approved"` merchants
- Reuses `formatLocalAmount` and `formatMobi` for currency display
- Reuses `LiveScoreboardDrawer` for the live scoreboard feature
- Connects to the existing play flow via `InteractiveQuizPlayDialog` when a user joins a season
- All content is read-only -- no toggle, approve, suspend, wallet management, or question bank controls

