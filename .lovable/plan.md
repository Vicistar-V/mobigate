

# Fix: All Inactive Buttons on Financial Summary Page

## Problem

Every button on the Financial Summary page (navigated from Main Menu "Financial Summary") is completely non-functional:

1. **"DOWNLOAD SUMMARIES" button** -- calls `onDownload?.()` but no prop is passed from parent
2. **"Close" button** -- calls `onClose?.()` but no prop is passed from parent
3. **"View Now" button** -- works (scrolls to list) but needs better touch feedback
4. **"Friends" / "Profile" / "View Report" links** -- handlers exist but lack `active:scale` visual feedback, making them feel dead on mobile
5. **"Pay Now" button in Financial Status Dialog** -- works but dialog uses desktop `Dialog` instead of mobile `Drawer`
6. **Member avatar taps** -- handler exists but lacks visual feedback

## Root Cause

`FinancialSummaryTab.tsx` renders `FinancialSummaryTable` without passing `onDownload` or `onClose` props. And `CommunityProfile.tsx` renders `FinancialSummaryTab` without passing any navigation callback for "Close" to navigate back.

Working reference found in `CommunityAccountsTab.tsx` which correctly passes both props:
```
onDownload={() => setShowSummaryDownloadSheet(true)}
onClose={() => setIsTableCollapsed(true)}
```

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/community/finance/FinancialSummaryTab.tsx` | Add onClose prop, wire onDownload to DownloadFormatSheet, pass both to table |
| `src/pages/CommunityProfile.tsx` | Pass onClose callback to FinancialSummaryTab that navigates back to status |
| `src/components/community/finance/FinancialStatusDialog.tsx` | Convert to mobile Drawer pattern (isMobile ? Drawer : Dialog) |
| `src/components/community/finance/OtherMembersFinancialSection.tsx` | Add active:scale feedback to all link buttons |
| `src/components/community/finance/FinancialSummaryTable.tsx` | Add touch-manipulation to Select trigger |

## Detailed Changes

### 1. FinancialSummaryTab.tsx -- Wire up Download + Close

- Accept new prop: `onClose?: () => void`
- Add state: `showDownloadSheet` (boolean), `isDownloading` (boolean)
- Import `DownloadFormatSheet` and `DownloadFormat` from `@/components/common/DownloadFormatSheet`
- Import `useToast`
- Pass `onDownload={() => setShowDownloadSheet(true)}` to `FinancialSummaryTable`
- Pass `onClose={onClose}` to `FinancialSummaryTable`
- Add `handleDownload(format)` function that simulates download with toast
- Render `DownloadFormatSheet` component with `documentName="Financial Summary"` and `availableFormats={["pdf", "docx", "csv"]}`

### 2. CommunityProfile.tsx -- Pass navigation callback

- Find where `FinancialSummaryTab` is rendered (around line 1072-1076)
- Change from `<FinancialSummaryTab />` to `<FinancialSummaryTab onClose={() => handleTabChange("status")} />`
- This makes "Close" navigate back to the community status page

### 3. FinancialStatusDialog.tsx -- Convert to mobile Drawer

- Import `Drawer`, `DrawerContent`, `DrawerHeader`, `DrawerTitle` from `@/components/ui/drawer`
- Import `useIsMobile` from `@/hooks/use-mobile`
- Extract shared content into a `StatusContent` component
- On mobile: render as `Drawer` bottom sheet with `max-h-[92vh]`
- On desktop: keep existing `Dialog`
- Add `touch-manipulation` to "Pay Now" button
- Reduce padding from `p-4 sm:p-6` to `px-2 py-4` for mobile content area

### 4. OtherMembersFinancialSection.tsx -- Add visual feedback

- Add `active:scale-[0.97]` to all three Button links ("Friends", "Profile", "View Report") -- they already have `touch-manipulation` but lack the scale feedback that confirms a tap registered
- Add `active:scale-[0.97]` to the "View Now" button (already has `active:scale-[0.97]` -- confirmed working)

### 5. FinancialSummaryTable.tsx -- Touch optimization

- Add `touch-manipulation` to the `SelectTrigger` for the sort filter dropdown
- Ensure the dropdown `SelectContent` has `bg-card z-50` (already present -- confirmed)

## What Gets Fixed

| Button | Before | After |
|--------|--------|-------|
| DOWNLOAD SUMMARIES | Does nothing (no prop) | Opens DownloadFormatSheet with PDF/DOCX/CSV |
| Close | Does nothing (no prop) | Navigates back to community status page |
| View Now | Scrolls to list + toast | Same (already working) |
| Friends | Sends request + toast | Same + visual scale feedback |
| Profile | Opens MemberPreviewDialog | Same + visual scale feedback |
| View Report | Opens FinancialStatusDialog | Same + visual feedback + dialog now renders as Drawer on mobile |
| Pay Now (in report) | Processes payment | Same + now inside mobile Drawer |

## Technical Notes

- The `DownloadFormatSheet` component already exists at `src/components/common/DownloadFormatSheet.tsx` with full mobile optimization
- The Drawer conversion follows the exact `isMobile ? Drawer : Dialog` pattern used in `WalletWithdrawDialog`, `WalletTransferDialog`, and `WalletTopUpDialog`
- No backend changes needed -- this is a UI template
- All touch targets maintain minimum 44px height with `h-12` on buttons
