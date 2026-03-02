
# Sub-Merchant Access Gate for "Get Vouchers & Bundles"

## Overview
When a Sub-Merchant taps "Get Vouchers & Bundles" on the Merchant Home page, instead of navigating directly to the buy-vouchers page, a **login/verification drawer** will appear requiring Sub-Merchant credentials before granting access.

## Changes

### 1. Add Sub-Merchant ID-Code fields to mock data
**File: `src/data/subMerchantData.ts`**
- Add `idCode`, `phone`, `email`, and `country` fields to the `SubMerchant` interface
- Populate existing mock sub-merchants with realistic ID-Codes (e.g., "SM02753900101"), phone numbers, emails, and location data (city/state/country)

### 2. Create the Access Gate Drawer component
**New file: `src/components/merchant/SubMerchantAccessGateDrawer.tsx`**

A mobile-first bottom-sheet drawer with the following flow:

**Login Form:**
- **Access Code (Sub-Merchant ID-Code)** input field -- typing a valid code auto-fills Telephone, Email, and City/State/Country fields below
- **Telephone Number** input field -- typing a valid phone auto-fills the ID-Code, Email, and location fields
- **Email** input (optional)
- **Country / State** display (auto-populated, e.g., "Awka, Anambra, Nigeria")
- **"Proceed"** button -- navigates to the buy-vouchers transaction page for that merchant

**Auto-fill behavior:**
- Entering a correct ID-Code instantly looks up the sub-merchant and populates phone, email, and location
- Entering a correct phone number instantly looks up the sub-merchant and populates ID-Code, email, and location
- A confirmation card appears showing the matched Sub-Merchant's name and details

**Validation:**
- If no match is found, show an inline error: "No Sub-Merchant found with this ID-Code/Phone"
- "Proceed" button is disabled until a valid sub-merchant is confirmed

### 3. Wire the drawer into MerchantHomePage
**File: `src/pages/MerchantHomePage.tsx`**
- Add state for the access gate drawer (`showAccessGate`)
- Change the "Get Vouchers & Bundles" button's `onClick` to open the drawer instead of navigating directly
- On successful "Proceed", navigate to `/buy-vouchers?merchant=...`

## Technical Details

- The `SubMerchant` interface gains: `idCode: string`, `phone: string`, `email: string`, `country: string`
- Mock ID-Codes follow format: `SM` + 11 digits (e.g., `SM02753900101`)
- Auto-lookup uses a simple `.find()` against `mockSubMerchants` array, matching on `idCode` or `phone`
- The drawer uses the existing `Drawer`/`DrawerContent` component with `92vh` height for mobile consistency
- All inputs use `inputMode` attributes for optimal mobile keyboards (`numeric` for phone, `email` for email)
- The component is purely UI -- no backend calls
