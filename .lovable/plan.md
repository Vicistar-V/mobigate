
## Integrate Multi-Signature Authorization for Leadership Changes

### Problem
Currently, the "Apply Change" and "Apply Selected" buttons in the leadership management interface directly apply changes with a single click. As shown in the screenshot, this violates the governance requirement that leadership changes require multi-signature authorization from:

**Primary Quorum (3 signatories):**
- PG/Chairman (President)
- Secretary
- PRO (Publicity Secretary) OR Director of Socials

**Fallback Quorum (4 signatories) - if PG or Secretary unavailable:**
- Secretary OR Vice President (covering for PG)
- PRO (Publicity Secretary)
- Legal Adviser (mandatory when substitutes act)
- Financial Secretary OR Treasurer

---

### Solution Overview

Modify the `ApplyElectionResultsSection.tsx` component to:
1. When "Apply Change" or "Apply Selected" is clicked, open the `ModuleAuthorizationDrawer` instead of directly applying
2. Store the pending action (single or batch) in state
3. Only execute the actual change after successful authorization
4. Display the authorization requirements clearly to admins

---

### Files to Modify

| File | Action |
|------|--------|
| `src/components/community/leadership/ApplyElectionResultsSection.tsx` | Add authorization drawer integration |
| `src/components/admin/leadership/ApplyElectionResultsSheet.tsx` | Add authorization drawer integration |
| `src/components/admin/authorization/authorizationActionConfigs.tsx` | Add specific action for `apply_single_result` and `apply_batch_results` |

---

### Implementation Details

#### 1. Update `ApplyElectionResultsSection.tsx`

**Add Imports:**
```tsx
import { ModuleAuthorizationDrawer } from "@/components/admin/authorization/ModuleAuthorizationDrawer";
import { getActionConfig, renderActionDetails } from "@/components/admin/authorization/authorizationActionConfigs";
import { Shield, Crown } from "lucide-react";
```

**Add State:**
```tsx
// Authorization state
const [authDrawerOpen, setAuthDrawerOpen] = useState(false);
const [pendingAction, setPendingAction] = useState<{
  type: "single" | "batch";
  winnerId?: string;
  winnerIds?: string[];
} | null>(null);
```

**Modify Single Apply Handler:**
```tsx
const handleApplySingle = (winnerId: string) => {
  // Instead of directly applying, open auth drawer
  setPendingAction({ type: "single", winnerId });
  setAuthDrawerOpen(true);
};
```

**Modify Batch Apply Handler:**
```tsx
const handleApplySelected = () => {
  if (selectedWinners.length === 0) {
    toast({
      title: "No Selection",
      description: "Please select at least one position to apply",
      variant: "destructive",
    });
    return;
  }
  // Open auth drawer for batch action
  setPendingAction({ type: "batch", winnerIds: selectedWinners });
  setAuthDrawerOpen(true);
};
```

**Add Authorization Complete Handler:**
```tsx
const handleAuthorizationComplete = () => {
  if (!pendingAction) return;

  if (pendingAction.type === "single" && pendingAction.winnerId) {
    // Apply single change
    const winner = winners.find(w => w.id === pendingAction.winnerId);
    setWinners(prev => prev.map(w => 
      w.id === pendingAction.winnerId ? { ...w, applied: true } : w
    ));
    toast({
      title: "Leadership Updated",
      description: `${winner?.winnerName} is now the ${winner?.position}`,
    });
  } else if (pendingAction.type === "batch" && pendingAction.winnerIds) {
    // Apply batch changes
    setWinners(prev => prev.map(w => 
      pendingAction.winnerIds!.includes(w.id) ? { ...w, applied: true } : w
    ));
    setSelectedWinners([]);
    toast({
      title: "Leadership Updated",
      description: `${pendingAction.winnerIds.length} position(s) have been updated`,
    });
  }

  setPendingAction(null);
};
```

**Add Action Details Generator:**
```tsx
const getAuthActionDetails = () => {
  if (!pendingAction) return null;

  if (pendingAction.type === "single" && pendingAction.winnerId) {
    const winner = winners.find(w => w.id === pendingAction.winnerId);
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-500/10">
            <Crown className="h-5 w-5 text-indigo-600" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-sm">{winner?.position}</p>
            <p className="text-xs text-muted-foreground">Leadership Change</p>
          </div>
        </div>
        <div className="p-2.5 bg-muted/50 rounded-lg text-sm space-y-1">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Current:</span>
            <span>{winner?.currentHolderName || "Vacant"}</span>
          </div>
          <div className="flex justify-between font-medium text-primary">
            <span className="text-muted-foreground">New:</span>
            <span>{winner?.winnerName}</span>
          </div>
        </div>
      </div>
    );
  }

  // Batch action
  const selectedCount = pendingAction.winnerIds?.length || 0;
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-indigo-500/10">
          <Crown className="h-5 w-5 text-indigo-600" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-sm">Apply {selectedCount} Leadership Changes</p>
          <p className="text-xs text-muted-foreground">Batch Update from Election Results</p>
        </div>
      </div>
      <div className="p-2.5 bg-muted/50 rounded-lg text-xs space-y-1">
        {pendingAction.winnerIds?.slice(0, 3).map(id => {
          const winner = winners.find(w => w.id === id);
          return (
            <div key={id} className="flex justify-between">
              <span className="text-muted-foreground truncate">{winner?.position}:</span>
              <span className="font-medium truncate ml-2">{winner?.winnerName}</span>
            </div>
          );
        })}
        {selectedCount > 3 && (
          <p className="text-muted-foreground">+{selectedCount - 3} more...</p>
        )}
      </div>
    </div>
  );
};
```

**Add Authorization Drawer to JSX:**
```tsx
{/* Authorization Drawer */}
<ModuleAuthorizationDrawer
  open={authDrawerOpen}
  onOpenChange={setAuthDrawerOpen}
  module="leadership"
  actionTitle={
    pendingAction?.type === "single"
      ? "Apply Leadership Change"
      : `Apply ${pendingAction?.winnerIds?.length || 0} Changes`
  }
  actionDescription="Multi-signature authorization required: President + Secretary + (PRO or Dir. of Socials)"
  actionDetails={getAuthActionDetails()}
  initiatorRole="secretary"
  onAuthorized={handleAuthorizationComplete}
/>
```

**Add Authorization Info Footer:**
```tsx
{/* Authorization Info - Add before closing div */}
<div className="flex items-start gap-2 pt-3 border-t">
  <Shield className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
  <p className="text-xs text-muted-foreground leading-relaxed">
    Leadership changes require multi-signature approval: President + Secretary + (PRO or Dir. of Socials).
    If President/Secretary unavailable, 4 signatories including Legal Adviser required.
  </p>
</div>
```

---

#### 2. Update `ApplyElectionResultsSheet.tsx` (Admin Version)

Apply the same pattern as above - this is the admin dashboard version that also needs the authorization gate.

---

#### 3. Add Action Configs (Optional Enhancement)

Add specific action types to `authorizationActionConfigs.tsx`:

```tsx
// In leadership section of MODULE_ACTION_CONFIGS
apply_single_result: {
  title: "Apply Election Result",
  description: "Multi-signature authorization to update single leadership position",
  icon: <Crown className="h-5 w-5 text-indigo-600" />,
  iconComponent: Crown,
  iconColorClass: "text-indigo-600",
},
apply_batch_results: {
  title: "Apply Multiple Results",
  description: "Multi-signature authorization to update multiple leadership positions",
  icon: <Crown className="h-5 w-5 text-green-600" />,
  iconComponent: Crown,
  iconColorClass: "text-green-600",
},
```

---

### Mobile UI Considerations

All changes follow existing mobile optimization patterns:
- Authorization drawer uses `h-[92vh]` bottom sheet on mobile
- Touch-friendly buttons with `h-11/h-12` heights
- Text uses `text-xs/text-sm` for mobile readability
- Proper flex wrapping with `min-w-0` on text containers
- Authorization info uses `leading-relaxed` for wrapping

---

### Authorization Flow

```
User clicks "Apply Change"
        ↓
Opens ModuleAuthorizationDrawer
        ↓
System shows required signatories:
  • President (required)
  • Secretary (required)  
  • PRO or Dir. of Socials (pick one)
        ↓
Each officer enters PIN (1234 for demo)
        ↓
When 3/3 authorized → "Confirm Authorization" enables
        ↓
User confirms → Leadership actually updated
        ↓
Toast: "Leadership Updated Successfully"
```

---

### Expected Outcome

1. "Apply Change" no longer works with single click
2. Opens authorization drawer requiring 3 signatures
3. Shows which officers must approve
4. Clearly displays the pending change details
5. Only applies after full authorization complete
6. Works seamlessly on mobile with proper drawer behavior
7. Matches existing authorization patterns used in Finance module
