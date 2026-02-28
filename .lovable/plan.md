

# Print/Export Vouchers + Admin Discount Settings

## Overview

Two features to build:

1. **Print/Export on Batch Detail** -- merchants can select voucher cards from a batch and download/print them (with full serial numbers and PINs revealed). Exported cards get marked as "sold_unused" with `soldVia: "physical"`.

2. **Admin Voucher Discount Settings** -- a new section in the Mobigate Admin Dashboard (Settings or Merchants tab) where admins set a single discount percentage per bundle count (not tiered -- just one flat percentage value that applies per bundle purchased).

---

## Feature 1: Print/Export Voucher Cards

### Changes to `src/pages/MerchantVoucherBatchDetail.tsx`

- Add a **"Print / Export Cards"** button in the header area (next to the invalidate batch button)
- Tapping opens a bottom drawer with options:
  - **Select cards to export**: "All Available" (quick select) or manual bundle-by-bundle selection
  - Only cards with status "available" can be printed/exported
  - Show count of selected cards
- After selecting, tap "Continue" to open the existing `DownloadFormatSheet` component (reuse it) with formats: PDF and CSV
- On download confirmation:
  - Generate a mock PDF/CSV preview (simulated -- show a success screen with document name)
  - **Mark all exported cards as `sold_unused`** with `soldVia: "physical"` and set `soldAt` to current date
  - Show a toast confirming "X cards exported and marked as sold"
- The export document (conceptual) contains: batch number, denomination, and for each card: serial number, **full PIN** (unmasked), and status

### New component: `src/components/merchant/VoucherExportDrawer.tsx`

- A Drawer component that handles the card selection UI
- Props: `open`, `onOpenChange`, `batch`, `onExportComplete(cardIds: string[])`
- Shows list of bundles with checkboxes, "Select All Available" button
- Displays count of selected exportable cards
- "Continue to Download" button opens `DownloadFormatSheet`
- On format selected, simulates a 2-second download, then calls `onExportComplete` with selected card IDs

### Changes to `src/data/merchantVoucherData.ts`

- No structural changes needed -- the status update logic lives in the page component's state

---

## Feature 2: Admin Bulk Discount Configuration

### Changes to `src/data/platformSettingsData.ts`

Add new settings interface and data:

```
PlatformVoucherDiscountSettings {
  discountPercentPerBundle: number  // e.g., 0.5 means 0.5% per bundle
  discountPercentMin: number        // 0
  discountPercentMax: number        // 2
  maxDiscountPercent: number        // cap at e.g., 25%
  lastUpdatedAt: Date
  lastUpdatedBy: string
}
```

- Single percentage applied per bundle count (e.g., if set to 0.5%, buying 10 bundles = 5% discount, 20 bundles = 10%, capped at `maxDiscountPercent`)
- Add getter/setter functions following existing patterns

### Changes to `src/data/merchantVoucherData.ts`

- Update `getDiscountForBundles()` and `calculateBulkDiscount()` to use the platform setting instead of hardcoded tiers
- Remove the `discountTiers` array (replaced by dynamic calculation)

### New component: `src/components/mobigate/VoucherDiscountSettingsCard.tsx`

- A Card component (same style as `WithdrawalSettingsCard` and `QuizSettingsCard`)
- Shows current discount rate per bundle, max cap
- Slider or input to adjust the percentage per bundle (0% to 2%)
- Slider or input for max discount cap (5% to 50%)
- "Update" button with toast confirmation
- Preview section showing example: "10 bundles = X% discount, 50 bundles = Y% discount"

### Changes to `src/pages/admin/MobigateAdminDashboard.tsx`

- Add the `VoucherDiscountSettingsCard` to the **Settings tab** (after QuizSettingsCard)
- Import the new component

---

## Implementation Order

1. Create `src/data/platformSettingsData.ts` additions (voucher discount settings)
2. Update `src/data/merchantVoucherData.ts` (use platform settings for discount calc)
3. Create `src/components/mobigate/VoucherDiscountSettingsCard.tsx`
4. Add to Mobigate Admin Dashboard Settings tab
5. Create `src/components/merchant/VoucherExportDrawer.tsx`
6. Update `src/pages/MerchantVoucherBatchDetail.tsx` with export button + status marking logic

---

## Design Notes

- Mobile-only (360px), all drawers at 92vh max
- Touch targets 44px+, active:scale feedback
- Professional merchant aesthetic (slate/blue tones)
- Reuse existing `DownloadFormatSheet` for format selection
- All mock/UI only -- no backend

