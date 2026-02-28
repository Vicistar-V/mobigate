
# Manage Merchants -- Dedicated Admin Page

## Overview

Create a new **Manage Merchants** page at `/mobigate-admin/merchants` accessible from the Admin sidebar. This page replaces the current "Merchants" tab in the Mobigate Admin Dashboard. It will be a full page with its own tabs for merchant listing, applications, and settings (voucher discount config).

## What Changes

### 1. New sidebar item: "Manage Merchants"
**File:** `src/components/AppSidebar.tsx`

Add a new entry in `superadminMenuItems` (after "Manage Quiz"):
```
{
  title: "Manage Merchants",
  icon: Store,
  url: "/mobigate-admin/merchants"
}
```
This is a direct link (no sub-items), similar to how "Manage Quiz" works but navigates to a page.

### 2. New page: `src/pages/admin/ManageMerchantsPage.tsx`

A full mobile-first page with 3 tabs:
- **All Merchants** (default) -- List of all merchants with compact cascading filters (country/state/LGA/city) using a horizontal chip-style filter row instead of stacked full-width dropdowns. Clicking a merchant opens a detail drawer showing merchant info + voucher stats + quiz stats.
- **Applications** -- The existing `MerchantApplicationsAdmin` component (moved here from the Mobigate Admin Dashboard merchants tab)
- **Settings** -- The existing `VoucherDiscountSettingsCard` component (moved here)

#### All Merchants tab details:
- **Compact filters**: A single horizontal scroll row of filter chips (Country, State, LGA, City) that open Select dropdowns when tapped. Much more compact than the user-side stacked dropdowns.
- **Search bar**: Same as user side but compact
- **Merchant cards**: Same card style as user-facing `MerchantListingPage` but with admin-specific stats added
- **Merchant Detail Drawer**: Tapping a merchant opens a bottom drawer (92vh) showing:
  - Merchant profile header (avatar, name, verified badge, category, location)
  - **Voucher Statistics**: Total batches, total cards generated, cards sold, cards used, cards available, total revenue from vouchers (all mock data)
  - **Quiz Statistics**: Total quiz seasons, total games played, total prize pool, active seasons (all mock data)
  - Buttons: "View Public Page" (links to `/merchant-home/m1`)

### 3. Compact filters for user-side `MerchantListingPage.tsx`
The current stacked full-width dropdown filters take up too much vertical space. Replace with:
- A single search bar
- A horizontal scrollable row of compact filter chips that show the current selection and open the Select when tapped
- Same cascading logic, just in a more compact horizontal layout

### 4. Remove Merchants tab from Mobigate Admin Dashboard
**File:** `src/pages/admin/MobigateAdminDashboard.tsx`
- Remove the "Merchants" tab trigger and content
- Remove imports for `MerchantApplicationsAdmin` and `VoucherDiscountSettingsCard`
- Remove the badge on the merchants tab

### 5. Route registration
**File:** `src/App.tsx`
- Add route: `/mobigate-admin/merchants` pointing to `ManageMerchantsPage`
- Import the new page component

## Implementation Order

1. Create `src/pages/admin/ManageMerchantsPage.tsx` (the full new page with 3 tabs)
2. Update `src/components/AppSidebar.tsx` (add "Manage Merchants" sidebar item)
3. Update `src/App.tsx` (add route)
4. Update `src/pages/admin/MobigateAdminDashboard.tsx` (remove merchants tab)
5. Update `src/pages/MerchantListingPage.tsx` (compact filters)

## Design Notes

- Mobile-only (360px), all drawers 92vh
- Touch targets 44px+, active:scale feedback
- Text minimum: text-xs (12px) for metadata, text-sm (14px) for data
- No text-[10px] anywhere
- Merchant detail drawer shows mock voucher/quiz stats with realistic numbers
- Filter chips use compact pill style with current value shown inline
- All UI-only, no backend
