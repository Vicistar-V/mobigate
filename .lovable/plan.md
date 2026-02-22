
## Owner Edit Controls for QuizWinnerProfileDrawer

Add owner-only management UI to the winner profile drawer, allowing the profile owner to edit their slides, gallery photos, and video highlights. All controls are UI-only (mock) for now, with an `isOwner` prop for future backend gating.

### Changes Overview

**1. QuizWinnerProfileDrawer -- Add `isOwner` prop and edit buttons**

- Add an `isOwner` prop (default `false`, hardcoded `true` for demo)
- **Profile Slides (photo gallery at top):**
  - When `isOwner`, show a small "Edit" pencil button overlaid on the bottom-right of the photo slider
  - Tapping opens a drawer/bottom-sheet to manage slides: reorder, delete, or add new photos (mock upload using `ImageUploader`)
  - Show thumbnails of current slides with delete (X) buttons and an "Add Photo" card
  - Toast on save confirmation
- **Gallery Section:**
  - Pass `isOwner` down to `WinnerGallerySection`
  - When `isOwner`, show an "Edit" icon button next to the "Gallery" header
  - Tapping opens a management drawer with:
    - List of photos grouped by folder with delete buttons per photo
    - "Add Photo" button per folder (mock upload)
    - "Add Folder" input to create a new folder name
    - Toast feedback on actions
- **Video Highlights Section:**
  - Pass `isOwner` down to `WinnerVideoHighlightsSection`
  - When `isOwner`, show an "Edit" icon button next to the "Video Highlights" header
  - Tapping opens a management drawer with:
    - List of videos with thumbnail, title, folder, and delete button
    - "Add Video" button (mock upload with title/folder input)
    - Toast feedback on actions

**2. WinnerGallerySection -- Add owner editing**

- Accept `isOwner` and `onGalleryChange` props
- Show edit button in header when `isOwner`
- Inner drawer for managing photos: grid of thumbnails with delete overlay, "Add Photo" button (simulated via file input), folder selector/creator
- All changes call `onGalleryChange` with updated gallery array

**3. WinnerVideoHighlightsSection -- Add owner editing**

- Accept `isOwner` and `onVideoHighlightsChange` props
- Show edit button in header when `isOwner`
- Inner drawer for managing videos: list with delete, "Add Video" form (title, folder, mock thumbnail/URL)
- All changes call `onVideoHighlightsChange` with updated array

**4. Wire it up in QuizWinnerProfileDrawer**

- Maintain local mutable copies of `winner.photos`, `winner.gallery`, `winner.videoHighlights` in state
- Pass `isOwner={true}` for demo, with change handlers that update local state and show toast
- Profile slides edit drawer built directly inside QuizWinnerProfileDrawer

### Technical Details

- All editing is local state only (no backend), using `useState` with copies of winner data
- File "uploads" use `<input type="file" accept="image/*">` or `accept="video/*"`, converting to `URL.createObjectURL()` for preview
- All new drawers use the existing `Drawer`/`DrawerContent`/`DrawerBody` components from vaul
- Mobile-first: all controls use `touch-manipulation`, `active:scale-[0.97]`, compact sizing
- New icons needed: `Pencil`, `Plus`, `Trash2`, `FolderPlus`, `Upload`, `ImagePlus`, `VideoIcon` from lucide-react (most already imported)

### Files Modified

| File | Change |
|------|--------|
| `QuizWinnerProfileDrawer.tsx` | Add `isOwner` prop, local state for editable data, profile slides edit drawer, pass props down |
| `WinnerGallerySection.tsx` | Add `isOwner`/`onGalleryChange` props, edit drawer with add/delete/folder management |
| `WinnerVideoHighlightsSection.tsx` | Add `isOwner`/`onVideoHighlightsChange` props, edit drawer with add/delete management |
