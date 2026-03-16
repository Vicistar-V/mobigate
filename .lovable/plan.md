

## Plan: Fix "Fund Wallet → Resume Generation" Flow for Merchant & Sub-Merchant

### Problem
When a merchant or sub-merchant has insufficient wallet balance during voucher generation/purchase:
1. **Merchant Generate** (`MerchantVoucherGenerate.tsx`): "Fund Wallet" button navigates to `/merchant-wallet-fund`, but after funding, the success button sends them to `/merchant-voucher-management` (the dashboard) — losing all their selections. They have to start over.
2. **Sub-Merchant Buy** (`SubMerchantBuyVouchers.tsx`): Shows a toast "Please fund your wallet first" but provides no "Fund Wallet" button at all — dead end.
3. **MerchantWalletFund.tsx**: Has no awareness of where the user came from. Always redirects to the dashboard on success.

### Solution
Make the wallet funding flow "return-aware" so users resume exactly where they left off after funding.

### Changes

**1. `src/pages/MerchantWalletFund.tsx`**
- Accept a `returnTo` query parameter (e.g. `?returnTo=/merchant-voucher-generate`)
- On success, navigate to `returnTo` if present, otherwise fall back to `/merchant-voucher-management`
- Change the success button label from "Back to Dashboard" to "Continue" when a return path exists

**2. `src/pages/MerchantVoucherGenerate.tsx`**
- Change the "Fund Wallet" button on the insufficient balance warning to navigate to `/merchant-wallet-fund?returnTo=/merchant-voucher-generate`
- This ensures after funding, the user lands back on the generate page (they'll re-select, but at least they're in the right place)

**3. `src/pages/SubMerchantBuyVouchers.tsx`**
- Add a visible "Fund Wallet" button in the summary step when balance is insufficient (same pattern as merchant generate)
- Navigate to `/merchant-wallet-fund?returnTo=/sub-merchant-buy-vouchers`
- Show the insufficient balance warning inline instead of only as a toast

**4. `src/pages/MerchantWalletFund.tsx` — Success screen**
- Read `returnTo` from URL search params
- If present: button says "Continue to Vouchers" and navigates to `returnTo`
- If absent: button says "Back to Dashboard" and navigates to `/merchant-voucher-management`

### Flow After Fix
```text
Generate Vouchers → Insufficient Balance → "Fund Wallet" button
  → /merchant-wallet-fund?returnTo=/merchant-voucher-generate
  → Fund amount → Processing → Success
  → "Continue to Vouchers" button → /merchant-voucher-generate
```

Same pattern for sub-merchant buy flow.

