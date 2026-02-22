

## Merchant Home Page

A new colorful, public-facing page for each merchant that visitors can browse, interact with, and explore. This page sits between the sidebar navigation and the quiz-focused MerchantDetailPage.

### What Gets Built

**1. New Sidebar Link: "Merchant Home"**
- Added under "Merchants Menu" in `src/components/AppSidebar.tsx`, positioned above "Merchant Quizzes Management"
- Links to `/merchant-home/:merchantId` (defaulting to the first approved merchant for demo)

**2. New Route**
- `/merchant-home/:merchantId` in `src/App.tsx`

**3. New Page: `src/pages/MerchantHomePage.tsx`**
A vibrant, mobile-first merchant storefront with these sections:

- **Hero Banner** -- Full-width gradient banner with merchant logo, name, category, verified badge, follower count, and Follow/Report buttons
- **Quick Actions Bar** -- Horizontal scroll row with colorful icon buttons: Play Quiz, Gallery, Events, Shows, Calendar, Contact
- **Image Gallery Section** -- Horizontal scrollable photo cards from mock merchant gallery data. Tapping opens `MediaGalleryViewer`. "View All" link
- **Video Highlights Section** -- Horizontal scrollable video thumbnail cards with play overlay. Tapping opens `MediaGalleryViewer` in video mode
- **Upcoming Shows** -- Cards for scheduled quiz shows/TV rounds pulled from `mockSeasons` data (upcoming + live). Each card shows date, season name, status badge (LIVE/Upcoming/Past), participant count. Tapping navigates to `/mobi-quiz-games/merchant/:merchantId`
- **Past Shows** -- Collapsed section showing completed seasons with winner highlights
- **Events & Calendar** -- A mini calendar-style list of upcoming season dates, selection round dates, and TV show dates extracted from season data
- **Links Section** -- Merchant external links (website, social media) rendered as tappable cards that open in new tabs
- **Social Interaction Bar** -- Fixed bottom bar with Like, Comment, Share, Follow buttons using existing `CommentDialog` and `ShareDialog` components
- **Live Video Placeholder** -- A card with a "LIVE" badge and play button for when merchant is streaming (links to scoreboard drawer)

**4. New Mock Data: `src/data/merchantHomeData.ts`**
- Gallery photos, external links, event descriptions, and follower/like counts for each mock merchant
- Reuses existing `mockMerchants` and `mockSeasons` from `mobigateInteractiveQuizData.ts`

### Navigation Flow
Sidebar "Merchants Menu" -> "Merchant Home" -> Opens the colorful merchant home page -> From there, "Play Quiz" button navigates to existing `/mobi-quiz-games/merchant/:merchantId`

### Existing Components Reused
- `MediaGalleryViewer` for photo/video full-screen viewing
- `CommentDialog` for commenting
- `ShareDialog` for sharing
- `LiveScoreboardDrawer` for live scoreboard access
- `Calendar` component for date display
- `Avatar`, `Badge`, `Button`, `Card` from UI library
- `HighlightedWinnersCarousel` for winner showcase

### Technical Details

**Files created:**
- `src/pages/MerchantHomePage.tsx` -- Main page component (~400-500 lines)
- `src/data/merchantHomeData.ts` -- Mock gallery, links, events data (~100 lines)

**Files modified:**
- `src/components/AppSidebar.tsx` -- Add "Merchant Home" link under Merchants Menu
- `src/App.tsx` -- Add route for `/merchant-home/:merchantId`

**Mobile-first design priorities:**
- All touch targets 44px+ minimum
- Horizontal scroll sections with `overflow-x-auto scrollbar-hide`
- Sticky header with back button
- Fixed bottom social action bar (56px height)
- `pb-20` on main content to account for bottom bar
- No horizontal overflow on 360px viewport
- Colorful gradients on hero, section headers, and action buttons
- Native scroll behavior (`touch-auto`, `overscroll-contain`)

