

## Plan: Admin Waiver Approval + Configurable Solvency Percentage

### Overview

Two features added to the Mobigate Admin Dashboard:

1. **Waiver Requests Management** -- A new section in the admin "Quiz" tab showing all pending waiver requests from merchants, with Approve/Reject actions.
2. **Configurable Solvency Percentage** -- A new slider in the admin Settings tab (or within QuizSettingsCard) letting admins set the minimum wallet balance percentage (currently hardcoded at 70%).

All data is mock/local state -- no backend integration.

---

### Feature 1: Waiver Requests Panel (Admin Quiz Tab)

A new "Merchant Waivers" card appears at the top of the Quiz tab in `MobigateAdminDashboard.tsx`. It shows:

- Count badge of pending waivers
- List of mock waiver requests, each showing:
  - Merchant name and logo
  - Season name and total prize pool
  - Wallet balance vs required balance (with shortfall)
  - Waiver context message (if provided)
  - Date submitted
  - **Approve** (green) and **Reject** (red) buttons
- On Approve: toast confirmation, card changes to "Approved" badge, buttons disappear
- On Reject: toast, card shows "Rejected" badge with strikethrough styling

Mock waiver data will be defined inline in the dashboard file (3-4 waiver requests from different merchants).

### Feature 2: Configurable Solvency % (Admin Settings)

Added to `QuizSettingsCard.tsx` as a new section:

- "Merchant Solvency Requirement" slider (range: 50% to 100%, step 5%)
- Current value shown prominently
- Info note explaining: "Merchants must have this % of prize pool in wallet to create a season without waiver"
- Saved locally via state (same pattern as existing quiz settings)

The `MERCHANT_MIN_WALLET_PERCENT` constant stays in the data file as the default, but the admin UI shows it's configurable.

Additionally, the hardcoded "70%" text in MerchantPage solvency card will be updated to reference this configurable value dynamically (though since it's a UI template, the MerchantPage will still use the constant -- the admin settings demonstrate configurability).

### Technical Details

**File: `src/pages/admin/MobigateAdminDashboard.tsx`**
- Add imports: `Clock`, `CheckCircle`, `XCircle`, `AlertTriangle`, `Store`
- Add mock waiver requests data array with fields: `id`, `merchantName`, `seasonName`, `totalPrizes`, `walletBalance`, `requiredBalance`, `waiverContext`, `submittedDate`, `waiverFee`
- Add state: `waiverStatuses: Record<string, 'pending' | 'approved' | 'rejected'>`
- In the Quiz tab (before the quiz type cards), render a "Merchant Waiver Requests" card with the pending count badge and individual request cards with Approve/Reject buttons
- Each action updates local state and shows a toast

**File: `src/components/mobigate/QuizSettingsCard.tsx`**
- Add a new "Merchant Solvency Requirement" section after the Question View Fee section
- Slider from 50-100%, step 5, default 70%
- Uses same save pattern as other settings
- Add `Wallet` icon import from lucide-react
- Add solvency state and include in `hasChanges` check and `handleSave`

**File: `src/data/platformSettingsData.ts`** (if needed)
- Add `merchantSolvencyPercent`, `merchantSolvencyMin`, `merchantSolvencyMax` to the platform settings object
- Add setter function for the solvency percent

No changes to `MerchantPage.tsx` -- it continues reading from `MERCHANT_MIN_WALLET_PERCENT` (the admin config is a UI demonstration of configurability).

