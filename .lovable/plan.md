

## Plan: Order Summary Enhancements + Print/Reprint for Sold Bundles

### Issue 1: Order Summary Missing Key Financial Lines
The user's screenshot shows the Order Summary (Step 3 in SubMerchantBuyVouchers) is missing important pricing lines. Currently it shows: Denomination, Bundles, Total Cards, Price per Bundle, Total Cost. It needs to also show:

- **Total Bundles Retail Value** — the full face value of all voucher cards (denomination x total cards), showing what the vouchers are actually worth
- **Merchant's Discount** — the discount percentage and amount saved
- **Total Cost** (renamed from current usage to clarify it's the discounted amount to pay)

**File: `src/pages/SubMerchantBuyVouchers.tsx`**

Changes to Step 3 (summary) and Step 5 (receipt):
- Compute `totalRetailValue` = sum of (denomination x bundleCount x 100) for each selection
- Compute `totalDiscount` = totalRetailValue - totalCost
- Add line: "Total Voucher Retail Value" showing ₦X (the face value)
- Add line: "Merchant's Discount (X%)" showing -₦Y in green
- Rename "Total Cost" to "Amount to Pay"
- Apply same additions to the success receipt

### Issue 2: Print/Reprint Button for Sold Bundles
The user's second screenshot shows they want a "Print/Reprint" action for sold cards in expanded bundles — not just for available cards. Currently `Print Bundle (N)` only appears when `bundleAvailable > 0` (available cards).

**File: `src/pages/SubMerchantVoucherBatchDetail.tsx`**

- Add a "Print/Reprint (N)" button next to the existing "Print Bundle" button in the expanded bundle view
- This button counts `sold_unused` cards (sold but not yet used) and allows reprinting them
- Count: `bundle.cards.filter(c => c.status === "sold_unused").length`
- The print action reuses the existing `VoucherPrintDrawer` or triggers `window.print()` for those specific cards

### Summary of Changes
1. **SubMerchantBuyVouchers.tsx** — Add Total Voucher Retail Value, Merchant's Discount, and Amount to Pay lines to both order summary and receipt
2. **SubMerchantVoucherBatchDetail.tsx** — Add Print/Reprint button for sold bundles in expanded bundle view

