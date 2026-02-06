

## Mobile Optimization: Community Accounts - Fix Overflow and Clipping

### Problem

The "All Credit / All Income", "All Debit / All Withdrawals", and "Balance / Available Balance" filter buttons are cutting beyond the screen borders on mobile. The 3-column grid forces text to overflow, and the parent container's padding (`px-2`) combined with `border-2` on the buttons causes elements to clip at the edges. The transaction table also has margin/overflow issues.

### Solution

Restructure the filter buttons, transaction table, and overall layout for mobile-first containment. Every element must fit within the viewport without horizontal clipping.

---

### File: `src/components/community/finance/CommunityAccountsTab.tsx`

**Change 1: Fix the filter buttons grid (lines 101-132)**

Replace the `grid grid-cols-3 gap-2` with a properly constrained layout:
- Reduce `gap-2` to `gap-1.5` to save horizontal space
- Change button padding from `py-3` to `py-2.5`
- Remove `border-2` (use `border` instead -- saves 2px per side per button = 12px total across 3 buttons)
- Shorten subtitle text: "All Income" stays, "All Withdrawals" becomes "Withdrawals", "Available Balance" becomes "Avail. Balance"
- Use `text-xs` consistently (remove `sm:text-sm` breakpoints -- mobile only focus)
- Add `overflow-hidden` and `min-w-0` on the grid container and each button to prevent any bleed

**Change 2: Fix the overall container (line 89)**

Add `overflow-hidden` to the root div to prevent any child from bleeding out:
```
<div className="space-y-4 pb-20 overflow-hidden">
```

**Change 3: Fix the ad banner (lines 138-146)**

- Remove `sm:text-sm` responsive classes (mobile only)
- Remove `hidden sm:inline` from the middle text to keep it simple -- just show a compact single-line ad

**Change 4: Fix the Sort By dropdown (lines 149-160)**

- Change `w-[140px]` to `w-auto` with proper padding
- Remove `border-2 border-black` -- use `border` instead for consistency
- Remove `sm:text-sm`, keep `text-xs`

**Change 5: Fix the Balance Info card (lines 64-86)**

- Add `overflow-hidden` to the Card
- Use `text-sm` for labels instead of default, and `text-base font-bold` for the bottom line instead of `text-lg` to prevent overflow on narrow screens
- Ensure amounts wrap properly with `break-all` or `tabular-nums`

**Change 6: Fix the action buttons section (lines 184-224)**

- Reduce button height from `py-6` to `py-4` for better mobile proportions
- Add `text-sm` to button text to prevent label overflow
- Ensure checkbox + button rows have proper `items-center` alignment

---

### File: `src/components/community/finance/TransactionTable.tsx`

**Change 7: Fix transaction table for mobile (entire file)**

- Add `overflow-hidden` to the Card wrapper
- Ensure `overflow-x-auto` with `-mx-4 px-4` pattern (negative margin technique) so the scroll container uses full width
- Reduce cell padding from `p-3` to `p-2` for tighter mobile fit
- Use `text-xs` consistently for all table cells
- Add `min-w-0` on the wrapping div
- Add `whitespace-nowrap` on the S/N column header and cells to prevent awkward wrapping

---

### File: `src/components/community/finance/FinancialSummaryTable.tsx`

**Change 8: Fix financial summary table header (lines 27-43)**

- Change `flex-wrap` layout to a vertical stack on mobile
- Make the Sort dropdown full-width on mobile: remove `w-[180px]`, use `w-full`
- Remove `border-2 border-black` from the select trigger

**Change 9: Fix scrollable table container (lines 46-117)**

- Already uses `overflow-x-auto -mx-4 px-4` which is correct
- Add `overflow-hidden` on the parent Card to prevent horizontal bleed

**Change 10: Fix action buttons (lines 125-132)**

- Change `flex gap-2 justify-end` to `flex gap-2 w-full` with buttons taking full width
- Use `flex-1` on both buttons so they distribute evenly

---

### Summary

| Area | Problem | Fix |
|------|---------|-----|
| Filter buttons grid | `border-2` + `gap-2` + long text = 12px+ overflow | `border` + `gap-1.5` + shorter labels + `overflow-hidden` |
| Root container | No overflow constraint | Add `overflow-hidden` |
| Ad banner | Responsive classes waste space | Mobile-only classes, compact text |
| Sort dropdown | Fixed width with thick border | Auto width, thin border |
| Balance card | Large text overflows | Smaller font sizes |
| Action buttons | `py-6` too tall, text clips | `py-4`, `text-sm` |
| Transaction table | `p-3` cells too wide | `p-2`, `text-xs`, `overflow-hidden` on Card |
| Financial summary | Header layout wraps poorly | Vertical stack, full-width dropdown |
| Summary buttons | Right-aligned, may clip | Full-width distributed |

### Files Modified
1. `src/components/community/finance/CommunityAccountsTab.tsx`
2. `src/components/community/finance/TransactionTable.tsx`
3. `src/components/community/finance/FinancialSummaryTable.tsx`

