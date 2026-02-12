
# Restructure: Advert Management System

## Current State
The sidebar "Manage Adverts" section has 3 items:
- **Set Ad Slot Rate** -- points to `/all_settings.php#advert_slot_fee` (not built)
- **View/Manage All Adverts** -- points to `/admin/manage-adverts` (already built as a full React page)
- **Upload/Manage Promotional Ads** -- points to `/upload_manage_promotional_ad.php` (not built)

## Plan
Build the two missing pages as dedicated React routes under `/mobigate-admin/adverts/`, and move the existing manage page to align with the new route structure. Update the sidebar and admin dashboard to match -- same pattern as the quiz restructure.

### New Route Structure

| Sidebar Item | New Route | Content |
|---|---|---|
| Set Ad Slot Rate | `/mobigate-admin/adverts/slot-rates` | Configure pricing per ad slot type, duration rates, slot pack discounts |
| View/Manage All Adverts | `/mobigate-admin/adverts/manage` | Existing `AdminManageAdverts` page (moved route) |
| Upload/Manage Promotional Ads | `/mobigate-admin/adverts/promotional` | Upload, preview, enable/disable platform promotional banners |

### New Pages

**1. Ad Slot Rate Page (`/mobigate-admin/adverts/slot-rates`)**
- Mobile-first admin page with `MobigateAdminHeader`
- Display current slot packs (Entry, Basic, Standard, Business, Enterprise) as editable cards
- Each card shows: pack name, slot range, discount %, and editable base rate input
- Duration pricing section: rate multipliers for 7-day, 14-day, 30-day, 60-day, 90-day durations
- DPD (Display Per Day) pricing tiers
- All values are mock/editable with state + toast confirmations

**2. Promotional Ads Page (`/mobigate-admin/adverts/promotional`)**
- Mobile-first admin page with `MobigateAdminHeader`
- Upload section: image upload area (mock) with title, link URL, and display position (Top Banner, Feed Insert, Sidebar)
- Active promotional ads list: cards showing thumbnail, title, status toggle, impressions count, click count
- Pre-populated with 3-4 mock promotional ads
- Enable/disable toggles, delete action, edit capability

### Modified Files

**`src/components/AppSidebar.tsx`**
- Update "Manage Adverts" sub-items to new routes

**`src/App.tsx`**
- Add 2 new routes, update existing `/admin/manage-adverts` to `/mobigate-admin/adverts/manage`
- Keep old route as redirect for compatibility

**`src/pages/admin/MobigateAdminDashboard.tsx`**
- Add an "Adverts" tab (or add advert quick-link cards to existing dashboard) with 3 navigation cards linking to each sub-page, same pattern as the Quiz tab

### New Files
- `src/pages/admin/adverts/AdSlotRatesPage.tsx`
- `src/pages/admin/adverts/ManageAdvertsPage.tsx` (wrapper that renders existing `AdminManageAdverts` with admin header)
- `src/pages/admin/adverts/PromotionalAdsPage.tsx`

### Admin Dashboard Update
Add advert management cards to the Quiz tab's sibling -- either a new "Adverts" tab or integrate into the existing dashboard. Since the quiz already uses quick-link cards, the adverts section will follow the same card-based navigation pattern with 3 items.

## Technical Notes
- All data is mock/static (UI template only, no backend)
- Reuses existing slot pack data from `src/data/slotPacks.ts` for the rate configuration page
- Mobile-first: h-12 inputs, touch-friendly toggles, full-width cards
- Toast notifications for all save/update/delete actions
