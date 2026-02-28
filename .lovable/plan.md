

# Link "Get Vouchers & Bundles" to Buy Vouchers Flow

## Problem
The "Get Vouchers & Bundles" button on the Merchant Home page (`/merchant-home/:merchantId`) currently only shows a toast -- it doesn't navigate anywhere. It should take the user to the Buy Vouchers flow, pre-associated with that merchant so they skip the country/merchant selection steps.

## Solution

Since the Merchant Home page uses `mockMerchants` data (merchant listing system) while the Buy Vouchers page uses `MobiMerchant` from `mobiMerchantsData.ts` (a different data model for voucher sellers), we can't directly map between them. Instead, we'll:

1. Navigate to `/buy-vouchers?merchant=<merchantName>` passing the merchant name
2. On the Buy Vouchers page, detect this query param and auto-select the first local merchant (Nigeria) as the pre-selected merchant, displaying the originating merchant's name in context
3. Skip the country and merchant selection steps -- after choosing voucher denominations, go straight to payment summary with the pre-selected merchant

## Changes

### 1. `src/pages/MerchantHomePage.tsx`
- Change the "Get Vouchers & Bundles" button `onClick` from showing a toast to navigating: `navigate(/buy-vouchers?merchant={merchantId})`

### 2. `src/pages/BuyVouchersPage.tsx`
- Read a new `merchant` search param
- When present, auto-select the local country and its first merchant on mount
- Modify `goToCountries()` so when a merchant is pre-selected, it skips country and merchant steps and goes directly to `payment`
- Adjust `handleBack()` so pressing back from `payment` when pre-selected goes back to `vouchers` (not `merchants`)
- Show a small banner on the voucher selection step indicating "Buying from [Merchant Name]"

## Design Notes
- Mobile-first (360px), all existing patterns maintained
- No new files needed -- just two file edits
- The pre-selected merchant defaults to the first active local (Nigeria) merchant since the merchant listing and voucher merchant systems use different data models
