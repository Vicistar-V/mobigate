

# Consolidate Quiz Admin into Single Sidebar Drawer + Fix Mobile Scrolling

## Overview

Replace the 5 separate quiz admin sub-menus in the sidebar (Group Quiz, Standard Solo, Interactive, Food for Home, Scholarship) with a **single "Manage Quiz" button** that opens a full-height **Drawer**. Inside that drawer, each quiz type is an expandable accordion section with links to its admin pages. Additionally, fix all quiz-related drawers to scroll properly on mobile.

## Changes

### 1. New Component: QuizAdminDrawer

**File:** `src/components/mobigate/QuizAdminDrawer.tsx` (new)

A mobile-first Drawer (max-h-[92vh]) containing:
- A header: "Quiz Administration"
- Five expandable sections using Collapsible, one per quiz type:
  - **Group Quiz** -- Categories, Levels, Create Questions, Manage Questions, Monitor
  - **Standard Solo** -- same 5 links
  - **Interactive Quiz** -- Merchant Management + same 5 links
  - **Food for Home** -- same 5 links
  - **Scholarship Quiz** -- same 5 links
- Each section has a gradient-colored header with icon/emoji and expands to show Link buttons
- The body uses `overflow-y-auto touch-auto` (native scroll, no ScrollArea) for reliable mobile scrolling
- Tapping a link navigates and closes the drawer

### 2. Sidebar Consolidation

**File:** `src/components/AppSidebar.tsx` (modify)

- Remove the 5 individual quiz type entries from `superadminMenuItems` (lines 22-76: Group Quiz, Standard Solo, Interactive Quiz, Food for Home Quiz, Scholarship Quiz)
- Replace with a single entry: `{ title: "Manage Quiz", icon: Gamepad2, onClick: () => setShowQuizDrawer(true) }`
- Add state `showQuizDrawer` and render `<QuizAdminDrawer>` at the bottom of the sidebar component

### 3. Fix Drawer Scrolling on Mobile

The following drawers will be audited and fixed to use the mobile-safe pattern:
- **p-0** on DrawerContent
- **overflow-y-auto touch-auto** on the body (not ScrollArea)
- **max-h-[92vh]** on DrawerContent
- Sticky headers/footers with `shrink-0`

Files to fix:

- `src/components/mobigate/InteractiveMerchantAdmin.tsx`
  - The Add Season drawer (line 232) and Edit Merchant drawer (line 276): add `max-h-[92vh]` to DrawerContent, add `overflow-y-auto touch-auto` to the body div
  - The main component uses `<ScrollArea>` for the merchant list/detail views -- replace with native `overflow-y-auto touch-auto` div for better mobile scroll performance

- `src/components/mobigate/EditQuizLevelDrawer.tsx`
  - Already has `max-h-[85vh]` -- increase to `max-h-[92vh]` and add `touch-auto` to the body

- `src/components/mobigate/MonitorDetailDrawer.tsx`
  - Already looks correct (max-h-[92vh], overflow-y-auto touch-auto) -- no changes needed

### 4. No Route Changes

All existing routes remain the same. The drawer simply provides a new navigation entry point to the same pages.

## Technical Details

### QuizAdminDrawer structure (mobile-safe pattern)

```text
Drawer
  DrawerContent (max-h-[92vh] p-0)
    DrawerHeader (shrink-0, px-4)
      "Quiz Administration"
    div (flex-1 overflow-y-auto touch-auto px-4 pb-6)
      Collapsible (Group Quiz)
        trigger: gradient card with icon
        content: list of Link buttons
      Collapsible (Standard Solo)
        ...
      Collapsible (Interactive Quiz)
        content: includes "Merchant Management" link
        ...
      Collapsible (Food for Home)
        ...
      Collapsible (Scholarship Quiz)
        ...
```

### Sidebar changes summary

- Remove 5 quiz menu items from `superadminMenuItems` array
- Add one `onClick`-based item that opens the QuizAdminDrawer
- The drawer handles its own navigation via react-router `Link` + closing itself

### Files Modified
- `src/components/AppSidebar.tsx` -- consolidate 5 quiz menus into 1 button + render drawer
- `src/components/mobigate/InteractiveMerchantAdmin.tsx` -- replace ScrollArea with native scroll, add max-h to drawers
- `src/components/mobigate/EditQuizLevelDrawer.tsx` -- update max-h to 92vh, add touch-auto

### Files Created
- `src/components/mobigate/QuizAdminDrawer.tsx` -- the consolidated quiz admin navigation drawer

