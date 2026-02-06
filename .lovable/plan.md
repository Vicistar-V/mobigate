

## Auto-Generate Letters, ID Cards, and Scrollable Publication Actions

### Overview

Three improvements to the Manage Resources dialog, all focused on mobile:

1. **Letters Tab** - "Issue Letter" button auto-generates a professional official letter document (like Certificate of Return) with download capability
2. **ID Cards Tab** - "Issue Card" button auto-generates a digital community ID card document with download capability
3. **Publications Tab** - Action buttons (Feature/Unfeature, Edit, Delete) become horizontally scrollable instead of wrapping

---

### 1. Create Official Letter Display Component

**New file: `src/components/community/resources/OfficialLetterDisplay.tsx`**

A professional letter document display, following the same pattern as `CertificateOfReturnDisplay.tsx`:

- Professional formal letter layout with community letterhead
- Blue-themed design with community name, logo area, and official styling
- Letter content auto-populated from the request data (template title, requester name, purpose, letter number)
- Verification code and QR code section for authenticity
- Issued date, signatory section
- Download button that opens `DownloadFormatSheet` (PDF, JPEG, PNG, TXT)
- Uses `html2canvas` + `jsPDF` for high-resolution export (already in project dependencies)
- Mobile: Drawer (92vh); Desktop: Dialog (85vh)

Letter content structure:
```text
[Community Letterhead]
[Date]
[Reference: CMT/LTR/2024/001]

TO WHOM IT MAY CONCERN

RE: MEMBERSHIP CONFIRMATION LETTER

This is to certify that [Member Name] is a registered and 
active member of [Community Name].

Purpose: [Stated purpose from request]

This letter is issued upon request for the purpose stated above.

[Verification Code]
[Signed by: Community Secretary]
```

### 2. Create Digital ID Card Display Component

**New file: `src/components/community/resources/DigitalIDCardDisplay.tsx`**

A professional digital ID card document, following the same pattern:

- Card-style layout with community branding (gradient background)
- Member photo, name, member ID, card number
- QR code section for verification
- Issue date and expiry date
- Status badge (Active)
- Verification code for authenticity
- Download button with `DownloadFormatSheet` (PDF, JPEG, PNG)
- Uses `html2canvas` + `jsPDF` for export
- Mobile: Drawer (92vh); Desktop: Dialog (85vh)

Card layout:
```text
[Community Name - Header with gradient]
[Member Photo]  [QR Code]
[Member Name]
[Member ID: MEM-2024-0234]
[Card Number: CMT-001-0234]
[Issue: 02/02/2026]  [Expiry: 02/02/2028]
[Status: Active]
[Verification Code]
```

### 3. Update ManageCommunityResourcesDialog

**File: `src/components/community/ManageCommunityResourcesDialog.tsx`**

Changes:

**A. ID Cards Tab - "Issue Card" button:**
- Add state for `showIDCardPreview` and `selectedIDCardRequest`
- When "Issue Card" is clicked: generate card data, show the `DigitalIDCardDisplay` component
- When "View Card" is clicked (for already-issued cards): also show the `DigitalIDCardDisplay`

**B. Letters Tab - "Issue Letter" button:**
- Add state for `showLetterPreview` and `selectedLetterRequest`
- When "Issue Letter" is clicked: generate letter data, show the `OfficialLetterDisplay` component
- When "Preview" is clicked (for already-issued letters): also show the `OfficialLetterDisplay`

**C. Publications Tab - Scrollable action buttons:**
- Wrap the action buttons row in a horizontally scrollable container
- Replace `flex flex-wrap gap-2` with `flex gap-2 overflow-x-auto` and `whitespace-nowrap` on buttons
- Add `shrink-0` on each button to prevent compression
- This allows swiping left-right to reveal all buttons on narrow screens

---

### Technical Details

**OfficialLetterDisplay.tsx structure:**
```text
Props:
  - open: boolean
  - onOpenChange: (open: boolean) => void
  - letterData: {
      templateTitle: string
      letterNumber: string
      requestedBy: string
      purpose: string
      issuedDate: Date
      communityName: string
      signedBy: string
      verificationCode: string
    }

Internal:
  - useRef for printable area (html2canvas capture)
  - DownloadFormatSheet integration
  - Mobile Drawer / Desktop Dialog pattern
```

**DigitalIDCardDisplay.tsx structure:**
```text
Props:
  - open: boolean
  - onOpenChange: (open: boolean) => void
  - cardData: {
      memberName: string
      memberId: string
      memberPhoto: string
      cardNumber: string
      issueDate: Date
      expiryDate: Date
      communityName: string
      verificationCode: string
      qrCode: string
    }

Internal:
  - useRef for printable area (html2canvas capture)
  - DownloadFormatSheet integration
  - Mobile Drawer / Desktop Dialog pattern
```

**Publications scrollable buttons change:**
```text
Current (line 642):
  <div className="flex flex-wrap gap-2 mt-3">

New:
  <div className="flex gap-2 mt-3 overflow-x-auto pb-1 -mb-1">
    + add shrink-0 to each Button
```

---

### Files to Create

| File | Purpose |
|------|---------|
| `src/components/community/resources/OfficialLetterDisplay.tsx` | Auto-generated official letter document with download |
| `src/components/community/resources/DigitalIDCardDisplay.tsx` | Auto-generated digital ID card document with download |

### Files to Modify

| File | Change |
|------|--------|
| `src/components/community/ManageCommunityResourcesDialog.tsx` | Wire up Issue Letter/Card buttons to open preview components; make publication buttons scrollable |

### Dependencies Used (already installed)

- `html2canvas` - For capturing document as image
- `jspdf` - For PDF generation
- `date-fns` - For date formatting
- `DownloadFormatSheet` - Existing reusable download format picker

