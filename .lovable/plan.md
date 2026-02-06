

# Advertisement Feature for Community Businesses

## Overview

Add a full "Advertisement" section to the Community Main Menu, modeled exactly after the Election Campaign system. Community members can advertise their businesses/products within their community, choosing target audiences, uploading photos, and paying advert fees with the same revenue-sharing formula (60% Community / 40% Mobigate).

## New Files to Create

### 1. `src/types/advertisementSystem.ts`
Type definitions for the advertisement system, mirroring `campaignSystem.ts`:

- `AdvertisementFormData` -- advertiser name, product title, description, city, phone numbers (up to 2), email, website, photos (max 4), audience targets, duration
- `EnhancedAdvertisement` -- full advert record with fees, stats, status, feedback
- `AdvertisementCategory` -- predefined business categories (e.g., Fashion, Electronics, Food, Real Estate, Services, Health, Education, Other)
- Reuse `CampaignAudience`, `CampaignDurationDays`, `FeeDistributionConfig` from existing campaign types (same audiences, same durations, same fee structure)

### 2. `src/data/advertisementData.ts`
Mock data for advertisements:

- `advertisementCategories` -- list of business categories with icons
- `mockAdvertisements` -- 4-5 sample adverts with realistic Nigerian business data (e.g., "Amara's Kitchen -- Catering Services", "TechZone -- Electronics Store", "Prestige Homes -- Real Estate")
- Helper functions: `getActiveAdvertisements()`, `getAdvertisementStats()`
- Reuses `campaignAudienceOptions`, `campaignDurationOptions`, and fee distribution from existing campaign data

### 3. `src/components/community/advertisements/CreateAdvertisementDrawer.tsx`
The primary creation form (mirrors `LaunchCampaignDialog.tsx`):

- Mobile Drawer with scrollable body and fixed footer
- Form fields (all with `h-12` touch inputs):
  - Business/Product Name (Input, required)
  - Category (Select dropdown from categories list)
  - Product Description (Textarea, max 500 chars)
  - City/Location (Input)
  - Phone Number 1 (Input, required)
  - Phone Number 2 (Input, optional)
  - Email Address (Input, optional)
  - Website URL (Input, optional)
  - Photo Upload section (max 4 photos, using grid layout with add/remove)
- Footer buttons:
  - "Preview Advert" -- opens preview sheet
  - "Configure Advert (Audience and Fees)" -- opens settings dialog
  - "Quick Submit (Free)" -- submits to community-only audience

### 4. `src/components/community/advertisements/AdvertisementSettingsSheet.tsx`
3-step audience/fee configuration (mirrors `CampaignSettingsDialog.tsx`):

- Step 1: Review advert details (read-only summary of business info + photos)
- Step 2: Choose audience targets (same checkboxes as campaign -- community, members, mobigate, users, marketplace)
- Step 3: Duration and Payment (same duration options + fee breakdown + wallet balance)
- Uses the exact same `calculateCampaignFee` and `distributeCampaignFee` functions from `campaignFeeDistribution.ts`
- Bottom sheet pattern (`SheetContent side="bottom"` at 90vh)

### 5. `src/components/community/advertisements/AdvertisementPreviewSheet.tsx`
Mobile preview of how the advert will look (mirrors `CampaignPreviewSheet.tsx`):

- Drawer with simulated ad card display
- Shows: business name, product photos (carousel if multiple), description, city, contact buttons (WhatsApp/Call, Email, Website)
- Simulated engagement bar (likes, comments, shares)
- "Looks Good" dismiss button

### 6. `src/components/community/advertisements/AdvertisementPhotoUploader.tsx`
Simplified photo uploader for up to 4 product photos:

- Grid layout (2x2) showing uploaded photos with remove buttons
- "Add Photo" button for each empty slot
- File validation (image types, max 2MB per photo)
- Thumbnail previews with numbering

### 7. `src/components/community/advertisements/AdvertisementsListSheet.tsx`
View all advertisements (mirrors `ElectionCampaignsTab.tsx`):

- Tab bar: Active | My Adverts | Ended
- Each advert card shows: thumbnail, business name, category badge, city, days remaining, view count
- Tap to open full advert view
- "Create New Advert" floating action button

### 8. `src/components/community/advertisements/AdvertisementFullViewSheet.tsx`
Full view of a single advertisement (mirrors `CampaignFullViewSheet.tsx`):

- Photo carousel at top
- Business name, category, city
- Full description
- Contact buttons row (Call, WhatsApp, Email, Website)
- Engagement bar
- "Report Ad" option
- Share button

## Existing Files to Modify

### 9. `src/components/community/CommunityMainMenu.tsx`
Add the "Advertisement" accordion between "Admins" and "Administration/Leadership" (as shown in screenshot):

- New state: `showCreateAdvert`, `showAdvertisements`
- New AccordionItem with value "advertisement":
  - "Create Advertisement" button (highlighted with orange/amber accent, like the EoI button in Elections)
  - "View Advertisements" button
  - "My Advertisements" button
- Render the `CreateAdvertisementDrawer` and `AdvertisementsListSheet` dialogs at the bottom alongside other dialogs

## Technical Implementation Details

### Fee System (Reused from Campaign)
- Same duration options: 3, 7, 14, 21, 30, 45, 60, 90 days
- Same audience targets with same premium multipliers
- Same 60/40 Community/Mobigate revenue split
- Same wallet balance check and payment processing
- Import directly from `campaignFeeDistribution.ts` -- no duplication

### Photo Upload System
- Max 4 photos (vs campaign's banner + profile + 4 artworks)
- Each photo: max 2MB, JPG/PNG/WebP
- Stored as base64 previews (UI template only, no backend)
- 2x2 grid layout on mobile with numbered badges

### Mobile-First Patterns (Consistent with Existing)
- All drawers: `max-h-[92vh]` with `DrawerBody` for scroll
- All inputs: `h-12 text-base touch-manipulation`
- All buttons: `touch-manipulation active:scale-[0.97]`
- All containers: `overflow-x-hidden`
- All text: `min-w-0 truncate` on flex children

### Data Architecture

```text
AdvertisementFormData
  businessName: string
  category: string
  description: string
  city: string
  phone1: string
  phone2?: string
  email?: string
  website?: string
  photos: string[] (max 4, base64 previews)
  audienceTargets: CampaignAudience[] (reused)
  durationDays: CampaignDurationDays (reused)
```

## Files Summary

| # | File | Action |
|---|------|--------|
| 1 | `src/types/advertisementSystem.ts` | Create |
| 2 | `src/data/advertisementData.ts` | Create |
| 3 | `src/components/community/advertisements/CreateAdvertisementDrawer.tsx` | Create |
| 4 | `src/components/community/advertisements/AdvertisementSettingsSheet.tsx` | Create |
| 5 | `src/components/community/advertisements/AdvertisementPreviewSheet.tsx` | Create |
| 6 | `src/components/community/advertisements/AdvertisementPhotoUploader.tsx` | Create |
| 7 | `src/components/community/advertisements/AdvertisementsListSheet.tsx` | Create |
| 8 | `src/components/community/advertisements/AdvertisementFullViewSheet.tsx` | Create |
| 9 | `src/components/community/CommunityMainMenu.tsx` | Modify (add accordion + state + dialog renders) |

