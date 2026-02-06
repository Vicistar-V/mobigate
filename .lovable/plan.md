

# Add Video Support to Advertisement Media

## What Changes

Currently, advertisements only support photos. This update adds **video support** so advertisers can upload a mix of photos and videos (up to 4 items total per ad). Every component that displays or handles ad media needs to be updated.

## Technical Approach

Replace the `photos: string[]` field with a `media: AdMediaItem[]` array where each item tracks both the URL/data and the file type (image or video).

```text
AdMediaItem {
  url: string          -- base64 data URL or remote URL
  type: 'image' | 'video'
  thumbnailUrl?: string -- auto-generated for videos
}
```

---

## Files to Modify (8 files)

### 1. `src/types/advertisementSystem.ts`
- Add new `AdMediaItem` interface with `url`, `type`, and optional `thumbnailUrl`
- Change `photos: string[]` to `media: AdMediaItem[]` in both `AdvertisementFormData` and `EnhancedAdvertisement`

### 2. `src/components/community/advertisements/AdvertisementPhotoUploader.tsx`
- Rename to **AdvertisementMediaUploader** (new file, old file kept as re-export for safety)
- Accept `media: AdMediaItem[]` instead of `photos: string[]`
- Update file input `accept` to include `video/mp4,video/webm,video/quicktime`
- Increase max size for videos to 10MB (keep 2MB for images)
- Render video thumbnails with a play icon overlay in the 2x2 grid
- Show media type indicator badge (photo/video icon) on each slot
- Update label: "Product Photos & Videos (X/4)"
- Update helper text: "JPG, PNG, WebP, MP4, WebM -- Images max 2MB, Videos max 10MB"

### 3. `src/components/community/advertisements/CreateAdvertisementDrawer.tsx`
- Import updated MediaUploader
- Change `formData.photos` references to `formData.media`
- Update the uploader component usage

### 4. `src/components/community/advertisements/AdvertisementPreviewSheet.tsx`
- Change `formData.photos` to `formData.media`
- In the carousel, check `media[i].type`:
  - If `'image'`: render `<img>` (same as now)
  - If `'video'`: render `<video>` with `controls`, `playsInline`, `muted` attributes, with poster frame
- Update counter text and empty state message

### 5. `src/components/community/advertisements/AdvertisementFullViewSheet.tsx`
- Change `ad.photos` to `ad.media`
- Same image/video rendering logic as preview
- Add play icon overlay on video carousel items
- Videos play inline with controls on tap

### 6. `src/components/community/advertisements/AdvertisementsListSheet.tsx`
- Change `ad.photos` to `ad.media` for thumbnail rendering
- If first media item is a video, show video thumbnail with small play icon overlay
- Otherwise show image as before

### 7. `src/components/community/advertisements/AdvertisementSettingsSheet.tsx`
- Update any references to `formData.photos` to `formData.media`
- Update step 1 summary to show "X media items" instead of "X photos"

### 8. `src/data/advertisementData.ts`
- Convert all `photos: [...]` arrays to `media: [...]` with `{ url: "...", type: "image" }` format
- Add one mock video entry to one of the advertisements for demo purposes

---

## Mobile-Specific Details

**Video Playback in Carousel:**
- Videos render with `playsInline`, `muted`, and `controls` attributes for smooth mobile playback
- A centered play icon overlay appears on video frames before interaction
- Tap to play/pause within the carousel

**Media Uploader Grid:**
- Each 2x2 grid slot shows a small badge icon in the corner:
  - Camera icon for photos
  - Video icon for videos
- Videos display a static first frame with a semi-transparent play button overlay
- The empty slot button text changes to "Add Media" instead of "Add Photo"

**File Validation:**
- Images: JPG, PNG, WebP -- max 2MB each
- Videos: MP4, WebM -- max 10MB each
- Total: 4 items combined

---

## Summary Table

| File | Action |
|------|--------|
| `src/types/advertisementSystem.ts` | Modify -- add `AdMediaItem`, change `photos` to `media` |
| `AdvertisementPhotoUploader.tsx` | Modify -- support video files, rename labels, add play overlays |
| `CreateAdvertisementDrawer.tsx` | Modify -- update `photos` refs to `media` |
| `AdvertisementPreviewSheet.tsx` | Modify -- render videos in carousel |
| `AdvertisementFullViewSheet.tsx` | Modify -- render videos in carousel |
| `AdvertisementsListSheet.tsx` | Modify -- video thumbnail support |
| `AdvertisementSettingsSheet.tsx` | Modify -- update photo refs to media |
| `advertisementData.ts` | Modify -- convert photos arrays to media format |

