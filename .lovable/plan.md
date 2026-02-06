

## Fix "Accreditation Complete" Text Overflow

### Problem
The "Accreditation Complete!" text is still getting cut off on mobile viewports even after reducing to `text-base` (16px). The button width is constrained and the text plus icon doesn't fit.

### Solution
Further reduce the font size and optimize the button layout for narrow mobile screens.

---

## Implementation Details

### File: `src/components/community/elections/ElectionAccreditationTab.tsx`

**Lines 317-343 - Changes:**

| Element | Current | New |
|---------|---------|-----|
| Button text size | `text-base` | `text-sm` |
| Gap between icon and text | `gap-2` | `gap-1.5` |
| Icon size | `h-5 w-5` | `h-4 w-4` |
| Button padding | `py-5` | `py-4` |

**Updated Code:**
```tsx
<Button 
  className={`w-full text-sm font-bold py-4 transition-all duration-300 ${...}`}
  ...
>
  {isAccreditationLoading ? (
    <div className="flex items-center justify-center gap-1.5">
      <Loader2 className="h-4 w-4 animate-spin" />
      <span>Processing...</span>
    </div>
  ) : isAccredited ? (
    <div className="flex items-center justify-center gap-1.5">
      <CheckCircle2 className="h-4 w-4" />
      <span>Accreditation Complete!</span>
    </div>
  ) : (
    "Get Accreditation Now!"
  )}
</Button>
```

---

## Files to Modify

| File | Change |
|------|--------|
| `src/components/community/elections/ElectionAccreditationTab.tsx` | Reduce `text-base` to `text-sm`, icons to `h-4 w-4`, gap to `gap-1.5` |

---

## Expected Outcome
- "Accreditation Complete!" text fits fully within the button on all mobile viewports
- Button maintains proper touch target height (44px minimum)
- Icon and text are properly aligned with tighter spacing

