

# Mobile Optimization: Primary Election Details Sheet

## Problem

The "Primary Election Details" bottom sheet has right-edge clipping on mobile (~360px screens). The screenshots show:

1. **"Completed" badge** on the election info card is clipped on the right
2. **Vote counts** (549, 850) in the Voter Turnout section are cut off at the right edge
3. **"2 advancing" badge** in the Candidates Results header is partially hidden
4. **Progress bar percentage text** and threshold markers clip on the right

### Root Cause

The content area uses `px-4 py-4` (16px each side) on the ScrollArea's inner div (line 312), plus `p-3` (12px) on each card inside it. Combined: 16 + 12 = 28px per side = 56px total lost from 360px = only 304px for content. The status badge, vote numbers, and advancing badge all fight for that remaining space.

---

## File to Modify

`src/components/admin/election/AdminPrimaryElectionsSection.tsx`

---

## Detailed Changes

### 1. Sheet Header (line 303)
- Change `px-4 pt-4 pb-3` to `px-3 pt-4 pb-3` -- saves 4px per side on the header to match the body

### 2. ScrollArea inner container (line 312)
- Change `px-4 py-4` to `px-2 py-3` -- reclaims 16px total horizontal space

### 3. Election Info card (line 314)
- Change `p-3` to `p-2.5` -- saves another 4px total
- The office name + status badge row (line 315): already has `gap-2` and `min-w-0 flex-1`, which is good

### 4. Date and Time boxes (lines 324-339)
- Change the `text-[10px]` "Date" and "Time" labels to `text-xs` to meet the project's minimum typography standard
- Keep the side-by-side layout as it works well

### 5. Voter Turnout card (line 344)
- Change `p-3` to `p-2.5`
- The vote count rows (lines 350-357): these use `flex justify-between` which is correct, but the numbers clip because the parent padding eats the space. The reduced padding from step 2 and this step will fix it.

### 6. Advancement Rules card (line 370)
- Change `p-3` to `p-2.5`
- Change the advancement rules header `gap-2.5` to `gap-2`

### 7. Candidates Results section

**Header row (lines 403-411)**:
- The "2 advancing" Badge uses `text-[10px]` -- change to `text-xs`

**Auto-qualified summary text (line 414)**:
- Change `text-[10px]` to `text-xs`

**Candidate cards (lines 430-516)**:
- Change card padding from `p-3` to `p-2.5`
- Change the candidate row gap from `gap-3` to `gap-2.5`
- Change the candidate rank number width from `w-5` to `w-4` to save horizontal space
- The progress bar area (line 471): change `ml-8` to `ml-7` since the rank number is now narrower
- The threshold text (line 492-494): change `text-[10px]` to `text-xs`

### 8. Status badges (lines 52-64, used throughout)
- Change `text-[10px]` to `text-xs` on all status badges (Completed, Ongoing, Scheduled, Cancelled)

### 9. StatCard label (line 79)
- Change `text-[10px]` to `text-xs` on the stat card labels

### 10. Primary list cards (lines 186-295)
- The voter turnout detail text at line 215-218 uses `text-[10px]` -- change to `text-xs`
- Candidate preview name at line 257 uses `truncate max-w-[120px]` -- change to `max-w-[140px]` since we have more space from reduced padding
- Candidate vote detail at line 269 uses `text-[10px]` -- change to `text-xs`
- The AvatarFallback at line 255 uses `text-[10px]` -- change to `text-xs`

---

## Summary of Space Savings in Detail Sheet

| Area | Before | After | Saved |
|------|--------|-------|-------|
| ScrollArea inner padding | 16px each side | 8px each side | 16px total |
| Card padding | 12px each side | 10px each side | 4px total |
| Candidate rank width | 20px | 16px | 4px |
| **Total horizontal savings** | | | **~24px** |

This brings usable content width from ~304px to ~328px on a 360px screen -- enough to show badges, vote counts, and percentages without clipping.

All `text-[10px]` instances are bumped to `text-xs` to meet the project's typography standard.

