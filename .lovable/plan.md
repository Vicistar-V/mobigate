

## Fix Inactive Handlers in Admin Dashboard

### Problem Identified
Multiple action buttons across the Admin Dashboard return "no response" because they are configured with placeholder toast notifications instead of opening functional interfaces. The affected areas are:

**1. Meetings Section - Upcoming Meeting Items**
- File: `src/components/admin/AdminMeetingSection.tsx`
- Line: 155
- Current: `onView={(id) => {}}` (empty function)
- Issue: Clicking on individual upcoming meeting items (Q1 General Assembly, Executive Committee, Finance Committee Review) does nothing

**2. Settings Section - Edit Profile & Edit Photos**
- File: `src/pages/CommunityAdminDashboard.tsx`
- Lines: 266-267
- Current: Toast notifications only
- Issue: The buttons exist but don't open the profile/photo editing dialogs that already exist in the codebase

**3. Settings Section - Privacy, Notifications, Rules**
- File: `src/pages/CommunityAdminDashboard.tsx`
- Lines: 270-272
- Current: Toast notifications only
- Issue: Should integrate with existing settings management

**4. Leadership Section - Multiple Actions**
- File: `src/pages/CommunityAdminDashboard.tsx`
- Lines: 258-261
- Current: Toast notifications only
- Issue: Apply Results, View History, Manage Adhoc, View Executive all inactive

---

### Solution: Wire Up Existing Components & Create Missing Interfaces

---

### Part 1: Fix Upcoming Meeting Items Click Handler

**File: `src/components/admin/AdminMeetingSection.tsx`**

The `MeetingItem` component at line 155 has an empty `onView` handler. This should open the meeting details by setting state to show the upcoming meetings sheet with a selected meeting.

**Change Required:**
- Add `onViewMeetingDetail` prop to `AdminMeetingSection`
- Pass the meeting ID to parent when clicked
- Parent opens the Upcoming Meetings sheet

---

### Part 2: Wire Up Profile & Photo Editing

**File: `src/pages/CommunityAdminDashboard.tsx`**

Add state and import for the existing dialogs:

| Action | Existing Component | State Variable |
|--------|-------------------|----------------|
| Edit Profile | `EditCommunityProfileDialog` | `showEditProfile` |
| Edit Photos | `EditCommunityPhotoDialog` | `showEditPhotos` |

**Implementation:**
1. Add state variables for profile/photo dialogs
2. Import the existing dialog components
3. Wire handlers to open dialogs
4. Add dialog components to render tree with mock member data

---

### Part 3: Fix Settings Section Handlers

**File: `src/pages/CommunityAdminDashboard.tsx`**

| Action | Current Behavior | Solution |
|--------|------------------|----------|
| Privacy Settings | Toast | Open `AdminSettingsTab` with Privacy category selected |
| Notification Settings | Toast | Open `AdminSettingsTab` with filtered view |
| Community Rules | Toast | Open `AdminSettingsTab` with General category |

The `AdminSettingsTab` component already handles all these settings categories - the handlers should open the settings tab, potentially with a pre-selected category.

---

### Part 4: Fix Leadership Section Handlers

**File: `src/pages/CommunityAdminDashboard.tsx`**

These require creating dedicated sheets/drawers:

| Action | Solution |
|--------|----------|
| Apply Election Results | Create `ApplyElectionResultsSheet` - shows recent election results to apply |
| View Change History | Create `LeadershipHistorySheet` - timeline of leadership changes |
| Manage Adhoc | Create `AdhocCommitteesSheet` - manage temporary committees |
| View Executive | Clicking an executive opens their detail - wire to existing `ExecutiveDetailSheet` |

---

### Files to Modify

| File | Action |
|------|--------|
| `src/pages/CommunityAdminDashboard.tsx` | **MODIFY** - Add states, imports, wire handlers, add dialogs |
| `src/components/admin/AdminMeetingSection.tsx` | **MODIFY** - Add `onViewMeetingDetail` prop and wire MeetingItem click |
| `src/components/admin/AdminLeadershipSection.tsx` | **MODIFY** - Add `onViewExecutiveDetail` to open detail sheet |

### New Files to Create

| File | Description |
|------|-------------|
| `src/components/admin/leadership/ApplyElectionResultsSheet.tsx` | Sheet to apply election results to leadership |
| `src/components/admin/leadership/LeadershipHistorySheet.tsx` | Timeline of leadership changes |
| `src/components/admin/leadership/AdhocCommitteesSheet.tsx` | Manage ad-hoc committees |

---

### Implementation Order

**Phase 1: Quick Fixes (Existing Components)**
1. Wire Edit Profile handler to `EditCommunityProfileDialog`
2. Wire Edit Photos handler to `EditCommunityPhotoDialog`
3. Wire Privacy/Notification/Rules to open `AdminSettingsTab`
4. Fix MeetingItem click to show meeting details

**Phase 2: Create Missing Components**
5. Create Leadership section sheets (History, Adhoc, Apply Results)
6. Wire executive detail view

---

### Technical Details

**1. Add imports to CommunityAdminDashboard.tsx:**
```tsx
import { EditCommunityProfileDialog } from "@/components/community/EditCommunityProfileDialog";
import { EditCommunityPhotoDialog } from "@/components/community/EditCommunityPhotoDialog";
import { ExecutiveDetailSheet } from "@/components/community/leadership/ExecutiveDetailSheet";
// New leadership sheets
import { ApplyElectionResultsSheet } from "@/components/admin/leadership/ApplyElectionResultsSheet";
import { LeadershipHistorySheet } from "@/components/admin/leadership/LeadershipHistorySheet";
import { AdhocCommitteesSheet } from "@/components/admin/leadership/AdhocCommitteesSheet";
```

**2. Add state variables:**
```tsx
const [showEditProfile, setShowEditProfile] = useState(false);
const [showEditPhotos, setShowEditPhotos] = useState(false);
const [selectedExecutive, setSelectedExecutive] = useState<typeof mockExecutives[0] | null>(null);
const [showExecutiveDetail, setShowExecutiveDetail] = useState(false);
const [showApplyResults, setShowApplyResults] = useState(false);
const [showLeadershipHistory, setShowLeadershipHistory] = useState(false);
const [showAdhocCommittees, setShowAdhocCommittees] = useState(false);
```

**3. Update AdminSettingsSection handlers:**
```tsx
<AdminSettingsSection
  onEditProfile={() => setShowEditProfile(true)}
  onEditPhotos={() => setShowEditPhotos(true)}
  onManageConstitution={() => setShowConstitution(true)}
  onManageResources={() => setShowResourcesDialog(true)}
  onPrivacySettings={() => setShowSettingsTab(true)} // Opens settings tab
  onNotificationSettings={() => setShowSettingsTab(true)} // Opens settings tab
  onCommunityRules={() => setShowSettingsTab(true)} // Opens settings tab
  onDemocraticPrivacy={() => setShowDemocraticPrivacy(true)}
/>
```

**4. Update AdminLeadershipSection handlers:**
```tsx
<AdminLeadershipSection
  executives={mockExecutives}
  onManageLeadership={() => setShowLeadershipDialog(true)}
  onApplyElectionResults={() => setShowApplyResults(true)}
  onViewChangeHistory={() => setShowLeadershipHistory(true)}
  onManageAdhoc={() => setShowAdhocCommittees(true)}
  onViewExecutive={(id) => {
    const exec = mockExecutives.find(e => e.id === id);
    if (exec) {
      setSelectedExecutive(exec);
      setShowExecutiveDetail(true);
    }
  }}
/>
```

**5. Fix MeetingItem in AdminMeetingSection.tsx:**
```tsx
// Update interface to add new prop
interface AdminMeetingSectionProps {
  // ... existing props
  onViewMeetingDetail?: (meetingId: string) => void;
}

// In MeetingItem usage (line 155)
<MeetingItem 
  key={meeting.id} 
  meeting={meeting} 
  onView={(id) => onViewUpcoming()} // Opens upcoming meetings sheet
/>
```

---

### New Component Template: ApplyElectionResultsSheet

```tsx
// Mobile-first bottom sheet for applying election results to leadership
<Sheet open={open} onOpenChange={onOpenChange}>
  <SheetContent side="bottom" className="h-[92vh] rounded-t-2xl p-0 flex flex-col">
    <SheetHeader className="px-4 pt-4 pb-3 border-b shrink-0">
      <SheetTitle>Apply Election Results</SheetTitle>
    </SheetHeader>
    <div className="flex-1 overflow-y-auto touch-auto px-4 py-4">
      {/* List of completed elections with "Apply" buttons */}
      {/* Each item shows position, winner, and action to update leadership */}
    </div>
  </SheetContent>
</Sheet>
```

---

### Expected Outcome

1. Clicking "Edit Profile" opens the profile editing drawer
2. Clicking "Edit Photos" opens the photo editing drawer
3. Privacy/Notification/Rules buttons open the Settings tab
4. Clicking upcoming meetings shows meeting details
5. Leadership section actions open dedicated interfaces
6. All previously inactive buttons now have functional responses

