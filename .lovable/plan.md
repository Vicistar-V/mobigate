
# Mobigate Admin Dashboard & Democratic Privacy Settings Implementation Plan

## Overview

This plan implements:
1. **Democratic Privacy Settings** - Community settings determined by member voting with majority rule
2. **Mobigate Admin Dashboard** - Platform-level administration (separate from Community Admin)
3. **Nomination Fee Configuration** - Mobigate-only settings for election fees and service charges
4. **Declare for Election Button** - Member access point for nomination process

---

## Part 1: Democratic Privacy Settings System

### 1.1 New Type Definitions

**File: `src/types/communityPrivacyVoting.ts`**

```typescript
// Privacy voting options
type VotersListPrivacy = 'nobody' | 'only_admins' | 'valid_members' | 'all_members';

interface PrivacySetting {
  settingId: string;
  settingName: string;
  settingDescription: string;
  currentValue: VotersListPrivacy;
  voteCounts: {
    nobody: number;
    only_admins: number;
    valid_members: number;
    all_members: number;
  };
  totalVotes: number;
  memberVote?: VotersListPrivacy;
  lastUpdated: Date;
  effectiveDate: Date;
}

interface CommunitySettingsVote {
  settingId: string;
  memberId: string;
  selectedOption: string;
  votedAt: Date;
}

interface DemocraticSettingsConfig {
  communityId: string;
  settings: PrivacySetting[];
  votingEnabled: boolean;
  minimumVotesRequired: number;
  lastRecalculatedAt: Date;
}
```

### 1.2 Community Settings Privacy Section

**File: `src/components/admin/settings/VotersListPrivacySettings.tsx`**

Admin view showing:
- Current setting with majority indicator
- Vote distribution breakdown (pie chart or progress bars)
- Member participation rate
- Setting becomes permanent once majority is established

### 1.3 Member Settings Privacy Section

**File: `src/components/community/settings/MemberPrivacyVotingSheet.tsx`**

Mobile-first sheet for members to:
- View current community privacy settings
- See their current vote (if any)
- Cast or change their vote
- View real-time vote distribution
- Understand that majority rule applies

**UI Flow:**
1. Member opens Settings from their profile
2. Sees "Community Privacy Settings" section
3. For each setting (e.g., Voters' List), sees options:
   - Nobody
   - Only Admins
   - Valid Members
   - All Members
4. Selects their preference
5. Vote is recorded and totals update
6. Majority option becomes the active setting

---

## Part 2: Mobigate Admin Dashboard

### 2.1 New Page & Route

**File: `src/pages/admin/MobigateAdminDashboard.tsx`**

Platform-level administration page with:
- Dashboard header with Mobigate branding
- Stats cards (total communities, total users, total transactions)
- Platform revenue overview
- System health indicators

### 2.2 Route Addition

**File: `src/App.tsx`** - Add route:
```typescript
<Route path="/mobigate-admin" element={<MobigateAdminDashboard />} />
```

### 2.3 Mobigate Admin Dashboard Sections

**Tabs/Sections:**
1. **Overview** - Platform stats and revenue
2. **Election Settings** - Nomination fees, service charges
3. **Communities** - Manage all communities
4. **Users** - Platform user management
5. **Revenue** - Financial reports and royalty tracking
6. **System** - Platform configuration

---

## Part 3: Nomination Fee & Service Charge Configuration

### 3.1 Mobigate Election Fee Settings Component

**File: `src/components/mobigate/NominationFeeSettingsSection.tsx`**

Mobigate-only settings (NOT visible to Community Admins):

**Fee Configuration:**
- Office-specific nomination fees (already exists in `nominationFeesData.ts`)
- Edit capability for each office fee
- Bulk update option

**Service Charge Configuration:**
- Service Charge Percentage slider (15% - 30% range)
- Current percentage display with large number
- Fee breakdown preview showing:
  - Example: If Nomination Fee = M50,000
  - Service Charge (20%) = M10,000
  - Total Debited = M60,000
  - To Community Account = M50,000
  - To Mobigate = M10,000 (service charge)

**UI Components:**
```
+--------------------------------------+
| Service Charge Rate                  |
+--------------------------------------+
|                                      |
|              20%                     |
|                                      |
| [========|===========] 15% --- 30%   |
|                                      |
| Preview:                             |
| Nomination Fee:    M50,000           |
| Service Charge:    M10,000 (20%)     |
| Total Debited:     M60,000           |
+--------------------------------------+
| Community Receives: M50,000          |
| Mobigate Receives:  M10,000          |
+--------------------------------------+
| [Save Changes]                       |
+--------------------------------------+
```

### 3.2 Update Nomination Types

**File: `src/types/nominationProcess.ts`** - Add:
```typescript
interface MobigateNominationConfig {
  serviceChargePercent: number; // 15-30%
  minimumServiceChargePercent: number; // 15
  maximumServiceChargePercent: number; // 30
  lastUpdatedAt: Date;
  lastUpdatedBy: string;
}
```

### 3.3 Update Nomination Fee Data

**File: `src/data/nominationFeesData.ts`** - Add:
```typescript
export const mobigateNominationConfig: MobigateNominationConfig = {
  serviceChargePercent: 20,
  minimumServiceChargePercent: 15,
  maximumServiceChargePercent: 30,
  lastUpdatedAt: new Date("2025-01-01"),
  lastUpdatedBy: "Mobigate Admin"
};

// Update fee calculation to include service charge
export function calculateTotalNominationCost(officeId: string) {
  const fee = getNominationFee(officeId);
  if (!fee) return null;
  
  const serviceCharge = fee.feeInMobi * (mobigateNominationConfig.serviceChargePercent / 100);
  return {
    nominationFee: fee.feeInMobi,
    serviceCharge,
    total: fee.feeInMobi + serviceCharge,
    communityReceives: fee.feeInMobi,
    mobigateReceives: serviceCharge
  };
}
```

---

## Part 4: Declare for Election Button Integration

### 4.1 Member Dashboard Integration

**File: `src/components/community/CommunityElectionTab.tsx`**

Add prominent "Declare for Election" button:
- Position: Top of the navigation area OR as a floating action button
- Style: Primary/accent color to stand out
- Icon: Vote/Flag icon
- Opens `DeclarationOfInterestSheet`

### 4.2 Add to Member Profile Menu

**File: (Member profile settings component)**

Add "Declare for Election" option in the community actions section for easy access from the member's personal menu.

---

## Part 5: Remove Conflicting Tab

### 5.1 Clean Up Election Settings Tab

The current `ElectionManagementPage.tsx` has a Settings tab with Campaign Fee Distribution that appears to be accessible to Community Admins. Based on the requirement:

**Action:** The Nomination Fee and Service Charge settings are Mobigate-only. The existing Campaign Fee Distribution can remain for Community Admins to view (but not edit Mobigate-controlled settings).

**Clarification:**
- **Community Admins CAN:** View campaign fee distribution (Community vs Mobigate split)
- **Community Admins CANNOT:** Edit nomination fees, service charge percentages
- **Mobigate Admins CAN:** Control all fee structures

---

## Part 6: Integration Summary

### Files to Create (8 files):

1. `src/types/communityPrivacyVoting.ts` - Democratic privacy types
2. `src/data/communityPrivacyVotingData.ts` - Mock voting data
3. `src/components/admin/settings/VotersListPrivacySettings.tsx` - Admin privacy view
4. `src/components/community/settings/MemberPrivacyVotingSheet.tsx` - Member voting UI
5. `src/pages/admin/MobigateAdminDashboard.tsx` - Platform admin page
6. `src/components/mobigate/MobigateAdminHeader.tsx` - Platform admin header
7. `src/components/mobigate/NominationFeeSettingsSection.tsx` - Fee configuration
8. `src/components/mobigate/ServiceChargeConfigCard.tsx` - Service charge slider

### Files to Modify (6 files):

1. `src/App.tsx` - Add Mobigate admin route
2. `src/types/nominationProcess.ts` - Add Mobigate config types
3. `src/data/nominationFeesData.ts` - Add service charge calculation
4. `src/components/community/CommunityElectionTab.tsx` - Add Declare button
5. `src/components/admin/AdminSettingsSection.tsx` - Add privacy voting link
6. `src/components/community/elections/DeclarationOfInterestSheet.tsx` - Update fee display with service charge

---

## Technical Details

### Democratic Settings Logic

```typescript
// Calculate majority and apply setting
function calculateMajoritySetting(setting: PrivacySetting): {
  winner: VotersListPrivacy;
  percentage: number;
  isMajority: boolean;
} {
  const { voteCounts, totalVotes } = setting;
  
  const entries = Object.entries(voteCounts) as [VotersListPrivacy, number][];
  const sorted = entries.sort((a, b) => b[1] - a[1]);
  const [winner, winnerVotes] = sorted[0];
  const percentage = totalVotes > 0 ? (winnerVotes / totalVotes) * 100 : 0;
  
  return {
    winner,
    percentage,
    isMajority: percentage > 50
  };
}
```

### Service Charge Application

The service charge is applied automatically when a member declares for election:
1. Member selects office position
2. System calculates: Nomination Fee + Service Charge (%)
3. Total is debited from member's Mobi wallet
4. Nomination Fee goes to Community Account
5. Service Charge goes to Mobigate

### Mobile-First Design

All new components follow:
- Sheet/Drawer patterns for mobile modals
- Touch-friendly inputs (min 44px height)
- Large readable text for settings
- Progress indicators for voting percentages
- Clear visual hierarchy

---

## Mock Data Initialization

### Voters' List Privacy Default

```typescript
const mockVotersListSetting: PrivacySetting = {
  settingId: "voters-list-privacy",
  settingName: "Voters' List Visibility",
  settingDescription: "Who can see the list of voters and their voting records",
  currentValue: "valid_members",
  voteCounts: {
    nobody: 5,
    only_admins: 12,
    valid_members: 28,
    all_members: 8
  },
  totalVotes: 53,
  lastUpdated: new Date("2025-01-15"),
  effectiveDate: new Date("2025-01-16")
};
```

This implementation creates a complete democratic governance system where member preferences directly influence community settings, while maintaining clear separation between Community Admin and Mobigate Admin privileges.
