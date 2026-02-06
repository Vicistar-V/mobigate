
## Fix Community ID Card: Add Community Name and Activate Download Button

### Problems Identified

1. **Missing Community Name**: The inline ID card preview in the member's "Community Resources" dialog shows member details but lacks the community name header. The `DigitalIDCardDisplay` component already shows it with a blue gradient banner, but the inline preview card doesn't.

2. **Inactive "Download Digital" button**: The button on line 162 has no `onClick` handler -- tapping it does nothing. It should open the `DigitalIDCardDisplay` component which provides the full high-fidelity card view with multi-format download.

3. **Inactive Letter "Download" button**: The letter history download button (line 258) also has no `onClick` handler.

---

### File: `src/components/community/CommunityResourcesDialog.tsx`

**Change 1: Add imports for DigitalIDCardDisplay and OfficialLetterDisplay**

Add imports at the top:
```tsx
import { DigitalIDCardDisplay, IDCardData } from "@/components/community/resources/DigitalIDCardDisplay";
import { OfficialLetterDisplay, LetterData } from "@/components/community/resources/OfficialLetterDisplay";
import { Shield } from "lucide-react";
```

**Change 2: Add state for ID card and letter preview dialogs**

After the existing state declarations (around line 25), add:
```tsx
const [showIDCardPreview, setShowIDCardPreview] = useState(false);
const [showLetterPreview, setShowLetterPreview] = useState(false);
const [selectedLetterData, setSelectedLetterData] = useState<LetterData | null>(null);
```

**Change 3: Add Community Name header to inline ID card preview (line 119)**

Before the member photo/name section, add a professional branded header inside the card area showing "Ndigbo Progressive Union" with a shield icon. This matches the branding used in the `DigitalIDCardDisplay`:

```tsx
<div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-2 border-primary/20 rounded-xl overflow-hidden">
  {/* Community Name Header */}
  <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3">
    <div className="flex items-center gap-2">
      <Shield className="h-4 w-4" />
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider">Ndigbo Progressive Union</h4>
        <p className="text-[9px] opacity-80">Official Community ID Card</p>
      </div>
    </div>
  </div>
  {/* ...existing member details with p-4 padding... */}
</div>
```

**Change 4: Wire "Download Digital" button (line 162)**

Add an `onClick` handler to open the `DigitalIDCardDisplay`:

```tsx
<Button 
  variant="outline" 
  size="sm"
  onClick={() => setShowIDCardPreview(true)}
>
  <Download className="h-4 w-4 mr-2" />
  Download Digital
</Button>
```

**Change 5: Add the DigitalIDCardDisplay component at the bottom of the return**

Render the component with card data mapped from `mockIDCard`:

```tsx
<DigitalIDCardDisplay
  open={showIDCardPreview}
  onOpenChange={setShowIDCardPreview}
  cardData={{
    memberName: mockIDCard.memberName,
    memberId: mockIDCard.memberId,
    memberPhoto: mockIDCard.memberPhoto,
    cardNumber: mockIDCard.cardNumber,
    issueDate: mockIDCard.issueDate,
    expiryDate: mockIDCard.expiryDate,
    communityName: "Ndigbo Progressive Union",
    verificationCode: mockIDCard.qrCode,
  }}
/>
```

**Change 6: Wire letter "Download" button (line 258)**

Add an `onClick` handler that constructs `LetterData` from the request and opens the letter preview:

```tsx
<Button 
  size="sm" 
  variant="outline"
  onClick={() => {
    setSelectedLetterData({
      templateTitle: template?.title || "",
      letterNumber: request.letterNumber!,
      requestedBy: request.requestedBy,
      purpose: request.purpose,
      issuedDate: request.approvalDate || request.requestDate,
      communityName: "Ndigbo Progressive Union",
      signedBy: request.approvedBy || "Community Secretary",
      verificationCode: `VER-${request.letterNumber?.replace(/\//g, "-")}`,
    });
    setShowLetterPreview(true);
  }}
>
  <Download className="h-3 w-3 mr-1" />
  Download
</Button>
```

**Change 7: Add the OfficialLetterDisplay component at the bottom of the return**

```tsx
{selectedLetterData && (
  <OfficialLetterDisplay
    open={showLetterPreview}
    onOpenChange={setShowLetterPreview}
    letterData={selectedLetterData}
  />
)}
```

---

### Summary

| Change | Purpose |
|--------|---------|
| Add community name banner to inline ID card | Shows "Ndigbo Progressive Union" with Shield icon in a blue gradient header, matching the official card design |
| Wire "Download Digital" button | Opens `DigitalIDCardDisplay` drawer (mobile) with full card preview and multi-format download (PDF, JPEG, PNG) |
| Wire letter "Download" button | Opens `OfficialLetterDisplay` drawer with full letter preview and multi-format download |
| Add state variables | Track open/close state for both preview components |
| Add imports | `DigitalIDCardDisplay`, `OfficialLetterDisplay`, `Shield` icon |

### Single File Modified

`src/components/community/CommunityResourcesDialog.tsx`
