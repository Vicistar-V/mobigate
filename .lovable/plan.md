

# Plan: "Fund Your Wallet" → Wallet Page with Fund Selection

## What the user wants
The sidebar's "Fund Your Wallet" link should navigate to the same page as "View Wallet" (`/wallet`), but automatically present a wallet-type selection (Mobi Wallet vs Local Currency Wallet) so the user can choose which to fund.

## Current behavior
- "View Wallet" → `/wallet` (WalletPage with dual wallet carousel)
- "Fund Your Wallet" → `/buy-vouchers?source=fund-wallet` (goes directly to Mobi voucher purchase)

## Changes

### 1. Update sidebar link (`src/components/AppSidebar.tsx`)
Change "Fund Your Wallet" URL from `/buy-vouchers?source=fund-wallet` to `/wallet?action=fund`.

### 2. Update WalletPage (`src/pages/WalletPage.tsx`)
- Read `action=fund` from URL search params on mount.
- When `action=fund` is detected, auto-open a "Choose Wallet to Fund" drawer/sheet with two options:
  - **Mobi Wallet (M)** — opens the existing Mobi fund drawer (`setFundMobiDrawerOpen(true)`)
  - **Local Currency Wallet (₦)** — opens the existing Local fund drawer (`setFundDrawerOpen(true)`)
- The selection drawer uses the same mobile-optimized card button pattern already used in the Mobi fund options (icon + label + chevron, touch-manipulation).
- After selection or dismissal, clear the `action` param from the URL to prevent re-triggering.

This approach reuses both existing fund drawers entirely — no duplication of funding logic.

