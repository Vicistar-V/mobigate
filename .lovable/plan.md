
## Mobile Optimization for Community Privacy Settings Sheet

### Current Flow
The user clicks the **"View"** button in the Democratic Governance section of the Admin Dashboard → This opens the **`MemberPrivacyVotingSheet`** (Community Privacy Settings) → Which contains settings cards with voting options.

### Issues Identified

Based on code analysis of `src/components/community/settings/MemberPrivacyVotingSheet.tsx`:

**1. Text Clipping in Settings Cards (Lines 162-196)**
- Missing `min-w-0` on inner flex containers
- Using `items-center` instead of `items-start` for multi-line content
- Description `line-clamp-2` may clip long text

**2. Info Banner Text Overflow (Lines 141-149)**
- The info banner text could wrap awkwardly on small screens

**3. Current Setting Badge Row (Lines 180-189)**
- `justify-between` layout may clip on narrow viewports
- Badge + percentage text can overflow

**4. Vote Distribution Section (Lines 203-231)**
- Long option labels may clip
- Progress bar labels need better wrapping

**5. Voting Options Labels (Lines 246-275)**
- Missing `min-w-0` on description containers
- Option icon and text may overflow

**6. Impeachment Privacy Card (Lines 309-327)**
- Text may clip on narrow screens
- Missing proper flex constraints

---

### Solution: Complete Mobile Layout Restructure

#### File: `src/components/community/settings/MemberPrivacyVotingSheet.tsx`

---

### Change 1: Fix Settings Card Header (Lines 162-196)

Add proper flex constraints and text wrapping to prevent clipping.

**Key Changes:**
- Add `min-w-0` to text container
- Change description from `line-clamp-2` to allow proper wrapping with `leading-relaxed`
- Fix the "Current:" row to use vertical stacking if needed

```tsx
// Before (clipping issues):
<div className="min-w-0 flex-1">
  <div className="flex items-center gap-2 mb-1">
    ...
  </div>
  <p className="text-sm text-muted-foreground line-clamp-2">
    {setting.settingDescription}
  </p>
  <div className="flex items-center gap-2 mt-2">
    ...
  </div>
</div>

// After (proper mobile layout):
<div className="min-w-0 flex-1">
  <div className="flex items-start gap-2 flex-wrap mb-1">
    <h4 className="font-medium text-sm">{setting.settingName}</h4>
    {setting.memberVote && (...)}
  </div>
  <p className="text-xs text-muted-foreground leading-relaxed">
    {setting.settingDescription}
  </p>
  <div className="flex items-center gap-2 mt-2 flex-wrap">
    ...
  </div>
</div>
```

---

### Change 2: Fix Info Banner (Lines 141-149)

Improve text readability with better sizing.

```tsx
// Use text-xs and add leading-relaxed for better mobile fit
<p className="text-xs text-muted-foreground leading-relaxed">
```

---

### Change 3: Fix Vote Distribution Labels (Lines 214-222)

Add `min-w-0` and use `flex-wrap` to prevent text clipping.

```tsx
// Before:
<div className="flex items-center justify-between text-sm">
  <span className={isWinner ? 'font-medium' : 'text-muted-foreground'}>
    {PRIVACY_OPTION_LABELS[option]}
  </span>
  <span className="text-muted-foreground">
    {votes} ({percentage.toFixed(0)}%)
  </span>
</div>

// After:
<div className="flex items-center justify-between gap-2 text-sm">
  <span className={cn(
    "min-w-0 flex-1",
    isWinner ? 'font-medium' : 'text-muted-foreground'
  )}>
    {PRIVACY_OPTION_LABELS[option]}
  </span>
  <span className="text-muted-foreground shrink-0 text-xs">
    {votes} ({percentage.toFixed(0)}%)
  </span>
</div>
```

---

### Change 4: Fix Voting Options (Lines 246-275)

Add proper constraints to option labels.

```tsx
// Before:
<div className="flex-1 min-w-0">
  <div className="flex items-center gap-2">
    {getOptionIcon(option)}
    <span className="font-medium text-sm">
      {PRIVACY_OPTION_LABELS[option]}
    </span>
  </div>
  <p className="text-sm text-muted-foreground mt-0.5">
    {PRIVACY_OPTION_DESCRIPTIONS[option]}
  </p>
</div>

// After:
<div className="flex-1 min-w-0">
  <div className="flex items-center gap-2">
    <span className="shrink-0">{getOptionIcon(option)}</span>
    <span className="font-medium text-sm">
      {PRIVACY_OPTION_LABELS[option]}
    </span>
  </div>
  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
    {PRIVACY_OPTION_DESCRIPTIONS[option]}
  </p>
</div>
```

---

### Change 5: Fix Impeachment Privacy Card (Lines 309-327)

Add proper text wrapping and constraints.

```tsx
// Before:
<div className="min-w-0">
  <h4 className="font-medium text-sm text-red-800">Impeachment Privacy Settings</h4>
  <p className="text-sm text-red-600/80 line-clamp-2">
    Vote on what impeachment data to show or hide (70% threshold)
  </p>
</div>

// After:
<div className="min-w-0 flex-1">
  <h4 className="font-medium text-sm text-red-800 leading-tight">
    Impeachment Privacy Settings
  </h4>
  <p className="text-xs text-red-600/80 leading-relaxed mt-0.5">
    Vote on what impeachment data to show or hide (70% threshold)
  </p>
</div>
```

---

### Change 6: Fix Sheet Content Overflow (Line 127)

Add `overflow-hidden` to prevent content bleeding.

```tsx
// Before:
<SheetContent side="bottom" className="h-[92vh] p-0">

// After:
<SheetContent side="bottom" className="h-[92vh] p-0 overflow-hidden">
```

---

### Change 7: Fix "How Voting Works" Card (Lines 331-342)

Ensure proper mobile text sizing.

```tsx
// Update list text size
<ul className="text-xs text-muted-foreground space-y-1.5 leading-relaxed">
```

---

### Files to Modify

| File | Action |
|------|--------|
| `src/components/community/settings/MemberPrivacyVotingSheet.tsx` | **MODIFY** - Complete mobile optimization |

---

### Summary of CSS Fixes

| Location | Issue | Fix |
|----------|-------|-----|
| Settings card header | Missing flex-wrap | Add `flex-wrap`, `items-start` |
| Settings description | Text clipping | Use `text-xs`, `leading-relaxed` |
| Current status row | Overflow | Add `flex-wrap`, `gap-2` |
| Vote distribution | Label clipping | Add `min-w-0 flex-1`, `shrink-0` |
| Voting options | Description too big | Use `text-xs`, `leading-relaxed` |
| Impeachment card | Text clipping | Add `flex-1`, `leading-tight/relaxed` |
| How Voting Works | Text size | Use `text-xs` |

---

### Expected Outcome

1. All setting names fully visible
2. Descriptions properly wrap without clipping
3. Vote distribution labels don't overflow
4. Voting option descriptions readable on all screen sizes
5. Impeachment card text fully visible
6. Overall improved readability on narrow mobile screens
