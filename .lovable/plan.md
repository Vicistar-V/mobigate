

## Fix Elements Cutting on Right Margin - Financial Overview

### Problem Identified
The Financial Overview dialog content is being cut off on the right margin on mobile devices. Looking at the screenshot, the "Withdraw" button text is clipped, indicating the dialog isn't properly respecting mobile viewport boundaries.

**Root Cause:** The `FinancialOverviewDialog.tsx` uses a standard `Dialog` component with `max-w-2xl` which doesn't properly handle mobile viewports. Unlike other wallet dialogs (`WalletTopUpDialog`, `WalletTransferDialog`) that use the mobile-first `Drawer` pattern, this dialog lacks proper mobile handling.

---

### Solution Overview

Convert `FinancialOverviewDialog` to use the established mobile-first pattern:
- Use `Drawer` component on mobile devices (via `useIsMobile` hook)
- Use `Dialog` on larger screens
- Apply proper padding and constraints to prevent margin clipping

---

### Implementation Details

#### File: `src/components/community/finance/FinancialOverviewDialog.tsx`

**Changes to make:**

1. **Add imports for Drawer components and useIsMobile hook:**
```tsx
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
```

2. **Add mobile detection:**
```tsx
const isMobile = useIsMobile();
```

3. **Create shared content component for reuse:**
```tsx
const Content = () => (
  <div className="flex-1 min-h-0 overflow-y-auto touch-auto overscroll-contain">
    <div className="px-4 pb-6 space-y-4">
      {/* Wallet Balance Card */}
      {/* Quick Actions */}
      {/* Monthly Summary */}
      {/* Recent Transactions */}
    </div>
  </div>
);
```

4. **Conditional rendering based on device:**
```tsx
if (isMobile) {
  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[92vh] flex flex-col overflow-hidden">
          <DrawerHeader className="pb-2 border-b shrink-0">
            <DrawerTitle>Financial Overview</DrawerTitle>
          </DrawerHeader>
          <Content />
        </DrawerContent>
      </Drawer>
      {/* Wallet Action Dialogs */}
    </>
  );
}

return (
  <>
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-4 pt-4 pb-2 shrink-0 border-b">
          <DialogTitle>Financial Overview</DialogTitle>
        </DialogHeader>
        <Content />
      </DialogContent>
    </Dialog>
    {/* Wallet Action Dialogs */}
  </>
);
```

---

### Mobile-Specific Fixes

| Issue | Fix |
|-------|-----|
| Right margin clipping | Drawer uses `max-h-[92vh]` with proper internal padding (`px-4`) |
| Dialog too wide on mobile | Drawer slides from bottom, respects safe areas |
| ScrollArea stealing focus | Use native `overflow-y-auto touch-auto` instead |
| Button text truncation | Grid buttons get proper spacing with `gap-3` instead of `gap-2` |

---

### Detailed Code Structure

**Mobile Layout (Drawer):**
```text
+---------------------------------------+
| Financial Overview           [Handle] |  <- DrawerHeader
+---------------------------------------+
|                                       |
|  +-------------------------------+    |
|  | Total Balance                 |    |  <- Wallet Card
|  | ₦125,000 (M125,000)          |    |
|  +-------------------------------+    |
|                                       |
|  [Top Up]  [Transfer]  [Withdraw]     |  <- 3-col grid, gap-3
|                                       |
|  +--Income--+  +--Expenses--+         |  <- 2-col grid
|  | +₦45,000 |  | -₦28,000   |         |
|  +----------+  +------------+         |
|                                       |
|  Recent Transactions                  |  <- Scrollable list
|  ...                                  |
|                                       |
+---------------------------------------+
```

---

### Files to Modify

| File | Action |
|------|--------|
| `src/components/community/finance/FinancialOverviewDialog.tsx` | **MODIFY** - Add Drawer pattern for mobile |

---

### Expected Outcome

1. On mobile: Financial Overview opens as a bottom drawer (92vh height)
2. All content has proper padding (`px-4`) with no edge clipping
3. "Withdraw" button and all other elements display fully without truncation
4. Native scroll behavior with `touch-auto` for smooth mobile scrolling
5. Desktop users see the same Dialog experience (unchanged)

