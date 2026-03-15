

## Plan: Fix Merchant Name Not Captured in Re-apply Flow

### Problem
When re-applying after a rejected application, the merchant name shows as generic "Merchant" / "General" because:

1. **Merchant ID mismatch**: The `merchantId` values in mock applications (e.g., "quickmart", "techhub") don't exist in any merchant data source (`mockMerchants`, `allLocationMerchants`, `merchantCountries`), so all lookups fail.
2. **Inconsistent state keys**: `SubMerchantVoucherManagement.tsx` passes navigation state as `{ prefill: { merchantName, merchantCity } }` but `SubMerchantApplicationPage.tsx` only reads `(location.state as any)?.previousData` -- so `prefill` data is ignored entirely.
3. **Fragile fallback**: The fallback `reapplyData?.merchantName || "Merchant"` only works if `previousData` was passed, which doesn't happen from every navigation source.

### Solution

**File: `src/pages/SubMerchantApplicationPage.tsx`**
- Read BOTH `previousData` and `prefill` from location state
- Add merchant name/category as URL search params (`?name=QuickMart+Ltd&category=Retail`) as a durable fallback that survives page refreshes
- Update the merchant resolution chain: data sources → `previousData` → `prefill` → URL search params → "Merchant" default

**File: `src/pages/SubMerchantApplicationStatus.tsx`**
- Append `?name=${encodeURIComponent(app.merchantName)}&category=Retail` to the re-apply navigation URL

**File: `src/pages/SubMerchantVoucherManagement.tsx`**
- Append merchant name/category as URL search params to the re-apply navigation URL
- Standardize state key from `prefill` to `previousData` for consistency

**File: `src/pages/MerchantHomePage.tsx`**
- Append merchant name to the apply URL search params

**File: `src/pages/MerchantListingPage.tsx`**
- Append merchant name to the apply URL search params

This ensures the merchant name is always available regardless of how the user arrives at the application page.

