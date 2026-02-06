

## Mobile Optimization for Financial Audit Dialog

### Problem Identified
Looking at the screenshot, the "Risk Indicators" section content is being cut off on the right margin. The "Recoverable/pending amounts" text under "Floating Funds" is clipped. The issue is:

1. **DrawerContent missing flex layout** - Line 449: `className="max-h-[92vh]"` needs `flex flex-col` for proper flex child behavior
2. **ScrollArea wrapper not respecting padding** - Content padding is applied inside ScrollArea but the container structure allows overflow
3. **Risk Indicators grid cells too constrained** - The 2-column grid doesn't give enough room for wrapped currency values on small screens

---

### Solution: Complete Mobile Layout Restructure

#### File: `src/components/admin/finance/AdminFinancialAuditDialog.tsx`

**Changes to make:**

---

#### 1. Fix Drawer Container Structure (Lines 448-456)

**Before:**
```tsx
<Drawer open={open} onOpenChange={onOpenChange}>
  <DrawerContent className="max-h-[92vh]">
    <DrawerHeader className="border-b">
      <DrawerTitle>Financial Audit</DrawerTitle>
    </DrawerHeader>
    <ScrollArea className="flex-1 p-4 overflow-y-auto touch-auto">
      <Content />
    </ScrollArea>
  </DrawerContent>
</Drawer>
```

**After:**
```tsx
<Drawer open={open} onOpenChange={onOpenChange}>
  <DrawerContent className="max-h-[92vh] flex flex-col overflow-hidden">
    <DrawerHeader className="border-b shrink-0 px-4">
      <DrawerTitle>Financial Audit</DrawerTitle>
    </DrawerHeader>
    <div className="flex-1 min-h-0 overflow-y-auto touch-auto overscroll-contain">
      <div className="px-4 pb-6">
        <Content />
      </div>
    </div>
  </DrawerContent>
</Drawer>
```

---

#### 2. Convert Risk Indicators to Single Column Layout (Lines 188-213)

The 2-column grid causes clipping. Switch to stacked single-column layout for mobile clarity:

**Before:**
```tsx
<div className="grid grid-cols-2 gap-3">
  <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
    ...Total Deficits...
  </div>
  <div className="p-3 rounded-lg bg-purple-50 border border-purple-200">
    ...Floating Funds...
  </div>
</div>
```

**After (Single Column Stack):**
```tsx
<div className="space-y-3">
  <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-center gap-2">
        <Minus className="h-4 w-4 text-amber-600 shrink-0" />
        <span className="text-xs text-muted-foreground">Total Deficits</span>
      </div>
      <p className="text-base font-bold text-amber-600 text-right">
        {formatCurrency(currentAudit.totalDeficits)}
      </p>
    </div>
    <p className="text-xs text-muted-foreground mt-1.5">
      Debts community owes
    </p>
  </div>
  <div className="p-3 rounded-lg bg-purple-50 border border-purple-200">
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-purple-600 shrink-0" />
        <span className="text-xs text-muted-foreground">Floating Funds</span>
      </div>
      <p className="text-base font-bold text-purple-600 text-right">
        {formatCurrency(currentAudit.floatingFunds)}
      </p>
    </div>
    <p className="text-xs text-muted-foreground mt-1.5">
      Recoverable/pending amounts
    </p>
  </div>
</div>
```

---

#### 3. Summary Cards - Keep 2x2 Grid but Optimize Text (Lines 139-180)

The summary cards work but need tighter text handling:

- Reduce font size from `text-lg` to `text-base` for currency values
- Remove `whitespace-normal` in favor of controlled line breaks
- Add `min-w-0` to container for proper truncation

**Key Changes:**
```tsx
<Card className="p-3 bg-green-50 border-green-200 min-w-0">
  <div className="flex items-center gap-2 mb-1">
    <ArrowDownLeft className="h-4 w-4 text-green-600 shrink-0" />
    <span className="text-xs text-muted-foreground">Funds Received</span>
  </div>
  <p className="text-base font-bold text-green-600 leading-tight break-words">
    {formatCurrency(currentAudit.totalFundsReceived)}
  </p>
</Card>
```

Apply same pattern to all 4 summary cards.

---

#### 4. Balance Flow Section - Restack Layout (Lines 226-254)

Use stacked rows instead of side-by-side for better mobile display:

**Before:**
```tsx
<div className="flex items-start justify-between gap-3">
  <span className="text-sm text-muted-foreground">Opening Balance</span>
  <span className="font-medium text-right whitespace-normal break-words leading-tight max-w-[55%]">
    {formatCurrency(currentAudit.openingBalance)}
  </span>
</div>
```

**After:**
```tsx
<div className="flex flex-col gap-0.5">
  <span className="text-sm text-muted-foreground">Opening Balance</span>
  <span className="font-medium text-base">
    {formatCurrency(currentAudit.openingBalance)}
  </span>
</div>
```

Apply to all Balance Flow rows (Opening Balance, Funds Received, Funds Spent, Closing Balance).

---

### Mobile Layout Pattern Summary

| Section | Before | After |
|---------|--------|-------|
| Risk Indicators | 2-column grid | Single column stack with horizontal label-value layout |
| Summary Cards | 2x2 grid with `text-lg` | 2x2 grid with `text-base` and `min-w-0` |
| Balance Flow | Side-by-side with `max-w-[55%]` | Stacked rows (label above value) |
| Drawer Container | `max-h-[92vh]` only | `max-h-[92vh] flex flex-col overflow-hidden` with native scroll |

---

### Files to Modify

| File | Action |
|------|--------|
| `src/components/admin/finance/AdminFinancialAuditDialog.tsx` | **MODIFY** - Complete mobile layout restructure |

---

### Expected Outcome

1. No content clipped on right margin
2. "Recoverable/pending amounts" text fully visible
3. All currency values display without truncation
4. Smooth native scrolling on mobile
5. Proper flex layout ensures header stays fixed
6. Single-column Risk Indicators prevent horizontal overflow
7. Balance Flow rows use stacked layout for clarity

