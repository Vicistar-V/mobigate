
# Add Minimum Total Order Value for Bulk Discount Eligibility

## Problem
Currently, a user can buy 10 units of M100 (total M1,000) and unlock a bulk discount. This doesn't make business sense -- discounts should only apply to genuinely large orders.

## Solution
Add a **minimum total order value of M50,000** to unlock discounts, in addition to the existing minimum quantity of 10.

Both conditions must be met:
1. Quantity >= 10 per denomination
2. Total order value >= M50,000

## Files to Modify

### 1. `src/data/platformSettingsData.ts`
- Add a `minOrderValueForDiscount` setting (default: 50000) to the platform settings
- Export a constant `MIN_DISCOUNT_ORDER_VALUE = 50000`

### 2. `src/data/merchantVoucherData.ts`
- Update `calculateBulkDiscount()` to accept an optional `totalOrderValue` parameter
- When total order value is below M50,000, force discount to 0%

### 3. `src/pages/BuyVouchersPage.tsx` (Consumer Buy Vouchers)
- Update the "Discount Unlocked!" badge logic: only show when qty >= 10 AND total cart value >= M50,000
- Update discount eligibility messages to mention both conditions
- Update the merchant list discount calculations to check total order value
- Update the payment summary discount calculations

### 4. `src/pages/MerchantVoucherGenerate.tsx` (Merchant Voucher Generation)
- Update discount display to check `denomination * bundleCount * 100 >= 50000` before showing discount
- Update the tier hint to mention minimum order value if not yet met

### 5. `src/components/mobigate/VoucherDiscountSettingsCard.tsx`
- Add a display line showing the minimum order value threshold (M50,000)

## Technical Details

### New constant in `platformSettingsData.ts`
```typescript
export const MIN_DISCOUNT_ORDER_VALUE = 50000; // M50,000 minimum
```

### Updated discount check pattern
```typescript
// Before: only quantity check
const isDiscountEligible = quantity >= 10;

// After: quantity + total value check
const isDiscountEligible = quantity >= 10 && totalOrderMobi >= MIN_DISCOUNT_ORDER_VALUE;
```

### Consumer-facing messages
- When qty < 10: "Min 10 per denomination for discount"
- When qty >= 10 but total < M50,000: "Total order must be at least M50,000 for discount"
- When both met: "Discount Unlocked!" (existing badge)

### Merchant generation
- The subtotal check uses `denomination * bundleCount * cardsPerBundle` which is the total Mobi value of the batch
