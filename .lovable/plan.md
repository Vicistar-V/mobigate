

# Swipeable Wallet Carousel in Financial Overview

## What Changes

The Financial Overview dialog currently shows a single "Community Main Wallet" balance card at the top. This update transforms that single card into a **horizontally swipeable carousel of two wallet cards**:

1. **Slide 1 (default)**: Community Main Wallet -- uses the existing green/primary theme, showing total balance, last updated, income/expenses summary, and the Top Up / Transfer / Withdraw action buttons
2. **Slide 2 (swipe left to reveal)**: Quiz Wallet -- uses a blue theme, showing total balance, available balance, reserved for payouts, and quiz-specific stats (stakes in, payouts, net position)

Each wallet displays its own dedicated information, actions, and parameters. The user swipes left to reveal the Quiz Wallet, or swipes right to go back to the Main Wallet. Dot indicators below the carousel show which wallet is active.

---

## File to Modify

| File | Action |
|------|--------|
| `src/components/community/finance/FinancialOverviewDialog.tsx` | Major modify -- add swipeable wallet carousel |

No new files or dependencies needed. The project already has `react-swipeable` installed and the pattern is proven in `PremiumAdCarousel.tsx`.

---

## Implementation Details

### Carousel Mechanics (using `useSwipeable`)

Following the existing `PremiumAdCarousel.tsx` pattern:
- `useSwipeable` hook with `onSwipedLeft` / `onSwipedRight` to toggle between wallet index 0 and 1
- `translateX` CSS transform with `transition-transform duration-300 ease-out` for smooth sliding
- `overflow-hidden` container so only one card shows at a time
- Dot indicators (2 dots) below the carousel to show active wallet
- A visible right-edge "peek" of the next card (about 8% visible as a blue strip, matching the screenshot) to hint swipeability

### Slide 1: Community Main Wallet

Keeps the existing balance card layout but styled distinctly:
- Green gradient background (`bg-gradient-to-br from-primary/10 via-primary/5`)
- Shows: "Total Balance" label, large Naira amount, Mobi equivalent, wallet icon, last updated timestamp
- Below the carousel: the existing Top Up / Transfer / Withdraw buttons + Income/Expenses monthly summary + Recent Transactions -- these remain static (not swiped) and always visible

### Slide 2: Quiz Wallet

Blue-themed card with dedicated Quiz Wallet information:
- Blue gradient background (`bg-gradient-to-br from-blue-50 to-blue-100`)
- Shows: "Quiz Wallet" label with Shield icon, total balance (large), Mobi equivalent, last updated timestamp
- Below the main balance: Available vs Reserved split (2-column grid)
- Quick stats row: Stakes In | Payouts | Net Position
- Availability status indicator (green checkmark or amber warning)
- "Manage Quiz Wallet" button (for admins) linking to the existing `QuizWalletDrawer`

### Below-Carousel Content (always visible, not swiped)

The content below the wallet carousel changes based on which wallet is active:

**When Main Wallet is active (index 0):**
- Quick Actions grid (Top Up, Transfer, Withdraw)
- Monthly Income/Expenses summary cards
- Recent Transactions list

**When Quiz Wallet is active (index 1):**
- Quick Stats grid (Stakes In, Payouts, Net Position)
- Transfer Actions (Fund from Main, Transfer to Main)
- Quiz Wallet Transaction History
- Availability Banner

This ensures each wallet displays "its own very information and parameters."

### Dot Indicators

Two dots centered below the carousel:
- Active dot: wider pill shape (w-6 h-1.5), primary color for Main Wallet or blue-600 for Quiz Wallet
- Inactive dot: small circle (w-1.5 h-1.5), muted color
- Tappable to switch wallets directly

### Visual "Peek" Hint

The carousel items use `basis-[92%]` so that 8% of the next card peeks through on the right edge, providing a visual cue that there is more content to swipe to. This matches the blue strip visible in the screenshot.

---

## Technical Approach

### State Management
```text
walletIndex: number (0 = Main, 1 = Quiz)
```

### Swipe Handler
```text
useSwipeable({
  onSwipedLeft: () => setWalletIndex(1)
  onSwipedRight: () => setWalletIndex(0)
  preventScrollOnSwipe: true
  delta: 50
})
```

### Props Update
The component will need `isAdmin` and `isOwner` props added to control the "Manage Quiz Wallet" button visibility on the Quiz Wallet slide.

### Data Imports
Add imports from `communityQuizData.ts` for the quiz wallet data, and from `mobiCurrencyTranslation.ts` for formatting utilities.

---

## Mobile-First Focus

- Full-width swipeable cards optimized for thumb gestures
- Touch-friendly 50px swipe delta
- Smooth CSS transitions (300ms ease-out)
- Large, readable balance amounts
- Dot indicators with generous tap targets
- The "peek" strip provides intuitive discoverability without needing instructions
- All content below adapts to the selected wallet, keeping the viewport uncluttered

