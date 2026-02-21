
# Paid "View All Questions" Feature in Quiz History

## Overview

Add a paywall to the "View All Questions" button in the My Quiz History detail drawer. When a player taps it, a payment confirmation dialog appears first. The player's main Mobi wallet is charged an admin-configurable fee (e.g., M2,000). If the wallet has insufficient funds, access is denied with a clear message.

---

## Changes

### 1. Add Question View Fee to Platform Settings

**File:** `src/data/platformSettingsData.ts`

Add a new setting block for the question viewing charge:

- `questionViewFee`: number (default M2,000)
- `questionViewFeeMin`: number (M500)
- `questionViewFeeMax`: number (M10,000)
- Getter: `getQuestionViewFee()`
- Setter: `setQuestionViewFee(newFee)`

### 2. Add Admin UI for Managing the Fee

**File:** `src/components/mobigate/QuizSettingsCard.tsx`

Add a third settings section (below the existing "Time Per Question" and "Partial Win" sections) for "Question View Fee":

- Slider from M500 to M10,000 (step M500)
- Large display showing current fee in Mobi
- Info note: "Players will be charged this amount from their main wallet to view played quiz questions in their history"
- Included in the existing Save button logic

### 3. Add Payment Confirmation Dialog to Quiz History

**File:** `src/pages/MyQuizHistory.tsx`

Replace the current direct toggle behavior of the "View All Questions" button with a paywall flow:

- **New state:** `showPaymentConfirm` (boolean), `paymentProcessing` (boolean), `questionAccessGranted` (Record of game IDs that have been paid for)
- **On tap "View All Questions":**
  - If already paid for this game (in `questionAccessGranted`), toggle questions directly
  - Otherwise, open a payment confirmation AlertDialog
- **Payment Confirmation AlertDialog** (mobile drawer-style):
  - Header: "View Quiz Questions" with an Eye icon
  - Body shows:
    - Fee amount in Mobi (e.g., M2,000) and local equivalent
    - Current wallet balance
    - Sufficient/Insufficient badge
  - Two buttons:
    - "Pay and View" (disabled if insufficient funds) -- deducts from wallet mock, grants access, shows questions
    - "Cancel" -- closes dialog
  - If insufficient funds: shows a warning card with "Top up your wallet to access this feature"
- **After payment:** the questions toggle opens automatically, and future taps on the same game don't re-charge

### 4. Import and Wire Dependencies

- Import `useWalletBalance` from `@/hooks/useWindowData` into `MyQuizHistory.tsx`
- Import `getQuestionViewFee` from `@/data/platformSettingsData`
- Import `formatMobiAmount`, `formatLocalAmount` from `@/lib/mobiCurrencyTranslation`
- Use `AlertDialog` from `@/components/ui/alert-dialog` for the payment confirmation

---

## Technical Details

### Platform Settings Addition (platformSettingsData.ts)

```text
interface: PlatformQuestionViewSettings
  questionViewFee: 2000        (M2,000 default)
  questionViewFeeMin: 500      (M500)
  questionViewFeeMax: 10000    (M10,000)
  lastUpdatedAt: Date

getQuestionViewFee() -> number
setQuestionViewFee(fee: number) -> void
```

### Payment Flow in MyQuizHistory.tsx

```text
State:
  questionAccessGranted: Set<number>   -- game IDs already paid for
  paymentGameId: number | null         -- which game's payment dialog is open
  paymentProcessing: boolean

On "View All Questions" tap:
  if gameId in questionAccessGranted:
    toggle showQuestions (free)
  else:
    set paymentGameId = gameId (opens AlertDialog)

On "Pay & View" tap:
  if walletBalance >= fee:
    set paymentProcessing = true
    simulate 1.5s delay
    add gameId to questionAccessGranted
    set showQuestions = true
    show success toast with amount charged
    close dialog
  else:
    show insufficient funds toast
```

### Payment Confirmation UI (mobile-optimized)

```text
AlertDialog (rounded-xl on mobile)
  AlertDialogHeader
    Icon: Eye (amber)
    Title: "View Quiz Questions"
    Description: "This is a premium feature"

  Body:
    Fee card: "M2,000 (approx N2,000.00)"
    Wallet card: current balance + Sufficient/Insufficient badge
    [if insufficient]: Warning card with top-up message

  AlertDialogFooter (stacked vertically)
    Button "Pay M2,000 & View Questions"
      (w-full, min-h-[44px], green gradient, disabled if insufficient)
    Button "Cancel"
      (w-full, outline)
```

### Admin Settings UI Addition (QuizSettingsCard.tsx)

```text
New section after "Partial Win Percentage":
  Separator
  Header: "Question View Fee" with Eye icon
  Large display: M{fee} centered
  Slider: M500 - M10,000, step M500
  Info note: "Charged to player's main wallet when viewing played quiz questions"
  (Included in existing hasChanges/Save logic)
```

### Files Modified
- `src/data/platformSettingsData.ts` -- add question view fee settings and helpers
- `src/components/mobigate/QuizSettingsCard.tsx` -- add fee management slider section
- `src/pages/MyQuizHistory.tsx` -- add payment gate on "View All Questions" button

### Files Created
- None (all changes are additions to existing files)
