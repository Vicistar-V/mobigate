## Goal
Fix the Vite/SWC syntax error in `src/components/profile/ProfileAlbumsTab.tsx` caused by leftover code from the earlier merge-conflict cleanup, without changing any behavior or UI.

## Changes (single file: `src/components/profile/ProfileAlbumsTab.tsx`)

1. **Delete the stray duplicate block (lines 44–69).**
   This removes the second `export const ProfileAlbumsTab = (...)`, the duplicate `useState` declarations, and the `fetchAlbums` function that references undefined `API_BASE` / `ApiAlbum`. The component already has all the state it needs from lines 37–42.

2. **Add `useMemo` to the React import** (line 1):
   `import React, { useState, useEffect, useMemo, useCallback } from "react";`
   (Drop `useEffect`/`useCallback` if unused after cleanup.)

3. **Import `mockAlbums`** so the `userAlbums` memo at line 73 still resolves:
   `import { mockAlbums } from "@/data/posts";` (or the correct path used elsewhere — confirm during edit).

4. **Define the missing `handleAlbumClick` helper** (used at lines 182 and 215):
   ```ts
   const handleAlbumClick = (album: Album & { isSystem?: boolean }) => {
     setSelectedAlbum(album);
     setAlbumDialogOpen(true);
   };
   ```

5. **Rename `displayed` → `displayedAlbums`** (or vice-versa) so line 155's declaration matches its usages at lines 207 and 209.

6. **Remove now-unused state** (`visibleAlbumCount` at line 40) since the file uses `visibleCount` instead — keep only one.

## Out of scope
No UI/visual changes, no behavior changes, no backend work — purely a syntax/merge cleanup so the preview compiles again.
