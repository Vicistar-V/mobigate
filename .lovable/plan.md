
# Nomination System Enhancement Plan

## Overview

This plan adds a comprehensive nomination feature that allows:
1. **Self-Nomination**: Candidates can nominate themselves for any election office
2. **Member Nomination**: Any community member can nominate another member for election
3. **Proper Scrolling**: All sheets/drawers will properly scroll on both mobile and desktop devices

The current system only has the "Declaration of Interest (EoI)" flow - this adds a separate **Nomination** flow which is distinct (EoI is a paid declaration, Nomination is a community endorsement).

---

## Current Architecture Analysis

### Existing Components
| Component | Purpose |
|-----------|---------|
| `AdminNominationsSection.tsx` | Admin view of all nominations with approval workflow |
| `DeclarationOfInterestSheet.tsx` | Paid declaration flow for candidates |
| `CandidateDashboardSheet.tsx` | Candidate's personal dashboard |
| `Nomination` type | Stores nomination data including `nominatedBy`, `nominatedByName` |

### Key Insight from Screenshot
The uploaded screenshot shows a "Nomination Details" drawer displaying:
- Nominee: Chukwuemeka Obi
- Office: President General
- **Nominated By: Elder James Nwachukwu** (another member nominated them)
- Date, Endorsements count, and Acceptance status

This confirms that nominations are community-driven endorsements, separate from the candidate's own declaration.

---

## Implementation Plan

### 1. Create NominateCandidateSheet Component

**New File**: `src/components/community/elections/NominateCandidateSheet.tsx`

This is the main user-facing component for nominating someone (or yourself).

**Key Features:**
- Toggle for "Nominate Myself" vs "Nominate Another Member"
- Office selection dropdown
- Member search/select (when nominating others)
- Confirmation dialog before submission
- Mobile (Drawer) and Desktop (Dialog) responsive wrapper

**UI Flow:**
```text
┌─────────────────────────────────────────┐
│  📋 Nominate for Election               │
├─────────────────────────────────────────┤
│  [○] Nominate Myself                    │
│  [●] Nominate Another Member            │
├─────────────────────────────────────────┤
│  Search Member: [________________]      │
│                                         │
│  👤 Elder James Nwachukwu    [Select]   │
│  👤 Dr. Patricia Okafor      [Select]   │
│  👤 Chief Emmanuel Nwosu     [Select]   │
├─────────────────────────────────────────┤
│  Select Office:                         │
│  ┌──────────────────────────────────┐   │
│  │ President General            ▾   │   │
│  └──────────────────────────────────┘   │
├─────────────────────────────────────────┤
│                                         │
│         [ Submit Nomination ]           │
│                                         │
└─────────────────────────────────────────┘
```

---

### 2. Create NominationDetailsSheet Component

**New File**: `src/components/community/elections/NominationDetailsSheet.tsx`

A user-facing component to view nomination details (separate from admin view).

**Key Features:**
- Shows nominee info, nominator info, endorsement count
- Endorsement button for other members
- Acceptance status (for the nominee to accept/decline)
- Mobile Drawer / Desktop Dialog pattern with proper scrolling

---

### 3. Create NominationsListView Component

**New File**: `src/components/community/elections/NominationsListView.tsx`

A list of all community nominations visible to members.

**Features:**
- Filter by office
- Search nominees
- Click to view details
- Shows endorsement counts

---

### 4. Update CommunityElectionTab.tsx

Add "Nominations" to the navigation with access to:
- View all nominations
- "Nominate" button (opens NominateCandidateSheet)

---

### 5. Update AdminNominationsSection.tsx

Fix the scrolling issue in the existing Nomination Details Sheet:
- Change from `Sheet` to responsive Drawer/Dialog pattern
- Add `useIsMobile()` hook
- Use `max-h-[92vh]` on mobile Drawer
- Use `max-h-[85vh]` on desktop Dialog
- Add `overflow-y-auto touch-auto` to content areas

---

### 6. Add Types

**Update**: `src/types/electionProcesses.ts`

Add:
```typescript
// Whether nomination is self or by another member
export interface Nomination {
  // existing fields...
  isSelfNomination: boolean;  // NEW
}
```

---

## Files to Create

| File | Purpose |
|------|---------|
| `src/components/community/elections/NominateCandidateSheet.tsx` | Self/member nomination flow with office selection |
| `src/components/community/elections/NominationDetailsSheet.tsx` | View nomination details with endorsement action |
| `src/components/community/elections/NominationsListView.tsx` | Browse all community nominations |

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/admin/election/AdminNominationsSection.tsx` | Fix scrolling with responsive Drawer/Dialog pattern |
| `src/components/community/CommunityElectionTab.tsx` | Add Nominations view and Nominate button |
| `src/data/electionProcessesData.ts` | Add `isSelfNomination` flag to mock data |
| `src/types/electionProcesses.ts` | Add `isSelfNomination` to Nomination interface |

---

## Technical Details

### Responsive Drawer/Dialog Pattern

All nomination sheets will use this pattern for proper scrolling:

```typescript
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";

function MySheet({ open, onOpenChange, ...props }) {
  const isMobile = useIsMobile();

  const Content = () => (
    <ScrollArea className="flex-1 overflow-y-auto touch-auto">
      {/* Content here */}
    </ScrollArea>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[92vh]">
          <DrawerHeader>
            <DrawerTitle>Title</DrawerTitle>
          </DrawerHeader>
          <Content />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Title</DialogTitle>
        </DialogHeader>
        <Content />
      </DialogContent>
    </Dialog>
  );
}
```

### Self-Nomination Logic

When "Nominate Myself" is selected:
- `nominatedBy` = current user ID
- `nominatedByName` = current user name
- `nomineeId` = current user ID
- `isSelfNomination` = true
- Automatic acceptance (`acceptedByNominee` = true)

### Member Nomination Logic

When nominating another member:
- `nominatedBy` = current user ID
- `nominatedByName` = current user name
- `nomineeId` = selected member ID
- `isSelfNomination` = false
- Requires acceptance from nominee

---

## UI/UX Considerations

### Mobile-First Design
- All touch targets minimum 44x44px
- Stacked layouts on mobile
- Horizontal layouts on desktop where appropriate
- Bottom sheet pattern on mobile (Drawer from bottom)
- Side/center dialog on desktop

### Self-Nomination Indicator
Show a badge when viewing self-nominations:
```text
👤 Paulson Chinedu Okonkwo
   President General
   [Self-Nominated] [5 Endorsements]
```

### Endorsement Flow
Members can endorse nominations:
```text
[👍 Endorse] → "You endorsed this candidate!" → [Endorsed ✓]
```

---

## Navigation Updates

### Election Tab Navigation
Add "Nominations" as a new view:

```text
[Campaigns] [Voting] [Results ▾] [Winners] [...More ▾]
                                            └── Nominations ← NEW
                                            └── Nominate Someone ← NEW
                                            └── Public Opinions
                                            └── Accreditation
                                            └── etc.
```

### Quick Action Button
Add "Nominate" button next to "Declare for Election":

```text
[Declare for Election]  [Nominate Someone]
```

---

## Mock Data Updates

Add a self-nomination example:

```typescript
{
  id: "nom-7",
  nomineeId: "member-7",
  nomineeName: "Paulson Chinedu Okonkwo",
  nomineeAvatar: "/placeholder.svg",
  officeId: "office-1",
  officeName: "President General",
  nominatedBy: "member-7", // Same as nominee
  nominatedByName: "Paulson Chinedu Okonkwo", // Same person
  nominatedAt: new Date("2025-01-15"),
  status: "approved",
  acceptedByNominee: true,
  acceptedAt: new Date("2025-01-15"),
  endorsementsCount: 45,
  qualificationStatus: "qualified",
  isSelfNomination: true
}
```

---

## Summary

This implementation adds:
1. **NominateCandidateSheet** - Allows self-nomination or nominating other members
2. **NominationDetailsSheet** - User-facing details view with endorsement
3. **NominationsListView** - Browse all nominations with filters
4. **Proper scrolling** - All sheets use responsive Drawer/Dialog with overflow handling
5. **Self-nomination support** - Track whether nomination is self or by another member
6. **Navigation integration** - Added to Election Tab menu and quick actions
