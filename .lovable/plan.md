

## Add Gallery and Video Highlights to Winner Profile Drawer

This plan adds two new interactive media sections to the winner profile drawer: a **Photo Gallery** and **Video Highlights** section, both organized in folders with a full-screen viewer experience.

---

### What You'll Get

1. **Gallery Section** - A thumbnail grid of the winner's photos organized in folders (e.g., "Quiz Moments", "Award Ceremony", "Behind the Scenes"). Tapping any thumbnail opens a full-screen swipeable gallery viewer with navigation dots, zoom, and close gesture.

2. **Video Highlights Section** - A horizontal scrollable list of video highlight thumbnails with play overlays, also organized in folders (e.g., "Quiz Rounds", "Victory Moments"). Tapping opens a full-screen video player.

3. **Folder Navigation** - Both sections have tappable folder tabs/chips at the top to filter content by category. An "All" tab shows everything.

4. **Full Gallery Viewer** - Uses the existing `MediaGalleryViewer` component for a polished full-screen experience with swipe navigation, like/share actions, and smooth transitions.

---

### Technical Details

**1. Update `SeasonWinner` interface** (`src/data/mobigateInteractiveQuizData.ts`)
- Add `gallery` field: array of `{ url: string; folder: string }` objects
- Add `videoHighlights` field: array of `{ url: string; thumbnail: string; title: string; folder: string; duration: string }` objects
- Populate mock data with realistic Unsplash images grouped into folders and sample video URLs

**2. Create `WinnerGallerySection` component** (`src/components/community/mobigate-quiz/WinnerGallerySection.tsx`)
- Folder chip tabs at top (horizontal scroll)
- 3-column thumbnail grid below
- Tap opens `MediaGalleryViewer` at the correct index
- Mobile-optimized: compact thumbnails, touch-friendly chips, smooth scroll

**3. Create `WinnerVideoHighlightsSection` component** (`src/components/community/mobigate-quiz/WinnerVideoHighlightsSection.tsx`)
- Folder chip tabs at top
- Horizontal scroll of video cards with play icon overlay and duration badge
- Tap opens `MediaGalleryViewer` in video mode
- Mobile-optimized: snap scrolling, compact cards

**4. Update `QuizWinnerProfileDrawer`** (`src/components/community/mobigate-quiz/QuizWinnerProfileDrawer.tsx`)
- Import and render both new sections between the Details card and the Action buttons
- Each section has a header with icon and item count
- Sections only render when data exists

All changes are mobile-first with touch-manipulation, snap scroll, and compact sizing throughout.
