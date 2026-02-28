
# Convert Sort Chips to Select and Add Cascading Location Filters

## Overview
Replace the horizontal sort chip buttons with a Select dropdown, and add cascading location filter Select dropdowns (State/Province, LGA/County, City/Town) to the merchant selection step (Step 3) in the Buy Vouchers flow. Filters use existing Nigerian location data and cascade properly.

## Changes

### 1. Add location fields to MobiMerchant data
**File:** `src/data/mobiMerchantsData.ts`

Add optional `stateId`, `stateName`, `lgaId`, `lgaName` fields to the `MobiMerchant` interface, and populate them for Nigerian merchants so they can be filtered by location:

- Mobi-Express Lagos -> state: Lagos, LGA: Ikeja
- QuickPay Solutions -> state: Abuja (FCT), LGA: Municipal Area Council
- VoucherHub Nigeria -> state: Rivers, LGA: Port Harcourt
- Naira2Mobi Store -> state: Kano, LGA: Kano Municipal
- FastCredit Ibadan -> state: Oyo, LGA: Ibadan North
- 9ja Mobi Deals -> state: Enugu, LGA: Enugu North
- PayFast Benin -> state: Edo, LGA: Oredo
- MobiKing Owerri -> state: Imo, LGA: Owerri Municipal

Other countries' merchants keep these fields undefined (filters only shown for countries with state data).

### 2. Replace sort chips with Select + add location filter Selects
**File:** `src/pages/BuyVouchersPage.tsx`

**New state variables:**
- `merchantStateFilter` (string, default "all")
- `merchantLgaFilter` (string, default "all")  
- `merchantCityFilter` (string, default "all")

**UI layout** (below the Mobi Order banner, above the merchant list):
A compact row of Select components in a horizontal scrollable container:

```
[ Sort: Highest Discount v ] [ State: All v ] [ LGA: All v ] [ City: All v ]
```

- **Sort Select**: Same 4 options (Highest Discount, Lowest Discount, Highest Rating, Lowest Rating), replaces chip buttons
- **State Select**: Populated from unique states of active merchants in the selected country. Only shows when the country has merchants with state data.
- **LGA Select**: Cascades from selected state. Only shows options matching the selected state.
- **City Select**: Cascades from selected LGA. Only shows cities matching the selected LGA.

Selecting a state resets LGA and City to "all". Selecting an LGA resets City to "all".

**Filtering logic**: Applied after sorting -- filter `sortedMerchants` by stateId, lgaId, and city matching the selected filter values.

### 3. Design details
- Each Select uses compact styling: `h-8 rounded-full text-xs` to match mobile pill aesthetic
- Selects sit in a `flex overflow-x-auto gap-2 no-scrollbar` container
- Location filters only appear for countries that have state/LGA data (currently Nigeria only)
- All text minimum text-xs (12px)
- Touch targets 44px tap area

## Files to edit
1. `src/data/mobiMerchantsData.ts` -- add location fields to interface and Nigerian merchant data
2. `src/pages/BuyVouchersPage.tsx` -- replace sort chips with Select, add cascading location filter Selects, add filter state and logic
