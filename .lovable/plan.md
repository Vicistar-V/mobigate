
# Campaign Media Uploader Integration & Candidate Dashboard Enhancement

## Overview

This plan addresses two key requirements:
1. Add the **Campaign Media Uploader** to the Admin's "Create Campaign" form (it already exists in the Candidate's campaign creation flow but is missing from the Admin Panel)
2. Ensure the **"Create Campaign" button is prominently visible** on the Candidate Dashboard after successful election declaration

---

## Current State Analysis

### What Already Exists

| Component | Has Media Uploader | Has Create Campaign Button |
|-----------|-------------------|---------------------------|
| `CampaignSettingsDialog.tsx` (Candidate) | Yes - Line 255 | N/A (IS the creation dialog) |
| `CampaignFormDialog.tsx` (Admin) | **NO - Missing** | N/A |
| `CandidateDashboardSheet.tsx` | N/A | Yes - Lines 130-151, 237-245 |
| `DeclarationOfInterestSheet.tsx` | N/A | Redirects to dashboard |

### The Media Uploader Component

The `CampaignMediaUploader.tsx` component already provides:
- Campaign Banner upload (16:9 aspect ratio, required)
- Profile Photo upload (circular/square format, required)
- Promotional Artwork gallery (up to 4 optional images)
- File validation (type + size limits)
- Preview thumbnails with remove/set-primary actions

---

## Implementation Plan

### Task 1: Add Media Uploader to Admin Campaign Form

**File:** `src/components/admin/election/CampaignFormDialog.tsx`

**Changes:**

1. Import the media uploader component:
```typescript
import { CampaignMediaUploader } from "@/components/community/elections/CampaignMediaUploader";
```

2. Add campaign images state to form data:
```typescript
const [formData, setFormData] = useState({
  candidateName: "",
  office: "",
  slogan: "",
  manifesto: "",
  priorities: [""],
  startDate: "",
  endDate: "",
  publishImmediately: false,
  campaignImages: []  // NEW: Store uploaded images
});
```

3. Add Media Upload section after Campaign Slogan field (before Campaign Period):
```text
{/* Campaign Media Upload Section */}
<Separator className="my-4" />

<div className="space-y-2">
  <Label className="text-sm font-medium flex items-center gap-2">
    <Image className="h-4 w-4" />
    Campaign Media *
  </Label>
  <CampaignMediaUploader 
    onImagesChange={(images) => 
      setFormData(prev => ({ ...prev, campaignImages: images }))
    }
  />
</div>

<Separator className="my-4" />
```

4. Add validation in handleSubmit to ensure at least a banner is uploaded

---

### Task 2: Enhance Candidate Dashboard Campaign Button Visibility

**File:** `src/components/community/elections/CandidateDashboardSheet.tsx`

The "Create New Campaign" button already exists but can be enhanced:

**Current location (Lines 129-152):**
- A prominent CTA card with Megaphone icon
- Button styled with primary colors
- Shows when `canCreateCampaign === true` and `campaignStatus === "not_created"`

**Enhancements to make:**

1. Add a pulsing animation to draw attention:
```typescript
className="w-full animate-pulse"
```

2. Add tooltip text explaining the action

3. Add an info card below the button explaining what the campaign creation enables (reach voters, share manifesto, set audience & duration)

---

### Task 3: Ensure Declaration Flow Leads to Campaign Creation

**File:** `src/components/community/elections/DeclarationOfInterestSheet.tsx`

This already works correctly:
- After successful declaration, shows "Go to Campaign Dashboard" button
- The `onDeclarationComplete` callback is used to:
  1. Close the Declaration sheet
  2. Open the `CandidateDashboardSheet`
  
The dashboard then shows the "Create Campaign" CTA.

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/admin/election/CampaignFormDialog.tsx` | Add CampaignMediaUploader import and integrate into form with state management |
| `src/components/community/elections/CandidateDashboardSheet.tsx` | Enhance CTA visibility with animation and clearer messaging |

---

## Technical Details

### Form Data Flow (Admin Panel)

```text
CampaignFormDialog
  └── Form State
      ├── candidateName
      ├── office
      ├── slogan
      ├── manifesto
      ├── priorities[]
      ├── startDate/endDate
      ├── publishImmediately
      └── campaignImages[] ← NEW
          ├── banner (required)
          ├── profile (required)
          └── artwork[] (optional, up to 4)
```

### Candidate Dashboard Flow

```text
1. Member clicks "Declare for Election (EoI)" in Community Menu
2. DeclarationOfInterestSheet opens
3. Member selects office, pays fee
4. On success: "Go to Campaign Dashboard" button shown
5. Click redirects to CandidateDashboardSheet
6. Dashboard shows prominent "Create New Campaign" CTA (when eligible)
7. Click opens CampaignSettingsDialog (3-step process with media uploader)
```

---

## Mobile-First UI Considerations

- Media uploader is already mobile-optimized with:
  - Touch-friendly upload buttons (h-10+ touch targets)
  - Responsive grid layout (cols-2 for artworks)
  - Proper aspect ratios for mobile viewing
  - File size validation prevents slow uploads

- Admin form uses Drawer component (mobile-friendly bottom sheet)

---

## Validation Requirements

### Admin Campaign Form Validation:
1. Candidate Name - Required
2. Office Position - Required
3. Campaign Slogan - Optional but recommended
4. **Campaign Banner** - Required (NEW)
5. **Profile Photo** - Required (NEW)
6. Campaign Period - Optional (defaults available)

---

## Summary

This implementation:
1. Adds the existing `CampaignMediaUploader` component to the Admin's campaign creation form
2. Maintains consistency between Admin and Candidate campaign creation experiences
3. Keeps the existing Candidate Dashboard flow intact (the "Create Campaign" button is already there and working)
4. Enhances the CTA visibility with minor UI improvements
