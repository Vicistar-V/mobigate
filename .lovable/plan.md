
# Community Settings - Democratic Governance System Implementation

## Overview

This plan implements a comprehensive **Community Settings** section in the Community Menu that enables democratic governance of all community settings. The system follows these core principles:

1. **All settings visible to valid members** for approval/disapproval
2. **60% threshold** required for settings to become active
3. **Admins manage settings**, but **members can disapprove and recommend alternatives**
4. **Member-recommended settings with 60% majority automatically override admin settings**
5. **Settings changes trigger prompts on all member panels** for approval/disapproval

---

## Current State Analysis

### Existing Infrastructure
- `communityPrivacyVoting.ts` - Types for democratic voting on privacy settings
- `MemberPrivacyVotingSheet.tsx` - Member-facing voting UI for privacy settings only
- `VotersListPrivacySettings.tsx` - Admin view of voting results
- `AdminSettingsSection.tsx` - Admin settings management with multi-signature authorization
- Privacy settings limited to 5 categories (voters list, member list, financial records, meeting minutes, election results)

### Gaps Requiring Implementation
1. **No "Community Settings" section in Community Menu** - Only "Member Settings" exists for privacy voting
2. **No 60% threshold system** - Current system uses 50% majority
3. **No disapproval mechanism** - Members can only vote, not disapprove admin changes
4. **No recommendation system** - Members cannot propose alternative settings
5. **No notification/prompt system** - Members aren't notified of admin setting changes
6. **Limited setting scope** - Only privacy settings are votable, not all community settings

---

## New Types & Data Structures

### File: `src/types/communityDemocraticSettings.ts` (NEW)

```text
Define comprehensive types for the democratic settings system:

CommunitySettingCategory:
  - privacy_settings
  - general_settings
  - election_settings
  - finance_settings
  - membership_settings
  - posting_settings
  - meeting_settings

DemocraticSettingStatus:
  - pending_approval (admin proposed, awaiting 60%)
  - active (approved by 60%+ members)
  - disapproved (60%+ members disapproved)
  - member_override (member recommendation with 60%+ replaced admin setting)

AdminSettingProposal:
  - proposalId
  - settingKey
  - settingCategory
  - currentValue
  - proposedValue
  - proposedBy (admin info)
  - proposedAt
  - approvalCount
  - disapprovalCount
  - approvalPercentage
  - disapprovalPercentage
  - status
  - effectiveDate
  - expiresAt (if not approved within X days)

MemberRecommendation:
  - recommendationId
  - settingKey
  - recommendedValue
  - recommendedBy (member info)
  - recommendedAt
  - supportCount
  - supportPercentage
  - isActive

MemberSettingVote:
  - voteId
  - proposalId / recommendationId
  - memberId
  - voteType: 'approve' | 'disapprove'
  - recommendedAlternative (optional)
  - votedAt
  - updatedAt
```

### File: `src/data/communityDemocraticSettingsData.ts` (NEW)

```text
Mock data for:
- All community settings organized by category
- Pending admin proposals awaiting approval
- Member recommendations with support counts
- Vote distribution for each setting
- Notification queue for member prompts
```

---

## UI Components to Create

### 1. Community Settings Sheet (Member-Facing)
**File:** `src/components/community/settings/CommunitySettingsSheet.tsx`

```text
A full-height mobile sheet containing:

HEADER:
  - "Community Settings" title with Settings icon
  - Badge showing pending approvals count

SECTIONS (Accordion):
  1. Pending Admin Changes (with notification badge)
     - Cards for each pending admin proposal
     - Approve/Disapprove buttons
     - "Recommend Alternative" option
     
  2. Active Settings by Category
     - Privacy Settings
     - General Settings  
     - Election Settings
     - Finance Settings
     - Membership Settings
     - Posting Settings
     - Meeting Settings
     
  3. Member Recommendations
     - List of member-proposed alternatives
     - Support/Unsupport buttons
     - Progress toward 60% threshold

FOOTER:
  - Info card explaining 60% threshold rules
  - "Members' votes determine all settings"
```

### 2. Admin Setting Proposal Card
**File:** `src/components/community/settings/AdminSettingProposalCard.tsx`

```text
Mobile-optimized card for displaying pending admin proposals:

LAYOUT:
  - Setting name & category badge
  - Current value vs Proposed value (visual comparison)
  - Proposed by admin info + timestamp
  - Approval progress bar (needs 60%)
  - Disapproval count
  
ACTIONS:
  - Approve button (green)
  - Disapprove button (red)
  - "Recommend Alternative" button (opens recommendation dialog)
```

### 3. Recommend Alternative Dialog
**File:** `src/components/community/settings/RecommendAlternativeDialog.tsx`

```text
Dialog/Drawer for members to recommend alternative settings:

CONTENT:
  - Current setting value (read-only)
  - Admin's proposed value (read-only)
  - Input for member's recommended value
  - Reason for recommendation (optional textarea)
  
ACTIONS:
  - Submit Recommendation
  - Cancel
```

### 4. Member Recommendations List
**File:** `src/components/community/settings/MemberRecommendationsList.tsx`

```text
List of member-proposed alternatives:

EACH ITEM:
  - Setting name
  - Recommended value
  - Recommender info
  - Support count + progress toward 60%
  - Support/Unsupport toggle button
  
SPECIAL HANDLING:
  - If recommendation reaches 60%, highlight with "Majority Reached" badge
  - Show countdown if close to threshold
```

### 5. Settings Change Notification Banner
**File:** `src/components/community/settings/SettingsChangeNotificationBanner.tsx`

```text
Sticky banner for pending approval prompts:

DISPLAY:
  - Alert icon + "X Settings Pending Your Approval"
  - "Review Now" button
  
BEHAVIOR:
  - Appears when user has unreviewed admin proposals
  - Dismisses after user views Community Settings
  - Re-appears for new proposals
```

### 6. Community Settings Admin View
**File:** `src/components/admin/settings/CommunitySettingsAdminView.tsx`

```text
Enhanced admin settings panel showing:

FOR EACH SETTING:
  - Current value (with member approval status)
  - Edit button (triggers multi-sig + member approval flow)
  - Member approval percentage
  - Active member recommendations
  
WARNING CARD:
  - "Settings changes require 60% member approval to take effect"
  - "Member recommendations with 60% support automatically override"
```

---

## Integration Points

### 1. Add to Community Menu
**File:** `src/components/community/CommunityMainMenu.tsx`

```text
ADD new AccordionItem "Community Settings" as LAST item:

Position: After "Mobi-Merchant" section (line ~1007)

Content:
  - "View All Settings" button → opens CommunitySettingsSheet
  - Badge showing pending approval count
  - "How Settings Work" info text

State:
  - Add showCommunitySettings state
  - Add CommunitySettingsSheet to dialog renders
```

### 2. Add Notification Banner to Community Page
**File:** `src/pages/Community.tsx` or `src/pages/CommunityDetail.tsx`

```text
Add SettingsChangeNotificationBanner component:
  - Shows when member has pending setting approvals
  - Positioned below header or as floating banner
```

### 3. Update Admin Settings Section
**File:** `src/components/admin/AdminSettingsSection.tsx`

```text
Modify to integrate democratic approval:
  - Show approval status for each setting
  - Add "Pending Approval" badges
  - Show member override warnings
  - Link to view member recommendations
```

---

## Logic & Calculation Utilities

### File: `src/lib/democraticSettingsUtils.ts` (NEW)

```typescript
// Core calculation functions:

/**
 * Calculate if setting has reached 60% approval
 */
function hasReached60PercentApproval(
  approvalCount: number, 
  totalValidMembers: number
): boolean

/**
 * Calculate if setting has reached 60% disapproval
 */
function hasReached60PercentDisapproval(
  disapprovalCount: number, 
  totalValidMembers: number
): boolean

/**
 * Get winning recommendation (highest support among 60%+ recommendations)
 */
function getWinningRecommendation(
  recommendations: MemberRecommendation[], 
  totalValidMembers: number
): MemberRecommendation | null

/**
 * Determine final setting value based on votes
 */
function determineFinalSettingValue(
  adminProposal: AdminSettingProposal,
  recommendations: MemberRecommendation[],
  totalValidMembers: number
): { value: any; source: 'admin' | 'member_recommendation' | 'unchanged' }

/**
 * Get all settings requiring member attention
 */
function getPendingSettingsForMember(
  memberId: string,
  proposals: AdminSettingProposal[]
): AdminSettingProposal[]
```

---

## Notification System

### Member Prompt Behavior

1. **When Admin Changes Setting:**
   - System creates `AdminSettingProposal` with `pending_approval` status
   - All valid members receive notification
   - Setting does NOT take effect until 60% approve

2. **Member Reviews Setting:**
   - Can Approve (adds to approval count)
   - Can Disapprove (adds to disapproval count)
   - Can Recommend Alternative (creates `MemberRecommendation`)

3. **60% Approval Reached:**
   - Setting becomes `active`
   - Applied to both Admin Panel and Member Panels
   - Notification sent: "Setting X has been approved"

4. **60% Disapproval Reached:**
   - If recommendations exist, the one with highest 60%+ support wins
   - Setting becomes `member_override`
   - Admin setting is replaced
   - Notification sent: "Members have overridden admin setting"

5. **Disapproval Without Recommendation:**
   - Setting remains unchanged (current value persists)
   - Admin can propose new value

---

## Settings Categories & Scope

### Complete Settings Coverage

| Category | Settings Included |
|----------|-------------------|
| **Privacy** | Community finances, member financial status, complaints, meeting recordings, general posts, member comments |
| **General** | Handover time, account manager, download fees, access fees, complaint box fee, posting fee |
| **Election** | Who can vote, view results, view accredited voters, download resources |
| **Membership** | Who can add members, approve new members, remove/suspend/block |
| **Posting** | Who can post, edit/pause/delete/approve content |
| **Meeting** | Attendance register, meeting schedules, frequency |
| **Promotion** | Community suggestion visibility, community visibility, guest access |

---

## UI/UX Mobile-First Design

### Community Settings Sheet Layout

```text
+--------------------------------+
|  < Community Settings      X  |
|  [3 Pending Approvals badge]  |
+--------------------------------+
|                                |
|  [!] PENDING ADMIN CHANGES (3) |
|  +----------------------------+|
|  | Privacy Setting Change     ||
|  | Current: Valid Members     ||
|  | → Proposed: All Members    ||
|  | [====60%====     ] 45%    ||
|  | [Approve] [Disapprove]     ||
|  +----------------------------+|
|                                |
|  v ACTIVE SETTINGS             |
|    > Privacy Settings          |
|    > General Settings          |
|    > Election Settings         |
|    > Finance Settings          |
|    > Membership Settings       |
|                                |
|  v MEMBER RECOMMENDATIONS (2)  |
|  +----------------------------+|
|  | Meeting Download Fee: M0   ||
|  | By: John Doe | 52% support ||
|  | [Support] [Unsupport]      ||
|  +----------------------------+|
|                                |
|  +----------------------------+|
|  | ℹ How Settings Work        ||
|  | • 60% approval required    ||
|  | • Members can recommend    ||
|  | • Majority wins            ||
|  +----------------------------+|
+--------------------------------+
```

---

## Files to Create (Summary)

| File | Purpose |
|------|---------|
| `src/types/communityDemocraticSettings.ts` | Type definitions for democratic governance |
| `src/data/communityDemocraticSettingsData.ts` | Mock data for all settings and proposals |
| `src/lib/democraticSettingsUtils.ts` | Calculation and utility functions |
| `src/components/community/settings/CommunitySettingsSheet.tsx` | Main member-facing settings sheet |
| `src/components/community/settings/AdminSettingProposalCard.tsx` | Card for pending admin proposals |
| `src/components/community/settings/RecommendAlternativeDialog.tsx` | Dialog for member recommendations |
| `src/components/community/settings/MemberRecommendationsList.tsx` | List of member recommendations |
| `src/components/community/settings/SettingsChangeNotificationBanner.tsx` | Notification banner component |
| `src/components/community/settings/ActiveSettingsList.tsx` | List of active settings by category |
| `src/components/admin/settings/CommunitySettingsAdminView.tsx` | Enhanced admin settings view |

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/community/CommunityMainMenu.tsx` | Add "Community Settings" accordion section |
| `src/components/admin/AdminSettingsSection.tsx` | Add approval status indicators |
| `src/types/communityPrivacyVoting.ts` | Extend to support 60% threshold |

---

## Implementation Order

1. **Phase 1: Types & Data**
   - Create type definitions
   - Create mock data with sample proposals
   - Create utility functions

2. **Phase 2: Core Components**
   - CommunitySettingsSheet (main container)
   - AdminSettingProposalCard
   - ActiveSettingsList
   - MemberRecommendationsList

3. **Phase 3: Interactive Components**
   - RecommendAlternativeDialog
   - Vote handling logic
   - Progress calculations

4. **Phase 4: Integration**
   - Add to CommunityMainMenu
   - Update AdminSettingsSection
   - Add notification banner

5. **Phase 5: Polish**
   - Mobile optimization
   - Animation/transitions
   - Edge case handling
