
## Merchant Application System (Individual + Corporate) with Admin Review

### Overview
Build a complete merchant application flow accessible from the sidebar menu ("Individual Merchant Account" / "Corporate Merchant Account"), plus an admin section in the Mobigate Admin Dashboard for reviewing and approving/declining applications. Everything is UI-only with mock data -- no backend integration.

---

### New Files

**1. `src/pages/MerchantApplication.tsx`** -- Main application page

- Route: `/merchant-application/:type` where type is `individual` or `corporate`
- Uses `Header` component, mobile-first layout
- Sections:
  - **Header area**: Icon, title ("Individual Merchant Application" or "Corporate Merchant Application"), brief description
  - **Requirements Info Card** (read-only, collapsible): Displays the merchant requirements as informational items:
    - Verified user for minimum 180 days
    - Registration fee: M1,000,000 (non-refundable)
    - Initial Merchant Vouchers Subscription Deposit (IMVSD): min M1,000,000
    - IMVSD must cover initial Mandatory Voucher Packs (100-unit pack x 12 denominations)
    - At least 1,000 invited active friends
    - At least 5,000 friends and 5,000 followers
    - At least 100 e-Library contents with 5,000+ likes each
    - Followed at least 500 users/content creators
    - Only merchants transact with Mobigate central system
    - Vouchers can be credited to wallet, sent as e-PIN, or gifted
  - **Application Form**:
    - For **Individual**: Name field auto-filled (disabled) showing "Adewale Johnson" (mock account name), with a note "Name captured from your Mobigate account"
    - For **Corporate**: Editable "Business/Corporate Name" input field
    - Phone number (auto-filled from account)
    - Email (auto-filled from account)
    - For Corporate: Business registration number input, business address textarea
    - Accept policies checkbox with text about terms and M50,000 application fee (using `formatMobi` for display)
    - Submit button -- charges M50,000 application fee
  - **Post-submission UI**: Replaces the form with a "Under Review" status card showing:
    - Application reference number
    - "Your application is under review" message with a clock icon
    - Estimated review time: 3-5 business days
    - Summary of submitted info

**2. `src/components/mobigate/MerchantApplicationsAdmin.tsx`** -- Admin review component

- Used inside the Mobigate Admin Dashboard (new tab or section)
- Displays a list of pending merchant applications as cards
- Each card shows:
  - Applicant name, type badge (Individual/Corporate), submitted date
  - For corporate: business name, registration number
  - Application fee paid: M50,000
  - Eligibility checklist (mock data showing which requirements are met/unmet with checkmarks/crosses)
  - Two action buttons: "Approve" (green) and "Decline" (red)
  - Approve shows a toast "Application approved"
  - Decline opens a small reason input, then shows toast "Application declined"
- Also shows a summary count: Pending / Approved / Declined
- Mock data: 3-4 sample applications with varying statuses

---

### Modified Files

**3. `src/components/AppSidebar.tsx`**
- Update the "Individual Merchant Account" URL from `#` to `/merchant-application/individual`
- Update the "Corporate Merchant Account" URL from `#` to `/merchant-application/corporate`

**4. `src/App.tsx`**
- Add route: `/merchant-application/:type` pointing to `MerchantApplication` page

**5. `src/pages/admin/MobigateAdminDashboard.tsx`**
- Add a "Merchant Applications" section/tab that renders the `MerchantApplicationsAdmin` component
- Shows pending application count badge

---

### Technical Details

| Aspect | Detail |
|--------|--------|
| Currency display | Uses `formatMobi()` and `formatLocalAmount()` from existing currency utils |
| Application fee | M50,000 (displayed with local equivalent) |
| Registration fee | M1,000,000 (info display only, not charged here) |
| IMVSD | M1,000,000 minimum (info display only) |
| Mock user data | Name: "Adewale Johnson", auto-filled for individual |
| State management | Local `useState` only, no backend |
| Styling | Mobile-first, uses existing Card, Badge, Button, Input, Checkbox, Collapsible components |
| Icons | Store, CheckCircle, XCircle, Clock, FileText, Shield from lucide-react |
| Toast | Uses existing `useToast` for submission and admin actions |
| Requirements | Displayed as an informational accordion, not validated against real data |
