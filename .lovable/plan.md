
# Connect "Play Mobi-Quiz" Button to Actual Quiz Games

## Problem
The "Play Mobi-Quiz" button on the community profile (via the RotatingCtaButton) only shows a toast message -- it doesn't actually open any quiz. The same issue affects the CommunityQuickLinks "Play Mobi-Quiz Game" link.

## Solution
Create a **Quiz Selection Sheet** that appears when the quiz button is tapped, letting the player choose between:
- **Community Quiz** (blue-themed) -- community-specific questions
- **Mobi Quiz** (amber/orange-themed) -- platform-wide Mobigate quiz

In a community context, both options appear. On the Mobigate central environment, only Mobi Quiz would be available.

## Changes

### 1. New Component: `src/components/community/QuizSelectionSheet.tsx`
A mobile-optimized bottom sheet (using Drawer from vaul) with:
- Two large tappable cards side by side:
  - **Community Quiz** card (blue accent, community icon) -- opens `CommunityQuizDialog`
  - **Mobi Quiz** card (amber accent, globe icon) -- opens `MobiQuizGameDialog`  
- Each card shows a brief description of the quiz type
- Optional `showCommunityQuiz` prop (defaults to true) -- when false, only Mobi Quiz shows (for Mobigate central use)

### 2. Update: `src/pages/CommunityProfile.tsx`
- Replace `handleQuizGame` toast with opening the new `QuizSelectionSheet`
- Add state for the sheet and both quiz dialogs
- Wire the selection to open the appropriate quiz dialog

### 3. Update: `src/components/community/CommunityQuickLinks.tsx`
- Replace the direct `MobiQuizGameDialog` open with the new `QuizSelectionSheet`
- Player taps "Play Mobi-Quiz Game" link, gets the selection sheet, then picks which quiz type

## Technical Details

**QuizSelectionSheet layout (mobile):**
```text
+-------------------------------------------+
|        Choose Your Quiz Game              |
|                                           |
|  +----------------+  +----------------+  |
|  |   Community    |  |    Mobi        |  |
|  |   Quiz         |  |    Quiz        |  |
|  |                |  |                |  |
|  | Community-     |  | Platform-wide  |  |
|  | specific       |  | Mobigate quiz  |  |
|  | knowledge      |  | challenges     |  |
|  +----------------+  +----------------+  |
+-------------------------------------------+
```

**Files to create:**
1. `src/components/community/QuizSelectionSheet.tsx`

**Files to edit:**
1. `src/pages/CommunityProfile.tsx` -- wire handleQuizGame to open the selection sheet
2. `src/components/community/CommunityQuickLinks.tsx` -- use selection sheet instead of direct MobiQuizGameDialog
