
# Invalidation Rework, Regeneration, Native Printing, and Receipt System

## Overview
Four interconnected improvements across merchant and sub-merchant batch detail pages:

1. **Invalidation scope**: Remove per-card invalidation -- only allow invalidation by **bundle** or by **batch**
2. **Regeneration button**: After invalidation, show a "Regenerate" button that creates a replacement batch containing only the invalidated cards (excluding used ones), respecting 100-cards-per-bundle structure
3. **Native printing**: Replace the simulated print flow with `window.print()` to trigger the browser's native print dialog, rendering an A4-formatted print layout with full card details (serial, full PIN, denomination, date, batch number)
4. **Receipts**: After voucher generation (merchant) or purchase (sub-merchant), show a proper receipt with all transaction details, printable via the same native print system
5. **Sub-merchant printing**: Add the VoucherPrintDrawer to the sub-merchant batch detail page (currently missing)
6. **Enriched card data**: Each card row in batch detail views gets more visible info (denomination, batch number, created date, bundle prefix)

---

## Part 1: Invalidation Changes

### Remove per-card invalidation
- **MerchantVoucherBatchDetail.tsx**: Remove the per-card "Invalidate" button from each card row. Keep only bundle-level and batch-level invalidation buttons.
- **SubMerchantVoucherBatchDetail.tsx**: Same removal of per-card invalidate buttons.
- Remove `type: "card"` from the `InvalidateTarget` type in both files.

### Add Regeneration after invalidation
- After invalidation completes, show a "Regenerate Invalidated Cards" button on the batch detail page.
- The button appears when `counts.invalidated > 0`.
- Clicking it opens a confirmation dialog showing how many cards will be regenerated (only invalidated cards, NOT used ones).
- On confirm, create a new replacement batch in local state with:
  - `generationType: "replacement"`
  - `replacedBatchId` pointing to the original batch
  - Cards grouped into bundles of 100
  - Same denomination as original
  - New batch number using the existing `generateBatchNumber()` format
- Show a toast with the new batch number and a "View Batch" action.

---

## Part 2: Native Printing System

### Replace simulated print with `window.print()`
- **VoucherExportDrawer.tsx**: When "Print" is clicked, instead of simulating a 2s delay:
  1. Dynamically create a hidden printable div with A4-formatted voucher cards
  2. Each card rendered in a grid/table layout showing:
     - Serial Number (full, not truncated)
     - Full PIN (unmasked)
     - Denomination (e.g., M500)
     - Batch Number
     - Bundle Prefix
     - Date Generated
  3. Call `window.print()` which triggers the browser's native print dialog with preview
  4. On `afterprint` event, mark cards as `sold_unused` / `physical` and close the drawer
- Add a `@media print` CSS block (in `index.css` or inline) that hides everything except the print content and formats for A4

### Card layout for printing
- A4 page: cards arranged in a grid (e.g., 4 columns x 5 rows per page = 20 cards per page)
- Each card cell contains: denomination, serial, PIN (full), date, batch ref
- Clear borders, readable font size (at least 10pt), no color backgrounds for ink efficiency
- Page breaks between full pages

---

## Part 3: Sub-Merchant Printing

### Add VoucherPrintDrawer to SubMerchantVoucherBatchDetail
- Import and wire up `VoucherPrintDrawer` in `SubMerchantVoucherBatchDetail.tsx`
- Add "Print Cards" button (same pattern as merchant batch detail)
- Add `handlePrintComplete` to mark cards as `sold_unused` / `physical`

---

## Part 4: Receipt on Generation/Purchase Complete

### Merchant Generation Receipt (MerchantVoucherGenerate.tsx)
- Replace the current "complete" step's simple summary with a full receipt:
  - Receipt header: "VOUCHER GENERATION RECEIPT"
  - Receipt number (transaction ref)
  - Date and time
  - Merchant ID
  - Denomination, bundle count, total cards
  - Subtotal, discount %, discount amount, total paid
  - Wallet balance after deduction
  - Batch number assigned
- Add a "Print Receipt" button that uses `window.print()` with A4 formatting
- Keep "View Batches" and "Back to Dashboard" buttons below

### Sub-Merchant Purchase Receipt (SubMerchantBuyVouchers.tsx)
- Same receipt treatment on the "success" step:
  - "VOUCHER PURCHASE RECEIPT"
  - Transaction ref, date/time
  - Purchased from (merchant name)
  - Denomination, bundles, cards, cost breakdown
  - "Print Receipt" button

---

## Part 5: Enriched Card Data in Batch Details

### Both MerchantVoucherBatchDetail and SubMerchantVoucherBatchDetail
- Each card row currently shows: serial, PIN (masked), status, sold date, invalidate button
- Add to each card row:
  - Denomination (e.g., "M500")
  - Created date
  - Bundle prefix label
  - Sold via channel (if sold): "Physical" or "Digital"
- Use normal readable text sizes (text-sm for primary info, text-xs only for secondary labels)

---

## Files to Modify

1. **`src/pages/MerchantVoucherBatchDetail.tsx`** -- Remove per-card invalidation, add regeneration button/logic, add print button for sub-bundles, enrich card rows
2. **`src/pages/SubMerchantVoucherBatchDetail.tsx`** -- Same: remove per-card invalidation, add regeneration, add VoucherPrintDrawer, enrich card rows
3. **`src/components/merchant/VoucherExportDrawer.tsx`** -- Replace simulated print with native `window.print()` using A4 layout, unmask PINs in print view
4. **`src/pages/MerchantVoucherGenerate.tsx`** -- Replace "complete" step with full receipt, add "Print Receipt" button
5. **`src/pages/SubMerchantBuyVouchers.tsx`** -- Replace "success" step with full receipt, add "Print Receipt" button
6. **`src/index.css`** -- Add `@media print` styles for A4 formatting and hiding non-print content

---

## Technical Notes

- Regeneration creates new batch entries in local state arrays -- no backend needed
- `window.print()` is natively supported in all browsers and shows the OS/Chrome print dialog with preview
- The `@media print` CSS approach cleanly separates screen vs print rendering
- Card grids for A4 printing use CSS grid with `page-break-after: always` for pagination
- All touch targets remain 44px minimum, no text below 12px on screen views
- PINs are only unmasked in the print-specific hidden div, never shown on screen
