
# Mobigate Universal Financial Protocol - Dual Currency Display Implementation

## Overview

This plan ensures that **all financial values displayed in Mobi (M) are accompanied by their local currency equivalents**, reflecting the Mobigate Universal Financial Protocol where:

1. **Mobi (M)** is the universal platform currency for all internal operations
2. **Communities and users operate in their local currencies** (NGN, USD, ZAR, etc.)
3. **All displays show both values** for user clarity

The existing infrastructure (`mobiCurrencyTranslation.ts`, `MobiCurrencyDisplay.tsx`) already supports this, but many components use basic `formatMobi()` without the local equivalent.

---

## Components Requiring Updates

### Category 1: Admin Finance Components (High Priority)

| File | Current Display | Required Change |
|------|-----------------|-----------------|
| `LevyDetailSheet.tsx` | `M{levy.amount.toLocaleString()}` | Add local equivalent using `formatMobiWithLocal()` |
| `LevyProgressCard.tsx` | Uses `MobiCompactDisplay` | Already correct, but verify |
| `ManageDuesLeviesDialog.tsx` | `M{obligation.amount.toLocaleString()}` | Add local equivalent |

### Category 2: Mobigate Admin Dashboard

| File | Current Display | Required Change |
|------|-----------------|-----------------|
| `MobigateAdminDashboard.tsx` | `formatMobi()` only | Add local equivalent for revenue figures |
| `ServiceChargeConfigCard.tsx` | `formatMobi()` only | Add local equivalent in preview section |
| `NominationFeeSettingsSection.tsx` | `formatMobi()` only | Add local equivalent for fee editing |

### Category 3: Election & Declaration Flow

| File | Current Display | Required Change |
|------|-----------------|-----------------|
| `DeclarationOfInterestSheet.tsx` | `formatMobiAmount()` | Replace with `formatMobiWithLocal()` or inline local |
| `CandidateDashboardSheet.tsx` | Verify fee displays | Add local equivalent |
| `CampaignRoyaltyDetailSheet.tsx` | `formatMobiAmount()` | Add local equivalent |

### Category 4: Quiz & Community Features

| File | Current Display | Required Change |
|------|-----------------|-----------------|
| `CommunityQuizPlayDialog.tsx` | `M{amount.toLocaleString()}` | Add local equivalent |

---

## Implementation Strategy

### Phase 1: Create Enhanced Display Utility

**File: `src/lib/mobiCurrencyTranslation.ts`**

Add a new helper function for inline dual display:

```typescript
/**
 * Format Mobi with inline local currency (compact version)
 * Returns: "M50,000 (₦50,000)" for NGN or "M50,000 ($100)" for USD
 */
export function formatMobiWithLocalInline(
  mobiAmount: number, 
  localCurrency: string = "NGN"
): string {
  const result = formatMobiWithLocal(mobiAmount, localCurrency);
  
  // For NGN (1:1 rate), only show Mobi since values are identical
  if (localCurrency === "NGN") {
    return result.mobi;
  }
  
  return result.combined;
}
```

### Phase 2: Create Community Currency Context

**File: `src/contexts/CurrencyContext.tsx`**

Create a React Context to provide the community's local currency throughout the app:

```typescript
interface CurrencyContextType {
  communityLocalCurrency: string;
  userPreferredCurrency: string;
  formatWithLocal: (mobiAmount: number) => { mobi: string; local: string; combined: string };
}
```

This allows components to automatically use the correct currency for the current community.

### Phase 3: Update Financial Display Components

#### 3.1 Update LevyDetailSheet.tsx

Replace inline `M{amount}` with dual display:

**Current:**
```jsx
<span>M{levy.amount.toLocaleString()}/member</span>
```

**Updated:**
```jsx
<MobiCompactDisplay amount={levy.amount} />
<span className="text-xs text-muted-foreground ml-1">
  (≈ {formatLocalAmount(levy.amount, "NGN")})
</span>
```

#### 3.2 Update ManageDuesLeviesDialog.tsx

Add local equivalent to collection progress:

**Current:**
```jsx
M{obligation.totalCollected.toLocaleString()} / M{obligation.totalExpected.toLocaleString()}
```

**Updated:**
```jsx
{formatMobiAmount(obligation.totalCollected)} / {formatMobiAmount(obligation.totalExpected)}
<p className="text-xs text-muted-foreground">
  ≈ {formatLocalAmount(obligation.totalCollected, "NGN")} / {formatLocalAmount(obligation.totalExpected, "NGN")}
</p>
```

#### 3.3 Update MobigateAdminDashboard.tsx

For revenue figures, add local equivalent:

**Current:**
```jsx
<p className="text-2xl font-bold">{formatMobi(platformStats.platformRevenue)}</p>
```

**Updated:**
```jsx
<p className="text-2xl font-bold">{formatMobi(platformStats.platformRevenue)}</p>
<p className="text-xs text-muted-foreground">
  ≈ {formatLocalAmount(platformStats.platformRevenue, "NGN")}
</p>
```

#### 3.4 Update ServiceChargeConfigCard.tsx

Add local equivalent to preview calculation:

**Current:**
```jsx
<span className="font-medium">{formatMobi(exampleFee)}</span>
```

**Updated:**
```jsx
<div>
  <span className="font-medium">{formatMobi(exampleFee)}</span>
  <span className="text-xs text-muted-foreground ml-1">
    (≈ {formatLocalAmount(exampleFee, "NGN")})
  </span>
</div>
```

#### 3.5 Update DeclarationOfInterestSheet.tsx

The fee breakdown should show both currencies:

**Current:**
```jsx
<span>{formatMobiAmount(costBreakdown.nominationFee)}</span>
```

**Updated:**
```jsx
<div className="text-right">
  <span>{formatMobiAmount(costBreakdown.nominationFee)}</span>
  <p className="text-xs text-muted-foreground">
    ≈ {formatLocalAmount(costBreakdown.nominationFee, "NGN")}
  </p>
</div>
```

### Phase 4: Add Explanatory UI Elements

#### 4.1 Currency Information Tooltip

Create a reusable tooltip component explaining the Mobi system:

**File: `src/components/common/MobiExplainerTooltip.tsx`**

```typescript
export function MobiExplainerTooltip() {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Info className="h-3 w-3 text-muted-foreground" />
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <p className="text-xs">
          <strong>Mobi (M)</strong> is Mobigate's universal currency. 
          All platform transactions are processed in Mobi and automatically 
          converted to your local currency at current exchange rates.
        </p>
      </TooltipContent>
    </Tooltip>
  );
}
```

#### 4.2 Add Info Note to Fee Sections

In components showing fees, add an informational note:

```jsx
<div className="flex items-start gap-2 p-3 bg-primary/5 rounded-lg mt-4">
  <Globe className="h-4 w-4 text-primary shrink-0 mt-0.5" />
  <p className="text-xs text-muted-foreground">
    All fees are charged in Mobi (M) and automatically converted to your 
    community's local currency. Current rate: ₦1 = M1
  </p>
</div>
```

---

## Files to Create

| File | Purpose |
|------|---------|
| `src/contexts/CurrencyContext.tsx` | Community currency context provider |
| `src/components/common/MobiExplainerTooltip.tsx` | Educational tooltip about Mobi |

## Files to Modify

| File | Change Type |
|------|-------------|
| `src/lib/mobiCurrencyTranslation.ts` | Add `formatMobiWithLocalInline` helper |
| `src/components/admin/finance/LevyDetailSheet.tsx` | Add local currency display |
| `src/components/admin/finance/ManageDuesLeviesDialog.tsx` | Add local currency display |
| `src/pages/admin/MobigateAdminDashboard.tsx` | Add local currency to revenue figures |
| `src/components/mobigate/ServiceChargeConfigCard.tsx` | Add local currency to preview |
| `src/components/mobigate/NominationFeeSettingsSection.tsx` | Add local currency to fee editing |
| `src/components/community/elections/DeclarationOfInterestSheet.tsx` | Add local currency to fee breakdown |
| `src/components/admin/election/CampaignRoyaltyDetailSheet.tsx` | Add local currency display |
| `src/components/community/CommunityQuizPlayDialog.tsx` | Add local currency to stake/win amounts |

---

## Display Pattern Guidelines

### Pattern 1: Large Amounts (Headers/Stats)
```
M12,500,000
≈ ₦12,500,000
```

### Pattern 2: Inline Values (Lists/Rows)
```
M50,000 (≈ ₦50,000)
```

### Pattern 3: Fee Breakdowns (Detailed)
```
Nomination Fee:     M50,000
                    ≈ ₦50,000
Processing Fee:     M2,500
                    ≈ ₦2,500
─────────────────────────────
Total:              M52,500
                    ≈ ₦52,500
```

### Pattern 4: For Non-NGN Communities
When community operates in USD:
```
M50,000
≈ $100.00
```

---

## Implementation Order

1. **First**: Create `CurrencyContext.tsx` and `MobiExplainerTooltip.tsx`
2. **Second**: Update `mobiCurrencyTranslation.ts` with new helper
3. **Third**: Update Admin Finance components (LevyDetailSheet, ManageDuesLeviesDialog)
4. **Fourth**: Update Mobigate Admin Dashboard and related
5. **Fifth**: Update Election/Declaration flow
6. **Last**: Update Quiz and other community features

---

## Mobile-First Considerations

- Local currency equivalents use `text-xs` for compact display
- On mobile, stack Mobi and local vertically when space is limited
- Use `text-muted-foreground` for secondary (local) values
- Maintain touch-friendly input areas (min 44px)

---

## Verification Checklist

After implementation, verify:
- [ ] Levy amounts show both Mobi and local currency
- [ ] Collection progress shows dual currency
- [ ] Mobigate Admin revenue figures show local equivalent
- [ ] Nomination fee breakdown shows both currencies
- [ ] Campaign royalty details show dual display
- [ ] Quiz stake/win amounts show local equivalent
- [ ] Explanatory tooltips appear where needed
- [ ] All displays work correctly on mobile
