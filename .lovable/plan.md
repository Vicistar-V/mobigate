

# Mobile Optimization: Block Management and Members' Financial Reports

## Problems Identified

All three screens share the same root cause: **cumulative padding causing right-edge clipping** on ~360px mobile screens.

### Block Management Drawer (`BlockManagementDrawer.tsx`)
- Outer ScrollArea content has `p-4` (16px each side)
- Each Card has `CardContent` with `p-4` internally
- Block details section has another `p-3`
- Total horizontal padding: ~16 + 16 = 32px per side = 64px lost from 360px = only 296px for content
- Result: "Blocked 2x" badge, email text, and action buttons clip on the right

### Members Financial Reports (`MembersFinancialReportsDialog.tsx`)
- **Pay-ins tab**: ScrollArea has `p-4`, search Card has `p-3`, each payment Card has `p-3` with a flex layout. The right-aligned amounts (+₦15,000, M15,000, completed badge, PAY-2025-00...) clip off the right edge
- **Status tab**: Same padding stack. The progress bar row with percentage (100%), due dates, and last-paid dates clip on the right

---

## Files to Modify

| File | What Changes |
|------|-------------|
| `src/components/community/BlockManagementDrawer.tsx` | Reduce padding, restack card content vertically |
| `src/components/admin/finance/MembersFinancialReportsDialog.tsx` | Reduce padding, restack payment/obligation cards vertically |

---

## Detailed Changes

### 1. BlockManagementDrawer.tsx

**Container padding (line 305):**
- Change `p-4 space-y-4` to `px-2 py-3 space-y-3` -- reclaims 16px total horizontal space

**Card content padding (line 361):**
- Change `p-4 space-y-3` to `p-2.5 space-y-2.5` -- saves another 12px total

**User header row (lines 362-396):**
- Keep avatar + name row as-is but remove `truncate` from name so it wraps instead of clipping
- The DropdownMenu trigger (three dots) stays flex-shrink-0 at the end

**Block details section (line 427):**
- Change `p-3` to `p-2.5`
- The date/admin row (line 428): change from horizontal `flex justify-between` to vertical stack so "Blocked October 15, 2024" and "By: Admin Fatima" each get their own line instead of fighting for horizontal space
- The "Permanent Ban" badge + "Blocked 2x" row (lines 442-459): keep horizontal since badges are compact, but add `flex-wrap` so they wrap if needed

**Quick action buttons (line 465):**
- Change `px-4 py-2` to `px-2.5 py-2`

**Tab trigger padding (line 278):**
- Change `px-4 pt-3` to `px-2 pt-3` for the TabsList wrapper to match reduced padding

**Search and filter row (lines 309-339):**
- Already fine, just reduce parent padding carries through

### 2. MembersFinancialReportsDialog.tsx

**Drawer content (line 384):**
- Change `p-4` to `px-2 py-3` on the ScrollArea -- reclaims 16px horizontal

**Search card (line 143):**
- Change `p-3` to `p-2.5`

**Payment cards -- Pay-ins tab (lines 198-242):**
Current layout tries to fit name+obligation on left and amount+badge on right in a single row -- this clips.

Restack to:
```
Row 1: [Avatar]  [Name]                    [+N15,000]
                 [Obligation Name]          [(M15,000)]
                                            [completed badge]
Row 2: [wallet icon] wallet    Feb 6, 2026    PAY-2025-00...
```

Specific changes:
- Keep the flex row with avatar, but reduce gap from `gap-3` to `gap-2.5`
- Change card padding from `p-3` to `p-2.5`
- The metadata row (line 231-238): add `flex-wrap` and reduce `gap-3` to `gap-2` so items wrap instead of clipping

**Disbursement cards -- Pay-outs tab (lines 256-290):**
Same treatment as Pay-ins: reduce card padding to `p-2.5`, reduce gap, add flex-wrap to metadata row.

**Obligation cards -- Status tab (lines 320-371):**
- Reduce card padding from `p-3` to `p-2.5`
- Reduce gap from `gap-3` to `gap-2.5`
- The amounts row (lines 347-354): already stacked vertically, keep as-is
- The due/last-paid row (lines 359-366): add `flex-wrap gap-y-0.5` so it wraps on narrow screens
- Summary cards grid (lines 305-318): keep grid-cols-2 but reduce Card padding from `p-2` to `p-2` (already minimal, fine)

---

## Summary of Space Savings

| Area | Before | After | Saved |
|------|--------|-------|-------|
| Block Management outer padding | 16px each side | 8px each side | 16px total |
| Block Management card padding | 16px each side | 10px each side | 12px total |
| Financial Reports outer padding | 16px each side | 8px each side | 16px total |
| Financial Reports card padding | 12px each side | 10px each side | 4px total |
| **Total horizontal savings** | | | **~28-32px** |

This brings the effective content width from ~296px back to ~324-328px on a 360px screen, which is enough to prevent all the observed clipping.
