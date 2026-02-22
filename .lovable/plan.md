

## Merchant Application System -- Quiz Merchant

Build a complete merchant application flow for Individual and Corporate Quiz Merchant accounts, plus an admin review section in the MobiGate Admin Dashboard.

### User-Facing Flow

**New Page: `/merchant-apply/:type`** (type = "individual" or "corporate")

When users click "Individual Merchant Account" or "Corporate Merchant Account" from the sidebar, they navigate to this page showing a step-by-step application flow:

**Step 1 -- Merchant Type Selection**
- Two cards: "Quiz Merchant" and "Voucher Merchant" (disabled/greyed out with "Coming Soon" badge)
- Tapping "Quiz Merchant" proceeds to Step 2

**Step 2 -- Application Form**
- **Individual**: Name field is auto-filled and read-only (mock: "Chukwuemeka Okafor" from their MobiGate account)
- **Corporate**: Editable input field for business/company name
- Both show:
  - Account type badge (Individual/Corporate)
  - Merchant type badge (Quiz)
  - Phone number (auto-filled, read-only mock)
  - Email (auto-filled, read-only mock)
  - Corporate only: Business registration number input, business address input
  - Terms and policies checkbox (scrollable terms text)
  - Application fee notice: "M50,000.00 (approximately N50,000.00) will be charged from your Mobi Wallet"
  - "Submit Application" button (disabled until policies accepted)

**Step 3 -- Payment Confirmation**
- Confirmation drawer showing fee breakdown
- Wallet balance check (mock: M125,000 balance)
- "Confirm and Pay M50,000" button
- On confirm: brief loading, toast success, advance to Step 4

**Step 4 -- Under Review Screen**
- Full-screen status card with a clock/hourglass icon
- "Application Under Review" title
- Application reference number (auto-generated mock)
- Submitted date
- Estimated review time: "3-5 business days"
- "Your application is being reviewed by the MobiGate team"
- "Back to Home" button

### Admin Side -- New "Merchants" Tab in MobiGate Admin Dashboard

Add a new "Merchants" tab to the existing `MobigateAdminDashboard`:

- Tab icon: Store
- Shows pending merchant applications count badge
- Content:
  - Filter chips: All / Pending / Approved / Rejected
  - Application cards showing:
    - Applicant name, account type (Individual/Corporate), merchant type (Quiz)
    - Application date, reference number
    - Business name (corporate only)
    - Status badge
  - Tapping a pending application opens a review drawer:
    - Full application details
    - "Approve" button (green) and "Reject" button (red)
    - Rejection requires selecting a reason (reuses `RejectionReasonDialog` pattern)
    - On action: toast feedback, card updates status

### Mock Data

New file `src/data/merchantApplicationData.ts`:
- `MerchantApplication` interface with fields: id, applicantName, accountType (individual/corporate), merchantType (quiz/voucher), businessName, regNumber, email, phone, status (pending/approved/rejected), applicationDate, referenceNumber, rejectionReason
- 5-6 mock applications in various states (3 pending, 1 approved, 1 rejected)

### Files to Create/Modify

| File | Action |
|------|--------|
| `src/data/merchantApplicationData.ts` | **Create** -- Mock data and interfaces |
| `src/pages/MerchantApplyPage.tsx` | **Create** -- Application flow page with 4 steps |
| `src/components/AppSidebar.tsx` | **Modify** -- Update sidebar links to point to `/merchant-apply/individual` and `/merchant-apply/corporate` |
| `src/App.tsx` | **Modify** -- Add route for `/merchant-apply/:type` |
| `src/pages/admin/MobigateAdminDashboard.tsx` | **Modify** -- Add "Merchants" tab with application review UI |

### Technical Notes

- Mobile-first design throughout, using Drawer components for review actions
- Application fee formatted using `formatMobi` and `formatLocalAmount` utilities
- Status badges use consistent color coding: amber/pending, green/approved, red/rejected
- All state is local (useState) -- no backend, pure UI template
- The "Under Review" screen persists as a static UI (no actual status checking)

