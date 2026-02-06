

## Fix "Announce Results" Button Not Working

### Problem
The "Announce Result" button in the office detail sheet (shown when viewing a completed election office) is missing an `onClick` handler. Tapping the button does nothing because no action is attached to it.

**Location:** `src/components/admin/election/AdminMainElectionSection.tsx`, lines 500-507

```tsx
{selectedOffice.status === 'completed' && (
  <Button 
    className="w-full bg-green-600 hover:bg-green-700"
    // Missing onClick handler - button is inactive
  >
    <Megaphone className="h-4 w-4 mr-2" />
    Announce Result
  </Button>
)}
```

---

## Solution

Add proper click handling to trigger the announcement flow. There are two approaches:

### Option A: Use Existing Announce Dialog (Simpler)
When tapping "Announce Result" for a specific office, close the detail sheet and open the announce dialog.

### Option B: Office-Specific Authorization (Recommended)
Implement the multi-signature authorization flow consistent with other admin election actions. This requires integrating `ModuleAuthorizationDrawer`.

I recommend **Option B** for consistency with the "Announce Winners" button in `AdminElectionSection.tsx` which properly uses authorization.

---

## Implementation Details

### File: `src/components/admin/election/AdminMainElectionSection.tsx`

#### 1. Add Import for ModuleAuthorizationDrawer
```tsx
import { ModuleAuthorizationDrawer } from "../authorization/ModuleAuthorizationDrawer";
import { getActionConfig, renderActionDetails } from "../authorization/authorizationActionConfigs";
```

#### 2. Add State for Authorization
```tsx
const [showAuthDrawer, setShowAuthDrawer] = useState(false);
const [officeToAnnounce, setOfficeToAnnounce] = useState<MainElectionOffice | null>(null);
```

#### 3. Add Handler for Announce Button
```tsx
const handleAnnounceOfficeResult = (office: MainElectionOffice) => {
  setOfficeToAnnounce(office);
  setShowDetailSheet(false); // Close detail sheet to prevent modal stacking
  setTimeout(() => {
    setShowAuthDrawer(true);
  }, 150); // Slight delay for smooth transition
};

const handleAuthComplete = () => {
  if (officeToAnnounce) {
    toast({
      title: "Result Announced",
      description: `Election result for ${officeToAnnounce.officeName} has been published`,
    });
  }
  setOfficeToAnnounce(null);
  setShowAuthDrawer(false);
};
```

#### 4. Update Button with onClick Handler
```tsx
{selectedOffice.status === 'completed' && (
  <Button 
    className="w-full bg-green-600 hover:bg-green-700"
    onClick={() => handleAnnounceOfficeResult(selectedOffice)}
  >
    <Megaphone className="h-4 w-4 mr-2" />
    Announce Result
  </Button>
)}
```

#### 5. Add Authorization Drawer Component
Add at the end of the JSX return, after the CandidateVotersListSheet:
```tsx
{/* Office Result Authorization Drawer */}
<ModuleAuthorizationDrawer
  open={showAuthDrawer}
  onOpenChange={setShowAuthDrawer}
  module="elections"
  actionTitle="Announce Election Result"
  actionDescription="Multi-signature authorization required to publish election result"
  actionDetails={
    officeToAnnounce && (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Megaphone className="h-5 w-5 text-green-600" />
          <div>
            <p className="font-medium text-sm">{officeToAnnounce.officeName}</p>
            <p className="text-xs text-muted-foreground">
              Winner: {officeToAnnounce.winner || "To be announced"}
            </p>
          </div>
        </div>
      </div>
    )
  }
  initiatorRole="secretary"
  onAuthorized={handleAuthComplete}
/>
```

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/admin/election/AdminMainElectionSection.tsx` | Add onClick handler, state, authorization drawer integration |

---

## Mobile Optimizations
- Use 150ms delay when transitioning between detail sheet and authorization drawer to prevent modal stacking issues
- Authorization drawer uses established mobile patterns (92vh height, touch-optimized)

---

## Expected Outcome

- Tapping "Announce Result" button closes the office detail sheet
- Opens multi-signature authorization drawer
- Shows office name and winner information
- Requires President + Secretary + (PRO or Dir. Socials) approval
- Upon authorization, shows success toast confirming result announcement
- Consistent with other admin election authorization patterns

