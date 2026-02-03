
# Implementation Plan: Multi-Signature Authorization for Voter Accreditation

## Overview
This plan converts the single-admin "Accredit" and "Revoke" actions into a 3-signature authorization process. The accreditation workflow will now require approval from multiple officers before any voter status changes take effect.

---

## User Requirements

### Authorization Quorum (3 Signatures Required)
1. **PG/Chairman (President)** — *or* Vice President + Secretary if PG is unavailable
2. **Secretary** — *or* Assistant Secretary + PG if Secretary is unavailable  
3. **One of**: Legal Adviser, Financial Secretary, *or* Publicity Secretary (PRO)

This aligns with the existing multi-signature framework but with accreditation-specific role requirements.

---

## Current State

The `AdminAccreditationTab.tsx` currently has four action handlers that directly update voter state:
- `handleBulkAccredit()` — Immediately sets selected voters to "valid"
- `handleBulkRevoke()` — Immediately sets selected voters to "revoked"
- `handleAccredit(voterId)` — Immediately accredits a single voter
- `handleRevoke(voterId)` — Immediately revokes a single voter

These need to be converted to trigger the `ModuleAuthorizationDrawer` instead.

---

## Implementation Details

### File 1: `src/components/admin/authorization/authorizationActionConfigs.tsx`

**Add new action configs for accreditation operations**

Location: Inside `MODULE_ACTION_CONFIGS.elections` object (after line 142)

```typescript
elections: {
  // ... existing configs ...
  accredit_voters: {
    title: "Accredit Voters",
    description: "Multi-signature authorization to grant voting accreditation",
    icon: <Vote className="h-5 w-5 text-green-600" />,
    iconComponent: Vote,
    iconColorClass: "text-green-600",
  },
  revoke_accreditation: {
    title: "Revoke Accreditation",
    description: "Multi-signature authorization to revoke voting accreditation",
    icon: <Vote className="h-5 w-5 text-red-600" />,
    iconComponent: Vote,
    iconColorClass: "text-red-600",
  },
}
```

---

### File 2: `src/types/adminAuthorization.ts`

**Add a custom authorization rule for accreditation (optional enhancement)**

The existing `elections` module rules work, but to precisely match the user's requirement of "Legal Adviser, Financial Secretary, or PRO" as the third signatory, we can extend the alternativeRoles:

Location: Update `MODULE_AUTHORIZATION_RULES.elections.alternativeRoles` (lines 158-161)

```typescript
elections: {
  module: "elections",
  displayName: "Elections",
  description: "Election management and result announcements",
  requiredSignatories: 3,
  requiredRoles: ["president", "secretary"],
  alternativeRoles: [["publicity_secretary", "financial_secretary", "legal_adviser"]], // Updated to include all three options
  auxiliaryRoles: ["legal_adviser", "vice_president", "assistant_secretary"],
  canProceedWithoutPresident: false,
  requiresLegalAdviserIfActing: true,
},
```

Also update `getRequirementsDescription()` for elections (line 369-370):

```typescript
case "elections":
  return "President + Secretary + (PRO, Fin. Sec, or Legal Adviser)";
```

---

### File 3: `src/components/admin/election/AdminAccreditationTab.tsx`

**Major Changes:**

1. **Add state for authorization drawer**
2. **Add state to track pending action context** (which voters, what action type)
3. **Replace direct handlers with drawer triggers**
4. **Add `ModuleAuthorizationDrawer` component**
5. **Move actual state updates to `onAuthorized` callback**

#### New Imports
```typescript
import { ModuleAuthorizationDrawer } from "@/components/admin/authorization/ModuleAuthorizationDrawer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { UserCheck, UserX, Users, Shield } from "lucide-react";
```

#### New State Variables
```typescript
// Authorization drawer state
const [showAuthDrawer, setShowAuthDrawer] = useState(false);
const [pendingAction, setPendingAction] = useState<{
  type: "accredit" | "revoke";
  voterIds: string[];
  voterNames: string[];
} | null>(null);
```

#### Modified Handlers

**Replace `handleBulkAccredit()` (lines 99-108):**
```typescript
const handleBulkAccredit = () => {
  const selectedVoterData = voters.filter(v => selectedVoters.includes(v.id));
  setPendingAction({
    type: "accredit",
    voterIds: selectedVoters,
    voterNames: selectedVoterData.map(v => v.name),
  });
  setShowAuthDrawer(true);
};
```

**Replace `handleBulkRevoke()` (lines 110-120):**
```typescript
const handleBulkRevoke = () => {
  const selectedVoterData = voters.filter(v => selectedVoters.includes(v.id));
  setPendingAction({
    type: "revoke",
    voterIds: selectedVoters,
    voterNames: selectedVoterData.map(v => v.name),
  });
  setShowAuthDrawer(true);
};
```

**Replace `handleAccredit(voterId)` (lines 122-130):**
```typescript
const handleAccredit = (voterId: string) => {
  const voter = voters.find(v => v.id === voterId);
  if (!voter) return;
  
  setPendingAction({
    type: "accredit",
    voterIds: [voterId],
    voterNames: [voter.name],
  });
  setShowAuthDrawer(true);
};
```

**Replace `handleRevoke(voterId)` (lines 132-141):**
```typescript
const handleRevoke = (voterId: string) => {
  const voter = voters.find(v => v.id === voterId);
  if (!voter) return;
  
  setPendingAction({
    type: "revoke",
    voterIds: [voterId],
    voterNames: [voter.name],
  });
  setShowAuthDrawer(true);
};
```

#### New Authorization Complete Handler
```typescript
const handleAuthorizationComplete = () => {
  if (!pendingAction) return;
  
  if (pendingAction.type === "accredit") {
    setVoters(prev => prev.map(v => 
      pendingAction.voterIds.includes(v.id) 
        ? { ...v, accreditationStatus: 'valid' as const, dateAccredited: new Date() } 
        : v
    ));
    toast({
      title: "Voters Accredited",
      description: `${pendingAction.voterIds.length} voter(s) have been accredited with multi-signature authorization`
    });
  } else {
    setVoters(prev => prev.map(v => 
      pendingAction.voterIds.includes(v.id) 
        ? { ...v, accreditationStatus: 'revoked' as const } 
        : v
    ));
    toast({
      title: "Accreditation Revoked",
      description: `${pendingAction.voterIds.length} voter(s) have had their accreditation revoked`,
      variant: "destructive"
    });
  }
  
  setSelectedVoters([]);
  setPendingAction(null);
};
```

#### Action Details Renderer
```typescript
const getAuthActionDetails = () => {
  if (!pendingAction) return null;
  
  const isAccredit = pendingAction.type === "accredit";
  const count = pendingAction.voterIds.length;
  
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${isAccredit ? "bg-green-500/10" : "bg-red-500/10"}`}>
          {isAccredit ? (
            <UserCheck className="h-5 w-5 text-green-600" />
          ) : (
            <UserX className="h-5 w-5 text-red-600" />
          )}
        </div>
        <div>
          <p className="font-medium text-sm">
            {isAccredit ? "Accredit" : "Revoke"} {count} Voter{count !== 1 ? "s" : ""}
          </p>
          <p className="text-xs text-muted-foreground">
            {isAccredit ? "Grant voting rights" : "Remove voting rights"}
          </p>
        </div>
      </div>
      
      {/* Voter names list */}
      <div className="bg-muted/50 rounded-lg p-2 max-h-24 overflow-y-auto">
        {pendingAction.voterNames.slice(0, 5).map((name, idx) => (
          <p key={idx} className="text-xs truncate">{name}</p>
        ))}
        {pendingAction.voterNames.length > 5 && (
          <p className="text-xs text-muted-foreground mt-1">
            +{pendingAction.voterNames.length - 5} more
          </p>
        )}
      </div>
      
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Shield className="h-3.5 w-3.5" />
        <span>Requires 3 admin signatures</span>
      </div>
    </div>
  );
};
```

#### Add Authorization Drawer (at bottom of component, before closing div)
```tsx
{/* Multi-Signature Authorization Drawer */}
<ModuleAuthorizationDrawer
  open={showAuthDrawer}
  onOpenChange={(open) => {
    setShowAuthDrawer(open);
    if (!open) setPendingAction(null);
  }}
  module="elections"
  actionTitle={pendingAction?.type === "accredit" ? "Accredit Voters" : "Revoke Accreditation"}
  actionDescription={
    pendingAction?.type === "accredit"
      ? "Multi-signature authorization required to grant voting accreditation"
      : "Multi-signature authorization required to revoke voting accreditation"
  }
  actionDetails={getAuthActionDetails()}
  initiatorRole="secretary"
  onAuthorized={handleAuthorizationComplete}
/>
```

---

## Visual Changes

### Before (Single Admin)
```
┌─────────────────────────────────────┐
│  [Accredit]  [Revoke]  buttons      │
│         ↓                            │
│  Instant state change + toast       │
└─────────────────────────────────────┘
```

### After (Multi-Signature)
```
┌─────────────────────────────────────┐
│  [Accredit]  [Revoke]  buttons      │
│         ↓                            │
│  Opens ModuleAuthorizationDrawer    │
│         ↓                            │
│  3 Officers enter passwords:        │
│   • President (or Vice + Sec)       │
│   • Secretary (or Asst + PG)        │
│   • PRO/Fin.Sec/Legal Adviser       │
│         ↓                            │
│  "Confirm Authorization" enabled    │
│         ↓                            │
│  State change + success toast       │
└─────────────────────────────────────┘
```

---

## Technical Summary

| File | Action | Description |
|------|--------|-------------|
| `authorizationActionConfigs.tsx` | Add | New `accredit_voters` and `revoke_accreditation` action configs |
| `adminAuthorization.ts` | Modify | Update election alternativeRoles to include Financial Secretary |
| `AdminAccreditationTab.tsx` | Modify | Replace direct handlers with authorization drawer flow |

---

## Mobile-First Considerations

1. **Bottom Sheet on Mobile** — The authorization drawer uses Drawer on mobile (92vh)
2. **Scrollable Officer List** — Officers listed in single column with touch-friendly targets
3. **Clear Visual Feedback** — Green/red badges indicate accredit vs revoke action
4. **Voter Names Preview** — Shows first 5 names with "+X more" for bulk actions

---

## Authorization Flow Summary

```
User selects voter(s)
        ↓
Clicks "Accredit" or "Revoke"
        ↓
Authorization Drawer opens
        ↓
Shows action details (voter names, count)
        ↓
3 Officers must authorize:
  1. President/Chairman (required)
  2. Secretary (required)
  3. PRO, Fin.Sec, or Legal Adviser (pick one)
        ↓
24-hour expiration timer
        ↓
"Confirm Authorization" becomes active
        ↓
Action executes, voters updated
```
