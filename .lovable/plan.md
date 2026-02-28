
# Buy Vouchers Sub-Merchant Flags, Discount Details, and Sub-Merchant Application System

## Summary
This plan covers 5 changes:
1. Flag all merchants in the Buy Vouchers merchant list as "Sub-Merchant" (users only buy from sub-merchants, not primary merchants)
2. Enhance the "Your Mobi Order" banner with per-item discount breakdown
3. Conditionally show/hide discount info on merchant cards based on whether the user has qualifying items
4. Add "Apply as Sub-Merchant" button on the Merchant Home page with a full application flow
5. Make "My Merchants" tab items in SubMerchantVoucherManagement clickable to navigate to merchant home

---

## Part 1: Flag All Merchants as Sub-Merchant in Buy Vouchers

### Data Change - `src/data/mobiMerchantsData.ts`
- Set `isSubMerchant: true` on ALL merchants across ALL countries (Nigeria, Ghana, Kenya, South Africa, UK, USA, Canada, UAE)
- These are the shops users buy from -- they are all sub-merchants/retailers

### UI Change - `src/pages/BuyVouchersPage.tsx` (merchant step)
- The "Sub-Merchant" badge already renders when `merchant.isSubMerchant` is true -- no card changes needed since the data change handles it
- Change header text from "Select a merchant" to "Select a Sub-Merchant"
- Change country step text from "merchants" to "sub-merchants" where appropriate

---

## Part 2: Conditional Discount Display on Merchant Cards

### Logic - `src/pages/BuyVouchersPage.tsx` (renderMerchantsStep)
- Compute which cart items qualify for discount (qty >= 10) and which don't
- Calculate total discount-eligible amount vs non-eligible amount
- If NO items qualify for discount (all qty < 10):
  - Remove the discount badge ("X% OFF") from merchant cards
  - Remove "You save" section
  - Show "You pay" as the full undiscounted amount
  - Show a subtle note: "No bulk discounts applied"
- If SOME items qualify:
  - Show discount badge but with note like "Discount on 2 of 5 items"
  - "You save" shows only the savings from eligible items
  - "You pay" shows the correctly calculated total

### Merchant Card Changes
- Compute per-merchant savings considering only discount-eligible cart items
- Only show green discount badge if there are actual savings for this user's cart

---

## Part 3: Enhanced "Your Mobi Order" Banner

### `src/pages/BuyVouchersPage.tsx` (renderMerchantsStep, sticky header)
- Expand the "Your Mobi Order" banner to show a mini breakdown:
  - Total order value
  - Number of items qualifying for discount (qty >= 10) vs total items
  - Eligible discount amount (in text like "3 items qualify for discount")
  - If none qualify: "No items qualify for bulk discount yet"
- Keep it compact -- use text-xs sizing, max 3-4 lines

---

## Part 4: Sub-Merchant Application on Merchant Home Page

### New Page - `src/pages/SubMerchantApplicationPage.tsx`
- A new page at route `/apply-sub-merchant/:merchantId`
- Shows the target merchant info at top (name, location, discount rate)
- Application form fields:
  - Applicant Full Name
  - Business/Store Name
  - Phone Number
  - Email Address
  - City
  - State
  - Business Type (select: "Retail Shop", "Kiosk", "Online Store", "Mobile Agent")
  - Brief description of business (textarea)
  - How many years in business (select)
  - Agree to terms (checkbox)
- Submit button (simulated -- shows success toast and navigates back)
- Application fee notice at bottom

### Merchant Home Page - `src/pages/MerchantHomePage.tsx`
- Add an "Apply as Sub-Merchant" button below the Voucher CTA
- Styled as a secondary CTA (outline style, with Store icon)
- Navigates to `/apply-sub-merchant/:merchantId`

### Sidebar - `src/components/AppSidebar.tsx`
- Add "Apply as Sub-Merchant" item under the merchant section, linking to `/apply-sub-merchant/m1` (default merchant for demo)

### Routes - `src/App.tsx`
- Add route: `/apply-sub-merchant/:merchantId` -> `SubMerchantApplicationPage`

---

## Part 5: Clickable "My Merchants" in SubMerchantVoucherManagement

### `src/pages/SubMerchantVoucherManagement.tsx`
- Make each merchant card in the "My Merchants" tab clickable
- On click, navigate to `/merchant-home/${merchantId}` (map parent merchant IDs to merchant home IDs, default to `m1` for demo)
- Add a ChevronRight icon to indicate tappability
- Add `cursor-pointer active:scale-[0.97]` touch feedback

---

## Files to Create
1. `src/pages/SubMerchantApplicationPage.tsx` -- New application form page

## Files to Modify
1. `src/data/mobiMerchantsData.ts` -- Add `isSubMerchant: true` to all merchants
2. `src/pages/BuyVouchersPage.tsx` -- Conditional discount display, enhanced order banner, sub-merchant labeling
3. `src/pages/MerchantHomePage.tsx` -- Add "Apply as Sub-Merchant" CTA button
4. `src/pages/SubMerchantVoucherManagement.tsx` -- Make My Merchants tab items clickable to merchant home
5. `src/components/AppSidebar.tsx` -- Add sidebar link for sub-merchant application
6. `src/App.tsx` -- Add route for SubMerchantApplicationPage

## Technical Notes
- All new UI is mobile-first (360px target), no desktop considerations
- Touch targets minimum 44px, minimum font size 12px (text-xs)
- Sub-merchant application is UI-only with mock submission (toast confirmation)
- Discount logic: only cart items with quantity >= 10 get the merchant's discount percentage applied
