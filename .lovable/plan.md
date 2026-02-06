
## Add "Verify Certificate" Button

### Overview
Implement a certificate verification feature allowing anyone to verify a Certificate of Return by entering its verification code. This will be accessible from both the Admin area (Certificate Generator) and public dashboards (Elections/Voting section).

---

## Implementation Details

### 1. Create New Component: `VerifyCertificateDrawer.tsx`

**Location:** `src/components/community/elections/VerifyCertificateDrawer.tsx`

A mobile-first bottom drawer that allows users to verify certificates by entering a verification code.

**Key Features:**
- Input field for 8-character verification code
- "Verify Now" button to trigger verification
- Loading state during verification
- Success state showing certificate summary
- Error state for invalid codes
- Button to view full certificate on success
- Touch-optimized inputs with mobile focus protection

**UI Layout:**
```text
+---------------------------------------+
| [ShieldCheck] Verify Certificate   X  |
+---------------------------------------+
|                                       |
| [Award Icon]                          |
| Certificate Verification              |
| Enter the verification code from a    |
| Certificate of Return to verify its   |
| authenticity.                         |
|                                       |
+---------------------------------------+
| Verification Code *                   |
| [  Y5LE6SLJ  ]                       |
| Enter the 8-character code            |
+---------------------------------------+
|                                       |
| [     Verify Now      ]               |
|                                       |
+---------------------------------------+
```

**Success State:**
```text
+---------------------------------------+
| [CheckCircle] Certificate Verified!   |
+---------------------------------------+
| +-----------------------------------+ |
| | Winner: Daniel Obiora Chibueze    | |
| | Office: Secretary                 | |
| | Community: Ndigbo Progressive...  | |
| | Tenure: 2026 - 2030               | |
| | Issued: February 4, 2026          | |
| +-----------------------------------+ |
|                                       |
| [View Full Certificate]               |
| [Verify Another Certificate]          |
+---------------------------------------+
```

**Error State:**
```text
+---------------------------------------+
| [XCircle] Verification Failed         |
|                                       |
| The verification code you entered     |
| could not be found. Please check      |
| the code and try again.               |
|                                       |
| [Try Again]                           |
+---------------------------------------+
```

---

### 2. Admin Area Integration

**File:** `src/components/admin/election/CertificateOfReturnGenerator.tsx`

Add "Verify Certificate" button below the "Issued Certificates" section.

**Changes:**
- Import the new `VerifyCertificateDrawer` component
- Add state: `const [showVerifyDrawer, setShowVerifyDrawer] = useState(false);`
- Add button after line 261 (after the "Issued Certificates" description):

```tsx
{/* Verify Certificate Section */}
<Button
  variant="outline"
  className="w-full gap-2"
  onClick={() => setShowVerifyDrawer(true)}
>
  <ShieldCheck className="h-4 w-4" />
  Verify Certificate
</Button>
```

- Render the drawer at the end of the component:
```tsx
<VerifyCertificateDrawer
  open={showVerifyDrawer}
  onOpenChange={setShowVerifyDrawer}
/>
```

---

### 3. Public Dashboard Integration (Community Menu)

**File:** `src/components/community/CommunityMainMenu.tsx`

Add "Verify Certificate" button to the Election/Voting accordion section (around line 715, after "Accredited Voters").

**Changes:**
- Import `VerifyCertificateDrawer` and `ShieldCheck` icon
- Add state: `const [showVerifyCertificate, setShowVerifyCertificate] = useState(false);`
- Add button in Elections accordion:

```tsx
<Button
  variant="ghost"
  className="w-full justify-start pl-4 h-9 transition-colors duration-200"
  onClick={() => {
    setShowVerifyCertificate(true);
    setOpen(false);
  }}
>
  <ShieldCheck className="h-4 w-4 mr-2" />
  Verify Certificate
</Button>
```

- Render the drawer component

---

### 4. Election Winners Tab Integration

**File:** `src/components/community/elections/ElectionWinnersTab.tsx`

Add a "Verify Certificate" button in the header section for easy public access.

**Changes:**
- Import `VerifyCertificateDrawer` and `ShieldCheck` icon
- Add state: `const [showVerifyDrawer, setShowVerifyDrawer] = useState(false);`
- Add button in the header (line 119, after the title):

```tsx
<div className="flex items-center justify-between">
  <div className="flex items-center gap-2">
    <Menu className="w-5 h-5" />
    <h1 className="text-2xl font-bold">Election Winners</h1>
  </div>
  <Button
    variant="outline"
    size="sm"
    className="gap-1.5"
    onClick={() => setShowVerifyDrawer(true)}
  >
    <ShieldCheck className="h-4 w-4" />
    <span className="hidden sm:inline">Verify</span>
  </Button>
</div>
```

---

## Component Structure: VerifyCertificateDrawer.tsx

```typescript
interface VerifyCertificateDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// States
const [verificationCode, setVerificationCode] = useState("");
const [isVerifying, setIsVerifying] = useState(false);
const [verificationResult, setVerificationResult] = useState<{
  status: 'idle' | 'success' | 'error';
  certificate?: CertificateOfReturn;
  message?: string;
}>({ status: 'idle' });
const [showFullCertificate, setShowFullCertificate] = useState(false);

// Verification logic (mock for UI template)
const handleVerify = async () => {
  if (!verificationCode.trim()) return;
  
  setIsVerifying(true);
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
  
  // Mock verification - matches against mockCertificate
  if (verificationCode.toUpperCase() === mockCertificate.verificationCode) {
    setVerificationResult({
      status: 'success',
      certificate: mockCertificate
    });
  } else {
    setVerificationResult({
      status: 'error',
      message: 'Certificate not found. Please check the code and try again.'
    });
  }
  
  setIsVerifying(false);
};
```

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/components/community/elections/VerifyCertificateDrawer.tsx` | **CREATE** - New verification drawer component |
| `src/components/admin/election/CertificateOfReturnGenerator.tsx` | **MODIFY** - Add Verify Certificate button |
| `src/components/community/CommunityMainMenu.tsx` | **MODIFY** - Add Verify Certificate to Elections menu |
| `src/components/community/elections/ElectionWinnersTab.tsx` | **MODIFY** - Add Verify button in header |

---

## Mobile Optimizations

All implementations follow established mobile patterns:
- Drawer uses 92vh max height with rounded top corners
- Touch-optimized input with `touch-manipulation` class
- `autoComplete="off"`, `autoCorrect="off"`, `spellCheck={false}` on input
- `onClick={(e) => e.stopPropagation()}` to prevent scroll issues
- Minimum 44px touch targets for all buttons
- Clear visual feedback with loading states and result indicators

---

## Expected Outcome

1. **Admin Area (Certificate Generator):**
   - "Verify Certificate" button appears below "Issued Certificates" section
   - Opens mobile-first verification drawer

2. **Public Dashboard (Community Menu > Election/Voting):**
   - "Verify Certificate" option in Elections accordion
   - Accessible to all community members and visitors
   - Enables banks and third parties to verify leadership credentials

3. **Election Winners Tab:**
   - Quick "Verify" button in the header
   - Most visible public entry point for verification

4. **Verification Flow:**
   - User enters 8-character verification code
   - System validates and returns certificate details
   - On success, shows summary with option to view full certificate
   - On error, shows clear message with retry option
