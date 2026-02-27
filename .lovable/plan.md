# Buy Vouchers System - Full Page Implementation

## Overview

Build a dedicated "Buy Vouchers" page accessible from the sidebar's "Merchants Menu > Buy Vouchers" link. This is a multi-step, mobile-first flow where users select voucher denominations (cart-style), then pick a merchant to see localized pricing, then proceed to payment.

## Step 1: Expand Voucher Denominations Data

Update `src/data/rechargeVouchersData.ts` to include all requested denominations in a 2-column grid layout:

- **Low tier**: 100, 200, 500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 5500, 6000, 6500, 7000, 7500, 8000, 8500, 9000, 9500, 10000
- **Mid tier**: 10000, 15000, 20000, 25000, 30000, 35000, 40000, 45000, 50000, 55000, 60000, 65000, 70000, 75000, 80000, 85000, 90000, 95000, 100000
- **High tier**: 100000, 125000, 150000, 175000, 200000, 225000, 250000, 275000, 300000 ... up to 1000000

Each entry will follow the existing `RechargeVoucher` interface (mobiValue, ngnPrice, usdPrice, isActive). The NGN:Mobi ratio stays 1:1.

## Step 2: Create the Buy Vouchers Page

New file: `src/pages/BuyVouchersPage.tsx`

A full-page, mobile-first multi-step flow with 3 steps:

### Step A - Select Vouchers (Cart-style)

- Sticky header with back arrow and title "Buy Vouchers"
- **2-column grid** of denomination cards (compact, touch-friendly)
- Each card shows the Mobi value (e.g., "500", "1,000", "10,000")
- Tapping a card selects it (highlighted border/bg)
- When selected, a quantity stepper appears (+/- buttons) on the card
- A **sticky bottom bar** shows running total: total items count, total value in Naira/Mobi, and a "Continue" button
- Cards grouped into sections with subtle headers ("Low", "Mid", "High" tiers)

### Step B - Select Merchant

- Reuses the existing country-then-merchant pattern from `MerchantSelectionStep`
- Shows countries first, then merchants within that country
- Each merchant card shows: name, city, rating, discount %, and **the actual price the user will pay** after discount (based on their cart total)
- Savings amount shown per merchant
- Tapping a merchant proceeds to Step C

### Step C - Payment Confirmation

- Shows order summary: selected vouchers with quantities, merchant info, discount applied, final amount
- A prominent "Pay Now" button that shows a toast: "Payment is being initialized..." (placeholder)
- Back button to return to merchant selection

## Step 3: Wire Up Routing and Sidebar

- `**src/App.tsx**`: Add route `/buy-vouchers` pointing to `BuyVouchersPage`
- `**src/components/AppSidebar.tsx**`: Update "Buy Vouchers" menu item URL from `"#"` to `"/buy-vouchers"`

## Technical Details

- **No backend** - pure UI template with mock data
- **Mobile-only focus** - designed for 360px viewport, no desktop considerations
- Reuses existing components: `Card`, `Badge`, `Button` from shadcn
- Reuses existing data: `mobiMerchantsData.ts` for merchants, expanded `rechargeVouchersData.ts` for denominations
- Reuses existing helpers: `calculateVoucherTotals`, `calculateDiscountedAmount`
- Uses `useNavigate` for step navigation within the page (no dialogs/drawers - full page flow)
- Touch-optimized: `touch-manipulation`, `active:scale-[0.97]`, proper tap targets
- Native scrolling with `overflow-y-auto touch-auto overscroll-contain`

## Files to Create/Modify

1. **Modify** `src/data/rechargeVouchersData.ts` - expand denominations to full range (100 to 1,000,000)
2. **Create** `src/pages/BuyVouchersPage.tsx` - the full 3-step page
3. **Modify** `src/App.tsx` - add route
4. **Modify** `src/components/AppSidebar.tsx` - update sidebar link

&nbsp;

remember what they are actualy trying to buy is mobi thats our currnelcy with symbole M buut they see merhcnat rate in there local currency like example naira