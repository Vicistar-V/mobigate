

# Rename Payment Labels and Add Merchant Sort

## Changes

### 1. Rename payment summary labels in `BuyVouchersPage.tsx` (lines 579-596)

Current labels will be updated to match the user's requested naming:

| Current | New |
|---------|-----|
| Subtotal (Mobi) | Total Voucher Value |
| Merchant Rate | Regular Price Value |
| Discount (X%) | Merchant's Discount (X%) |
| Total to Pay | Amount to Pay |

Also add a "You receive M8,250,000 in Mobi vouchers" note updated to say the same.

### 2. Add sort options to the merchant selection step (Step 3, lines 469-536)

Add a horizontal scrollable row of sort chips above the merchant list. Sort options:
- **Highest Discount** (default -- already sorted this way)
- **Lowest Discount**
- **Highest Rating**
- **Lowest Rating**

These will be compact pill-style buttons in a horizontal scroll row. Tapping one sorts the merchant list accordingly. Active sort chip gets a highlighted style.

New state: `merchantSort` with values `"discount_high" | "discount_low" | "rating_high" | "rating_low"`.

### Files to edit
- `src/pages/BuyVouchersPage.tsx` -- rename labels in payment step + add sort state and UI in merchants step

### Design
- Mobile-only, 360px target
- Sort chips: `h-8 rounded-full text-xs` in `flex overflow-x-auto gap-2`
- No tiny text -- all labels text-sm, values text-sm+
