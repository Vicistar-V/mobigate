
# Interactive Quiz: Merchant-Centric Player Flow, Winning Prizes Display, Wallet Requirements, and Waiver System

## What This Plan Does

Currently, the player-facing Interactive Quiz Merchant Sheet is a basic list showing merchant names, categories, and prize pools. This plan transforms it into a full merchant-centric experience where:

1. **Players see each merchant's actual winning prize offers** (1st, 2nd, 3rd prizes + consolation) prominently on merchant cards
2. **Merchants configure their Game Show winning prizes** (1st/2nd/3rd + consolation) from their admin panel
3. **A wallet balance validation system** ensures merchants have at least 70% of total prizes before launching
4. **An Exclusive Waiver request flow** lets under-funded merchants apply (with a non-refundable fee) for admin approval
5. **Draft/Active quiz status** reflects whether a merchant's quiz is launchable or pending funding

---

## Detailed Changes

### 1. Data Model Updates (`mobigateInteractiveQuizData.ts`)

Add to the `QuizSeason` interface:
- `firstPrize: number` -- e.g., 6,000,000
- `secondPrize: number` -- e.g., 3,000,000
- `thirdPrize: number` -- e.g., 1,500,000
- `consolationPrizePerPlayer: number` -- e.g., 500,000 (for 12 semi-final evictees)
- `consolationPrizeCount: number` -- e.g., 12
- `totalWinningPrizes: number` -- computed: 1st + 2nd + 3rd + (consolation x count) = 16,500,000
- `quizStatus: "draft" | "active" | "suspended"` -- replaces simple isLive for launch control

Add to the `QuizMerchant` interface:
- `walletBalance: number` -- current wallet balance
- `walletFundingHistory: { date: string; amount: number; description: string }[]`
- `pendingWaiverRequest: boolean`
- `waiverApproved: boolean`

Add new constants:
- `MERCHANT_MIN_WALLET_PERCENT = 0.7` (70% of total prizes required)
- `WAIVER_REQUEST_FEE = 50000` (admin-editable, non-refundable)

Update all mock seasons to include realistic 1st/2nd/3rd/consolation prize values.
Update mock merchants to include wallet balances (some sufficient, some insufficient for testing).

### 2. Player-Facing Merchant Sheet (`InteractiveQuizMerchantSheet.tsx`)

Transform merchant cards to show:
- Merchant name, category, verified badge (existing)
- **Winning Prizes section** on each card showing:
  - "1st: N6,000,000 (M6,000,000)"
  - "2nd: N3,000,000"
  - "3rd: N1,500,000"
  - "Consolation: N500,000 x 12 players"
  - "Total Prize Pool: N16,500,000"
- Number of active seasons and participant count
- Only show merchants with `applicationStatus === "approved"` and at least one active season

Filter out pending/suspended merchants from the player view (those are admin-only).

### 3. Player-Facing Season Sheet (`InteractiveQuizSeasonSheet.tsx`)

Update season cards to prominently display:
- The full prize breakdown (1st, 2nd, 3rd, consolation) in a dedicated prize section
- Dual currency display (NGN + Mobi) for all prize amounts
- Selection stages with entry fees (already present, keep as-is)
- A note: "Consolation Prizes for 12 Semi-Final contestants" when enabled

### 4. Merchant Admin -- Season Configuration (`InteractiveMerchantAdmin.tsx`)

**Add Season Drawer updates:**
- Add input fields for 1st Prize, 2nd Prize, 3rd Prize amounts
- Add consolation toggle + per-player amount + player count
- Auto-compute total winning prizes and display it
- Show the 70% wallet requirement: "Minimum wallet balance required: N11,550,000"
- Show merchant's current wallet balance

**Season card updates:**
- Show `quizStatus` badge (Draft/Active/Suspended)
- Show total winning prizes on each season card

**Launch validation (replacing simple "Live" toggle):**
- When toggling a season to "Active/Live":
  - Check: `merchant.walletBalance >= 0.7 * season.totalWinningPrizes`
  - If sufficient: activate with "Launch Quiz Now" confirmation
  - If insufficient: show "Insufficient Fund" alert with:
    - Current balance vs required balance
    - "Click Here to Apply for Exclusive Waiver" button
    - Waiver fee disclosure: "This request will charge a non-refundable fee of N50,000"

**Waiver Request Drawer (new):**
- Shows merchant's current wallet balance
- Shows required minimum balance
- Shows funding history (last 5 transactions)
- Shows the non-refundable waiver fee
- "Submit Waiver Request" button with fee confirmation
- After submission: toast confirmation, season stays as "Draft" pending admin approval

**Admin Waiver Management (within merchant detail view):**
- A "Pending Waivers" section (visible to admin only)
- Each waiver request shows: season name, required balance, current balance, shortfall
- "Approve" button: activates the quiz season
- "Reject" button: keeps season as Draft, notifies merchant

### 5. Merchant Selection Process Drawer (`MerchantSelectionProcessDrawer.tsx`)

- Update Grand Finale section to show the configured 1st/2nd/3rd prize amounts
- Show consolation prize details for TV Show evictees
- All amounts in dual currency (NGN + Mobi)

---

## Technical Details

### Wallet Validation Logic

```text
totalWinningPrizes = firstPrize + secondPrize + thirdPrize + (consolationPrizePerPlayer * consolationPrizeCount)
requiredBalance = totalWinningPrizes * MERCHANT_MIN_WALLET_PERCENT
canLaunch = merchant.walletBalance >= requiredBalance
```

### Quiz Status State Machine

```text
Draft --> (sufficient wallet) --> Active
Draft --> (insufficient wallet) --> show "Apply for Waiver"
Draft --> (waiver approved) --> Active
Active --> (admin suspends) --> Suspended
Suspended --> (admin reactivates) --> Active
```

### Files Modified (5 total)
- `src/data/mobigateInteractiveQuizData.ts` -- New prize fields, wallet fields, waiver constants, updated mocks
- `src/components/community/mobigate-quiz/InteractiveQuizMerchantSheet.tsx` -- Prize display on merchant cards, filter non-approved
- `src/components/community/mobigate-quiz/InteractiveQuizSeasonSheet.tsx` -- Prize breakdown display on season cards
- `src/components/mobigate/InteractiveMerchantAdmin.tsx` -- Prize config in Add Season, wallet validation, waiver request drawer, waiver admin section
- `src/components/mobigate/MerchantSelectionProcessDrawer.tsx` -- Prize amounts in Grand Finale section

### Files Created
- None
