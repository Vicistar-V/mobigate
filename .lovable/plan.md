
## Fix Community Resources Dialog - Mobile Layout and Functionality

### Issues Identified from Screenshots

1. **ID Card not fitting properly, cutting on edges** -- The inline ID card preview uses a 3-column horizontal layout (Avatar + Name + QR Code) that overflows on narrow mobile screens. The avatar (h-20 w-20 = 80px), name section, and QR code block (h-12 w-12 with padding) compete for horizontal space, causing content to cut off.

2. **Download button inactive on Letters tab** -- The screenshot shows the Download button on the "Membership Confirmation Letter" (approved, with letterNumber "CMT/LTR/2024/001") appears inactive. The code has the `onClick` handler wired, but the button only renders when `request.letterNumber` exists. The issue is likely that the Dialog container is intercepting taps or the button needs explicit z-index/pointer events. Looking more carefully, the code appears correct -- the onClick IS wired. The user may be tapping and nothing happens because the `OfficialLetterDisplay` component opens as a Drawer which may conflict with the parent Dialog's z-index.

3. **Missing "Renew ID Card" button** -- The user explicitly annotated "Add button: Renew ID Card" in their screenshot.

---

### Changes to: `src/components/community/CommunityResourcesDialog.tsx`

**Fix 1: Restack ID card layout for mobile**

Replace the current 3-column horizontal layout (Avatar + Name/ID + QR Code) with a mobile-friendly vertically stacked layout:
- Community name banner at top (already present, keep as-is)
- Center the member photo (reduce from h-20 to h-16)
- Name and Member ID below the photo, centered
- Status badge below name
- QR code smaller and inline with card number row
- Grid of card details (Card Number, Issue Date, Expiry Date, Status) stays as 2x2 grid but with reduced gap

This prevents any horizontal overflow on narrow screens.

**Fix 2: Add "Renew ID Card" button**

Add a third button row below the existing "Request New Card" / "Download Digital" buttons:
```tsx
<Button 
  onClick={handleRenewCard} 
  className="w-full" 
  variant="default"
>
  <CreditCard className="h-4 w-4 mr-2" />
  Renew ID Card
</Button>
```
Add a `handleRenewCard` handler that shows a toast: "Renewal Request Submitted".

**Fix 3: Fix Letter Download button z-index/interaction**

The `OfficialLetterDisplay` and `DigitalIDCardDisplay` components use Drawer (on mobile) which may conflict with the parent Dialog's stacking context. Fix by:
- Ensuring the parent Dialog closes or the overlays have proper z-indexing
- Adding `className="relative z-50"` or ensuring Drawer portals correctly above the Dialog

After investigation, the actual fix is simpler: the download button IS wired correctly in the code. The issue is that the `OfficialLetterDisplay` Drawer opens *behind* the parent Dialog. We need to either:
  - Close the parent dialog before opening the letter/ID preview, OR  
  - Ensure the Drawer renders with higher z-index

The cleanest approach: temporarily hide the parent dialog when showing the ID card or letter preview, then restore it when the preview closes.

---

### Detailed Implementation

**1. Add `handleRenewCard` handler (after `handleRequestCard`)**

```tsx
const handleRenewCard = () => {
  toast({
    title: "Renewal Request Submitted",
    description: "Your ID card renewal will be processed within 5 business days",
  });
};
```

**2. Restack ID card preview layout for mobile (lines 125-174)**

Replace the current member details section with a centered vertical stack:

```tsx
<div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-2 border-primary/20 rounded-xl overflow-hidden">
  {/* Community Name Header - unchanged */}
  <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3">
    <div className="flex items-center gap-2">
      <Shield className="h-4 w-4" />
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider">Ndigbo Progressive Union</h4>
        <p className="text-[9px] opacity-80">Official Community ID Card</p>
      </div>
    </div>
  </div>

  {/* Member Details - Vertically Stacked for Mobile */}
  <div className="p-4 space-y-3">
    {/* Photo + Name centered */}
    <div className="flex flex-col items-center text-center gap-2">
      <Avatar className="h-16 w-16 border-2 border-primary/20">
        <AvatarImage src={mockIDCard.memberPhoto} alt={mockIDCard.memberName} />
        <AvatarFallback>{mockIDCard.memberName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
      </Avatar>
      <div>
        <h3 className="font-bold text-base">{mockIDCard.memberName}</h3>
        <p className="text-sm text-muted-foreground">{mockIDCard.memberId}</p>
        <Badge className="mt-1" variant={mockIDCard.status === "active" ? "default" : "secondary"}>
          {mockIDCard.status}
        </Badge>
      </div>
    </div>

    {/* Card Details Grid */}
    <div className="grid grid-cols-2 gap-2 text-xs">
      <div className="bg-muted/50 rounded-lg p-2.5">
        <p className="text-muted-foreground text-[10px]">Card Number</p>
        <p className="font-medium">{mockIDCard.cardNumber}</p>
      </div>
      <div className="bg-muted/50 rounded-lg p-2.5">
        <p className="text-muted-foreground text-[10px]">Issue Date</p>
        <p className="font-medium">{mockIDCard.issueDate.toLocaleDateString()}</p>
      </div>
      <div className="bg-muted/50 rounded-lg p-2.5">
        <p className="text-muted-foreground text-[10px]">Expiry Date</p>
        <p className="font-medium">{mockIDCard.expiryDate.toLocaleDateString()}</p>
      </div>
      <div className="bg-muted/50 rounded-lg p-2.5 flex items-center gap-1.5">
        <QrCode className="h-4 w-4 text-primary shrink-0" />
        <div>
          <p className="text-muted-foreground text-[10px]">Verified</p>
          <p className="font-medium capitalize">{mockIDCard.status}</p>
        </div>
      </div>
    </div>
  </div>
</div>
```

**3. Add "Renew ID Card" button below the existing 2 buttons (after line 190)**

Change the button layout from a 2-column grid to a vertical stack with 3 buttons:

```tsx
<div className="space-y-2">
  <div className="grid grid-cols-2 gap-2">
    <Button onClick={handleRequestCard} variant="outline" size="sm">
      <CreditCard className="h-4 w-4 mr-2" />
      Request New
    </Button>
    <Button variant="outline" size="sm" onClick={() => setShowIDCardPreview(true)}>
      <Download className="h-4 w-4 mr-2" />
      Download Digital
    </Button>
  </div>
  <Button onClick={handleRenewCard} variant="default" className="w-full" size="sm">
    <CreditCard className="h-4 w-4 mr-2" />
    Renew ID Card
  </Button>
</div>
```

**4. Fix overlay stacking for ID Card and Letter previews**

When opening the ID card or letter preview, temporarily close the parent dialog to avoid z-index conflicts. Update the button handlers and preview close callbacks:

- ID Card: `onClick` sets `showIDCardPreview(true)` and `onOpenChange(false)` on the parent dialog
- Letter Download: same pattern -- close parent dialog, open letter preview
- When either preview closes, reopen the parent dialog

This requires a small state coordination:
```tsx
const [parentDialogOpen, setParentDialogOpen] = useState(true);
```

But since the parent dialog's `open` prop comes from the parent component, a simpler approach is to use CSS z-index. Add `style={{ zIndex: 60 }}` to the DigitalIDCardDisplay and OfficialLetterDisplay Drawer/Dialog wrappers. However, since we can't modify those components' internal z-index easily, the cleanest fix is to keep the parent Dialog open but ensure the child Drawers portal above it by wrapping them outside the Dialog in the JSX (which is already done in the current code -- they render as siblings in a fragment).

The real issue may be that the Drawer's backdrop isn't blocking the Dialog. This is already handled correctly since both render outside the Dialog. I'll verify by checking if the component actually works -- and if not, add explicit portal behavior.

---

### Summary

| Change | Purpose |
|--------|---------|
| Vertically stack ID card member info | Prevent horizontal overflow and edge cutting on mobile |
| Center photo and name | Clean mobile-first card layout |
| Replace plain grid cells with styled rounded boxes | Better visual hierarchy for card details |
| Add "Renew ID Card" button | User-requested feature |
| Add `handleRenewCard` handler | Toast confirmation for renewal |
| Ensure preview overlays render above parent dialog | Fix Download button appearing inactive |

### Single File Modified
`src/components/community/CommunityResourcesDialog.tsx`
