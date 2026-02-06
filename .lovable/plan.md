

## Fix Mobile Text Input Flickering Issue

### Problem Identified
Text inputs inside ScrollArea components are flickering and writing incorrectly on mobile devices. The issue occurs in:

1. **Election Details** - "Additional Notes" textarea
2. **Manage Dues & Levies** - "Obligation Name" input and "Description" textarea  
3. **Account Statements** - Search input

**Root Cause:** When inputs are inside a Radix ScrollArea component, mobile browsers can lose and regain focus rapidly due to the scroll viewport intercepting touch events. The inputs are missing the critical `onClick={(e) => e.stopPropagation()}` handler that prevents the scroll logic from stealing focus.

---

### Solution

Apply the established mobile input optimization pattern to all affected form inputs:

```tsx
<Input
  className="touch-manipulation"
  autoComplete="off"
  autoCorrect="off"
  spellCheck={false}
  onClick={(e) => e.stopPropagation()}  // Prevents scroll stealing focus
/>
```

---

### Files to Modify

#### 1. `src/components/admin/finance/ManageDuesLeviesDialog.tsx`

**Lines 286-290** - Obligation Name Input:
```tsx
<Input
  placeholder="e.g., Annual Dues 2025"
  value={formData.name}
  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
  className="touch-manipulation"
  autoComplete="off"
  autoCorrect="off"
  spellCheck={false}
  onClick={(e) => e.stopPropagation()}
/>
```

**Lines 321-326** - Amount Input:
```tsx
<Input
  type="number"
  placeholder="15000"
  value={formData.amount}
  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
  inputMode="decimal"
  className="touch-manipulation"
  onClick={(e) => e.stopPropagation()}
/>
```

**Lines 330-334** - Due Date Input:
```tsx
<Input
  type="date"
  value={formData.dueDate}
  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
  className="touch-manipulation"
  onClick={(e) => e.stopPropagation()}
/>
```

**Lines 340-345** - Description Textarea:
```tsx
<Textarea
  placeholder="Describe this obligation..."
  value={formData.description}
  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
  className="min-h-[80px] touch-manipulation"
  autoComplete="off"
  autoCorrect="off"
  spellCheck={false}
  onClick={(e) => e.stopPropagation()}
/>
```

**Lines 351-357** - Grace Period Input:
```tsx
<Input
  type="number"
  value={formData.gracePeriodDays}
  onChange={(e) => setFormData({ ...formData, gracePeriodDays: e.target.value })}
  inputMode="numeric"
  className="touch-manipulation"
  onClick={(e) => e.stopPropagation()}
/>
```

**Lines 362-365** - Late Fee Input:
```tsx
<Input
  type="number"
  value={formData.lateFee}
  onChange={(e) => setFormData({ ...formData, lateFee: e.target.value })}
  className="flex-1 touch-manipulation"
  inputMode="decimal"
  onClick={(e) => e.stopPropagation()}
/>
```

---

#### 2. `src/components/admin/finance/AccountStatementsDialog.tsx`

**Lines 288-294** - Search Input:
```tsx
<Input
  placeholder="Search by description or reference..."
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  className="pl-9 touch-manipulation"
  autoComplete="off"
  autoCorrect="off"
  spellCheck={false}
  onClick={(e) => e.stopPropagation()}
/>
```

**Lines 336-341** - From Date Input:
```tsx
<Input
  type="date"
  value={dateFrom}
  onChange={(e) => setDateFrom(e.target.value)}
  className="h-9 touch-manipulation"
  onClick={(e) => e.stopPropagation()}
/>
```

**Lines 348-352** - To Date Input:
```tsx
<Input
  type="date"
  value={dateTo}
  onChange={(e) => setDateTo(e.target.value)}
  className="h-9 touch-manipulation"
  onClick={(e) => e.stopPropagation()}
/>
```

---

### Summary of Changes

| File | Inputs Fixed |
|------|--------------|
| `ManageDuesLeviesDialog.tsx` | Obligation Name, Amount, Due Date, Description, Grace Period, Late Fee (6 inputs) |
| `AccountStatementsDialog.tsx` | Search, From Date, To Date (3 inputs) |

---

### Technical Details

The fix uses the established pattern from `memory/constraints/mobile-input-interaction-optimization`:

1. **`onClick={(e) => e.stopPropagation()}`** - Prevents the ScrollArea's viewport from capturing the click event and stealing focus
2. **`touch-manipulation`** - Enables native touch behaviors while disabling double-tap zoom
3. **`autoComplete="off"`, `autoCorrect="off"`, `spellCheck={false}`** - Prevents browser features that can interfere with mobile input

The `DeclareElectionDrawer.tsx` already has these optimizations applied correctly (lines 418-424, 511-522), which is why its inputs work properly. The other files need the same treatment.

