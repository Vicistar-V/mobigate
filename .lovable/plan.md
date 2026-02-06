

# Mobile Optimization: Primary Election List Cards

## Problem

The primary election list cards on mobile (~360px) show candidate names truncated ("Grace Adaeze ...", "Emmanuel Chu...") because:

1. **Hard name cap**: Candidate names have `truncate max-w-[140px]` which clips anything beyond ~15 characters
2. **Horizontal competition**: Each candidate row crams rank number + avatar + name + star icon + percentage + vote count all on one line via `flex items-center justify-between`
3. **Padding stack**: Page `p-3` (12px per side) + Card `p-3` (12px per side) = 48px total from 360px = only 312px for content, then candidate row `p-2` takes another 16px = 296px usable

## Files to Modify

| File | Changes |
|------|---------|
| `src/pages/admin/ElectionManagementPage.tsx` | Reduce page content padding from `p-3` to `px-2 py-3` |
| `src/components/admin/election/AdminPrimaryElectionsSection.tsx` | Restack candidate rows, reduce card padding, remove name cap |
| `src/components/admin/election/AdminElectionProcessesTab.tsx` | Fix `text-[10px]` instances to `text-xs` |

## Detailed Changes

### 1. ElectionManagementPage.tsx (line 104)

Reduce the content wrapper padding:
- Change `p-3 sm:p-4` to `px-2 py-3 sm:p-4`
- Saves 8px total horizontal on mobile

### 2. AdminPrimaryElectionsSection.tsx -- List Cards (lines 180-297)

**Card padding (line 186):**
- Change `p-3` to `p-2.5` -- saves 4px total

**Date/time row (lines 191-197):**
Currently all on one flex row: `Calendar Feb 15, 2025 . Clock 09:00 - 17:00`
Restack to two lines to prevent wrapping:
```
Calendar  Feb 15, 2025
Clock     09:00 - 17:00
```
Change from single flex row to a `flex flex-col gap-0.5` layout with each line having its own icon.

**Candidate preview rows (lines 240-271):**
Current layout (clips names):
```
[1.] [avatar] Grace Adaeze ... [star]    56.8%
                                         312 votes
```

New layout (full names visible):
```
[1.] [avatar] Grace Adaeze Nwosu        [star] 56.8%
              312 votes
```

Specific changes:
- Remove `max-w-[140px]` from name span (line 257) -- let name use available space
- Keep `truncate` but with `flex-1 min-w-0` so it truncates only when truly out of space
- Move the percentage display inline with name row instead of in a separate `text-right` div
- Move "312 votes" text below the name, left-aligned under the avatar
- The star/trophy icons stay inline with the name

**Voter Turnout stats row (lines 215-218):**
- Change indentation alignment (already fine, no change needed)

**"+2 more candidates" text (line 275):**
- Fine as-is

### 3. AdminPrimaryElectionsSection.tsx -- Detail Sheet Candidate Cards (lines 441-514)

Apply the same restacking pattern in the detail sheet for consistency:

**Candidate name (line 456):**
- Remove `truncate` since the detail sheet should show full names

### 4. AdminElectionProcessesTab.tsx -- Fix text-[10px] (lines 57, 174, 178, 182)

Change all `text-[10px]` instances to `text-xs`:
- Line 57: Badge stat labels in ProcessCard
- Line 174: "Total Nominations" label
- Line 178: "Primaries" label
- Line 182: "Turnout" label

## Space Savings Summary

| Area | Before | After | Saved |
|------|--------|-------|-------|
| Page content padding | 12px each side | 8px each side | 8px total |
| Card padding | 12px each side | 10px each side | 4px total |
| Name max-width cap | Hard 140px | Flex (uses available) | ~30-50px freed |
| **Total horizontal savings** | | | ~12px + uncapped names |

The combination of reduced padding and removing the hard 140px name cap means names like "Grace Adaeze Nwosu" and "Emmanuel Chukwuemeka" will display in full on most 360px screens, only truncating for truly extreme lengths.
