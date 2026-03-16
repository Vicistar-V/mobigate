

## Plan: Fix Blank Print Preview on Mobile

### Root Cause
The voucher card print area (`#voucher-print-area`) includes an inline style rule:
```css
@media screen { #voucher-print-area { display: none !important; } }
```
This hides the print container on screen. On mobile browsers, the print preview often renders from the visible screen state, resulting in a **blank page** because:
1. The print container is hidden via `display: none` on screen
2. Mobile print previews don't always switch to `@media print` rules before capturing

The receipt print areas (`#receipt-print-area`) in `MerchantVoucherGenerate.tsx` and `SubMerchantBuyVouchers.tsx` have a similar issue.

### Fix (3 files)

**1. `src/components/merchant/VoucherExportDrawer.tsx`**
- Remove the `@media screen { display: none }` rule from the inline styles
- Instead, position the print container off-screen but still rendered: `position: fixed; left: -9999px; top: 0;` (visible to print engine, invisible to user)
- On `@media print`, override to `position: static; left: auto;` so it prints normally
- This ensures the content is in the DOM and renderable for mobile print previews

**2. `src/pages/MerchantVoucherGenerate.tsx`**
- Apply the same off-screen positioning pattern for `#receipt-print-area`
- Remove reliance on toggling `display` property

**3. `src/pages/SubMerchantBuyVouchers.tsx`**
- Same fix as above for its `#receipt-print-area`

**4. `src/index.css`**
- Update global print styles to ensure the print areas use `visibility` and `position` rather than just `display` toggling

### The Pattern (applied to all 3 files)
```css
/* Instead of display:none on screen */
#voucher-print-area {
  position: fixed;
  left: -9999px;
  top: 0;
  width: 210mm; /* A4 width for consistent rendering */
}
@media print {
  body > *:not(#voucher-print-area) { display: none !important; }
  #voucher-print-area {
    display: block !important;
    position: static !important;
    left: auto !important;
    width: 100% !important;
  }
}
```

This keeps the content rendered (so mobile print preview can see it) but off-screen (so the user doesn't see it flash).

