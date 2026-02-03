
# Fix Plan: Mobile Input Text Scrambling in Campaign Forms

## Problem
When typing "John Obi" in the Candidate Name field, the text displays as "Obi hn oJ" with flickering behavior. This is a mobile browser input issue.

## Root Cause
The campaign form input fields are missing mobile-specific optimizations that prevent browser interference with React state updates:
- Missing `touch-manipulation` class
- Missing `autoComplete="off"` attribute
- Missing `autoCorrect="off"` attribute  
- Missing `spellCheck={false}` attribute
- Missing click event propagation prevention

## Solution
Apply the same mobile input optimizations used successfully in other components like WalletTransferDialog and CampaignFeedbackDialog.

---

## Files to Update

### 1. Admin Campaign Form
**File:** `src/components/admin/election/CampaignFormDialog.tsx`

**Changes:**
- Candidate Name Input (line 178-183): Add mobile optimization attributes
- Campaign Slogan Input (line 207-211): Add mobile optimization attributes
- All Textarea fields: Add mobile optimization attributes

### 2. Member Campaign Launch Form
**File:** `src/components/community/elections/LaunchCampaignDialog.tsx`

**Changes:**
- Candidate Name Input (line 200-206): Add mobile optimization attributes
- Campaign Tagline Input (line 231-237): Add mobile optimization attributes
- Manifesto Textarea (line 245-251): Add mobile optimization attributes

---

## Implementation Details

For each Input field, add these attributes:
```tsx
<Input
  className="... touch-manipulation"
  autoComplete="off"
  autoCorrect="off"
  spellCheck={false}
  onClick={(e) => e.stopPropagation()}
/>
```

For each Textarea field, add these attributes:
```tsx
<Textarea
  className="... touch-manipulation"
  autoComplete="off"
  autoCorrect="off"
  spellCheck={false}
  onClick={(e) => e.stopPropagation()}
/>
```

---

## Technical Summary

| File | Fields to Fix |
|------|---------------|
| `CampaignFormDialog.tsx` | Candidate Name, Campaign Slogan, Manifesto, Priority items |
| `LaunchCampaignDialog.tsx` | Candidate Name, Campaign Tagline, Manifesto |

This matches the established mobile input optimization pattern documented in the project constraints.
