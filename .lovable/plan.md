
# Application Status Pages

## Overview
Add "Application Status" navigation items in the sidebar for both Merchant and Sub-Merchant sections, linking to new status pages that show mock application status (pending/approved/rejected) with appropriate visual indicators and action buttons.

## New Files

### 1. `src/pages/MerchantApplicationStatus.tsx`
A mobile-first status page showing the merchant application status. Uses mock data (defaulting to "pending" status for demo). Three visual states:

- **Approved**: Large green checkmark circle, "Application Approved" heading, date submitted, reference number, and a "Go to Merchant Dashboard" button linking to `/merchant-voucher-management`.
- **Pending**: Large amber clock circle, "Application Pending" heading, date submitted, reference number, estimated review time (14-21 business days), and a "Send Reminder to Mobigate Admin" button (shows toast on click).
- **Rejected**: Large red X circle, "Application Rejected" heading, date submitted, rejection reason, and two buttons: "Re-apply as Individual" (`/merchant-application/individual`) and "Re-apply as Corporate" (`/merchant-application/corporate`).

Layout: Sticky header with back arrow at `top-16`, centered content card with status icon, details card with reference/date/type info, and action button(s) at the bottom.

### 2. `src/pages/SubMerchantApplicationStatus.tsx`
Same pattern as above but for sub-merchant applications. Three states:

- **Approved**: Green checkmark, "Go to Sub-Merchant Dashboard" button linking to `/sub-merchant-voucher-management`.
- **Pending**: Amber clock, "Send Reminder" button with toast feedback, 7-14 business days estimate.
- **Rejected**: Red X, single "Re-apply as Sub-Merchant" button linking to `/merchants?mode=apply`.

### 3. Route Registration in `src/App.tsx`
Add two new routes:
- `/merchant-application-status` -> `MerchantApplicationStatus` (wrapped with `WithHeader`)
- `/sub-merchant-application-status` -> `SubMerchantApplicationStatus` (wrapped with `WithHeader`)

### 4. Sidebar Updates in `src/components/AppSidebar.tsx`
- Add `{ title: "Application Status", url: "/merchant-application-status" }` as a new item after "Apply for a Merchant Account" in the Merchants Menu section.
- Add `{ title: "Sub-Merchant Application Status", url: "/sub-merchant-application-status" }` after "Apply as Sub-Merchant" in the same menu section.

## Technical Details
- Both pages use the existing `top-16` sticky header offset pattern
- Mobile-only focus: full-width layout, touch-manipulation buttons, rounded-xl elements, 44px+ touch targets
- Mock status stored in component state with a toggle for demo purposes (cycle through states by tapping the status badge)
- Uses existing UI components: `Button`, `Badge`, `Card`, `useToast`
- Icons from lucide-react: `CheckCircle2`, `Clock`, `XCircle`, `ArrowLeft`, `Bell`, `Store`
