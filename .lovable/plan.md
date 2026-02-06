
# Fix Two Mobile UI Issues

## Issue 1: Text Correction -- "on" not "from"

The user identified that all wallet debit messages incorrectly say "from your Mobi Wallet" when they should say "on your Mobi Wallet." This text appears in **5 files across 7 locations** and all will be corrected.

### Files and Lines to Fix

| File | Line(s) | Current Text | Fixed Text |
|------|---------|-------------|------------|
| `ElectionAccreditationTab.tsx` | 81 | "debited from your Mobi Wallet" | "debited on your Mobi Wallet" |
| `ElectionAccreditationTab.tsx` | 316 | "from your Mobi Wallet" | "on your Mobi Wallet" |
| `CheckIndebtednessSheet.tsx` | 34 | "debited from your Mobi Wallet" | "debited on your Mobi Wallet" |
| `CheckIndebtednessSheet.tsx` | 125 | "from your Mobi Wallet" | "on your Mobi Wallet" |
| `FinancialStatusDialog.tsx` | 54 | "debited from your Mobi Wallet" | "debited on your Mobi Wallet" |
| `FinancialStatusDialog.tsx` | 258 | "debited from your Mobi Wallet" | "debited on your Mobi Wallet" |
| `MinutesDownloadDialog.tsx` | 133 | "debited from your Mobi Wallet" | "debited on your Mobi Wallet" |
| `CampaignSettingsDialog.tsx` | 165 | "debited from your Mobi Wallet" | "debited on your Mobi Wallet" |

---

## Issue 2: Financial Accreditation Stat Boxes -- Compact Horizontal Fit

The three stat cards (Accredited, Pending, Total) in the Financial Accreditation tab are taking up too much vertical space on mobile. They need to be restructured into a tighter, more compact horizontal row.

### File: `FinancialAccreditationTab.tsx` (lines 46-65)

**Current**: Three `Card` components in a `grid-cols-3` with `p-2.5` padding, `text-xl` numbers, and somewhat long labels ("Accredited Members", "Pending Accreditation", "Total Members"). On small screens, the cards can appear tall with wasted space.

**Fix**: Replace with a single compact stat bar using:
- A single `Card` wrapper with a 3-column grid inside (no separate card borders per stat)
- Centered alignment for each stat cell
- Larger bold numbers (`text-2xl`) for emphasis
- Short labels ("Accredited", "Pending", "Total") in `text-[10px]` for compact fit
- Dividers between columns instead of separate card gaps
- Reduced padding to make the entire row compact
- Color-coded numbers (green, amber, blue) matching the stat meaning

This transforms 3 tall separate boxes into one slim horizontal bar that fits cleanly on any mobile width.

---

## Summary

| File | Action | What Changes |
|------|--------|-------------|
| `src/components/community/elections/ElectionAccreditationTab.tsx` | Modify | Fix 2 "from" to "on" |
| `src/components/community/elections/CheckIndebtednessSheet.tsx` | Modify | Fix 2 "from" to "on" |
| `src/components/community/finance/FinancialStatusDialog.tsx` | Modify | Fix 2 "from" to "on" |
| `src/components/community/meetings/MinutesDownloadDialog.tsx` | Modify | Fix 1 "from" to "on" |
| `src/components/community/elections/CampaignSettingsDialog.tsx` | Modify | Fix 1 "from" to "on" |
| `src/components/community/finance/FinancialAccreditationTab.tsx` | Modify | Restructure stat boxes into compact horizontal row |
