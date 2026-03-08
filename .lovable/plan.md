

## Plan: Complete the Manage Communities Page Implementation

### What's Already Done
- Page created with 4 tabs (All Communities, Applications, Complaints, Settings)
- Route registered at `/mobigate-admin/communities`
- "Communities" tab trigger added to `MobigateAdminDashboard`
- All Communities tab: search, filters, community cards, detail drawer with suspend/flag/activate
- Applications tab: collapsible cards with approve/decline
- Complaints tab: stats grid, filters, complaint cards, detail drawer with investigate/resolve/dismiss
- Settings tab: 4 collapsible password-gated sections (read-only display only)

### What's Missing (Compared to Manage Merchants Pattern)

**1. Settings Tab -- Editable Inputs (Currently Read-Only)**
The Merchants page has dedicated settings components (`VoucherDiscountSettingsCard`, `MerchantAppFeeSettingsCard`, `EligibilitySettingsCard`) with actual input fields, lock/unlock per field, min/max validation, and save buttons. The Communities settings just show static badges with no way to edit values.

Fix: Convert the `SettingsSection` component to support editable inputs (number inputs for fees/thresholds, toggle switches for boolean settings) with save/cancel, lock/unlock per field, and toast feedback -- same pattern as the Merchant settings cards.

**2. Complaints Tab -- Penalise Community System (Missing Entirely)**
The Merchants page has a full penalty system via `AdminComplaintsTab` with 4 escalation levels (Warning, Suspend, Ban, Deactivate Permanently), progressive duration model (30d → 24mo based on offence count), and 4-admin authorization for permanent deactivation. The Communities complaints tab has none of this.

Fix: Add a "Penalise Community" button/drawer in the complaint detail drawer with:
- 4 escalation levels: Warning, Suspend, Ban, Deactivate Permanently
- Progressive duration auto-selection based on offence history
- Admin override option for duration
- Reason textarea
- Checkbox confirmation for deactivation
- 4-admin multi-sig authorization gate for permanent deactivation (using `ModuleAuthorizationDrawer`)
- Resolution timeline entry recording penalty details

**3. Community Detail Drawer -- Deactivate Permanently Action (Missing)**
The Merchants detail drawer has a permanent deactivation option gated by 4-admin auth. The Communities detail drawer only has Suspend, Flag, and Reactivate -- no permanent deactivation.

Fix: Add a "Deactivate Permanently" button (red, at bottom of drawer) that requires checkbox confirmation + triggers the `ModuleAuthorizationDrawer` with 4-admin protocol before executing.

**4. Date Sort Filter on Complaints (Missing)**
The Merchants complaints tab has a Date filter (Newest/Oldest/Specific Date). The Communities complaints tab only has Status and Category filters.

Fix: Add a third Select filter for date sorting (Newest First, Oldest First).

### Files to Modify

**`src/pages/admin/ManageCommunitiesPage.tsx`** -- All changes in this single file:
1. Import `ModuleAuthorizationDrawer` and `Switch` component
2. Update `SettingsSection` to support editable inputs with lock/unlock, save, and toast
3. Add `PenaliseCommunityDrawer` component with escalation levels, progressive durations, reason, and multi-sig auth
4. Add "Penalise" button in `ComplaintDetailDrawer` for pending/investigating complaints
5. Add "Deactivate Permanently" button in `CommunityDetailDrawer` with checkbox + multi-sig auth
6. Add date sort filter to `ComplaintsTab`

### No New Files Needed
Everything fits within the existing `ManageCommunitiesPage.tsx` following the established pattern of self-contained tab components.

