

## Fix Inactive Buttons in Community Accounts

### Problem

The "Debts Clearance Now" button (circled in the screenshot) does nothing meaningful when tapped -- it only shows a brief toast notification instead of opening an actual debt clearance flow. Similarly, the "Financial Status Report" button also just shows a toast.

Both of these buttons have fully built components that should be wired to them but are not connected.

### Solution

Wire the two inactive buttons to their existing components in `CommunityAccountsTab.tsx`:

**1. "Debts Clearance Now" button (line 203-208)**
- Currently: `handleDebtsClearing()` shows a toast message
- Fix: When checkbox is checked, open the `CheckIndebtednessSheet` (already imported and rendered in the file) which has the full debt clearance flow with itemized debts, penalty calculation, and "Clear Debt Now" payment processing
- Update `handleDebtsClearing` to call `setShowIndebtednessSheet(true)` instead of `toast.success()`

**2. "Financial Status Report" button (line 184-188)**
- Currently: Shows a toast "Generating financial status report..."
- Fix: Open the `FinancialStatusDialog` component which shows financial standing, compliance rate, outstanding balance, and payment history
- Add new state: `showStatusDialog`
- Import `FinancialStatusDialog` from `./FinancialStatusDialog`
- Render `<FinancialStatusDialog>` at the bottom of the component

### Technical Changes -- Single File

**File: `src/components/community/finance/CommunityAccountsTab.tsx`**

- Add import: `FinancialStatusDialog` from `./FinancialStatusDialog`
- Add state: `const [showStatusDialog, setShowStatusDialog] = useState(false)`
- Update "Financial Status Report" button onClick: `() => setShowStatusDialog(true)`
- Update `handleDebtsClearing`: replace `toast.success(...)` with `setShowIndebtednessSheet(true)`
- Add `<FinancialStatusDialog open={showStatusDialog} onOpenChange={setShowStatusDialog} />` alongside the existing sheets at the bottom

Both target components (`CheckIndebtednessSheet` and `FinancialStatusDialog`) are already fully built with mobile-optimized layouts, payment flows, and proper drawer/dialog patterns.

