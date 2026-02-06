
## Fix Inactive Meeting Management Buttons

### Problem Identified
The meeting management buttons in the Admin Dashboard are showing toast notifications instead of opening actual management interfaces. The buttons affected are:

- **Upcoming Meetings** - Currently shows "Opening upcoming meetings..." toast
- **Past Meetings** - Currently shows "Opening past meetings..." toast  
- **Attendance Records** - Currently shows "Opening attendance records..." toast
- **Resolutions** - Currently shows "Opening resolutions..." toast
- **Conflicts & Disputes** - Currently shows "Opening conflicts of interest..." toast
- **Roll-Call Management** - Currently shows "Opening roll-call management..." toast

**Root Cause:** In `CommunityAdminDashboard.tsx` (lines 228-233), these handlers only call `showToast()` instead of opening actual content.

---

### Solution Overview

Create mobile-first bottom sheet components that wrap the existing meeting tab components, then connect them to the dashboard buttons.

---

### Implementation Plan

#### 1. Create `AdminMeetingsDrawers.tsx`

**Location:** `src/components/admin/AdminMeetingsDrawers.tsx`

A single file containing all six mobile-optimized drawer components:

**Components to create:**
- `AdminUpcomingMeetingsSheet` - Wraps `UpcomingSchedulesList`
- `AdminPastMeetingsSheet` - Wraps `PreviousMeetingsList`
- `AdminAttendanceSheet` - Wraps `MeetingAttendanceTab`
- `AdminResolutionsSheet` - Wraps `MeetingResolutionsTab`
- `AdminConflictsSheet` - Wraps `MeetingConflictsTab`
- `AdminRollCallSheet` - Wraps `RollCallsPage` content

**Sheet Structure (92vh Mobile Pattern):**
```tsx
<Sheet open={open} onOpenChange={onOpenChange}>
  <SheetContent side="bottom" className="h-[92vh] rounded-t-2xl p-0">
    <SheetHeader className="px-4 pt-4 pb-3 border-b shrink-0">
      <SheetTitle className="flex items-center gap-2">
        <IconComponent className="h-5 w-5 text-primary" />
        Section Title
      </SheetTitle>
    </SheetHeader>
    <ScrollArea className="flex-1 h-[calc(92vh-60px)] overflow-y-auto touch-auto">
      <div className="px-4 py-4">
        {/* Wrapped existing component */}
      </div>
    </ScrollArea>
  </SheetContent>
</Sheet>
```

---

#### 2. Modify `CommunityAdminDashboard.tsx`

**Add new state variables:**
```tsx
const [showUpcomingMeetings, setShowUpcomingMeetings] = useState(false);
const [showPastMeetings, setShowPastMeetings] = useState(false);
const [showAttendance, setShowAttendance] = useState(false);
const [showResolutions, setShowResolutions] = useState(false);
const [showConflicts, setShowConflicts] = useState(false);
const [showRollCall, setShowRollCall] = useState(false);
```

**Update `AdminMeetingSection` props (lines 225-234):**
```tsx
<AdminMeetingSection
  stats={mockAdminStats}
  upcomingMeetings={mockUpcomingMeetings}
  onViewUpcoming={() => setShowUpcomingMeetings(true)}
  onViewPast={() => setShowPastMeetings(true)}
  onViewAttendance={() => setShowAttendance(true)}
  onViewResolutions={() => setShowResolutions(true)}
  onViewConflicts={() => setShowConflicts(true)}
  onManageRollCall={() => setShowRollCall(true)}
/>
```

**Render drawer components:**
```tsx
<AdminUpcomingMeetingsSheet 
  open={showUpcomingMeetings} 
  onOpenChange={setShowUpcomingMeetings} 
/>
<AdminPastMeetingsSheet 
  open={showPastMeetings} 
  onOpenChange={setShowPastMeetings} 
/>
<AdminAttendanceSheet 
  open={showAttendance} 
  onOpenChange={setShowAttendance} 
/>
<AdminResolutionsSheet 
  open={showResolutions} 
  onOpenChange={setShowResolutions} 
/>
<AdminConflictsSheet 
  open={showConflicts} 
  onOpenChange={setShowConflicts} 
/>
<AdminRollCallSheet 
  open={showRollCall} 
  onOpenChange={setShowRollCall} 
/>
```

---

### Component Details

#### AdminUpcomingMeetingsSheet
- **Icon:** Clock
- **Title:** "Upcoming Meetings"
- **Content:** Wraps `UpcomingSchedulesList` with meetings data from `mockMeetings`
- **Features:** Tabs for Meetings, Events, Invitations

#### AdminPastMeetingsSheet
- **Icon:** CheckCircle
- **Title:** "Past Meetings"
- **Content:** Wraps `PreviousMeetingsList` with completed meetings
- **Features:** Chat Messages and Download tabs

#### AdminAttendanceSheet
- **Icon:** Users
- **Title:** "Attendance Records"
- **Content:** Wraps `MeetingAttendanceTab`
- **Features:** Meeting selection, status filters (Present/Late/Absent/Excused), export to TXT

#### AdminResolutionsSheet
- **Icon:** FileText
- **Title:** "Meeting Resolutions"
- **Content:** Wraps `MeetingResolutionsTab`
- **Features:** Status filters (Passed/Rejected/Tabled), vote breakdowns

#### AdminConflictsSheet
- **Icon:** Scale
- **Title:** "Conflicts & Disputes"
- **Content:** Wraps `MeetingConflictsTab`
- **Features:** Status filters (Declared/Resolved/Dismissed), resolution details

#### AdminRollCallSheet
- **Icon:** Users
- **Title:** "Roll-Call Management"
- **Content:** Adapted from `RollCallsPage` with admin-specific actions
- **Features:** Active roll call controls, attendance history, mark/report buttons

---

### Files to Create/Modify

| File | Action |
|------|--------|
| `src/components/admin/AdminMeetingsDrawers.tsx` | **CREATE** - All 6 drawer components |
| `src/pages/CommunityAdminDashboard.tsx` | **MODIFY** - Add states and render drawers |

---

### Mobile Optimizations

Following established patterns:
- Sheet uses `h-[92vh]` with `rounded-t-2xl`
- Container uses `p-0` with internal padding on scrollable body
- `ScrollArea` with `overflow-y-auto touch-auto` for proper mobile scrolling
- Non-shrinking header with `shrink-0` class
- 44px minimum touch targets for interactive elements
- Full-width buttons on mobile

---

### Data Sources

All components will use existing mock data:
- `mockMeetings` from `@/data/meetingsData`
- `mockAttendance`, `mockResolutions`, `mockConflictsOfInterest` from `@/data/meetingsData`
- `activeRollCall`, `rollCallHistory` from `@/data/rollCallsData`
- `mockUpcomingMeetings` from `@/data/adminDashboardData`

---

### Expected Outcome

After implementation:
1. Tapping "Upcoming Meetings" opens a 92vh bottom sheet showing upcoming meetings, events, and invitations
2. Tapping "Past Meetings" opens a sheet with chat messages and download options for completed meetings
3. Tapping "Attendance Records" opens a full attendance management interface with filters and export
4. Tapping "Resolutions" opens the resolutions list with voting results
5. Tapping "Conflicts & Disputes" opens the conflicts management interface
6. Tapping "Roll-Call Management" opens roll call controls for admin-level attendance management

All buttons will properly respond with their corresponding data interfaces instead of just showing toast notifications.
