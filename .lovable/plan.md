

# Sub-Merchant System: Manage Sub-Merchants, Sub-Merchant Voucher Management, and Buy Vouchers Updates

## Overview
This is a major feature addition introducing a **Sub-Merchant** layer into the platform. It involves three main areas: (1) a merchant-facing sub-merchant management dashboard, (2) a sub-merchant-facing voucher purchasing portal, and (3) updates to the user-facing Buy Vouchers page to support buying from sub-merchants with conditional discount rules.

---

## Part 1: Manage Sub-Merchants (Merchant Side Panel)

A new sidebar item under Merchants Menu called **"Manage Sub-Merchants"** linking to `/merchant-sub-merchants`. This is a full page (not a drawer) with **3 tabs**:

### Tab 1: Sub-Merchant List
- Shows all sub-merchants registered under this merchant in a card list
- Each card shows: name, city/location, status (Active/Suspended), join date, total purchases
- Clicking a sub-merchant navigates to a **detail page** at `/merchant-sub-merchant/:subMerchantId`
- **Detail page** shows:
  - Sub-merchant profile info (name, location, status badge)
  - Statistics cards: total batches purchased, total bundles, total cards, total spend
  - Purchase history table: date, batch reference/tracking ID, denomination, bundles bought, total cost, status
  - Each purchase row shows batch serial prefix for tracking

### Tab 2: Sub-Merchant Requests
- Shows pending, approved, and rejected applications
- Each request card shows: applicant name, date submitted, status badge (Pending/Approved/Rejected)
- Pending requests have "Approve" and "Decline" buttons with confirmation

### Tab 3: Sub-Merchant Settings
- **Application Fee**: An input field in local currency (Naira) where the merchant sets the price sub-merchants must pay to apply
- Save button with toast confirmation

### New Files
- `src/pages/ManageSubMerchants.tsx` -- main tabbed page
- `src/pages/SubMerchantDetail.tsx` -- detail page with stats and purchase history
- `src/data/subMerchantData.ts` -- mock data: sub-merchant profiles, applications, purchase history, settings

---

## Part 2: Sub-Merchant Voucher Management (Sub-Merchant Side Panel)

A new sidebar item called **"Sub-Merchant Voucher Management"** linking to `/sub-merchant-voucher-management`. This is structurally similar to the existing Merchant Voucher Management but with key differences:

### Main Dashboard Page
- Wallet card (local currency, same as merchant)
- **"Buy Vouchers from Merchant"** primary CTA (replaces "Generate New Vouchers")
- Quick actions: All Batches, Transactions
- Inventory overview stats (same layout as merchant)
- Recent batches

### Two Additional Tabs on the Dashboard (or as entry points):
1. **My Merchants** -- list of merchants the sub-merchant is signed up with (shows merchant name, discount rate, status)
2. **My Applications** -- shows pending, accepted, and rejected merchant application requests

### Buy Vouchers Flow (Sub-Merchant buying from Merchant)
- Step 1: Select denomination (same UI as merchant voucher generate)
- Step 2: Select bundle count (same stepper UI)
- Step 3: Select which merchant to buy from (shows merchant's available stock, discount rate)
- Step 4: Order summary and payment from local wallet
- Processing and completion steps

### Sub-Merchant Discount Settings
- A settings section where the sub-merchant sets their own discount percentage (for end-users buying from them)
- Uses same slider UI pattern as the existing `VoucherDiscountSettingsCard`

### New Files
- `src/pages/SubMerchantVoucherManagement.tsx` -- main dashboard with tabs
- `src/pages/SubMerchantBuyVouchers.tsx` -- the buy-from-merchant flow
- `src/pages/SubMerchantVoucherBatches.tsx` -- all batches (reuses patterns from MerchantVoucherBatches)
- `src/pages/SubMerchantVoucherBatchDetail.tsx` -- batch detail
- `src/pages/SubMerchantVoucherTransactions.tsx` -- transaction history
- `src/data/subMerchantVoucherData.ts` -- mock batches, transactions, wallet balance, merchant stock data

---

## Part 3: Buy Vouchers Page Updates (User-Facing)

### Quantity Input Field
- When a user taps a voucher denomination card and it becomes selected, alongside the existing +/- buttons, the quantity number becomes a tappable input field
- Tapping the number opens an inline numeric input so users can type the exact quantity directly
- The +/- buttons continue to work as before

### Conditional Discount Rules
- Discount is only applied to individual voucher selections where the quantity is **10 or more**
- Items with quantity below 10 show full price (no discount) with a note like "Min 10 for discount"
- The order summary on the payment step must break down per-item: showing which items qualify for discount and which don't
- The Mobi Order banner needs to show both discounted and non-discounted totals

### Sub-Merchant Badge in Merchant List
- In the merchant selection step (Step 3), merchants that are sub-merchants display a **"Sub-Merchant"** badge
- Sub-merchants are listed alongside regular merchants but clearly distinguished

### Updated Order Summary
- The payment step must show per-voucher-line breakdown:
  - Lines with qty >= 10: show discount applied, discounted price
  - Lines with qty < 10: show "No discount" label, full price
- Totals section recalculated accordingly: sum of discounted lines + sum of non-discounted lines

### Files Modified
- `src/pages/BuyVouchersPage.tsx` -- quantity input, discount logic, sub-merchant badge, updated order summary
- `src/data/mobiMerchantsData.ts` -- add `isSubMerchant?: boolean` field to `MobiMerchant` interface, mark some merchants as sub-merchants

---

## Part 4: Sidebar and Routing Updates

### Sidebar (`src/components/AppSidebar.tsx`)
- Add under "Merchants Menu":
  - **"Manage Sub-Merchants"** linking to `/merchant-sub-merchants`
  - **"Sub-Merchant Voucher Management"** linking to `/sub-merchant-voucher-management`

### Routes (`src/App.tsx`)
New routes:
- `/merchant-sub-merchants` -- ManageSubMerchants page
- `/merchant-sub-merchant/:subMerchantId` -- SubMerchantDetail page
- `/sub-merchant-voucher-management` -- SubMerchantVoucherManagement page
- `/sub-merchant-buy-vouchers` -- SubMerchantBuyVouchers page
- `/sub-merchant-voucher-batches` -- SubMerchantVoucherBatches page
- `/sub-merchant-voucher-batch/:batchId` -- SubMerchantVoucherBatchDetail page
- `/sub-merchant-voucher-transactions` -- SubMerchantVoucherTransactions page

---

## Technical Notes

- All pages follow existing mobile-first patterns: sticky headers, 44px touch targets, rounded cards, no text smaller than 12px (text-xs)
- Mock data files provide realistic Nigerian merchant/sub-merchant data with tracking serials
- Discount logic: `calculateDiscountedAmount` is reused but only applied per cart item where qty >= 10
- Sub-merchant discount rate setting uses the same slider pattern as `VoucherDiscountSettingsCard`
- All new pages use the same navigation patterns (back button, `navigate(-1)`)
- No backend -- everything uses local state and mock data

## Summary of All Files

**New files (10):**
1. `src/data/subMerchantData.ts`
2. `src/data/subMerchantVoucherData.ts`
3. `src/pages/ManageSubMerchants.tsx`
4. `src/pages/SubMerchantDetail.tsx`
5. `src/pages/SubMerchantVoucherManagement.tsx`
6. `src/pages/SubMerchantBuyVouchers.tsx`
7. `src/pages/SubMerchantVoucherBatches.tsx`
8. `src/pages/SubMerchantVoucherBatchDetail.tsx`
9. `src/pages/SubMerchantVoucherTransactions.tsx`
10. `src/components/merchant/SubMerchantDiscountSettings.tsx`

**Modified files (4):**
1. `src/components/AppSidebar.tsx` -- add 2 new menu items
2. `src/App.tsx` -- add 7 new routes
3. `src/pages/BuyVouchersPage.tsx` -- quantity input, conditional discounts, sub-merchant badges, updated order summary
4. `src/data/mobiMerchantsData.ts` -- add `isSubMerchant` field

