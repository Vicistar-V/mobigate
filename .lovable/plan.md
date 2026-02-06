
## Fix Inactive Edit Button in Publications Management

### Problem

The "Edit" button on publication cards in the "Manage Resources > Pubs" tab has no `onClick` handler, making it completely non-functional on mobile (or anywhere).

### Solution

Wire the Edit button to open the existing upload form pre-filled with the selected publication's data, allowing the admin to modify and save changes.

### File: `src/components/community/ManageCommunityResourcesDialog.tsx`

**1. Add editing state (after line 68)**

Add a state variable to track which publication is being edited:
```tsx
const [editingPubId, setEditingPubId] = useState<string | null>(null);
```

**2. Add `handleEditPublication` handler (after `handleDeletePublication` around line 274)**

Create a function that pre-fills the upload form fields with the selected publication's data:
```tsx
const handleEditPublication = (pub: typeof publications[0]) => {
  setEditingPubId(pub.id);
  setPubTitle(pub.title);
  setPubDescription(pub.description);
  setPubType(pub.type);
  setPubEdition(pub.edition);
  setPubPages(String(pub.pages));
  setPubFeatured(pub.featured);
  setCoverImageFile(pub.coverImage ? { name: "Current cover", preview: pub.coverImage } : null);
  setPdfFile({ name: "Current PDF file" });
  setShowUploadForm(true);
};
```

**3. Update `handleUploadPublication` (lines 206-231)**

Modify the existing upload handler to support both create and update flows:
- If `editingPubId` is set, show "Publication Updated" toast
- If not, show the current "Publication Uploaded" toast
- Reset `editingPubId` to null in both cases

**4. Update form title and button text**

Change the upload form header (line 617) and submit button (line 781) to reflect whether we're creating or editing:
- Header: `editingPubId ? "Edit Publication" : "Upload Publication"`
- Button: `editingPubId ? "Save Changes" : "Upload Publication"`

**5. Update form close handler**

When closing the upload form (line 620), also reset `editingPubId`:
```tsx
onClick={() => { setShowUploadForm(false); setEditingPubId(null); }}
```

**6. Wire the Edit button (line 852)**

Add the `onClick` handler to the Edit button:
```tsx
<Button
  size="sm"
  variant="outline"
  className="h-8 text-xs shrink-0"
  onClick={() => handleEditPublication(pub)}
>
  <Edit className="h-3 w-3 mr-1" />
  Edit
</Button>
```

**7. Update "Upload New Publication" button behavior**

When clicking "Upload New Publication" (line 607), ensure editing state is cleared:
```tsx
onClick={() => { setEditingPubId(null); setShowUploadForm(true); }}
```

---

### Summary

| Change | Location | Purpose |
|--------|----------|---------|
| Add `editingPubId` state | After line 68 | Track which publication is being edited |
| Add `handleEditPublication` | After line 274 | Pre-fill form fields from publication data |
| Update `handleUploadPublication` | Lines 206-231 | Support update toast alongside create toast, reset editing state |
| Update form header/button | Lines 617, 781 | Show "Edit Publication" / "Save Changes" when editing |
| Update form close | Line 620 | Reset editing state on close |
| Wire Edit button `onClick` | Line 852 | Call `handleEditPublication(pub)` |
| Clear editing on new upload | Line 607 | Reset `editingPubId` when creating new |

All changes are in a single file. The form scrolls to the top on mobile when opened for editing, giving users a clear view of the pre-filled fields. The existing mobile optimizations (touch-action, text-base inputs, stopPropagation) remain intact.
