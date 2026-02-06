
## Wire Up All Inactive Buttons in Financial Clearances Tab

### Problem Identified

The screenshot shows the **Financial Clearances** tab (`FinancialClearancesTab.tsx`), NOT the Community Accounts tab (which was fixed previously). This tab has its own set of **4 completely static buttons** with zero onClick handlers:

- **Financial Status Report** (yellow) -- no onClick
- **Check Total Indebtedness** (red) -- no onClick
- **Debts Clearance Now** (green) -- no onClick
- **Download Receipts** (blue) -- no onClick

Additionally, two related components also have inactive elements:

- **TransactionTable.tsx** -- Header says "Click for Details" but rows have no onClick
- **FinancialSummaryTable.tsx** -- "DOWNLOAD SUMMARIES" and "Close" buttons have no onClick

### Solution

Wire all inactive elements to their existing functional components.

---

### File 1: `src/components/community/finance/FinancialClearancesTab.tsx`

This is the PRIMARY fix. Currently lines 72-89 are 4 completely static buttons.

**Changes:**
- Import `useState` from React
- Import `FinancialStatusDialog` from `./FinancialStatusDialog`
- Import `CheckIndebtednessSheet` from `../elections/CheckIndebtednessSheet`
- Import `DownloadFormatSheet` from `@/components/common/DownloadFormatSheet`
- Import `toast` from `sonner`

**Add state variables:**
- `showStatusDialog` -- controls FinancialStatusDialog
- `showIndebtednessSheet` -- controls CheckIndebtednessSheet
- `showReceiptsSheet` -- controls DownloadFormatSheet

**Wire buttons:**
| Button | Handler |
|--------|---------|
| Financial Status Report | `onClick={() => setShowStatusDialog(true)}` |
| Check Total Indebtedness | `onClick={() => setShowIndebtednessSheet(true)}` |
| Debts Clearance Now | `onClick={() => setShowIndebtednessSheet(true)}` |
| Download Receipts | `onClick={() => setShowReceiptsSheet(true)}` |

**Render dialogs** at the bottom of the component alongside existing content.

---

### File 2: `src/components/community/finance/TransactionTable.tsx`

The header says "Click for Details" but rows are not clickable.

**Changes:**
- Import `useState` from React
- Import `Drawer, DrawerContent` from `@/components/ui/drawer`
- Add `selectedTransaction` state
- Add `onClick` handler to each `<tr>` with `cursor-pointer active:bg-muted/50 touch-manipulation` classes
- When a row is tapped, open a mobile Drawer showing full transaction details:
  - Transaction description (full, not truncated)
  - Date
  - Credit/Debit amounts (with dual currency)
  - Approval code
  - Status badge
  - Close button

---

### File 3: `src/components/community/finance/FinancialSummaryTable.tsx`

"DOWNLOAD SUMMARIES" and "Close" buttons (lines 126-131) have no onClick.

**Changes:**
- Add optional `onDownload` and `onClose` callback props to `FinancialSummaryTableProps`
- Wire "DOWNLOAD SUMMARIES" button: `onClick={() => onDownload?.()}`
- Wire "Close" button: `onClick={() => onClose?.()}`
- Add `touch-manipulation active:scale-[0.97]` to both buttons for mobile feedback

---

### File 4: `src/components/community/finance/CommunityAccountsTab.tsx`

Wire the FinancialSummaryTable callbacks.

**Changes:**
- Add `showSummaryDownload` state
- Add `summarySort` state (replace the empty `onSortChange={() => {}}`)
- Pass `onDownload={() => setShowSummaryDownload(true)}` to FinancialSummaryTable
- Pass `onClose={() => setIsTableCollapsed(true)}` to FinancialSummaryTable (or scroll back up)
- Pass `onSortChange={setSummarySort}` with proper state
- Add another `DownloadFormatSheet` instance for summary downloads

---

### Summary of All Changes

| File | What Gets Fixed |
|------|----------------|
| `FinancialClearancesTab.tsx` | All 4 action buttons wired to dialogs/sheets |
| `TransactionTable.tsx` | Row clicks open detail drawer |
| `FinancialSummaryTable.tsx` | DOWNLOAD SUMMARIES and Close buttons get callbacks |
| `CommunityAccountsTab.tsx` | Wire summary table callbacks + sort state |

### Files Modified
1. `src/components/community/finance/FinancialClearancesTab.tsx`
2. `src/components/community/finance/TransactionTable.tsx`
3. `src/components/community/finance/FinancialSummaryTable.tsx`
4. `src/components/community/finance/CommunityAccountsTab.tsx`
