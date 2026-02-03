
# Implementation Plan: Add "Declare Election" Tab & Verify Impeachment Tab Position

## Overview
The user wants to restructure the Election Management page tab layout:
1. **Add a "Declare Election" (or "New Election") tab as the FIRST tab** before "Campaigns"
2. **Verify Impeachment tab is correctly positioned** between "Winners" and "Settings" (already correct)

Currently, the "New Election" functionality is a button in the header. The user wants it moved to become the first tab in the tab row for easier discoverability.

---

## Current Structure

### Tab Order (Current):
```
Campaigns → Election Processes → Accreditation → Clearances → Winners → Impeachment → Settings
```

### Desired Tab Order:
```
+ Declare Election → Campaigns → Election Processes → Accreditation → Clearances → Winners → Impeachment → Settings
```

---

## Implementation Details

### File: `src/pages/admin/ElectionManagementPage.tsx`

**Change 1: Remove the "New Election" button from header**

The header currently has a button that opens `DeclareElectionDrawer`. This will be replaced by a new tab.

**Lines to modify:** 39-48 (remove the New Election Button from header)

Before:
```tsx
{/* New Election Button */}
<Button 
  size="sm"
  className="bg-green-600 hover:bg-green-700 text-white font-medium shrink-0"
  onClick={() => setShowDeclareElection(true)}
>
  <Plus className="h-4 w-4 mr-1" />
  <span className="hidden sm:inline">New Election</span>
  <span className="sm:hidden">New</span>
</Button>
```

After: Remove this entire block

---

**Change 2: Add "Declare Election" tab as FIRST tab trigger**

Add a new TabsTrigger before "Campaigns" at line 57:

```tsx
<TabsTrigger 
  value="declare" 
  className="text-xs sm:text-sm px-3 sm:px-4 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-md font-medium whitespace-nowrap"
>
  <Plus className="h-3.5 w-3.5 mr-1" />
  + Declare
</TabsTrigger>
```

---

**Change 3: Add TabsContent for "Declare Election"**

After line 106, before the Campaigns TabsContent:

```tsx
<TabsContent value="declare" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
  <AdminDeclareElectionTab onDeclareElection={() => setShowDeclareElection(true)} />
</TabsContent>
```

---

### File: NEW - `src/components/admin/election/AdminDeclareElectionTab.tsx`

Create a new tab content component that displays:
1. **Summary stats** for existing declared elections (Active, Pending Authorization, Completed, Cancelled)
2. **"+ Declare New Election" button** - prominent button that opens the existing `DeclareElectionDrawer`
3. **List of declared elections** with their status, authorization progress, and details

```tsx
// Core structure:
export function AdminDeclareElectionTab({ 
  onDeclareElection 
}: { 
  onDeclareElection: () => void 
}) {
  // Stats grid showing: Active Elections, Pending Auth, Completed, Cancelled
  // Prominent "+ Declare New Election" button
  // List of declared elections with:
  //   - Election type badge (General/Supplementary)
  //   - Election name
  //   - Selected offices count
  //   - Authorization status (X/3 signatures)
  //   - Nomination start & election dates
  //   - Status badge (Pending Auth, Active, Completed)
}
```

**Mobile-first design considerations:**
- Touch-friendly button sizes (minimum 44px tap targets)
- Stacked card layouts for election entries
- ScrollArea for long lists with `touch-auto` and `overscroll-contain`
- Stats grid using `grid-cols-4` with compact text

---

## Mock Data Structure

```typescript
interface DeclaredElection {
  id: string;
  name: string;
  type: 'general' | 'supplementary';
  selectedOffices: string[];
  nominationStartDate: Date;
  electionDate: Date;
  status: 'pending_authorization' | 'active' | 'nominations_open' | 'completed' | 'cancelled';
  authorizationProgress: {
    required: number;
    completed: number;
    signatories: string[];
  };
  vacancyReasons?: Record<string, VacancyReason>; // For supplementary elections
  createdAt: Date;
  createdBy: string;
}
```

---

## Authorization Flow (Already Implemented)

The existing `DeclareElectionDrawer` component already handles:
- Election type selection (General vs Supplementary)
- Office selection with vacancy reasons for supplementary elections
- Multi-step wizard flow
- Integration with `ModuleAuthorizationDrawer` for multi-signature authorization
- Authorization requirement: **President + Secretary + (PRO or Dir. of Socials)**, OR **Secretary + PRO + Legal Adviser + (Dir. of Socials or another Admin)** if President is unavailable

No changes needed to the authorization logic.

---

## Impeachment Tab Verification

**Current Position:** Between "Winners" and "Settings" (lines 87-93)
**Required Position:** Between "Winners" and "Settings"
**Status:** Already correctly positioned - no changes needed

---

## Summary of Files to Modify/Create

| File | Action |
|------|--------|
| `src/pages/admin/ElectionManagementPage.tsx` | Modify - Remove header button, add "Declare" tab |
| `src/components/admin/election/AdminDeclareElectionTab.tsx` | Create - New tab content component |

---

## Technical Notes

1. **Import Updates**: Add `Plus` icon import if not already present in the page
2. **State Management**: The `showDeclareElection` state already exists and will be passed to the new tab component
3. **Default Tab**: Keep `defaultValue="campaigns"` so existing users aren't disrupted - or optionally change to `"declare"` if the admin wants to start there
4. **Mobile Focus**: All UI elements will follow mobile-first patterns with touch-manipulation, proper sizing, and stacked layouts
