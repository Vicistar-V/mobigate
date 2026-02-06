

# Dedicated Quiz Wallet System

## Overview

The Community Quiz Games will receive a dedicated wallet, separate from the main Community Wallet. This wallet manages all quiz-related funds: player stake debits, winning payouts, and transfers to/from the main community wallet. If the Quiz Wallet has insufficient funds to cover potential winnings, all quiz games are disabled with the message: "Quiz Game Unavailable Right Now! Please try again later".

---

## What Gets Built

### 1. Enhanced Quiz Wallet Data Layer

**File: `src/data/communityQuizData.ts`** (modify)

- Expand `CommunityQuizWallet` interface with new fields:
  - `incomeFromMainWallet` -- total transferred in from main wallet
  - `transfersToMainWallet` -- total transferred out to main wallet
  - `totalWinningPayouts` -- total paid to winners
  - `totalStakeIncome` -- total received from player stakes
  - `reservedForPayouts` -- funds currently earmarked for active quiz winnings
  - `availableBalance` -- balance minus reserved amount
  - `transactions` -- array of `QuizWalletTransaction` records
- Add `QuizWalletTransaction` interface:
  - `id`, `type` (stake_income | winning_payout | transfer_in | transfer_out), `amount`, `description`, `date`, `reference`, `relatedQuizId?`, `playerName?`
- Update `communityQuizWalletData` mock with realistic transaction history
- Refine `isCommunityQuizAvailable` to check if wallet balance can cover the quiz's `winningAmount` (for full 10/10 win), returning the exact message: "Quiz Game Unavailable Right Now! Please try again later"

### 2. Quiz Wallet Management Dialog

**File: `src/components/community/QuizWalletDrawer.tsx`** (new)

A mobile-first Drawer component for managing the dedicated quiz wallet. Follows the existing `FinancialOverviewDialog` pattern:

- **Header**: Blue-themed gradient header with "Quiz Wallet" title and wallet icon
- **Balance Card**: Large balance display in dual currency (Local-First Protocol)
  - Total Balance, Available Balance (minus reserved), Reserved for Payouts
- **Quick Stats Grid** (3-column):
  - Total Stakes In | Total Payouts | Net Position
- **Transfer Actions** (2 buttons):
  - "Fund from Main Wallet" -- opens a simple transfer-in flow (amount input, confirm)
  - "Transfer to Main Wallet" -- opens a transfer-out flow (amount input, confirm)
- **Transaction History**: Scrollable list of all quiz wallet transactions with type icons, amounts (dual currency), dates, and descriptions
  - Stake income: green arrow-down icon
  - Winning payouts: red arrow-up icon
  - Transfer in: blue arrow-down icon
  - Transfer out: orange arrow-up icon
- **Availability Status Banner**: At the bottom, shows whether the wallet has sufficient funds for active quizzes. If insufficient, displays a prominent amber warning.

### 3. Updated Community Quiz Dialog

**File: `src/components/community/CommunityQuizDialog.tsx`** (modify)

- Replace the existing "Your Wallet" card in the Quizzes tab with two cards:
  1. **Your Player Wallet** (personal balance, same as now)
  2. **Quiz Wallet Status** (dedicated quiz wallet balance + availability indicator)
- Add a "Manage Quiz Wallet" button (admin/owner only) that opens the `QuizWalletDrawer`
- When `isCommunityQuizAvailable` returns false due to insufficient quiz wallet funds:
  - Show a full-width amber alert banner: "Quiz Game Unavailable Right Now! Please try again later"
  - Disable all "Play Now" buttons on quiz cards
  - Replace button text with "Currently Unavailable"

### 4. Updated Quiz Gameplay Dialog

**File: `src/components/community/CommunityQuizPlayDialog.tsx`** (modify)

- Update `startGame` toast message to clarify the stake is deducted from player's wallet and deposited into the Quiz Wallet
- Update `handleGameCompleteClick` to clarify winnings are paid from the Quiz Wallet
- Add a small info line in the pre-game screen: "Stakes go to Quiz Wallet. Winnings paid from Quiz Wallet."

### 5. Menu Integration

**File: `src/components/community/CommunityMainMenu.tsx`** (modify)

- In the "Quiz Game" accordion section, add a new admin-only button:
  ```
  Manage Quiz Wallet (Admin)
  ```
  with the Settings icon, text-primary styling, same pattern as other admin actions

---

## Technical Details

### Quiz Wallet Transaction Types

```text
QuizWalletTransaction {
  id: string
  type: 'stake_income' | 'winning_payout' | 'transfer_in' | 'transfer_out'
  amount: number
  description: string
  date: Date
  reference: string
  relatedQuizId?: string
  playerName?: string
}
```

### Availability Logic (refined)

The current check uses `quiz.winningAmount * 10` as a buffer. The new logic:
- For each active quiz, the required reserve = `quiz.winningAmount` (enough to pay one full winner)
- Total required reserve = sum of all active quizzes' `winningAmount`
- If `quizWallet.balance < totalRequiredReserve`, mark all games as unavailable
- Message: "Quiz Game Unavailable Right Now! Please try again later"

### Dual Currency Display

All amounts follow the Local-First Dual Currency Protocol:
- Primary: Nigerian Naira with full formatting (e.g., "N150,000.00")
- Secondary: Mobi equivalent in parentheses (e.g., "(M150,000)")

### Files Summary

| File | Action | Description |
|------|--------|-------------|
| `src/data/communityQuizData.ts` | Modify | Expand wallet interface, add transactions, refine availability check |
| `src/components/community/QuizWalletDrawer.tsx` | New | Dedicated quiz wallet management drawer |
| `src/components/community/CommunityQuizDialog.tsx` | Modify | Add quiz wallet status card, availability banner, admin button |
| `src/components/community/CommunityQuizPlayDialog.tsx` | Modify | Clarify stake/payout flow references to Quiz Wallet |
| `src/components/community/CommunityMainMenu.tsx` | Modify | Add "Manage Quiz Wallet" admin menu item |

