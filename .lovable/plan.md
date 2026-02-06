

## Fix Inactive Publication Download Buttons - Mobile First

### Problem

The "Download" and "Get" buttons on the Publications tab in Community Resources only show a toast notification saying "Downloading Publication" but don't actually do anything meaningful. They need to open the `DownloadFormatSheet` drawer so users can pick a format (PDF, JPEG, PNG, etc.) and trigger a proper download flow -- just like ID Cards and Letters already do.

### Solution

Integrate the existing `DownloadFormatSheet` component into the Publications tab. When a user taps "Download" or "Get", the parent dialog closes (to avoid z-index conflicts on mobile), the format picker opens, and after downloading, the parent dialog re-opens.

### File: `src/components/community/CommunityResourcesDialog.tsx`

**Change 1: Import DownloadFormatSheet**

Add the import for the existing download format picker component:
```tsx
import { DownloadFormatSheet, DownloadFormat } from "@/components/common/DownloadFormatSheet";
```

**Change 2: Add state variables for publication download flow**

After the existing state declarations (around line 30), add:
```tsx
const [showPubDownload, setShowPubDownload] = useState(false);
const [selectedPubForDownload, setSelectedPubForDownload] = useState<{ title: string; fileSize: string } | null>(null);
const [isDownloading, setIsDownloading] = useState(false);
```

**Change 3: Replace `handleDownloadPublication` with proper flow**

Replace the current toast-only handler (lines 89-94) with a handler that closes the parent dialog and opens the format sheet:

```tsx
const handleDownloadPublication = (pub: { title: string; fileSize: string }) => {
  setSelectedPubForDownload(pub);
  onOpenChange(false);
  setTimeout(() => setShowPubDownload(true), 150);
};

const handlePubDownloadConfirm = (format: DownloadFormat) => {
  setIsDownloading(true);
  setTimeout(() => {
    setIsDownloading(false);
    setShowPubDownload(false);
    toast({
      title: "Download Complete",
      description: `${selectedPubForDownload?.title} downloaded as ${format.toUpperCase()}`,
    });
    setTimeout(() => onOpenChange(true), 150);
  }, 1500);
};

const handleClosePubDownload = (open: boolean) => {
  setShowPubDownload(open);
  if (!open) {
    setTimeout(() => onOpenChange(true), 150);
  }
};
```

**Change 4: Update Featured Publication "Download" buttons (line 390)**

Update the onClick to pass the full publication object instead of just the title:
```tsx
<Button
  onClick={() => handleDownloadPublication({ title: pub.title, fileSize: pub.fileSize })}
  size="sm"
  className="shrink-0"
>
  <Download className="h-3 w-3 mr-1" />
  Download
</Button>
```

**Change 5: Update All Publications "Get" buttons (line 422-429)**

Same pattern for the non-featured publications:
```tsx
<Button
  onClick={() => handleDownloadPublication({ title: pub.title, fileSize: pub.fileSize })}
  size="sm"
  variant="ghost"
>
  <Download className="h-3 w-3 mr-1" />
  Get
</Button>
```

**Change 6: Render `DownloadFormatSheet` at the bottom of the component (before the closing Fragment tag, after the OfficialLetterDisplay)**

```tsx
{selectedPubForDownload && (
  <DownloadFormatSheet
    open={showPubDownload}
    onOpenChange={handleClosePubDownload}
    onDownload={handlePubDownloadConfirm}
    title="Download Publication"
    documentName={selectedPubForDownload.title}
    availableFormats={["pdf", "jpeg", "png"]}
    isDownloading={isDownloading}
  />
)}
```

---

### How It Works on Mobile

1. User taps "Download" or "Get" on any publication card
2. The parent Community Resources dialog closes smoothly (150ms)
3. The `DownloadFormatSheet` drawer slides up from the bottom, showing the publication name and format options (PDF recommended, plus JPEG, PNG)
4. User selects a format and taps "Download as .PDF"
5. A 1.5s spinner animation plays, then a success toast appears
6. The format sheet closes and the Community Resources dialog re-opens automatically

This follows the exact same pattern already used for ID Card and Letter downloads, ensuring consistency across the entire Resources feature.

### Summary

| Change | Purpose |
|--------|---------|
| Import `DownloadFormatSheet` | Reuse existing multi-format download component |
| Add download state variables | Track selected publication and downloading status |
| Replace toast-only handler | Open format picker instead of just showing toast |
| Add download confirm handler | Simulate download with loading state and success toast |
| Add close handler with re-open | Close parent dialog before opening drawer to fix z-index on mobile |
| Update both Download and Get button onClick | Pass publication data to the new handler |
| Render DownloadFormatSheet | Add the drawer component outside the Dialog |

### Single File Modified
`src/components/community/CommunityResourcesDialog.tsx`

