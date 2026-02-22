

# Transform Merchant Page into Full Merchant Quiz Management Admin

## Overview
Replace the current read-only merchant listing on `/merchant-page` with a comprehensive **Merchant Quiz Management** admin page where the merchant can create and manage everything about their interactive quiz platform -- settings, seasons, question banks, and more -- as described in the PDF.

## Sidebar Change
- Rename "Merchant Quiz Management" to **"Merchant Quizzes Management"** in `AppSidebar.tsx`

## New MerchantPage.tsx -- Full Rewrite

The page becomes a mobile-first merchant admin dashboard with these sections, all on a single scrollable page with tab navigation:

### Tab 1: Platform Settings (Editable)
- Questions per pack (default 15), Objective/Non-Objective split (10/5)
- Number of objective options (8-10)
- Cost per question (merchant sets billing)
- Win percentage threshold (25%-50%)
- Fair Answer percentage (20%)
- Alternative Answers range (min 2, max 5)
- Qualifying points for Game Show entry (default 15/300)
- Bonus games config: after X packs, grant Y-Z bonus games at A%-B% discount
- All fields are editable inputs with current values from `mockMerchants[0]` (simulating "my merchant")
- Save button (shows toast)

### Tab 2: Quiz Seasons Management
- List of all seasons (active, draft, completed) for this merchant
- Each season card shows: name, type badge, status, date range, participants, prize breakdown
- **"Create New Season"** button opens an inline form:
  - Season name, type selector (Short 4mo / Medium 6mo / Complete 12mo)
  - Start date picker (end date auto-calculated)
  - Entry fee
  - Prize breakdown: 1st, 2nd, 3rd, consolation per player, consolation count
  - Selection process rounds (dynamic add/remove)
  - TV Show rounds (dynamic add/remove)
  - Minimum target participants
- Edit/Suspend/Activate/Extend buttons on each season card
- Extension form: weeks (1-8), reason

### Tab 3: Question Bank
Three sub-sections matching the PDF:
1. **Main Objective Questions** -- list, create, edit, delete
2. **Main Non-Objective Questions** -- list, create, edit, delete (with Alternative Answers field)
3. **Bonus Objective Questions** -- list, create, edit, delete

Each question form includes:
- Question text, category, difficulty
- For objectives: 8 answer options (A-H), correct answer index
- For non-objectives: Alternative Answers (2-5 words/phrases)
- Time limit, cost per question

Uses existing `mockQuestions` data filtered by merchant ID.

### Tab 4: Wallet and Funding
- Current wallet balance display
- Funding history table
- Wallet requirement indicator (70% of total prizes must be funded)
- Waiver request status and button
- Add funds button (toast simulation)

## Design Principles
- Mobile-first: all content works perfectly at 360px
- Text minimum `text-xs`, primary content `text-sm` to `text-base`
- Native scrolling on the page body
- Tabs component for section navigation (sticky below header)
- Touch-friendly inputs and buttons (min 44px targets)
- All actions show toast feedback (UI template, no backend)

## Files Modified
1. **`src/pages/MerchantPage.tsx`** -- Complete rewrite into merchant admin dashboard with 4 tabs
2. **`src/components/AppSidebar.tsx`** -- Rename label to "Merchant Quizzes Management"

## Technical Notes
- Uses `mockMerchants[0]` (TechVentures Nigeria) as "the current merchant" for the admin view
- All edits are local state only (UI template, no backend)
- Reuses existing `QuizMerchant`, `QuizSeason`, `MerchantQuestion` types from `mobigateInteractiveQuizData.ts`
- Uses `Tabs`/`TabsList`/`TabsTrigger`/`TabsContent` from existing UI components
- Uses `Input`, `Select`, `Switch`, `Badge`, `Card`, `Button` from existing UI library
- Season create/edit uses inline expandable forms (no drawers/dialogs) for simplicity on mobile
