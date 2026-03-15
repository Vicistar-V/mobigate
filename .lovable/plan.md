

## Plan: Fix Bulk vs Retail Merchant Flow Mislabeling

### Problem
When starting a voucher purchase from a **Major (Bulk) Merchant's** dashboard via the access gate, the flow navigates to `/buy-vouchers?merchant=MerchantName`. The code treats `merchantParam` as meaning "retail merchant flow," causing:

1. **CTA button** says "Continue to Retail Merchants" — should say "Continue to Bulk Merchants"
2. **Order Summary badge** shows "Retail Merchant" — should show "Bulk Merchant" for bulk merchants
3. **Country/merchant labels** say "retail merchants" — should be context-aware
4. **Auto-select logic** picks the first active local merchant blindly, ignoring the merchant type context

### Root Cause
The access gate (`SubMerchantAccessGateDrawer`) navigates with `?merchant=NAME` but doesn't indicate merchant **type**. `BuyVouchersPage` uses `merchantParam` as a boolean flag assuming it always means "retail," which is incorrect for the bulk merchant flow.

### Solution

**File: `src/components/merchant/SubMerchantAccessGateDrawer.tsx`**
- Add `&type=bulk` to the navigation URL so the buy page knows the source is a bulk merchant

**File: `src/pages/MerchantHomePage.tsx`**
- For the retail (non-major) merchant direct navigation, add `&type=retail` to the URL

**File: `src/pages/BuyVouchersPage.tsx`**
- Read new `type` query param (`bulk` | `retail`)
- Update CTA: `"Continue to Bulk Merchants"` vs `"Continue to Retail Merchants"` vs `"Continue to Select Merchant"`
- Update country step labels: `"bulk merchants"` vs `"retail merchants"` vs `"merchants"`
- Update merchant selection header: `"Select a bulk merchant"` vs `"Select a retail merchant"` vs `"Select a merchant"`
- Update order summary badge: Show `"Bulk Merchant"` or `"Retail Merchant"` based on `type` param (not `isSubMerchant`)
- Auto-select logic: filter merchants by `isSubMerchant` matching the type param

### No new files needed. Three files modified.

