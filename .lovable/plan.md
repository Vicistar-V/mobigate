

## FundRaiser Button Connection + Mobile Optimization

### Problem Analysis

The **FundRaiser** button in the `RotatingCtaButton` component is not functioning correctly because:

1. **Wrong Tab ID**: The `handleFundRaiser` function uses `"fund-raiser"` as the tab identifier, but the actual tab is registered as `"fundraiser-campaigns"`
2. **No Navigation**: Users tap the button but nothing happens because the URL parameter doesn't match any displayed content

### Solution Overview

Fix the tab navigation and apply mobile-first optimizations to ensure a smooth, polished experience on mobile devices.

---

## Implementation Details

### 1. Fix FundRaiser Tab Navigation

**File**: `src/pages/CommunityProfile.tsx`

**Current (Broken)**:
```tsx
const handleFundRaiser = () => {
  handleTabChange("fund-raiser"); // Wrong ID
  toast({
    title: "FundRaiser",
    description: "Opening community fundraiser campaigns...",
  });
};
```

**Fixed**:
```tsx
const handleFundRaiser = () => {
  handleTabChange("fundraiser-campaigns"); // Correct ID
};
```

- Remove the toast notification (it's unnecessary once navigation works)
- The correct tab ID `"fundraiser-campaigns"` matches line 867 where `FundRaiserViewCampaignsTab` is rendered

---

### 2. Mobile-Optimize FundRaiser Header

**File**: `src/components/community/fundraiser/FundRaiserHeader.tsx`

**Changes**:
- Reduce padding from `p-6` to `p-4` for tighter mobile fit
- Scale down heading from `text-3xl` to `text-xl sm:text-2xl`
- Reduce subtitle from `text-lg` to `text-sm sm:text-base`
- Ensure full-width container fits mobile viewport without margins

---

### 3. Mobile-Optimize FundRaiser Campaigns Tab

**File**: `src/components/community/fundraiser/FundRaiserViewCampaignsTab.tsx`

**Changes**:
- Reduce heading size from `text-xl` to `text-lg` for mobile
- Shrink sort dropdown width from `w-[160px]` to `w-[140px]`
- Add proper spacing and ensure content fits full mobile width

---

### 4. Mobile-Optimize Donation Card

**File**: `src/components/community/fundraiser/DonationCard.tsx`

**Changes**:
- Reduce card padding from `p-6` to `p-4` on mobile
- Scale down convener avatar from `h-12 w-12` to `h-10 w-10`
- Reduce campaign theme heading from `text-xl` to `text-lg`
- Optimize the 2-column detail grid with smaller padding
- Ensure donate button maintains full width with proper touch targets (`py-5` instead of `py-6`)

---

### 5. Mobile-Optimize Donation Sheet

**File**: `src/components/community/fundraiser/DonationSheet.tsx`

**Changes**:
- Already well-optimized with Drawer pattern and 90vh height
- Minor refinement: Ensure ScrollArea uses `touch-auto` for iOS momentum scrolling
- Confirm button sizing is touch-friendly (minimum 48px height)

---

## Component Architecture Summary

```text
RotatingCtaButton
    |
    +-- onFundRaiser() --> handleTabChange("fundraiser-campaigns")
                                    |
                                    v
                          FundRaiserViewCampaignsTab
                                    |
                                    +-- FundRaiserHeader (mobile-optimized)
                                    +-- DonationCard (mobile-optimized)
                                    +-- DonationSheet (already mobile-ready)
```

---

## Files to Modify

| File | Change Type |
|------|-------------|
| `src/pages/CommunityProfile.tsx` | Fix tab ID in `handleFundRaiser` |
| `src/components/community/fundraiser/FundRaiserHeader.tsx` | Mobile typography + padding |
| `src/components/community/fundraiser/FundRaiserViewCampaignsTab.tsx` | Mobile spacing + sizing |
| `src/components/community/fundraiser/DonationCard.tsx` | Mobile padding + compact layout |

---

## Expected Outcome

After implementation:
1. Tapping the rose-colored **FundRaiser** button navigates to the FundRaiser campaigns tab
2. All FundRaiser UI components display properly on mobile without horizontal overflow
3. Cards, buttons, and inputs have proper touch targets (minimum 44-48px)
4. Donation flow works seamlessly with the bottom sheet pattern on mobile

