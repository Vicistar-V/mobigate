

## Fix: Regeneration Not Working + Blank Print Pages

### Problems Identified

1. **Regeneration creates a batch but user never sees it** -- `handleRegenerate` adds a new batch to local state, but the user stays on the current batch page. There's no navigation to the newly created batch, so it appears nothing happened.

2. **Printing produces blank A4 pages** -- The print container is created with `display: none`, then switched to `display: block` right before `window.print()`. In the preview iframe environment, this transition combined with the `@media print` CSS hiding rules can fail, resulting in the print area content not being visible when the print dialog renders the page.

---

### Fix 1: Navigate to new batch after regeneration

In both `MerchantVoucherBatchDetail.tsx` and `SubMerchantVoucherBatchDetail.tsx`:
- After `handleRegenerate` creates the new batch and shows the toast, navigate to the new batch's detail page so the user can immediately see the regenerated cards.
- Use the correct route prefix for each page (`/merchant-voucher-batch/` vs `/sub-merchant-voucher-batch/`).

### Fix 2: Fix blank print pages

In `VoucherExportDrawer.tsx`:
- Instead of toggling `display: none` to `display: block`, create the print container already visible (using `position: fixed; left: -9999px` to keep it off-screen but rendered).
- Use `visibility` and positioning tricks so the browser's print renderer can actually capture the content.
- Ensure the `@media print` block makes the print area visible and hides everything else reliably.

---

### Technical Details

**File: `src/pages/MerchantVoucherBatchDetail.tsx`** (line ~128-131)
- After `setBatches(prev => [...prev, newBatch])` and toast, add `navigate(`/merchant-voucher-batch/${newBatchId}`)`.

**File: `src/pages/SubMerchantVoucherBatchDetail.tsx`** (line ~106-109)
- Same change with route `/sub-merchant-voucher-batch/${newBatchId}`.

**File: `src/components/merchant/VoucherExportDrawer.tsx`** (lines ~72-158)
- Replace `printContainer.style.display = "none"` with off-screen positioning (`position: absolute; left: -9999px; top: 0`).
- Remove the `display: none` / `display: block` toggle.
- Update the `@media print` CSS to use `display: block !important; position: static !important; left: auto !important;` for the print area.
- Keep existing cleanup and afterprint logic.

