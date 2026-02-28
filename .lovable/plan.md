

## Voucher Batch Detail -- Statistics & Filter Overhaul (Both Merchant + Sub-Merchant)

### Summary of Changes

Three distinct layers of changes across both `MerchantVoucherBatchDetail.tsx` and `SubMerchantVoucherBatchDetail.tsx`:

---

### 1. Batch-Level Statistics (Top Cards) -- Count by BUNDLES, not cards

**Current**: 4 stats (Available, Sold, Used, Invalid) counting individual cards.

**New**: 3 stats (Available, Sold, Invalid) counting **bundles**. A bundle is classified by its dominant status:
- **Available**: All cards in the bundle are `available`
- **Sold**: At least one card is `sold_unused` and none are `invalidated`
- **Invalid**: At least one card is `invalidated`

These stats become **clickable filters** -- tapping one filters the bundle list below to show only bundles matching that classification. Tapping the active filter again clears it (show all).

Grid changes from `grid-cols-4` to `grid-cols-3`. "Used" stat is removed entirely from this level.

**New helper**: `getBatchBundleCounts(batch)` that classifies each bundle and returns `{ available, sold, invalidated }` bundle counts.

---

### 2. Bundle Header (Collapsed State) -- Only "Available" or "Sold"

**Current**: Shows up to 4 inline stats (avail, sold, used, inv).

**New**: Show only two stats: `available` count and `sold_unused` count (from card-level `getBundleStatusCounts`). Remove "used" and "inv" from this collapsed view.

---

### 3. Expanded Bundle Content -- Clickable "Used" / "Unused" Card Filters

**Current**: When a bundle is expanded, all cards are listed with no filtering.

**New**: Add a small clickable stat bar inside the expanded area (above the card list) showing:
- **Unused** count (cards with status `available` or `sold_unused`)
- **Used** count (cards with status `used`)

Tapping one filters the card list within that bundle. Tapping the active filter again shows all cards. These are pill-style toggles.

---

### Technical Details

#### File: `src/data/merchantVoucherData.ts`
- Add new exported function `getBatchBundleCounts(batch: VoucherBatch)` that iterates over `batch.bundles` and classifies each bundle:
  - If any card is `invalidated` -> bundle is "invalidated"
  - Else if any card is `sold_unused` -> bundle is "sold"
  - Else -> bundle is "available"
- Returns `{ available: number, sold: number, invalidated: number, total: number }`

#### File: `src/pages/MerchantVoucherBatchDetail.tsx`
- Add state: `batchStatusFilter: "available" | "sold" | "invalidated" | null` (default `null`)
- Add per-bundle state: `bundleCardFilter: Record<string, "used" | "unused" | null>` (default `{}`)
- Import and use `getBatchBundleCounts` for top stats
- Top stats grid: `grid-cols-3`, remove "Used", make each stat a tappable button that toggles `batchStatusFilter`
- Active filter gets a highlighted ring/border style
- `filteredBundles` memo: additionally filter by `batchStatusFilter` (classify each bundle same way as the count function)
- Bundle collapsed header: only show `avail` and `sold` counts
- Expanded bundle: add a row of "Unused" / "Used" pill-toggles with counts, updating `bundleCardFilter[bundle.id]`
- Card list filters by `bundleCardFilter[bundle.id]`: "unused" shows `available` + `sold_unused`, "used" shows `used`

#### File: `src/pages/SubMerchantVoucherBatchDetail.tsx`
- Same changes as the merchant version above (mirror implementation)

