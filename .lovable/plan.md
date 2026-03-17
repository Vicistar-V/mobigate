

## Plan: Add Location Filters + Replace "main-Wallet" with "Voucher Store"

### Two changes needed:

### 1. Add Country → State → City cascading filters to AdminBonusAwardsTab

**Location:** `src/components/admin/AdminBonusAwardsTab.tsx`

- Import `getUniqueCountries`, `getNigerianStatesForFilter`, `getCitiesForLGA` from `@/data/nigerianLocationsData`
- Add three new state variables: `countryFilter`, `stateFilter`, `cityFilter` (all default to `"all"`)
- Add a second row of filters below the existing Time + Denomination row with three `Select` dropdowns: Country → State → City
- State dropdown only shows when a country is selected (Nigeria specifically since that's where state data exists); City dropdown only shows when a state is selected
- Changing country resets state and city; changing state resets city
- Wire filters into `filteredAwards` (note: mock award data doesn't have location fields, so we'll add optional `countryName`, `stateName`, `cityName` fields to the `BonusAwardRecord` interface and populate some mock entries with location data so the filters actually work)

### 2. Replace all "main-Wallet" references with "Voucher Store"

**Files:** `src/components/admin/AdminBonusAwardsTab.tsx` and `src/components/admin/AwardBonusVoucherPackDrawer.tsx`

Every occurrence of "main‑Wallet" or "main-Wallet" in these two files will be changed to "Voucher Store". Specifically:

- **AdminBonusAwardsTab.tsx** (2 places):
  - Line 480: "Credited to" → "Voucher Store"
  - Line 536: "credited to merchant's main‑Wallet" → "Voucher Store"

- **AwardBonusVoucherPackDrawer.tsx** (4 places):
  - Line 254: "credited to Merchant's main‑Wallet" → "Voucher Store"
  - Line 375: "credited to merchant's main‑Wallet" → "Voucher Store"  
  - Line 389: "available in merchant's main‑Wallet" → "Voucher Store"
  - Line 433: "credited to merchant's main‑Wallet" → "Voucher Store"

