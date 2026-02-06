
# Mobile Optimization: Financial Tables -- Increase Sizes and Readability

## Problems Identified (from screenshots)

Both the **Financial Clearances** table and the **Financial Summary** table show text that is "too tiny and almost unreadable" on mobile:

1. **Clearances table** (`FinancialClearancesTab.tsx`): Column headers use `text-[10px]` and check/X indicator boxes use `text-[9px]` -- both violate the project's minimum `text-xs` (12px) typography standard
2. **Registration numbers** in member rows use `text-[10px]` instead of `text-xs`
3. **Column header names** ("Membership Registration Fees", "General Annual Dues & Levies", etc.) are long multi-word labels crammed into `min-w-[80px]` cells, making them wrap into unreadable slivers
4. **Check/X marks** (`text-lg`) are OK size-wise but their wrapper boxes (`px-1.5 py-0.5 text-[9px]`) are too small for the tap-target and readability

## Solution

### File 1: `src/components/community/finance/FinancialClearancesTab.tsx` (lines 55-97)

**Table header cells (lines 64-74)**:
- Change `text-[10px]` to `text-xs` for column header names
- Change `text-[9px]` to `text-xs` for the check/X indicator labels
- Increase `min-w-[80px]` to `min-w-[100px]` for each column to give more breathing room
- Increase padding from `px-1.5 py-0.5` to `px-2 py-1` on indicator boxes

**Table header row (line 59)**:
- Change S/N header from `text-xs` to `text-sm` for better visibility
- Change Member Name header from `text-xs` to `text-sm`

**Table body cells (lines 79-97)**:
- Change member S/N from `text-xs` to `text-sm`
- Change member name from `text-xs` to `text-sm font-bold`
- Change registration number from `text-[10px]` to `text-xs` (meets minimum standard)
- Increase check/X marks from `text-lg` to `text-xl` for clearer visibility

**Table min-width**: Keep at `min-w-[700px]` since horizontal scroll is expected, but the increased cell widths will make scrolled content readable.

### File 2: `src/components/community/finance/FinancialSummaryTable.tsx` (lines 52-113)

**Table header (lines 55-60)**:
- Change member name from `text-xs` to `text-sm font-bold`
- Change registration from `text-xs text-gray-600` to `text-xs text-gray-600` (already meets minimum)

**Year headers (lines 63-69)**:
- Change year and "Date" labels from `text-xs` to `text-sm` for better readability

**Table body items (lines 78-82)**:
- Change item number and name from `text-xs` to `text-sm` for readability
- Increase `min-w-[160px]` to `min-w-[180px]` for item name column to prevent wrapping

**Amount cells (lines 88-94)**:
- Change amount text from `text-xs` to `text-sm` with `font-bold tabular-nums`
- Increase min-width from `min-w-[80px]` to `min-w-[90px]`

**Date cells (lines 97-104)**:
- Change date text from `text-xs` to `text-sm`
- Increase min-width from `min-w-[65px]` to `min-w-[75px]`

**Overall table min-width**: Increase from `min-w-[900px]` to `min-w-[1000px]` to accommodate the larger text without cramming

---

## Summary

| File | What Changes |
|------|-------------|
| `src/components/community/finance/FinancialClearancesTab.tsx` | Increase all table text sizes to meet `text-xs` minimum; bump key labels to `text-sm`; enlarge check/X marks; widen column min-widths |
| `src/components/community/finance/FinancialSummaryTable.tsx` | Increase all table text from `text-xs` to `text-sm`; widen column min-widths for breathing room |

Both tables remain horizontally scrollable (this is expected and correct for data-heavy tables on mobile), but every piece of text will now be clearly legible at proper sizes.
