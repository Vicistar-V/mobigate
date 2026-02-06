
# Fix Inactive Buttons on Mobile -- Financial Action Buttons

## The Problem

Four action buttons across the financial pages ("Financial Status Report", "Check Total Indebtedness", "Debts Clearance Now", "Download Receipts") feel inactive and unresponsive on mobile because:

1. **Missing touch-manipulation CSS** -- Without this, mobile browsers apply a 300ms tap delay making buttons feel dead
2. **No active-state feedback** -- No visual scale-down on press, so users can't tell if their tap registered
3. **Hidden checkbox requirement** -- "Debts Clearance Now" and "Download Receipts" require a small checkbox to be ticked first. On mobile, this tiny checkbox is easily missed, so when users tap the button nothing visible happens (toast error appears briefly but can be missed)

## The Fix

Add `touch-manipulation active:scale-[0.97] transition-transform` to all action buttons in affected files, and make the checkbox requirement more obvious with inline helper text.

---

## Files to Modify

### 1. CommunityAccountsTab.tsx (lines 186-228)

All four buttons get `touch-manipulation active:scale-[0.97] transition-transform` added to their className. This matches the pattern already used in FinancialClearancesTab.

Additionally, add small helper text below each checkbox row: "Tick the box first, then tap the button" in `text-[10px] text-muted-foreground` to make the checkbox requirement obvious on mobile.

**Buttons affected:**
- "Financial Status Report" (line 188) -- add touch classes
- "Check Total Indebtedness" (line 194) -- add touch classes
- "Debts Clearance Now" (line 207) -- add touch classes + helper text
- "Download Receipts" (line 221) -- add touch classes + helper text

### 2. ElectionAccreditationTab.tsx (lines 146-189)

Same treatment -- add `touch-manipulation active:scale-[0.97] transition-transform` to all four action buttons. Add checkbox helper text to the two checkbox-gated buttons.

**Buttons affected:**
- "Check Total Indebtedness" (line 148) -- add touch classes
- "Debts Clearance Now" (line 161) -- add touch classes + helper text
- "Download Receipts" (line 175) -- add touch classes + helper text
- "Financial Status Report" (line 184) -- add touch classes

### 3. FinancialClearancesTab.tsx (lines 111-153)

Already has `touch-manipulation` -- only add the checkbox helper text for consistency.

---

## Technical Details

### Touch Classes Added

```
touch-manipulation active:scale-[0.97] transition-transform
```

- `touch-manipulation` -- Removes the 300ms tap delay on mobile browsers by telling the browser this element only needs pan/pinch gestures
- `active:scale-[0.97]` -- Provides instant visual feedback (slight shrink) on press so users know their tap registered
- `transition-transform` -- Smooths the scale animation

### Checkbox Helper Text

Below each checkbox + button row, a small text note:

```tsx
<p className="text-[10px] text-muted-foreground pl-7 -mt-1">
  Tick the box first, then tap the button
</p>
```

The `pl-7` aligns the text with the button (past the checkbox), and `-mt-1` keeps it compact.

---

## Summary

| File | What Changes |
|------|-------------|
| `src/components/community/finance/CommunityAccountsTab.tsx` | Add touch-manipulation + active feedback to 4 buttons; add checkbox helper text |
| `src/components/community/elections/ElectionAccreditationTab.tsx` | Add touch-manipulation + active feedback to 4 buttons; add checkbox helper text |
| `src/components/community/finance/FinancialClearancesTab.tsx` | Add checkbox helper text for consistency |
