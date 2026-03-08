

## Plan: Replace Community Voucher Bundles with Merchant Buy Vouchers Flow

### Problem
The "Subscribe for Voucher Bundles" menu item in the Community Menu opens an outdated `VoucherBundlesDialog` that shows NGN-based bundles (Basic/Standard/Premium). This is a separate, inconsistent recharge mechanism compared to the Mobi-denomination-based Buy Vouchers flow used in the Merchant area.

### Solution
Replace the dialog-based voucher bundles with navigation to the existing `/buy-vouchers` page, which uses the unified denomination selector, merchant selection, and discount system already built for the Merchant area.

### Changes

**1. Update `src/components/community/CommunityMainMenu.tsx`**
- Remove the `showVoucherBundles` state and `VoucherBundlesDialog` import/render
- Change the "Subscribe for Voucher Bundles" action to navigate to `/buy-vouchers` instead of opening the old dialog
- Add `useNavigate` hook usage for this navigation

**2. Optionally clean up unused files**
- `src/components/community/VoucherBundlesDialog.tsx` — no longer needed
- `src/data/voucherBundlesData.ts` — no longer needed (contains the old NGN bundles, partner merchants, and terms data)

### Result
Tapping "Subscribe for Voucher Bundles" (or renamed to "Buy Vouchers" for consistency) in the Community Menu will navigate to the same `/buy-vouchers` page used across the Merchant area, ensuring a uniform recharge mechanism app-wide.

