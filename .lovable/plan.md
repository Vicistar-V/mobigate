
## Fix Mobile Input Errors in All Election Voters List Views

### Problem

When typing into text fields (search inputs, textareas) inside election-related drawers and sheets on mobile, the input loses focus, characters get dropped, or the field flickers. This makes it impossible to type properly.

### Root Cause

The issue is caused by **inner component functions** defined inside parent components and rendered as JSX tags (e.g., `<Content />`). Because these functions are redefined on every render, React treats them as new component types on each keystroke. This causes the input to unmount and remount, destroying focus.

**Example of the problem pattern:**
```text
// BAD - causes focus loss on mobile
const Content = () => (
  <div>
    <Input value={searchQuery} onChange={...} />
  </div>
);

return <Content />;  // React sees a NEW component each render
```

**The fix:**
```text
// GOOD - preserves focus
const Content = () => (
  <div>
    <Input value={searchQuery} onChange={...} />
  </div>
);

return Content();  // React sees the same elements, no remount
```

Changing `<Content />` to `{Content()}` converts the JSX tag invocation (which React treats as a component boundary) into a plain function call (which React treats as inline elements in the parent tree).

---

### Files to Fix (10 files)

| # | File | Inner Components | Lines to Change |
|---|------|-----------------|-----------------|
| 1 | `CandidateVotersListSheet.tsx` | `Content` | Lines 368, 392: `<Content />` to `{Content()}` |
| 2 | `NominateCandidateDrawer.tsx` | `DrawerBodyContent`, `FooterContent` | Lines 512, 513, 549, 551 |
| 3 | `FeeDistributionConfigDialog.tsx` | `Content` | Lines 231, 248 |
| 4 | `CertificateOfReturnGenerator.tsx` | `Content` | Lines 291, 326 |
| 5 | `CampaignRoyaltyDetailSheet.tsx` | `Content` | Lines 179, 196 |
| 6 | `CampaignFeeDetailSheet.tsx` | `Content` | Lines 264, 281 |
| 7 | `AdminPrimaryManagementSheet.tsx` | `MainContent` (combines `Content` + `CandidateDetailContent`) | Lines 534, 551 |
| 8 | `AdminNominationsSection.tsx` | `DetailContent` | Lines 453, 465 |
| 9 | `AdminImpeachmentTab.tsx` | `DetailsSheetContent` | Lines 1056, 1062 |
| 10 | `CertificateOfReturnPreview.tsx` | `CertificateDocument`, `ActionButtons` | Lines 388-389, 406-407 |

---

### Technical Details

For each file, every `<InnerComponent />` usage is changed to `{InnerComponent()}`:

**1. CandidateVotersListSheet.tsx**
- Line 368: `<Content />` becomes `{Content()}`
- Line 392: `<Content />` becomes `{Content()}`

**2. NominateCandidateDrawer.tsx**
- Line 512: `<DrawerBodyContent />` becomes `{DrawerBodyContent()}`
- Line 513: `<FooterContent />` becomes `{FooterContent()}`
- Line 549: `<DrawerBodyContent />` becomes `{DrawerBodyContent()}`
- Line 551: `<FooterContent />` becomes `{FooterContent()}`

**3. FeeDistributionConfigDialog.tsx**
- Line 231: `<Content />` becomes `{Content()}`
- Line 248: `<Content />` becomes `{Content()}`

**4. CertificateOfReturnGenerator.tsx**
- Line 291: `<Content />` becomes `{Content()}`
- Line 326: `<Content />` becomes `{Content()}`

**5. CampaignRoyaltyDetailSheet.tsx**
- Line 179: `<Content />` becomes `{Content()}`
- Line 196: `<Content />` becomes `{Content()}`

**6. CampaignFeeDetailSheet.tsx**
- Line 264: `<Content />` becomes `{Content()}`
- Line 281: `<Content />` becomes `{Content()}`

**7. AdminPrimaryManagementSheet.tsx**
- Line 534: `<MainContent />` becomes `{MainContent()}`
- Line 551: `<MainContent />` becomes `{MainContent()}`

**8. AdminNominationsSection.tsx**
- Line 453: `<DetailContent />` becomes `{DetailContent()}`
- Line 465: `<DetailContent />` becomes `{DetailContent()}`

**9. AdminImpeachmentTab.tsx**
- Line 1056: `<DetailsSheetContent />` becomes `{DetailsSheetContent()}`
- Line 1062: `<DetailsSheetContent />` becomes `{DetailsSheetContent()}`

**10. CertificateOfReturnPreview.tsx**
- Lines 388-389: `<CertificateDocument />` and `<ActionButtons />` become `{CertificateDocument()}` and `{ActionButtons()}`
- Lines 406-407: Same changes

---

### What This Fixes

- Search inputs in Voters List sheets will hold focus while typing
- Textarea inputs in Impeachment reason forms will work properly
- All text fields inside election drawers/sheets will accept input without flickering or losing characters
- Mobile keyboard stays open and responsive during typing

### Why This Works

When React encounters `<Content />`, it creates a component boundary. If `Content` is a new function reference (which it is on every re-render since it's defined inside the parent), React unmounts the old component tree and mounts a new one -- destroying any focused input.

When React encounters `{Content()}`, it receives the JSX elements directly as part of the parent's render tree. No component boundary means no unmount/remount cycle, so input focus is preserved.
