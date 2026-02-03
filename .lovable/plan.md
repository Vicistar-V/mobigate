
# Implementation Plan: Add Member-Facing "Nominate Candidate" Button & Enhanced Office Display

## Overview
This plan adds a prominent **"Nominate Candidate"** button directly in the Community Main Menu's Election/Voting section, making it easily accessible to all members. Additionally, the nomination sheet will be enhanced to display **all community offices** - both available (selectable) and unavailable (grayed out with Lock icon and tenure dates).

---

## Current State Analysis

### What Exists:
- `NominateCandidateSheet.tsx` - A member-facing nomination component that allows self-nomination or nominating other members
- The sheet is currently only accessible via:
  - "Nomination Primaries" menu item
  - "More" dropdown in CommunityElectionTab (desktop only for the Nominate button)
  - Inside the NominationsListView

### What's Missing:
1. A **direct, prominent button** in the Community Main Menu for "Nominate Candidate"
2. Display of **inactive/unavailable offices** with Lock icons and tenure end dates

---

## Implementation Details

### File 1: `src/components/community/CommunityMainMenu.tsx`

**Add "Nominate Candidate" button after "Declare for Election (EoI)"**

Location: Lines 638-639 (after the Declare for Election button)

```
+++ Add new state variable for nomination sheet
const [showNominateCandidate, setShowNominateCandidate] = useState(false);

+++ Add highlighted Nominate button in Election/Voting accordion
<Button
  variant="ghost"
  className="w-full justify-start pl-4 h-10 transition-colors duration-200 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 font-medium"
  onClick={() => {
    setShowNominateCandidate(true);
    setOpen(false);
  }}
>
  <UserPlus className="h-4 w-4 mr-2" />
  Nominate Candidate
</Button>

+++ Add NominateCandidateSheet component at bottom
<NominateCandidateSheet
  open={showNominateCandidate}
  onOpenChange={setShowNominateCandidate}
  onNominationComplete={() => setShowNominateCandidate(false)}
/>
```

**Visual Hierarchy:**
- "Declare for Election (EoI)" - Primary/blue highlight (self-declaration, paid)
- "Nominate Candidate" - Emerald/green highlight (community nomination)
- Other buttons - Standard ghost styling

---

### File 2: `src/components/community/elections/NominateCandidateSheet.tsx`

**Enhance to display ALL offices with active/inactive states**

**Change 1: Update mock data import to include unavailable offices**

```typescript
// Add unavailable offices with tenure information
const unavailableOffices = [
  {
    id: "office-unavail-1",
    officeName: "President General",
    currentHolder: "Chief Emmanuel Nwosu",
    tenureEnd: new Date("2025-12-31"),
    status: "active_tenure" as const,
  },
  {
    id: "office-unavail-2",
    officeName: "Secretary General",
    currentHolder: "Mrs. Ngozi Eze",
    tenureEnd: new Date("2025-12-31"),
    status: "active_tenure" as const,
  },
  {
    id: "office-unavail-3",
    officeName: "Publicity Secretary",
    currentHolder: "Dr. Patricia Okafor",
    tenureEnd: new Date("2025-12-31"),
    status: "active_tenure" as const,
  },
];
```

**Change 2: Update Office Selection UI (lines 289-316)**

Replace simple dropdown with card-based selection showing:
- **Available Offices** (green border, selectable)
  - Office name
  - Current nomination count
  - "Open" badge
- **Unavailable Offices** (grayed out, Lock icon)
  - Office name
  - Current holder name
  - Tenure end date
  - "Inactive" badge with Lock icon

```tsx
{/* Office Selection - Card-based with Active/Inactive states */}
<div className="space-y-4">
  {/* Available Offices */}
  {openNominationPeriods.length > 0 && (
    <div className="space-y-2">
      <Label className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
        <Check className="h-3.5 w-3.5" />
        Available Positions ({openNominationPeriods.length})
      </Label>
      <div className="space-y-2">
        {openNominationPeriods.map((period) => (
          <Card
            key={period.officeId}
            className={cn(
              "cursor-pointer transition-all",
              selectedOffice === period.officeId
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-emerald-200 hover:border-emerald-400 hover:shadow-sm"
            )}
            onClick={() => setSelectedOffice(period.officeId)}
          >
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{period.officeName}</p>
                  <p className="text-xs text-muted-foreground">
                    {period.nominationsCount}/{period.maxNominations || "No limit"} nominations
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-emerald-500 text-white text-[10px]">Open</Badge>
                  {selectedOffice === period.officeId && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )}

  {/* Unavailable Offices */}
  {unavailableOffices.length > 0 && (
    <div className="space-y-2 mt-4">
      <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
        <Lock className="h-3.5 w-3.5" />
        Unavailable Positions ({unavailableOffices.length})
      </Label>
      <div className="space-y-2">
        {unavailableOffices.map((office) => (
          <Card
            key={office.id}
            className="opacity-60 border-muted cursor-not-allowed"
          >
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-muted-foreground">{office.officeName}</p>
                  <p className="text-xs text-muted-foreground">
                    Current: {office.currentHolder}
                  </p>
                  <p className="text-xs text-amber-600 flex items-center gap-1 mt-0.5">
                    <Calendar className="h-3 w-3" />
                    Tenure ends: {format(office.tenureEnd, "MMM d, yyyy")}
                  </p>
                </div>
                <Badge variant="secondary" className="text-[10px]">
                  <Lock className="h-2.5 w-2.5 mr-1" />
                  Inactive
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )}
</div>
```

---

## Technical Summary

| File | Action | Description |
|------|--------|-------------|
| `CommunityMainMenu.tsx` | Modify | Add "Nominate Candidate" button + state + sheet integration |
| `NominateCandidateSheet.tsx` | Modify | Add unavailable offices display with Lock icons and tenure dates |

---

## Mobile-First Design Considerations

1. **Touch-friendly cards** - Min 48px touch targets for office selection
2. **Stacked layout** - Available offices first, then unavailable offices
3. **Clear visual hierarchy** - Green for available, gray/muted for unavailable
4. **ScrollArea** with touch-auto for long office lists
5. **Consistent with admin pattern** - Matches the active/inactive display in `NominateCandidateDrawer.tsx`

---

## User Flow

```
Community Main Menu
    |
    +-- Election/Voting (Accordion)
           |
           +-- [Declare for Election (EoI)] (Blue highlight - paid self-declaration)
           |
           +-- [Nominate Candidate] (Green highlight - NEW)
           |        |
           |        +-> Opens NominateCandidateSheet
           |               |
           |               +-> Choose: Self / Other Member
           |               +-> Select Office (shows Active + Inactive)
           |               +-> Submit Nomination
           |
           +-- Campaigns
           +-- Start Voting
           +-- ... other options
```
