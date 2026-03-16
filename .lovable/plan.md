

## Plan: Multi-Denomination Merchant Voucher Generation

### Problem
The merchant voucher generation flow (`MerchantVoucherGenerate.tsx`) only allows selecting **one denomination** per generation. The sub-merchant buy flow already supports multi-denomination selection with per-item bundle counts. The merchant flow needs the same capability, with **tiered discounts calculated independently per denomination**.

### How It Works Today
- **Merchant Generate**: Single denomination → bundle count step → summary → process → complete (609 lines, 5-step wizard)
- **Sub-Merchant Buy**: Multi-denomination with inline bundle counts → merchant selection → summary → process → success

### Proposed Changes

**File: `src/pages/MerchantVoucherGenerate.tsx`** (full rewrite of flow logic)

1. **Replace single selection with multi-selection state**
   - Remove `selectedDenom` (single) and `bundleCount` (single)
   - Add `selections: { denomination: RechargeVoucher; bundleCount: number }[]` array
   - Add toggle/update/remove helpers (same pattern as `SubMerchantBuyVouchers`)

2. **Merge Steps 1 & 2 into one "Select & Configure" step**
   - Denomination cards become tappable toggles (multi-select)
   - When selected, expand inline bundle count controls (+/- stepper + input + remove button) — same UX as sub-merchant
   - Sticky footer shows live running total (total value, denom count, bundle count, card count)
   - Min order value warning per denomination or globally as needed

3. **Remove the separate "bundles" step**
   - Flow becomes: `select` → `summary` → `processing` → `complete` (4 steps)

4. **Per-denomination discount calculation**
   - Each denomination's discount is computed independently using `calculateBulkDiscount(denom.mobiValue, bundleCount)`
   - Each denomination's subtotal is checked against `MIN_DISCOUNT_ORDER_VALUE` separately
   - Summary shows per-line discount rates and amounts
   - Grand totals aggregate all lines

5. **Update Summary step**
   - Show each denomination as a line item with its own discount percentage and amount
   - Show aggregated totals (total bundles, cards, subtotal, total discounts, final total)

6. **Update Complete/Receipt step**
   - Receipt lists all denominations with per-line costs
   - Print receipt includes all denomination rows

7. **Update Processing step**
   - Reference total cards across all denominations

### Discount Logic (per denomination, independent)
```text
For each selected denomination:
  subtotal = bundleCount × 100 × denomination
  tieredDiscount = getTieredDiscount(bundleCount)
  if subtotal >= MIN_DISCOUNT_ORDER_VALUE:
    apply tieredDiscount.discountPercent
  else:
    no discount for this denomination
```

### UX Pattern (matching sub-merchant)
- Tap denomination card to toggle selection
- When selected: inline bundle count controls appear below the card
- Remove button (trash icon) to deselect
- Sticky footer with live running total and "Review Order" CTA

