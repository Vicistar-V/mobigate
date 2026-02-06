

## Fix Global Input Flickering Issue on Mobile

### Problem Identified
Text input fields across the entire application (especially within Finance admin sections like Manage Dues & Levies, Account Statements, Members' Financial Reports, Financial Audit, and View Obligations) are experiencing flickering and erratic text entry on mobile devices.

**Root Cause:** The Radix UI `ScrollArea` and other container components (Drawer, Dialog, Sheet) intercept touch/click events to manage scrolling behavior. When an input field is inside these containers, the touch intended to focus the field gets captured by the parent, causing the input to lose and regain focus rapidly - resulting in:
- Keyboard flickering/dismissal
- Random characters appearing
- Focus jumping away from input
- Text entry becoming unstable

### Solution: Global Fix at Base Component Level

Instead of adding `onClick={(e) => e.stopPropagation()}` to every individual input across 50+ files, the most effective fix is to modify the base UI components themselves.

---

### Files to Modify

| File | Action | Description |
|------|--------|-------------|
| `src/components/ui/input.tsx` | **MODIFY** | Add onClick with stopPropagation to prevent focus stealing |
| `src/components/ui/textarea.tsx` | **MODIFY** | Add onClick with stopPropagation to prevent focus stealing |

---

### Implementation Details

#### 1. Update `src/components/ui/input.tsx`

Add an `onClick` handler that stops event propagation while preserving any custom onClick handlers passed via props:

```tsx
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, allowImagePaste = false, onPaste, onClick, ...props }, ref) => {
    // ... existing handlePaste code ...

    const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
      e.stopPropagation();
      if (onClick) {
        onClick(e);
      }
    };

    return (
      <input
        // ... existing props ...
        onClick={handleClick}
        {...props}
      />
    );
  },
);
```

#### 2. Update `src/components/ui/textarea.tsx`

Apply the same pattern:

```tsx
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, allowImagePaste = false, onPaste, onClick, ...props }, ref) => {
    // ... existing handlePaste code ...

    const handleClick = (e: React.MouseEvent<HTMLTextAreaElement>) => {
      e.stopPropagation();
      if (onClick) {
        onClick(e);
      }
    };

    return (
      <textarea
        // ... existing props ...
        onClick={handleClick}
        {...props}
      />
    );
  }
);
```

---

### Why This Fixes Everything

This single change at the base component level will:

1. **Fix ALL existing inputs** - Every Input and Textarea component across the entire app automatically gets the fix
2. **Prevent future issues** - New inputs added in the future will automatically be protected
3. **Remove redundant code** - Can remove individual `onClick={(e) => e.stopPropagation()}` handlers from files that were previously patched

---

### Mobile Optimization Pattern Applied

| Property | Already Present | Purpose |
|----------|----------------|---------|
| `touch-manipulation` | Yes | Prevents double-tap zoom interference |
| `autoComplete="off"` | Yes | Prevents browser autocomplete popups |
| `autoCorrect="off"` | Yes | Disables iOS auto-correction |
| `spellCheck={false}` | Yes | Prevents spellcheck visual glitches |
| `onClick={stopPropagation}` | **ADDING** | Prevents ScrollArea from stealing focus |

---

### Expected Outcome

1. All text inputs across admin sections work flawlessly on mobile
2. No more flickering when tapping input fields
3. Text appears correctly as typed without random characters
4. Focus stays on input while typing
5. Keyboard stays visible and doesn't dismiss unexpectedly
6. Smooth typing experience within all Drawer, Dialog, Sheet, and ScrollArea containers

