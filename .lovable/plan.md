
## Plan: 70% Wallet Solvency Check on Season Creation with Waiver Option

### What Changes

**1. The "Create Season" button enforces 70% solvency**

When the merchant fills out the season form and the total prize pool is calculated, the system checks if `merchant.walletBalance >= 70% of totalPrizes`. If not:
- The "Create Season" button stays **disabled** (greyed out)
- An **info banner** appears below the button showing: wallet balance, required amount (70% of prizes), and the shortfall
- A "Request Waiver" option appears below the info banner

**2. Waiver Request Flow (inline in the form)**

If the merchant can't meet the 70% requirement:
- A "Request Waiver" button appears with an **optional textarea** for the merchant to explain their situation (e.g. "Sponsorship funds arriving next week")
- Tapping "Request Waiver" deducts the waiver fee (M50,000) from their wallet (toast), marks the waiver as pending
- After waiver is submitted, the "Create Season" button becomes **enabled** again
- The season is created with `quizStatus: "awaiting_approval"` instead of `"draft"`

**3. Data Model Update**

Add `"awaiting_approval"` to the `quizStatus` union type in `QuizSeason` interface.

**4. Season card shows "Awaiting Approval" badge**

Seasons with `quizStatus: "awaiting_approval"` display an amber badge and cannot be activated until approved.

### Technical Details

**File: `src/data/mobigateInteractiveQuizData.ts`**
- Update `quizStatus` type from `"draft" | "active" | "suspended"` to `"draft" | "active" | "suspended" | "awaiting_approval"`

**File: `src/pages/MerchantPage.tsx`**

- Change `SeasonsTab` props from `{ merchantId: string }` to `{ merchantId: string; merchant: QuizMerchant }` and pass `myMerchant` from the parent
- Add state: `waiverRequested: boolean`, `waiverContext: string` (optional textarea value)
- Compute solvency check: `const requiredBalance = totalPrizes * MERCHANT_MIN_WALLET_PERCENT; const isSolvent = merchant.walletBalance >= requiredBalance;`
- Between the TV Rounds section and the "Create Season" button, add:
  - If not solvent and no waiver requested: red/amber info card showing shortfall, optional context textarea, and "Request Waiver (fee)" button
  - If waiver requested: green info card saying "Waiver submitted -- season will be created as Awaiting Approval"
- Disable the "Create Season" button if `!isSolvent && !waiverRequested`
- In `handleCreate`: set `quizStatus` to `"awaiting_approval"` if `waiverRequested`, otherwise `"draft"`
- In season card rendering: handle `"awaiting_approval"` status with amber badge and appropriate label
- Update the `toggleStatus` function to also handle the new status where relevant
