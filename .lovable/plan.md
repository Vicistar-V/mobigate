

# Fix: Inactive Menu Items, Meeting Cards, and Executive Profiles on Mobile

## Problem

Three areas in the Admin Dashboard feel "inactive" on mobile -- tapping does nothing or feels unresponsive:

1. **Meeting menu items** (Upcoming Meetings, Past Meetings, Attendance Records, etc.) -- lack `touch-manipulation` CSS class, causing a 300ms tap delay on mobile browsers that makes them feel dead
2. **Upcoming meeting cards** (Q1 General Assembly, Executive Committee, Finance Committee Review) -- same touch delay issue, plus they all call a generic `onViewUpcoming()` instead of opening the specific meeting detail
3. **Leadership executive cards** (Barr. Ngozi Okonkwo, Mr. Chidi Okoro, Mrs. Ada Nwosu) -- same touch delay issue; the click handler is wired correctly but the 300ms delay makes it feel broken

## Root Cause

All interactive `<button>` elements in these sections are missing the `touch-manipulation` class. On mobile browsers, this causes a noticeable delay between tap and response, making items feel inactive. Additionally, some items lack visual tap feedback (`active:bg-muted/70`).

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/admin/AdminMeetingSection.tsx` | Add `touch-manipulation` and active feedback to all 7 menu buttons + meeting cards |
| `src/components/admin/AdminLeadershipSection.tsx` | Add `touch-manipulation` and active feedback to ExecutiveCard + 4 action buttons |
| `src/components/admin/AdminElectionSection.tsx` | Add `touch-manipulation` and active feedback to all 10 action buttons |

## Detailed Changes

### 1. AdminMeetingSection.tsx

**MeetingItem component (line 22-36)**:
- Add `touch-manipulation active:bg-muted/70` to the button className
- This is the component that renders each upcoming meeting card (Q1 General Assembly, etc.)

**Menu buttons (lines 116-143)** -- all 7 buttons:
- Upcoming Meetings, Past Meetings, Attendance Records, Resolutions, Conflicts and Disputes, Roll-Call Management, Minutes Settings
- Add `touch-manipulation active:bg-muted/70` to each button's className
- These are the list-style action items circled in image 1

### 2. AdminLeadershipSection.tsx

**ExecutiveCard component (line 23-39)**:
- Add `touch-manipulation active:bg-muted/70` to the button className
- These are the member cards circled in image 3 (Barr. Ngozi, Mr. Chidi, Mrs. Ada)

**Action buttons (lines 184-199)** -- all 4 buttons:
- Manage Leadership, Apply Election Results, View Change History, Manage Ad-hoc Committees
- Add `touch-manipulation active:bg-muted/70` to each button's className

### 3. AdminElectionSection.tsx

**Action buttons (lines 229-271)** -- all 10 buttons:
- View Campaigns, View Results, Manage Accreditation, Process Clearances, Manage Primaries, Campaign Royalties, Voting Settings, Campaign Settings, Announce Winners
- Add `touch-manipulation active:bg-muted/70` to each button's className

## What This Fixes

- **300ms tap delay eliminated**: `touch-manipulation` tells the browser to skip the double-tap-to-zoom delay, making taps register instantly
- **Visual feedback on tap**: `active:bg-muted/70` gives immediate visual confirmation that the tap was registered, preventing users from thinking the item is broken
- These are applied consistently across all three admin sections for a uniform mobile experience

## Technical Notes

- The underlying click handlers are already wired correctly in `CommunityAdminDashboard.tsx` (meeting sheets open via state setters, executive detail opens via `setSelectedExecutive` + `setShowExecutiveDetail`)
- The meeting cards call `onViewUpcoming()` which opens the Upcoming Meetings sheet -- this is the correct behavior since individual meeting detail views aren't implemented as separate routes
- No structural/layout changes needed -- this is purely a mobile touch responsiveness fix

