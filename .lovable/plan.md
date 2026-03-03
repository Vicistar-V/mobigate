

## Plan: Add Regeneration Fee to Confirm Dialog + Platform Setting

### What the user wants
The regeneration confirm dialog (shown in screenshot) needs an additional line informing the user about a **Regeneration Fee** (e.g., M100 / ₦100.00) before they proceed. This fee amount should be configurable by Mobigate Admin via a platform setting.

### Changes

**1. Add Regeneration Fee setting to `src/data/platformSettingsData.ts`**
- Add a new `PlatformRegenerationFeeSettings` interface and exported constant with `regenerationFee: 100`, min/max bounds, and getter/setter functions (`getRegenerationFee()`, `setRegenerationFee()`).

**2. Update Regeneration Confirm Dialog in `src/pages/MerchantVoucherBatchDetail.tsx`**
- Import `getRegenerationFee` from platformSettingsData.
- In the `AlertDialogDescription`, after the existing text about regenerating cards, add a new paragraph:
  > "This action will charge you a Regeneration Fee of **M100 (₦100.00)**. Click 'Regenerate' below to continue, otherwise cancel."
- The fee amount is dynamically read from `getRegenerationFee()` and formatted with both Mobi and Naira notation.

**3. Update Regeneration Confirm Dialog in `src/pages/SubMerchantVoucherBatchDetail.tsx`**
- Same changes as above — add the regeneration fee info text to the sub-merchant's regeneration confirm dialog.

### Summary
- 3 files modified: `platformSettingsData.ts`, `MerchantVoucherBatchDetail.tsx`, `SubMerchantVoucherBatchDetail.tsx`
- Fee defaults to M100 (₦100.00), configurable via getter/setter in platform settings

