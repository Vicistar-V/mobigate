

# Restructure Quiz Flow: Merchant-Centric User Experience

## Overview

The current setup has two problems:
1. **MerchantPage** (`/merchant-page`) shows a user-facing list of merchants -- but it should be a **merchant admin page** where merchants manage their own quizzes
2. **MobiQuizGames** (`/mobi-quiz-games`) shows generic "Game Modes" -- but it should show a **list of merchants** as the primary entry point, so users pick a merchant first, then see that merchant's quiz offerings

This plan restructures the entire flow so that:
- "Play Quiz Games" from the sidebar takes users to a **merchant list page** (replacing the current game modes view)
- Tapping a merchant navigates to a **dedicated merchant detail page** showing all their quiz seasons and settings, with a "Play Quiz" button that starts the actual interactive quiz (not a "Join Season" payment flow)
- The existing `/merchant-page` route becomes a merchant-facing admin/management page (rename to "Merchant Quiz Management")

## What Changes

### 1. Rewrite `MobiQuizGames.tsx` (the `/mobi-quiz-games` page)

Replace the current "Game Modes" list with a **merchant list** page:
- Keep the header, stats row, wallet/earnings cards, and quiz history link
- Replace the "Game Modes" section with a **"Quiz Merchants"** section listing all approved merchants from `mockMerchants`
- Each merchant card shows: avatar, name, category, verified badge, active seasons count, total participants, best season prize pool
- Tapping a merchant card navigates to `/mobi-quiz-games/merchant/:merchantId` (a new route)
- Keep the "Start Playing" CTA but rename it to "Browse All Merchants" or remove the hub dialog
- Remove `InteractiveQuizMerchantSheet` import (no longer needed as a drawer -- it's now a page)
- Keep Group, Standard, Food, Scholarship, Toggle quiz flow dialogs for direct access from within the merchant detail page

### 2. Create new page: `MerchantDetailPage.tsx` at `/mobi-quiz-games/merchant/:merchantId`

A full mobile page (not a drawer) showing everything about the selected merchant:
- **Header**: Back button, merchant name, verified badge, Live Scoreboard button
- **Merchant Info Card**: Avatar, name, category, verified status
- **Platform Settings** (read-only): Questions per pack, cost per question, win threshold, qualifying points, bonus games info
- **Seasons List**: Each season displayed as a rich card with:
  - Season name, type badge (Short/Medium/Complete), LIVE indicator
  - Full prize breakdown (1st, 2nd, 3rd, consolation)
  - Total prize pool, entry fee, participants
  - Selection process stages
  - TV Show rounds
  - Level progress bar
  - **"Play Quiz" button** that directly opens `InteractiveQuizPlayDialog` (starts the actual quiz immediately, no "Join Season" payment toast)
- All text sizes follow the readability standards (minimum `text-xs`, primary `text-sm` to `text-base`)
- Native scrolling with `overflow-y-auto touch-auto overscroll-contain`

### 3. Update `MerchantPage.tsx` to become a merchant management page

Rename it to serve as a merchant-facing quiz management/admin page:
- Change the page title from "Quiz Merchants" to "Merchant Quiz Management"
- This is where the merchant themselves would create/manage quizzes (the admin functionality described in the PDF)
- For now, keep the existing read-only content but relabel it as a management view
- Update the sidebar label from "Merchant Page" to "Merchant Quiz Management"

### 4. Route and Navigation Updates

**`src/App.tsx`**:
- Add new route: `/mobi-quiz-games/merchant/:merchantId` rendering `MerchantDetailPage`
- Keep `/merchant-page` route for merchant management
- Keep `/mobi-quiz-games` route

**`src/components/AppSidebar.tsx`**:
- Rename "Merchant Page" to "Merchant Quiz Management" (keeping URL `/merchant-page`)

### 5. Fix the "Join Season" flow

In the new `MerchantDetailPage`, the season "Play Quiz" button will:
- Directly open `InteractiveQuizPlayDialog` with the selected season
- No "Join Season" payment toast or entry fee deduction UI
- The quiz starts immediately with the mode selection screen

## Files Created
- `src/pages/MerchantDetailPage.tsx` -- New full-page merchant detail with seasons and direct quiz play

## Files Modified
- `src/pages/MobiQuizGames.tsx` -- Replace game modes with merchant list, navigate to merchant detail page
- `src/pages/MerchantPage.tsx` -- Rename title to "Merchant Quiz Management"
- `src/App.tsx` -- Add `/mobi-quiz-games/merchant/:merchantId` route
- `src/components/AppSidebar.tsx` -- Rename sidebar link label

## Technical Notes
- Reuses `mockMerchants`, `mockSeasons` from `mobigateInteractiveQuizData.ts`
- Reuses `InteractiveQuizPlayDialog` for actual quiz gameplay
- Reuses `LiveScoreboardDrawer` for live scores
- Uses `formatLocalAmount`, `formatMobi` for currency display
- All pages are mobile-first (360px viewport safe, no horizontal overflow)
- `useParams()` to extract `merchantId` on the detail page
- Merchant detail page uses native scrolling, not `ScrollArea`

