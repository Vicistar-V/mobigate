

# Fix Quiz Entry Flow: Route to Mobigate Quiz Hub Instead of Community Quiz

## The Problem

When tracing the quiz entry from the sidebar, here is what currently happens:

1. **Sidebar** "Play Quiz Games" link navigates to `/mobi-quiz-games`
2. The **MobiQuizGames page** renders game mode cards AND a "Start Playing" button
3. Both the "Start Playing" button AND every game mode card click open `MobiQuizGameDialog`
4. `MobiQuizGameDialog` is the **old Community Quiz dialog** -- it imports from `quizGameData.ts` (community quiz data), shows community quiz questions/rules, and plays the community quiz game
5. The actual **Mobigate Quiz Hub** (`MobigateQuizHub.tsx`) with all 6 game modes (Group, Standard, Interactive, Food, Scholarship, Toggle) is never opened from this page

The same problem exists in `QuizSelectionSheet.tsx` -- when a user taps "Mobi Quiz" from within a community, it also opens `MobiQuizGameDialog` (old community quiz) instead of `MobigateQuizHub`.

## The Fix

### File 1: `src/pages/MobiQuizGames.tsx`
- **Replace** the import of `MobiQuizGameDialog` with `MobigateQuizHub` from `src/components/community/mobigate-quiz/MobigateQuizHub.tsx`
- Update the "Start Playing" button to open `MobigateQuizHub` instead
- Update all game mode card `onClick` handlers: instead of opening one generic dialog, each card should open `MobigateQuizHub` (which lets the user select the specific mode from there)
- Rename the state variable from `showQuizDialog` to `showQuizHub` for clarity
- Replace `<MobiQuizGameDialog>` render at the bottom with `<MobigateQuizHub>`

### File 2: `src/components/community/QuizSelectionSheet.tsx`
- **Replace** the import of `MobiQuizGameDialog` with `MobigateQuizHub`
- Change `mobiQuizOpen` state and its handler to open `MobigateQuizHub` instead
- Replace `<MobiQuizGameDialog>` render with `<MobigateQuizHub>`

This way both entry points (the MobiQuizGames page from sidebar AND the community quiz selection sheet) correctly route to the Mobigate Quiz Hub with all 6 game modes.

---

## Technical Details

### Changes Summary

**`src/pages/MobiQuizGames.tsx`** (modify):
- Line 8: Change import from `MobiQuizGameDialog` to `MobigateQuizHub` (from `@/components/community/mobigate-quiz/MobigateQuizHub`)
- Line 73: Rename `showQuizDialog` to `showQuizHub`
- Line 129, 195: Update all references from `setShowQuizDialog(true)` to `setShowQuizHub(true)`
- Line 224: Replace `<MobiQuizGameDialog open={showQuizDialog} onOpenChange={setShowQuizDialog} />` with `<MobigateQuizHub open={showQuizHub} onOpenChange={setShowQuizHub} />`

**`src/components/community/QuizSelectionSheet.tsx`** (modify):
- Line 5: Change import from `MobiQuizGameDialog` to `MobigateQuizHub` (from `./mobigate-quiz/MobigateQuizHub`)
- Line 80: Replace `<MobiQuizGameDialog open={mobiQuizOpen} onOpenChange={setMobiQuizOpen} />` with `<MobigateQuizHub open={mobiQuizOpen} onOpenChange={setMobiQuizOpen} />`

No new files needed. Only 2 files modified with import swaps.

