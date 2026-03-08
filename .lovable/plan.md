

## Plan: Restructure Manage Merchants Settings Tab

### Current State
The Settings tab only shows one item: **Voucher Bulk Discount** (the `VoucherDiscountSettingsCard`). It's missing two important admin settings sections.

### What We're Building
Three distinct, collapsible settings cards on the Settings tab:

```text
Settings Tab
├── 1. Voucher Settings (Voucher Bulk Purchase Discounts)  ← exists
├── 2. Merchant Application Fees Settings                  ← NEW
└── 3. Eligibility Settings                                ← NEW
```

### 1. Voucher Settings (already exists)
- Keep `VoucherDiscountSettingsCard` as-is with its collapsible, password-gated interface

### 2. Merchant Application Fees Settings (new)
A collapsible card to configure merchant application fees:
- **Application Fee** — currently M50,000 (from `IndividualMerchantApplication.tsx`), editable with lock toggle
- **Waiver Fee** — currently M50,000 additional, editable with lock toggle
- Shows current values, password-gated like the voucher card
- Save button with toast confirmation

### 3. Eligibility Settings (new)
A collapsible card to configure the eligibility thresholds from `MerchantEligibilityCard.tsx`:
- Editable thresholds for each requirement: Verified Days (180), Invited Friends (1,000), Friends (5,000), Followers (5,000), E-Library Contents (100), Content Likes (5,000), Users Followed (500)
- Registration Fee amount (M1,000,000), IMVSD amount (M1,000,000)
- Each field has a lock toggle, password-gated access
- Save button with toast confirmation

### Files to Create/Modify

| File | Action |
|------|--------|
| `src/components/mobigate/MerchantAppFeeSettingsCard.tsx` | **Create** — Collapsible card for application fee + waiver fee config |
| `src/components/mobigate/EligibilitySettingsCard.tsx` | **Create** — Collapsible card for eligibility threshold config |
| `src/data/platformSettingsData.ts` | **Modify** — Add merchant app fee + eligibility settings with getters/setters |
| `src/pages/admin/ManageMerchantsPage.tsx` | **Modify** — Import and render the two new cards in the Settings tab alongside the existing voucher card, each with its own header row |

### Technical Details
- Both new cards follow the same collapsible + password-gate + lock-toggle pattern as `VoucherDiscountSettingsCard`
- All settings use the same mock-data-with-setter pattern from `platformSettingsData.ts`
- Mobile-first: all inputs h-11, text-sm minimum, full-width cards stacked vertically
- Each card has a summary line showing current config when collapsed (e.g., "App Fee: M50,000 · Waiver: M50,000")

