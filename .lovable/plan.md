

# Replace Hardcoded Ad Banner with Managed Inline Ad

## The Problem

The "Need an Architect" banner in Community Accounts is **hardcoded** -- it can't be edited, removed, or managed through the existing Advertisement console. The user wants it either removed or connected to the management system.

## The Solution

Since the app already has a full **Advertisement Management Console** (Create Ad, View Ads, My Ads), we will replace the hardcoded banner with a new **InlineBannerAd** component that automatically pulls from active managed advertisements. This means every inline ad slot across the app will show ads created through the Advertisement console -- fully managed, rotatable, and tappable.

---

## What Gets Built

### 1. New Component: InlineBannerAd

**File: `src/components/community/advertisements/InlineBannerAd.tsx`** (new)

A compact, single-line banner ad that:
- Pulls a random **active** advertisement from the managed pool (`getActiveAdvertisements()`)
- Displays it in a slim card matching the screenshot style: business name on the left, "Click Here!" on the right
- Rotates to a different ad every 30 seconds
- On tap, opens the full advertisement view (AdvertisementFullViewSheet)
- Shows a tiny "Ad" badge so users know it's sponsored
- If no active ads exist, the banner simply doesn't render (returns null)
- Fully mobile-optimized with touch-manipulation and active:scale feedback

### 2. Update CommunityAccountsTab

**File: `src/components/community/finance/CommunityAccountsTab.tsx`** (modify)

- Remove the hardcoded "Need an Architect" banner (lines 146-156)
- Replace it with the new `<InlineBannerAd />` component
- Remove the unused `window.open` call to `example.com`

---

## How It Works

The InlineBannerAd component:
1. Calls `getActiveAdvertisements()` from the existing advertisement data
2. Picks a random ad on mount and rotates every 30 seconds
3. Renders a single-line banner: `[Ad] Amara's Kitchen - Premium Catering    Click Here!`
4. On tap, opens the AdvertisementFullViewSheet showing the full ad details
5. If no active advertisements exist, nothing is shown -- clean and unobtrusive

This means any ad created through the "Create Advertisement" flow in the community menu will automatically appear in these inline banner slots.

---

## Files Summary

| File | Action | Description |
|------|--------|-------------|
| `src/components/community/advertisements/InlineBannerAd.tsx` | New | Compact managed inline banner ad component |
| `src/components/community/finance/CommunityAccountsTab.tsx` | Modify | Replace hardcoded banner with managed InlineBannerAd |

