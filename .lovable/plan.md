
# Post-Payment Flow: Success Animation, Distribution & Transfer System

## Overview
After tapping "Pay Now" on the order summary, the user enters a rich post-payment experience with animated success screens, a voucher distribution system (use for self or send to others), and a transfer UI with multi-user selection and amount splitting -- all mobile-only, full-page components within BuyVouchersPage.

## New Steps Added to the Flow

The current `Step` type expands from 4 to 8 states:

```text
vouchers -> countries -> merchants -> payment -> processing -> success -> distribute -> sendToUsers
```

### Step 5: Processing (Loading Screen)
- Full-screen centered loading animation
- Pulsing Mobi logo / spinning circle with gradient
- Text transitions: "Connecting to merchant..." -> "Processing payment..." -> "Verifying transaction..." -> "Almost done..."
- Auto-advances to Success after ~3 seconds using staged timeouts

### Step 6: Payment Success (Animated)
- Green checkmark animation that scales in with a satisfying bounce effect (CSS keyframes)
- Circular green background that expands outward
- Shows "Payment Successful!" with confetti-like sparkle accents
- Displays the Mobi amount received (M{total}) prominently
- After a brief pause, two action buttons fade in:
  - **"Use for Myself"** -- triggers a 5-second loading simulation then a final success screen showing "M{amount} credited to your Mobi Wallet" before navigating home
  - **"Send to Someone"** -- proceeds to the distribution step

### Step 7: Distribute (Choose Recipient Type)
- Full-page with sticky header showing remaining Mobi balance
- Two large cards:
  - **"Community Members"** -- shows community icon, taps to open user list filtered from `communityPeople` data
  - **"Mobigate Friends"** -- shows friends icon, taps to open user list filtered from `mockFriends` data
- Below: Transaction history section showing any transfers already made in this session (recipient name, amount, timestamp)
- If all Mobi has been distributed, show a success summary screen with "All vouchers distributed!" and a "Done" button

### Step 8: Send to Users (Full-Page User Selection + Amount Split)
- **Sticky header**: Back arrow + "Select Recipients" title
- **Sticky balance banner** (same pattern as merchant step): Shows remaining Mobi available to send, updates live as amounts are assigned
- **Search bar**: Filters the user list by name in real-time
- **Scrollable user list**: Each user row shows avatar, name, online status
  - Tapping a user selects them (highlighted with checkmark, similar to voucher card selection pattern)
  - When selected, an **amount input stepper** appears inline (same card-expand pattern as voucher quantity stepper but for Mobi amounts with preset quick-pick buttons like M100, M500, M1000, or manual entry)
- **Multiple users** can be selected simultaneously, each with their own amount
- Running total of allocated amounts shown in the sticky banner
- Validation: Cannot allocate more than remaining balance
- **"Send" button** at bottom (fixed, sticky) -- disabled until at least one user has an amount assigned
- On send: 5-second loading simulation (same awesome loading as processing step) then success screen showing transfer summary
- Returns to the distribute step with updated remaining balance and the new transactions in the history

## Data Sources for User Lists
- **Community Members**: Import from `communityPeople` in `src/data/communityPeopleData.ts`
- **Mobigate Friends**: Import from `mockFriends` in `src/data/profileData.ts`
- Both mapped to a common shape: `{ id, name, avatar, isOnline? }`

## State Management
All within BuyVouchersPage component state:
- `remainingMobi: number` -- starts at `totalMobi`, decreases as transfers happen
- `transfers: Array<{ id, recipientName, recipientAvatar, amount, timestamp }>` -- session transfer log
- `recipientType: "community" | "friends" | null` -- which list to show
- `selectedRecipients: Record<string, number>` -- userId -> allocated Mobi amount

## Animation Details
All animations use pure CSS keyframes (already configured in tailwind):
- **Processing spinner**: Custom `animate-spin` with gradient ring + staged text transitions via `setTimeout`
- **Success checkmark**: `scale-in` keyframe with spring-like bounce (custom `@keyframes checkmark-draw` for the SVG path)
- **Card transitions**: `animate-fade-in` for step content appearing
- **Button reveals**: Staggered `animate-fade-in` with delays

## Files to Modify
1. **`src/pages/BuyVouchersPage.tsx`** -- All changes happen here. Add the new step types, new render functions for each step, state variables for distribution tracking, and all animation styles via inline Tailwind + custom keyframe classes.

## Technical Notes
- No new files needed -- everything stays in BuyVouchersPage to keep the flow cohesive
- No backend -- all simulated with timeouts and local state
- Mobile-only: all layouts use single-column, full-width, touch-manipulation
- Scrolling: document-level scroll, `window.scrollTo(0,0)` on every step transition
- The "Use for Myself" flow: 5s loading -> success toast + animated screen -> auto-navigate to home after 3s or tap "Done"
