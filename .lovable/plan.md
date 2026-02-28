

# Batch Number Format Update

## Current Format
Batch numbers are currently random 4-digit numbers like `BATCH-5568`.

## New Format
```text
BATCH-{YEAR}-{MMDD}-{MERCHANT_ID}-{UNIQUE_NUMBER}
```

**Example:** `BATCH-2026-0228-0001-5568`

- **YEAR**: 4-digit year of generation (e.g. `2026`)
- **MMDD**: Month and day combined (e.g. `0228` for Feb 28)
- **MERCHANT_ID**: A constant merchant identifier like `0001` (stays the same across all batches for that merchant)
- **UNIQUE_NUMBER**: Random unique number to distinguish multiple batches on the same day

## Files to Change

### 1. `src/data/merchantVoucherData.ts`
- Update `generateBatchNumber()` to accept a `Date` and `merchantId` string parameter
- New format: `` `BATCH-${year}-${mmdd}-${merchantId}-${uniqueNum}` ``
- Update `createMockBatch()` to pass the `createdAt` date and a default merchant ID (`0001`) to the generator
- Add a default `MERCHANT_ID` constant (e.g. `"0001"`)

### 2. `src/data/subMerchantVoucherData.ts`
- Update `createSubMerchantBatch()` to use the same new batch number format
- Use a different merchant ID prefix for sub-merchants (e.g. `"SM01"`) so they are distinguishable
- Pass the `createdAt` date into the generator

### 3. Pages (display only -- no changes needed)
All pages already display `batch.batchNumber` directly, so the new format will automatically appear everywhere: `MerchantVoucherBatches`, `MerchantVoucherBatchDetail`, `SubMerchantVoucherBatches`, `SubMerchantVoucherBatchDetail`, `MerchantVoucherManagement`, `SubMerchantVoucherManagement`.

## Technical Detail

Updated `generateBatchNumber` function:
```typescript
function generateBatchNumber(date: Date, merchantId: string = "0001"): string {
  const year = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const unique = String(Math.floor(1000 + Math.random() * 9000));
  return `BATCH-${year}-${mm}${dd}-${merchantId}-${unique}`;
}
```

