
# Constitution Management: Active Download + Upload/Manage UI + Multi-Signature Authorization

## What's Being Fixed

1. **Download button is inactive** -- it only shows a toast message, no actual download happens
2. **No upload/management interface** -- no way to upload, modify, delete, or deactivate constitution documents
3. **Multi-signature authorization missing for management actions** -- uploads, modifications, deletions, and deactivations should require PG/Chairman + Secretary + Legal Adviser approval (with deputy substitution rules)

## Architecture Overview

The Constitution currently opens as a read-only viewer (`ConstitutionViewer.tsx`) from two places:
- Community Resources dialog (member view) -- should get working download
- Admin Settings section -- after authorization, should open a **management interface** instead of just the viewer

The plan creates a new `AdminConstitutionManagementSheet` component for admin-side management, while enhancing the existing `ConstitutionViewer` with a working download via the `DownloadFormatSheet`.

---

## Files to Create

| File | Purpose |
|------|---------|
| `src/components/admin/settings/AdminConstitutionManagementSheet.tsx` | Full constitution management UI (upload, modify, delete, deactivate) with multi-sig authorization |

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/community/ConstitutionViewer.tsx` | Wire download button to `DownloadFormatSheet` instead of toast |
| `src/components/admin/authorization/authorizationActionConfigs.tsx` | Add new constitution-specific action configs (upload, delete, deactivate) |
| `src/components/admin/AdminSettingsSection.tsx` | Open management sheet instead of just viewer after authorization |
| `src/pages/CommunityAdminDashboard.tsx` | Add state and rendering for new management sheet |

---

## Detailed Changes

### 1. ConstitutionViewer.tsx -- Active Download Button

Replace the toast-only `handleDownload` function with a flow that opens the existing `DownloadFormatSheet` component (same pattern used by publications and other documents).

**Changes:**
- Import `DownloadFormatSheet` and `DownloadFormat`
- Add state: `showDownloadSheet`, `isDownloading`
- Download button click opens the `DownloadFormatSheet` drawer
- On format selection, simulate download with a loading state and success toast
- Available formats: PDF, DOCX, TXT
- Render the `DownloadFormatSheet` component at the bottom of the return

### 2. New: AdminConstitutionManagementSheet.tsx

A full-screen mobile bottom sheet for managing constitution documents. This is the admin-only interface.

**Layout (mobile-first, bottom sheet):**

```text
[Header: Constitution Management]

[Stats Row]
  Active: 1  |  Archived: 2  |  Total: 3

[Upload New Document] -- primary button, triggers multi-sig auth

[Active Document Card]
  - Title, version, effective date, file size
  - Status badge (Active / Hidden / Archived)
  - Actions: View, Download, Modify, Deactivate, Delete
  - Each destructive action triggers multi-sig authorization

[Document History List]
  - Previous versions with dates and status
  - Download option for each

[Authorization Info Footer]
  "Constitution changes require President + Secretary + Legal Adviser"
```

**Authorization integration:**
- Uses `ModuleAuthorizationDrawer` with module="settings"
- Four action types that trigger authorization:
  - `upload_constitution` -- uploading a new document
  - `update_constitution` -- modifying the active document (already exists)
  - `delete_constitution` -- removing a document
  - `deactivate_constitution` -- hiding/deactivating a document
- Each action shows the appropriate authorization drawer before proceeding
- On authorization complete, shows success toast

**Mock data includes:**
- Active document: "Community Constitution v2.1" (2.4 MB PDF, effective Jul 1, 2024)
- Archived documents: v2.0 and v1.0 with historical dates

**Upload UI (within the sheet):**
- File input styled as a dashed-border drop zone
- Accepts PDF, DOCX formats
- Shows selected file name, size
- Version number input
- Effective date input
- Notes/changelog textarea
- Submit triggers multi-sig authorization

**Mobile optimization:**
- All touch targets minimum 44px
- `touch-manipulation` on all interactive elements
- `active:bg-muted/70` feedback on buttons
- Vertical stacking for all content
- `px-2` outer padding to maximize content width
- Text sizes: `text-xs` minimum (no `text-[10px]`)

### 3. authorizationActionConfigs.tsx -- New Constitution Actions

Add three new action configs under the `settings` module:

```typescript
upload_constitution: {
  title: "Upload Constitution",
  description: "Multi-signature authorization to upload new constitution document",
  icon: <FileText className="h-5 w-5 text-green-600" />,
  iconComponent: FileText,
  iconColorClass: "text-green-600",
},
delete_constitution: {
  title: "Delete Constitution",
  description: "Multi-signature authorization to delete constitution document",
  icon: <FileText className="h-5 w-5 text-red-600" />,
  iconComponent: FileText,
  iconColorClass: "text-red-600",
},
deactivate_constitution: {
  title: "Deactivate Constitution",
  description: "Multi-signature authorization to deactivate constitution document",
  icon: <FileText className="h-5 w-5 text-amber-600" />,
  iconComponent: FileText,
  iconColorClass: "text-amber-600",
},
```

Also update the `SettingsActionType` in `AdminSettingsSection.tsx` to include the new action types.

### 4. AdminSettingsSection.tsx -- Open Management Sheet

Currently, after authorization, the "Constitution" button calls `onManageConstitution()` which opens the read-only `ConstitutionViewer`. 

**Change:**
- Add a new prop `onManageConstitutionAdmin` that opens the management sheet
- After authorization completes for `update_constitution`, call `onManageConstitutionAdmin` instead of `onManageConstitution`
- Keep the authorization gating on the button click (existing behavior)

### 5. CommunityAdminDashboard.tsx -- Wire Up Management Sheet

**Changes:**
- Import `AdminConstitutionManagementSheet`
- Add state: `showConstitutionManagement`
- Pass `onManageConstitutionAdmin={() => setShowConstitutionManagement(true)}` to `AdminSettingsSection`
- Render `AdminConstitutionManagementSheet` alongside other sheets

---

## Technical Notes

### Authorization Rules (already configured)

The `settings` module authorization in `adminAuthorization.ts` already requires:
- **3 signatories**: President + Secretary + Legal Adviser
- **Deputy substitution**: Vice President can substitute for President, Assistant Secretary for Secretary
- **If deputy acts**: 4-signatory quorum forced, Legal Adviser must be included

This existing configuration automatically covers all constitution management actions since they all use `module="settings"`.

### No Backend Needed

Per project custom knowledge, this is a UI template. All data is mock/static. The upload UI will simulate file selection and show the file info, but won't actually upload to any storage. The management actions show authorization flows and success toasts.

### Mobile Focus

- Sheet uses `side="bottom"` with `h-[92vh]` and `rounded-t-2xl` (same pattern as all other admin sheets)
- All buttons use `touch-manipulation` class
- All interactive items have `active:bg-muted/70` or `active:scale-[0.98]` feedback
- No horizontal layouts that could overflow on 360px screens
- Vertical stacking for document cards and action buttons
