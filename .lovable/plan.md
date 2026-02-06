

## Fix Non-Active Upload Buttons in Publications Tab

### Problem

The "Cover Image" and "PDF File" upload areas in the Publications tab are purely visual -- they look clickable (`cursor-pointer`) but have no `onClick` handler and no hidden `<input type="file">` element behind them. Tapping them on mobile does nothing.

### Solution

Add proper file selection functionality using the standard React pattern: hidden `<input type="file">` elements triggered via `useRef`. When a file is selected, show visual feedback (file name, image preview) so the user knows it worked.

Since this is a UI template (no actual backend uploads), the files are stored in local state and a toast confirms the action.

---

### Changes in `src/components/community/ManageCommunityResourcesDialog.tsx`

**A. Add state variables and refs for file handling**

After the existing publication form state (around line 72), add:
```tsx
const coverInputRef = useRef<HTMLInputElement>(null);
const pdfInputRef = useRef<HTMLInputElement>(null);
const [coverImageFile, setCoverImageFile] = useState<{ name: string; preview: string } | null>(null);
const [pdfFile, setPdfFile] = useState<{ name: string } | null>(null);
```

Also add `useRef` to the React import at the top of the file.

**B. Add file selection handlers**

After the existing `handleUploadPublication` function (around line 217), add two handlers:

```tsx
const handleCoverImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    toast({ title: "Invalid File", description: "Please select an image file (JPG, PNG, etc.)", variant: "destructive" });
    return;
  }
  const preview = URL.createObjectURL(file);
  setCoverImageFile({ name: file.name, preview });
  toast({ title: "Cover Image Selected", description: file.name });
};

const handlePDFSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;
  if (file.type !== "application/pdf") {
    toast({ title: "Invalid File", description: "Please select a PDF file", variant: "destructive" });
    return;
  }
  setPdfFile({ name: file.name });
  toast({ title: "PDF File Selected", description: file.name });
};
```

**C. Update the form reset in `handleUploadPublication`**

Add clearing the file states when form resets:
```tsx
setCoverImageFile(null);
setPdfFile(null);
```

**D. Update the Cover Image upload area (lines 641-648)**

Replace the static div with a working upload zone:

```tsx
<div className="space-y-2">
  <Label>Cover Image</Label>
  <input
    ref={coverInputRef}
    type="file"
    accept="image/*"
    className="hidden"
    onChange={handleCoverImageSelect}
  />
  <div
    className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 active:bg-muted/70 transition-colors"
    onClick={() => coverInputRef.current?.click()}
  >
    {coverImageFile ? (
      <div className="space-y-2">
        <img
          src={coverImageFile.preview}
          alt="Cover preview"
          className="h-20 w-auto mx-auto rounded object-cover"
        />
        <p className="text-xs text-muted-foreground truncate">
          {coverImageFile.name}
        </p>
        <p className="text-xs text-primary font-medium">
          Tap to change
        </p>
      </div>
    ) : (
      <>
        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Click to upload cover image
        </p>
      </>
    )}
  </div>
</div>
```

**E. Update the PDF File upload area (lines 651-658)**

Replace the static div with a working upload zone:

```tsx
<div className="space-y-2">
  <Label>PDF File *</Label>
  <input
    ref={pdfInputRef}
    type="file"
    accept=".pdf,application/pdf"
    className="hidden"
    onChange={handlePDFSelect}
  />
  <div
    className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 active:bg-muted/70 transition-colors"
    onClick={() => pdfInputRef.current?.click()}
  >
    {pdfFile ? (
      <div className="space-y-1">
        <FileText className="h-8 w-8 mx-auto text-green-600" />
        <p className="text-xs text-foreground font-medium truncate">
          {pdfFile.name}
        </p>
        <p className="text-xs text-primary font-medium">
          Tap to change
        </p>
      </div>
    ) : (
      <>
        <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Click to upload PDF file
        </p>
      </>
    )}
  </div>
</div>
```

---

### Summary

| File | Change |
|------|--------|
| `ManageCommunityResourcesDialog.tsx` | Add `useRef` import, file state variables, hidden file inputs, click handlers, file validation, visual feedback (preview/filename), and form reset logic |

### What This Fixes

- Tapping "Cover Image" area opens the device file picker (images only)
- Tapping "PDF File" area opens the device file picker (PDF only)
- Selected files show visual feedback (image preview or filename with green icon)
- File type validation with error toasts for wrong types
- Both areas show "Tap to change" after selection for re-selection
- Mobile-optimized with `active:bg-muted/70` touch feedback
- Form reset clears selected files

