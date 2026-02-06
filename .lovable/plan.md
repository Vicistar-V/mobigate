

## Fix Content Clipping in Election Clearance Cards

### Problem

The "Ngozi Patricia Udoh" clearance card in the Admin Clearances section is not displaying fully on mobile:

1. The **rejection reason** text is truncated by `line-clamp-2`, hiding the amount ("M45,000") at the end
2. The **outer container** has `overflow-hidden` which may clip content near the bottom of the scrollable area
3. The **notes** text (e.g., "ID verification document is unclear...") also uses `line-clamp-2` and could be cut off

### Fix

**File: `src/components/admin/election/AdminClearancesTab.tsx`**

**Change 1: Remove `overflow-hidden` from outer container (line 108)**

The parent container has `overflow-hidden` which clips content. Replace it with just padding for scroll safety:

```
Before: <div className="space-y-3 sm:space-y-4 pb-20 overflow-hidden">
After:  <div className="space-y-3 sm:space-y-4 pb-20">
```

**Change 2: Remove `line-clamp-2` from notes text (line 192)**

Allow the full note to display so no information is hidden:

```
Before: <p className="mt-2.5 text-sm text-blue-600 bg-blue-50 dark:bg-blue-950/30 p-2 rounded line-clamp-2">
After:  <p className="mt-2.5 text-sm text-blue-600 bg-blue-50 dark:bg-blue-950/30 p-2 rounded break-words">
```

**Change 3: Remove `line-clamp-2` from rejection reason text (line 199)**

Allow the full rejection reason (including the amount) to display:

```
Before: <p className="mt-2.5 text-sm text-red-600 bg-red-50 dark:bg-red-950/30 p-2 rounded line-clamp-2">
After:  <p className="mt-2.5 text-sm text-red-600 bg-red-50 dark:bg-red-950/30 p-2 rounded break-words">
```

### Summary

| Change | Line | Purpose |
|--------|------|---------|
| Remove `overflow-hidden` | 108 | Prevent container from clipping bottom content |
| Remove `line-clamp-2`, add `break-words` on notes | 192 | Show full note text without truncation |
| Remove `line-clamp-2`, add `break-words` on rejection reason | 199 | Show full rejection reason including the amount |

### What This Fixes

- The full rejection reason "Outstanding financial obligations to the community have not been cleared. Amount owing: M45,000" will be fully visible
- Notes like "ID verification document is unclear. Please resubmit with a clearer image." will show completely
- No content will be clipped at the bottom of the card list
- `break-words` ensures long text wraps properly on narrow mobile screens

