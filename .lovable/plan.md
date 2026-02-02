
# Fix: Wallet Top Up Voucher List - Scroll Jump Prevention

## Problem Summary
When selecting multiple voucher denominations in the "Top Up Wallet" drawer (especially items further down the list), the list jumps back to the top after each selection. This makes it extremely frustrating to select multiple vouchers on mobile.

## Root Cause Analysis
The current implementation uses a `useLayoutEffect` hook to restore scroll position after React re-renders. However, this approach has several weaknesses:

1. **Browser Focus Behavior**: When a `Checkbox` or `Button` receives focus on mobile, the browser automatically scrolls to ensure the focused element is visible. This happens *after* the `useLayoutEffect` restore.

2. **Timing Race Condition**: The `onPreInteract` callback captures scroll position on `pointerDown`, but by the time the state updates and `useLayoutEffect` runs, the browser may have already triggered a focus-scroll.

3. **Radix Checkbox Internals**: The Radix `Checkbox` component internally manages focus, which can trigger scroll adjustments that the current prevention logic doesn't catch.

## Solution Architecture

### Strategy: Eliminate Focus-Triggered Scrolling

Instead of fighting the browser's scroll behavior with capture/restore, we'll prevent the focus from causing scroll in the first place:

1. **Disable focusable on quantity buttons** - Use `tabIndex={-1}` to prevent focus ring and associated scroll
2. **Use `preventScroll` option** - When programmatically focusing elements
3. **Block focus on checkbox clicks** - Add `preventScroll: true` to focus calls
4. **Apply `touch-manipulation`** - Already present, ensure it's working with other fixes

### Implementation Plan

---

### File 1: `src/components/community/finance/VoucherDenominationSelector.tsx`

**Changes:**

1. **Add `tabIndex={-1}` to +/− buttons** to prevent them from receiving focus (and triggering scroll):
   ```tsx
   <Button
     variant="outline"
     size="icon"
     className="h-7 w-7 touch-manipulation"
     tabIndex={-1}  // Add this
     onClick={(e) => handleQuantityChange(voucher.id, -1, e)}
     disabled={quantity <= 1}
   >
   ```

2. **Prevent focus on the Checkbox via `onPointerDown`** by calling `e.preventDefault()` which stops the browser from shifting focus:
   ```tsx
   <Checkbox
     id={voucher.id}
     checked={isSelected}
     onPointerDown={(e) => {
       e.preventDefault();  // Prevents focus scroll
       e.stopPropagation();
       onPreInteract?.();
     }}
     ...
   />
   ```

3. **Prevent focus on Card click** - Apply same pattern to the card's `onPointerDown`:
   ```tsx
   <Card
     ...
     onPointerDown={(e) => {
       e.preventDefault(); // Block native focus
       onPreInteract?.();
     }}
     ...
   >
   ```

4. **Remove `tabIndex={0}` from Card** - Cards don't need keyboard focus for this UI pattern on mobile

---

### File 2: `src/components/community/finance/WalletTopUpDialog.tsx`

**Changes:**

1. **Strengthen scroll restoration with `requestAnimationFrame` delay** - Add a small delay before and after restoring to handle edge cases:
   ```tsx
   useLayoutEffect(() => {
     if (step !== "vouchers") return;
     if (!vouchersScrollLockRef.current) return;
     
     const el = vouchersScrollRef.current;
     if (!el) return;
     
     // Restore immediately
     el.scrollTop = vouchersScrollTopRef.current;
     
     // Also restore after a micro-delay to catch late focus scrolls
     const scrollPos = vouchersScrollTopRef.current;
     requestAnimationFrame(() => {
       el.scrollTop = scrollPos;
       requestAnimationFrame(() => {
         el.scrollTop = scrollPos;
         vouchersScrollLockRef.current = false;
       });
     });
   }, [selectedVouchers, step]);
   ```

2. **Add `scroll-behavior: auto` style** to prevent smooth scrolling from interfering with the restore:
   ```tsx
   <div
     ref={vouchersScrollRef}
     className="flex-1 min-h-0 overflow-y-auto touch-auto overscroll-contain"
     style={{ scrollBehavior: 'auto' }}
     ...
   >
   ```

---

## Technical Details

### Why `tabIndex={-1}` Works
When an element has `tabIndex={-1}`, clicking it won't shift browser focus to that element, which means the browser won't trigger its "scroll focused element into view" behavior.

### Why `e.preventDefault()` on `onPointerDown` Works
Calling `preventDefault()` on the `pointerdown` event prevents the subsequent `focus` event from firing, which is what triggers the browser's scroll-to-element behavior.

### Why Multiple `requestAnimationFrame` Calls
Mobile browsers sometimes queue scroll adjustments that happen across multiple animation frames. By restoring in multiple frames, we catch any delayed scroll adjustments.

---

## Files to Modify
1. `src/components/community/finance/VoucherDenominationSelector.tsx`
2. `src/components/community/finance/WalletTopUpDialog.tsx`

## Expected Outcome
After these changes, selecting vouchers (including those at the bottom of the list) will no longer cause the list to jump to the top. The user's scroll position will be maintained throughout the selection process.
