

## Plan: Add "View Official Sponsors" to Quiz Games

### Overview
Add a sponsors system where merchants can add official sponsors to their quiz seasons (brand name, logo, website/WhatsApp/email/phone), and players can view those sponsors from any game show they access.

### Data Layer

**1. New `SeasonSponsor` interface in `src/data/mobigateInteractiveQuizData.ts`**
- Fields: `id`, `brandName`, `logoUrl`, `websiteUrl?`, `whatsAppNumber?`, `email?`, `phoneNumber?`
- Add `sponsors?: SeasonSponsor[]` to the `QuizSeason` interface
- Add mock sponsor data to 2-3 existing `mockSeasons` entries

### New Component

**2. Create `src/components/community/mobigate-quiz/ViewSponsorsDrawer.tsx`**
- A mobile drawer (92vh) displaying the list of sponsors for a given season
- Each sponsor card shows: logo (Avatar fallback if none), brand name, and contact action buttons (Website opens new tab, WhatsApp generates link, Email mailto, Phone tel link)
- Only shows buttons for contact methods the merchant has provided
- Empty state if no sponsors

**3. Create `src/components/community/mobigate-quiz/ManageSponsorsSheet.tsx`**
- A mobile drawer for merchants to add/edit/remove sponsors during season creation or management
- Form fields: Brand Name (required), Logo URL, Website URL, WhatsApp Number, Email, Phone Number
- List of added sponsors with edit/delete actions
- Validation: at least brand name required

### Integration Points (where "View Official Sponsors" button appears)

**4. Player-facing: `src/pages/MerchantDetailPage.tsx`**
- Add a "View Official Sponsors" button on each season card (between the Play button and SeasonDetailsReveal)
- Opens `ViewSponsorsDrawer` with that season's sponsors
- Only visible if `season.sponsors?.length > 0`

**5. Player-facing: `src/components/community/mobigate-quiz/SeasonDetailsReveal.tsx`**
- Add a "View Official Sponsors" button inside the expanded details area
- Same drawer behavior

**6. Player-facing: `src/components/community/mobigate-quiz/InteractiveQuizSeasonSheet.tsx`**
- Add sponsors button on each season card in the season picker drawer

**7. Merchant admin: `src/pages/MerchantPage.tsx` (SeasonsTab)**
- Add a "View Official Sponsors" button in the season action buttons area (alongside Suspend/Extend/Boost)
- Opens `ManageSponsorsSheet` where merchants can add/edit/remove sponsors
- Also add sponsor fields in the "Create New Season" form

### Technical Details

- Sponsor contact links use: `window.open(url, '_blank')` for websites, WhatsApp link generator, `mailto:` for email, `tel:` for phone
- All drawers use the standard 92vh mobile pattern with `overflow-y-auto touch-auto`
- Sponsor logos render in Avatar components with brand-name initials as fallback
- Button styling: outline variant with a `Handshake` or `Building2` icon from lucide-react

