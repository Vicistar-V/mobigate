
# Comprehensive Implementation Plan: Community Settings Democratic Governance & Dual Currency Integration Fixes

## Inspection Summary

### Community Settings Democratic Governance System - FULLY IMPLEMENTED
The democratic governance system has been successfully implemented with all required components:

**Created Files (All Complete):**
| File | Status |
|------|--------|
| `src/types/communityDemocraticSettings.ts` | Complete - All types, interfaces, and 60% threshold config |
| `src/lib/democraticSettingsUtils.ts` | Complete - 12 utility functions for threshold calculations |
| `src/data/communityDemocraticSettingsData.ts` | Complete - Mock data for proposals, recommendations, settings |
| `src/components/community/settings/CommunitySettingsSheet.tsx` | Complete - Main member-facing sheet with all features |
| `src/components/community/settings/AdminSettingProposalCard.tsx` | Complete - Voting cards with progress bars and 60% marker |
| `src/components/community/settings/ActiveSettingsList.tsx` | Complete - Settings display with approval status |
| `src/components/community/settings/MemberRecommendationsList.tsx` | Complete - Support/unsupport with majority tracking |
| `src/components/community/settings/RecommendAlternativeDialog.tsx` | Complete - Member recommendation submission |
| `src/components/community/settings/SettingsChangeNotificationBanner.tsx` | Complete - Notification component (available but not yet integrated into main view) |
| `src/components/admin/settings/CommunitySettingsAdminView.tsx` | Complete - Admin dashboard view (available but not yet used in admin panel) |

**Modified Files (Integration Complete):**
| File | Status |
|------|--------|
| `src/components/community/CommunityMainMenu.tsx` | Complete - "Community Settings" section added as last item with emerald styling, pending count badge, and sheet trigger |
| `src/components/admin/AdminSettingsSection.tsx` | Complete - Democratic governance status card, pending approvals badge, member override badges |

---

## Gaps Requiring Implementation

### Gap 1: Notification Banner Not Integrated into Community View
The `SettingsChangeNotificationBanner` component exists but isn't integrated into the main community page to notify members of pending settings.

**Files to Modify:**
- `src/pages/Community.tsx` or `src/pages/CommunityDetail.tsx`

### Gap 2: Admin View Component Not Integrated
The `CommunitySettingsAdminView` component exists but isn't used in the admin dashboard to show democratic governance status.

**Files to Modify:**
- `src/pages/CommunityAdminDashboard.tsx` (if exists) or relevant admin section

### Gap 3: Dual Currency Display - Remaining Files
The following files still use legacy `M{amount.toLocaleString()}` format without the dual currency display:

| File | Lines to Update |
|------|-----------------|
| `src/components/community/DonationDialog.tsx` | Lines 74-77, 185 |
| `src/components/community/CommunityQuizDialog.tsx` | Lines 49-52, 63-66, 119, 177, 181, 223-224, 274, 324, 342 |
| `src/components/community/MobigateQuizDialog.tsx` | Lines 50-53, 64-67 |
| `src/components/community/elections/CheckIndebtednessSheet.tsx` | Lines 31-34, 124 |
| `src/components/community/meetings/MinutesDownloadDialog.tsx` | Line 247 |
| `src/components/community/finance/WalletWithdrawDialog.tsx` | Lines 65-67, 95-97, 152, 172 |
| `src/components/community/fundraiser/DonationSheet.tsx` | Lines 45-59 |

---

## Implementation Plan

### Phase 1: Integrate Notification Banner (Priority: Medium)

**File: `src/pages/Community.tsx` or `src/pages/CommunityDetail.tsx`**

1. Import the notification banner component:
```typescript
import { SettingsChangeNotificationBanner } from "@/components/community/settings/SettingsChangeNotificationBanner";
import { getPendingProposalsCount } from "@/data/communityDemocraticSettingsData";
```

2. Add state for showing community settings sheet:
```typescript
const [showCommunitySettings, setShowCommunitySettings] = useState(false);
const pendingSettingsCount = getPendingProposalsCount();
```

3. Add banner below header:
```tsx
{pendingSettingsCount > 0 && (
  <SettingsChangeNotificationBanner
    pendingCount={pendingSettingsCount}
    onReviewClick={() => setShowCommunitySettings(true)}
  />
)}
```

4. Add CommunitySettingsSheet at bottom of component render

### Phase 2: Complete Dual Currency Integration (Priority: High)

For each file, apply this pattern:

**Import Statement:**
```typescript
import { formatMobiAmount, formatLocalAmount } from "@/lib/mobiCurrencyTranslation";
```

**Display Pattern (stacked - for cards):**
```tsx
<p className="font-bold">{formatMobiAmount(amount)}</p>
<p className="text-xs text-muted-foreground">≈ {formatLocalAmount(amount, "NGN")}</p>
```

**Display Pattern (inline - for toasts/messages):**
```tsx
`${formatMobiAmount(amount)} (≈ ${formatLocalAmount(amount, "NGN")})`
```

---

### Phase 2a: Update DonationDialog.tsx

**File:** `src/components/community/DonationDialog.tsx`

1. Add import:
```typescript
import { formatMobiAmount, formatLocalAmount } from "@/lib/mobiCurrencyTranslation";
```

2. Replace `formatMobiAmount` function (lines 74-77) with import from utility

3. Update preset buttons (line 185):
```tsx
// Before
<span className="text-xs sm:text-sm font-bold">M{preset.toLocaleString()}</span>

// After
<span className="text-xs sm:text-sm font-bold">{formatMobiAmount(preset)}</span>
<span className="text-[10px] text-muted-foreground">≈ {formatLocalAmount(preset, "NGN")}</span>
```

### Phase 2b: Update CommunityQuizDialog.tsx

**File:** `src/components/community/CommunityQuizDialog.tsx`

1. Add import for `formatMobiAmount` and `formatLocalAmount`

2. Update all instances:
   - Line 51: Toast description
   - Line 65-66: Toast description for win
   - Lines 119, 177, 181, 223-224: Wallet balance and quiz amounts
   - Lines 274, 324, 342: Player stats and contributions

### Phase 2c: Update MobigateQuizDialog.tsx

**File:** `src/components/community/MobigateQuizDialog.tsx`

1. Add import for formatting utilities

2. Update toast messages (lines 50-53, 64-67)

### Phase 2d: Update CheckIndebtednessSheet.tsx

**File:** `src/components/community/elections/CheckIndebtednessSheet.tsx`

1. Add import for formatting utilities

2. Update toast message (line 33) and display text (line 124)

### Phase 2e: Update MinutesDownloadDialog.tsx

**File:** `src/components/community/meetings/MinutesDownloadDialog.tsx`

1. Add import for formatting utilities

2. Update wallet balance display (line 247)

### Phase 2f: Update WalletWithdrawDialog.tsx

**File:** `src/components/community/finance/WalletWithdrawDialog.tsx`

1. Add import for formatting utilities

2. Update:
   - Toast messages (lines 65-67, 95-97)
   - Available balance display (line 152)
   - Minimum withdrawal display (line 172)

### Phase 2g: Update DonationSheet.tsx (Fundraiser)

**File:** `src/components/community/fundraiser/DonationSheet.tsx`

1. Add import for formatting utilities

2. Update conversion display functions (lines 45-59)

---

## Verification Checklist

After implementation, verify:

### Community Settings Democratic Governance
- [x] Types and interfaces defined with 60% threshold config
- [x] Utility functions for all threshold calculations
- [x] Mock data includes proposals, recommendations, and active settings
- [x] CommunitySettingsSheet accessible from Community Menu (last item)
- [x] Pending count badge shown in menu
- [x] Admin proposals show approve/disapprove buttons
- [x] Progress bars show 60% threshold marker
- [x] Member recommendations list with support toggle
- [x] Recommend Alternative dialog works
- [x] AdminSettingsSection shows democratic governance status
- [ ] Notification banner integrated into community page (TO BE DONE)

### Dual Currency Display
- [x] MembersFinancialReportsDialog - Updated
- [x] IncomeSourceDetailSheet - Updated
- [x] AccountStatementsDialog - Updated
- [x] FinancialStatusDialog - Updated
- [x] FinancialObligationsDialog - Updated
- [x] WalletTransferDialog - Updated
- [x] TransactionAuthorizationPanel - Updated
- [x] MobigateQuizPlayDialog - Updated
- [x] AdminPrimaryManagementSheet - Updated
- [ ] DonationDialog - TO BE UPDATED
- [ ] CommunityQuizDialog - TO BE UPDATED
- [ ] MobigateQuizDialog (toast messages) - TO BE UPDATED
- [ ] CheckIndebtednessSheet - TO BE UPDATED
- [ ] MinutesDownloadDialog - TO BE UPDATED
- [ ] WalletWithdrawDialog - TO BE UPDATED
- [ ] DonationSheet (fundraiser) - TO BE UPDATED

---

## Files Summary

### Files to Modify (7 files)
1. `src/components/community/DonationDialog.tsx`
2. `src/components/community/CommunityQuizDialog.tsx`
3. `src/components/community/MobigateQuizDialog.tsx`
4. `src/components/community/elections/CheckIndebtednessSheet.tsx`
5. `src/components/community/meetings/MinutesDownloadDialog.tsx`
6. `src/components/community/finance/WalletWithdrawDialog.tsx`
7. `src/components/community/fundraiser/DonationSheet.tsx`

### Optional Enhancement Files (2 files)
1. Community page - Add SettingsChangeNotificationBanner
2. Admin dashboard - Integrate CommunitySettingsAdminView

---

## Technical Notes

- All new components follow mobile-first design with 92vh drawer height
- Touch-friendly buttons use minimum h-10 height
- Progress bars include visual 60% threshold markers
- Toast messages provide user feedback for all actions
- Democratic settings use consistent emerald color theme
- The 60% threshold is configurable via `DEMOCRATIC_SETTINGS_CONFIG`
