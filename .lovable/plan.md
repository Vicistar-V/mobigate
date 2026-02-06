

## Fix Text Input Flickering in Members Financial Reports

### Problem Identified
The search input field in "Members Financial Reports" and related financial detail sheets is experiencing flickering and erratic text behavior on mobile devices. This is a known mobile input issue where the `ScrollArea` component steals focus from text inputs, causing typing problems.

**Root Cause:** The `Input` components are missing the mobile-specific optimizations documented in the project's memory constraints:
- Missing `touch-manipulation` class for proper touch handling
- Missing `onClick={(e) => e.stopPropagation()}` to prevent focus stealing
- Missing `autoComplete`, `autoCorrect`, and `spellCheck` disabling

---

### Affected Files

| File | Line | Description |
|------|------|-------------|
| `src/components/admin/finance/MembersFinancialReportsDialog.tsx` | 147-152 | Main search input in Members Financial Reports |
| `src/components/admin/finance/IncomeSourceDetailSheet.tsx` | 173-178 | Search input for income source details |
| `src/components/admin/finance/ExpenseSourceDetailSheet.tsx` | 522-527 | Search input for expense source details |
| `src/components/admin/finance/FloatingFundsDetailSheet.tsx` | 333-338 | Search input for floating funds details |
| `src/components/admin/finance/DeficitsDetailSheet.tsx` | 361-366 | Search input for deficits details |

---

### Solution

Apply the mobile input optimization pattern to all affected Input fields:

**Before (causes flickering):**
```tsx
<Input
  placeholder="Search member..."
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  className="pl-9"
/>
```

**After (mobile-optimized):**
```tsx
<Input
  placeholder="Search member..."
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  className="pl-9 touch-manipulation"
  autoComplete="off"
  autoCorrect="off"
  spellCheck={false}
  onClick={(e) => e.stopPropagation()}
/>
```

---

### Mobile Optimization Pattern Applied

| Property | Purpose |
|----------|---------|
| `touch-manipulation` | Enables proper touch handling and prevents double-tap zoom interference |
| `autoComplete="off"` | Prevents browser autocomplete popups that interfere with input |
| `autoCorrect="off"` | Disables iOS auto-correction that causes text jumps |
| `spellCheck={false}` | Prevents spellcheck underlining that causes visual glitches |
| `onClick={(e) => e.stopPropagation()}` | Prevents ScrollArea from stealing focus when input is clicked |

---

### Files to Modify

| File | Action |
|------|--------|
| `MembersFinancialReportsDialog.tsx` | **MODIFY** - Add mobile optimizations to Input (line 147) |
| `IncomeSourceDetailSheet.tsx` | **MODIFY** - Add mobile optimizations to Input (line 173) |
| `ExpenseSourceDetailSheet.tsx` | **MODIFY** - Add mobile optimizations to Input (line 522) |
| `FloatingFundsDetailSheet.tsx` | **MODIFY** - Add mobile optimizations to Input (line 333) |
| `DeficitsDetailSheet.tsx` | **MODIFY** - Add mobile optimizations to Input (line 361) |

---

### Expected Outcome

1. Search input no longer flickers when typing on mobile
2. Text appears correctly as typed without random characters
3. Focus is maintained on the input without jumping
4. Smooth typing experience within ScrollArea containers
5. Consistent behavior across all financial admin sheets

