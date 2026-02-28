

# Merchant Voucher Management System

## Overview

Build a complete Merchant Voucher Management system with generation, inventory tracking, invalidation, wallet funding, transaction history, and a user-side PIN recharge flow. Everything is mobile-first (360px), UI-only with mock data.

---

## Terminology Recap

- **Voucher Card**: Single unit with unique serial number + PIN (PIN is the recharge key)
- **Bundle**: 100 voucher cards of the same denomination (minimum purchase unit, has its own serial prefix)
- **Batch**: A single generation order/transaction containing one or more bundles of the same denomination

---

## New Files to Create

### 1. Data Layer

**`src/data/merchantVoucherData.ts`**
- Types: `VoucherCard` (id, serialNumber, pin, denomination, status: "available" | "sold_unused" | "used" | "invalidated", batchId, bundleSerialPrefix, soldVia: "physical" | "mobigate_digital" | null, createdAt, invalidatedAt)
- Types: `VoucherBundle` (serialPrefix, denomination, batchId, cardCount: 100, cards: VoucherCard[])
- Types: `VoucherBatch` (id, batchNumber, denomination, bundleCount, totalCards, status, createdAt, totalCost, discountApplied, discountPercent, generationType: "new" | "replacement", replacedBatchId?)
- Types: `MerchantWalletTransaction` (id, type: "funding" | "voucher_generation", amount, currency, reference, createdAt, description, batchId?)
- Mock data generator: creates serial numbers (bundle prefix + card suffix with date info), hashed PINs for display (showing only last 4 chars), a few pre-existing batches with mixed statuses
- Discount tiers config: e.g., 1-9 bundles = 0%, 10-49 = 5%, 50-99 = 8%, 100+ = 12% (admin-configurable later)
- Helper functions: `generateSerialNumber()`, `generatePin()`, `hashPin()`, `calculateBulkDiscount()`, `getInvalidatableCards()`

### 2. Merchant Voucher Management Page

**`src/pages/MerchantVoucherManagement.tsx`**
- Main page with sticky header + back button
- Three main sections accessible via prominent action cards at top:
  - **Generate Vouchers** (primary CTA button)
  - **View All Batches** (inventory)
  - **Transaction History**
- Local currency wallet balance display at top (card with "Fund Wallet" button)
- Stats overview: total batches, total bundles, total cards, cards by status breakdown

### 3. Generation Flow (sub-pages/steps within the page)

**`src/pages/MerchantVoucherGenerate.tsx`**
- Step 1: **Select Denomination** - Same voucher grid as user side but styled for merchant (professional blues/slates instead of consumer primary colors). Select ONE denomination per generation
- Step 2: **Select Bundle Count** - Stepper for number of bundles (each = 100 cards). Shows discount tier kicking in. Total cards = bundles x 100. Total cost calculation with discount applied
- Step 3: **Payment Summary** - Shows denomination, bundle count, total cards, unit cost, discount %, discounted total. Checks local currency wallet balance. If insufficient, shows "Fund Wallet" CTA
- Step 4: **Processing** - Similar animated loading as user side but merchant-themed
- Step 5: **Generation Complete** - Shows batch summary, auto-navigates to the new batch detail page

### 4. Batch List Page

**`src/pages/MerchantVoucherBatches.tsx`**
- Search bar (by batch number)
- Filter controls: by denomination, by date range, by status, by generation type (new/replacement)
- Sort: newest first, oldest, denomination high-low, denomination low-high
- Each batch card shows: batch number, denomination, bundle count, total cards, date, status breakdown (available/sold/used/invalidated counts), generation type badge
- Tap to open batch detail

### 5. Batch Detail Page

**`src/pages/MerchantVoucherBatchDetail.tsx`**
- Header: batch number, denomination, creation date, generation type
- Status summary cards (4 cards: Available, Sold Unused, Used, Invalidated with counts)
- Bundle list within the batch (each bundle shows its serial prefix, status breakdown)
- Tap bundle to expand and see individual cards
- Card list: serial number (full), PIN (hashed - showing "****XXXX"), status badge, sold date if sold
- Search within batch (by serial number or last 4 of PIN)
- Action buttons:
  - **Invalidate Batch** - Invalidates all cards with status "available" OR "sold_unused" (but NOT cards sold via Mobigate digital, and NOT "used" cards). Confirmation dialog with count of cards to be invalidated. On confirm: invalidated cards get replaced as a new batch (generation type: "replacement")
  - **Invalidate Bundle** - Same logic but for one bundle
  - **Invalidate Single Card** - Same logic for one card (only if available or sold_unused and not sold via mobigate digital)

### 6. Merchant Wallet Funding Flow

**`src/pages/MerchantWalletFund.tsx`**
- Local currency only (no Mobi). Amount input with numeric keypad feel
- Quick-pick amounts: 50,000 / 100,000 / 500,000 / 1,000,000
- Custom amount input
- Processing screen (similar loading animation)
- Success screen with transaction reference ID, amount funded, new balance
- Navigate back to voucher management

### 7. Transaction History Page

**`src/pages/MerchantVoucherTransactions.tsx`**
- Unified list: wallet fundings + voucher generation purchases
- Each transaction card: type icon, description, amount, date, reference ID, batch link (if generation)
- Filter: by type (funding/generation), date range
- Sort: newest/oldest, amount high-low

### 8. User PIN Recharge (modification to existing BuyVouchersPage)

**Modify `src/pages/BuyVouchersPage.tsx`**
- On the voucher selection step (step 1), add a new option section at the TOP before denomination tiers:
  - A card/section: "Have a Voucher Code?" with a brief description
  - Tap opens a new step: **"Redeem Voucher"**
- Redeem step UI:
  - Input field for PIN code (styled like OTP input, chunked digits)
  - "Redeem" button
  - Processing animation (3 seconds)
  - Success screen: shows denomination credited, new wallet balance animation
  - Error state: invalid/used/invalidated PIN message

---

## Route & Sidebar Changes

**`src/App.tsx`** - Add routes:
- `/merchant-voucher-management` - Main page
- `/merchant-voucher-generate` - Generation flow
- `/merchant-voucher-batches` - Batch list
- `/merchant-voucher-batch/:batchId` - Batch detail
- `/merchant-wallet-fund` - Wallet funding
- `/merchant-voucher-transactions` - Transaction history

**`src/components/AppSidebar.tsx`** - Add under Merchants Menu, after "Merchant Quizzes Management":
```
{ title: "Merchant Voucher Management", url: "/merchant-voucher-management" }
```

---

## Design Principles

- **Mobile-only (360px)**: No desktop considerations. Full-width cards, touch targets 44px+, sticky headers, safe-area-bottom padding
- **Merchant aesthetic**: Professional color palette (slate/blue tones for merchant pages vs consumer primary). Slightly more data-dense than consumer UI
- **PIN security**: PINs always displayed as "****XXXX" (last 4 only). Full PIN never visible on merchant screens
- **Serial numbers**: Format like `BDL-{bundlePrefix}-{YYMMDD}-{sequence}` for bundles, cards inherit bundle prefix + card number
- **All mock data**: No backend. State managed with useState. Pre-populated with 3-4 sample batches containing cards in various statuses
- **Invalidation logic**: Only "available" and "sold_unused" (physical sales only, NOT mobigate digital) cards can be invalidated. Used cards are untouchable. Invalidated cards are replaced as a new batch with type "replacement"

---

## Implementation Order

1. Create `merchantVoucherData.ts` (types + mock data + helpers)
2. Create `MerchantVoucherManagement.tsx` (main dashboard page)
3. Create `MerchantVoucherGenerate.tsx` (generation flow)
4. Create `MerchantWalletFund.tsx` (local currency funding)
5. Create `MerchantVoucherBatches.tsx` (batch listing)
6. Create `MerchantVoucherBatchDetail.tsx` (batch/bundle/card detail + invalidation)
7. Create `MerchantVoucherTransactions.tsx` (transaction history)
8. Modify `BuyVouchersPage.tsx` (add PIN recharge option + flow)
9. Update `AppSidebar.tsx` (add menu item)
10. Update `App.tsx` (add all new routes)

