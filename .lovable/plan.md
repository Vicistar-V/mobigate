

## Add "Sponsored Advert" Badge to Advertisement Components

The screenshot shows the user wants a prominent **"Sponsored Advert"** badge on all advertisement displays, mirroring the **"Election Campaign"** badge pattern used on campaign banner cards.

### What Gets Changed

The "Election Campaign" badge uses this pattern on the banner image:
```
Badge (absolute top-2 right-2, text-[10px])
  Vote icon + "Election Campaign"
```

The same approach will be applied to advertisements using:
```
Badge (absolute top-2 right-2, amber-600 bg, text-[10px])
  Megaphone icon + "Sponsored Advert"
```

---

### Files to Modify

| File | What Changes |
|------|-------------|
| `AdvertisementsListSheet.tsx` | Add "Sponsored Advert" badge to thumbnail corner of each ad card |
| `AdvertisementFullViewSheet.tsx` | Add "Sponsored Advert" badge overlay on photo carousel (top-left, since top-right has stats) |
| `AdvertisementPreviewSheet.tsx` | Add "Sponsored Advert" badge overlay on photo carousel |

---

### File 1: `src/components/community/advertisements/AdvertisementsListSheet.tsx`

**Change: Add badge to the AdCard thumbnail area**

The thumbnail is a 80x80 box (lines 57-65). Add a small "Sponsored Advert" badge positioned at the bottom of the thumbnail:

- Inside the thumbnail div, add an absolute-positioned Badge
- Use amber color scheme to distinguish from election (blue) badges
- Badge text: "Sponsored Advert" with Megaphone icon
- Position: bottom-0 left-0 (small overlay on thumbnail)

Since the thumbnail is small (80x80), the badge will be compact: just the Megaphone icon + abbreviated "Ad" text to fit the space. The full "Sponsored Advert" label appears in the info section instead, as a secondary badge alongside the category badge.

Implementation:
- Add a `Badge` with amber styling next to the category badge in the info section (line 72-74 area)
- Text: "Sponsored Advert" with Megaphone icon, amber-600 background

### File 2: `src/components/community/advertisements/AdvertisementFullViewSheet.tsx`

**Change: Add "Sponsored Advert" badge on photo carousel**

The photo carousel already has stats badges (Eye count, days left) at `top-2 right-2` (lines 96-105). Add the "Sponsored Advert" badge at `top-2 left-2` to avoid collision:

- Badge with amber-600 background, white text
- Megaphone icon + "Sponsored Advert"
- Position: absolute top-2 left-2
- Same text-[10px] sizing as campaign badge

### File 3: `src/components/community/advertisements/AdvertisementPreviewSheet.tsx`

**Change: Add "Sponsored Advert" badge on preview photo carousel**

Same as full view -- add badge overlay on the photo area at top-2 left-2 (the photo counter is at top-2 right-2, so left side is available):

- Badge with amber-600 background, white text
- Megaphone icon + "Sponsored Advert"

---

### Technical Details

**Badge style (consistent across all 3 files):**
```tsx
<Badge className="bg-amber-600 text-white text-[10px] border-0">
  <Megaphone className="h-3 w-3 mr-1" />
  Sponsored Advert
</Badge>
```

**Positioning:**
- Full view and Preview: `absolute top-2 left-2` (on photo carousel)
- List card: Inline badge in the info section alongside category badge

**No new files or dependencies needed** -- all changes use existing Badge and Megaphone icon imports already present in each file.
