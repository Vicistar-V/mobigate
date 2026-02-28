

## Fundraiser Campaign Form Improvements (Mobile-First)

### Changes Overview

**1. MediaGalleryUpload - Remove checkmarks, add per-thumbnail delete (X) buttons**
- Remove the checkbox overlay from the main image display
- Remove the `selected` state logic (toggleSelection, checkbox)
- Add an X (close) button on each thumbnail in the strip to delete that specific item
- Preview button: shows the current image full-screen (no selection needed)
- Delete button: deletes the currently displayed (active) item
- Save button: remains as-is
- Fix button overflow by ensuring buttons stay within the Card's bounds

**2. RequestAudienceSection - "This Community" checked by default and locked**
- In `FundRaiserRaiseCampaignTab`, initialize `audience` state with `["this-community"]`
- In `RequestAudienceSection`, prevent unchecking "this-community" (disable the checkbox or skip the toggle)
- Change "this-community" `chargePercent` from `0` to mark it as included in the base price

**3. Audience pricing: percentage of base 1000 Mobi, not compounding**
- Calculate total cost as: `1000 + (sum of selected chargePercents * 10)` (10% of 1000 = 100, 15% = 150, 20% = 200, etc.)
- Display the computed total cost prominently in the submission card instead of the hardcoded "1000 Mobi"
- Pass the total cost down or compute it where needed

**4. Make the cost amount more prominent in the submission section**
- Replace the small inline "1000 Mobi" text with a larger, bold, highlighted total amount that updates dynamically

---

### Technical Details

#### File: `src/data/fundraiserData.ts`
- Change "this-community" `chargePercent` to `0` (already 0, keep it -- it's the base, always included)

#### File: `src/components/community/fundraiser/MediaGalleryUpload.tsx`
- Remove `Checkbox` import and checkbox overlay from main image
- Remove `toggleSelection` function and `selected` state references
- Add X button on each thumbnail for individual deletion
- Update Preview to preview current item directly (no selection required)
- Update Delete to delete the current item
- Ensure all buttons fit within the Card container on mobile (use smaller text, proper wrapping)

#### File: `src/components/community/fundraiser/RequestAudienceSection.tsx`
- Accept a new prop `lockedAudiences?: string[]` to prevent unchecking certain items
- Disable checkbox for "this-community" (visually checked, not toggleable)
- Expose `totalExtraCharge` via a callback prop so the parent can use it for cost calculation

#### File: `src/components/community/fundraiser/FundRaiserRaiseCampaignTab.tsx`
- Initialize `audience` with `["this-community"]`
- Track `totalExtraCharge` from `RequestAudienceSection`
- Calculate dynamic cost: `baseCost (1000) + sum of (chargePercent / 100 * 1000)` for each selected audience (excluding the base "this-community")
- Update the submission Card to show the dynamic total prominently with large bold text

