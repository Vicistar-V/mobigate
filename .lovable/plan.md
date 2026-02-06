

## Mobile Optimization for Impeachment Privacy Settings - Fix Text Clipping

### Problem Identified

Looking at the screenshots, text is being cut off on the right margins in multiple places:

1. **"Make this data visible to all valid mem..."** - truncated (should be "members")
2. **"Protect member identity and privac..."** - truncated (should be "privacy")  
3. **"Show who initiated the..."** - truncated in setting description

The root cause is missing `min-w-0` on flex children and overly constrained flex containers that don't allow text to wrap properly.

---

### Solution: Complete Mobile Layout Restructure

#### File: `src/components/community/elections/ImpeachmentPrivacySettings.tsx`

---

### Change 1: Fix Setting Info Section (Lines 364-370)

The setting info container lacks `min-w-0` causing text overflow.

**Before:**
```tsx
<div className="flex items-center gap-3 mb-3">
  {/* Icon */}
  <div>
    <h3 className="font-semibold">{selectedSetting.settingName}</h3>
    <p className="text-sm text-muted-foreground">
      {selectedSetting.settingDescription}
    </p>
  </div>
</div>
```

**After:**
```tsx
<div className="flex items-start gap-3 mb-3">
  {/* Icon - unchanged */}
  <div className="flex-1 min-w-0">
    <h3 className="font-semibold text-sm leading-tight">{selectedSetting.settingName}</h3>
    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
      {selectedSetting.settingDescription}
    </p>
  </div>
</div>
```

Key changes:
- Add `flex-1 min-w-0` to text container to allow proper shrinking
- Change `items-center` to `items-start` for better vertical alignment
- Use `leading-relaxed` for description readability

---

### Change 2: Fix "Show Information" Vote Button (Lines 433-447)

The inner flex container clips text because of missing `min-w-0`.

**Before:**
```tsx
<div className="flex items-center gap-3 w-full">
  <div className="h-10 w-10 rounded-full ... shrink-0">
    <Eye className="h-5 w-5 text-green-600" />
  </div>
  <div className="flex-1 text-left">
    <p className="font-medium">Show Information</p>
    <p className="text-xs text-muted-foreground">
      Make this data visible to all valid members
    </p>
  </div>
  {selectedSetting.memberVote === 'visible' && (
    <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
  )}
</div>
```

**After:**
```tsx
<div className="flex items-start gap-3 w-full">
  <div className="h-10 w-10 rounded-full ... shrink-0 mt-0.5">
    <Eye className="h-5 w-5 text-green-600" />
  </div>
  <div className="flex-1 min-w-0 text-left">
    <p className="font-medium text-sm">Show Information</p>
    <p className="text-xs text-muted-foreground leading-relaxed">
      Make this data visible to all valid members
    </p>
  </div>
  {selectedSetting.memberVote === 'visible' && (
    <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
  )}
</div>
```

Key changes:
- Add `min-w-0` to text container - this is critical for text wrapping
- Change `items-center` to `items-start` for multi-line text alignment
- Add `mt-0.5` to icon and checkmark for vertical alignment with text
- Add `leading-relaxed` for better description readability

---

### Change 3: Fix "Hide Information" Vote Button (Lines 457-471)

Same pattern as Change 2.

**Before:**
```tsx
<div className="flex items-center gap-3 w-full">
  <div className="h-10 w-10 rounded-full ... shrink-0">
    <EyeOff className="h-5 w-5 text-muted-foreground" />
  </div>
  <div className="flex-1 text-left">
    <p className="font-medium">Hide Information</p>
    <p className="text-xs text-muted-foreground">
      Protect member identity and privacy
    </p>
  </div>
  ...
</div>
```

**After:**
```tsx
<div className="flex items-start gap-3 w-full">
  <div className="h-10 w-10 rounded-full ... shrink-0 mt-0.5">
    <EyeOff className="h-5 w-5 text-muted-foreground" />
  </div>
  <div className="flex-1 min-w-0 text-left">
    <p className="font-medium text-sm">Hide Information</p>
    <p className="text-xs text-muted-foreground leading-relaxed">
      Protect member identity and privacy
    </p>
  </div>
  {selectedSetting.memberVote === 'hidden' && (
    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
  )}
</div>
```

---

### Change 4: Fix Current Status Section (Lines 373-389)

The `justify-between` layout clips on narrow screens.

**Before:**
```tsx
<div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
  <span className="text-sm text-muted-foreground">Current setting:</span>
  <Badge variant="outline" className={cn(...)}>
    {selectedSetting.currentValue === 'visible' ? (...) : (...)}
  </Badge>
</div>
```

**After (Stacked Layout):**
```tsx
<div className="p-3 bg-muted/50 rounded-lg space-y-2">
  <div className="flex items-center justify-between gap-2">
    <span className="text-sm text-muted-foreground">Current setting:</span>
    <Badge variant="outline" className={cn(...)}>
      {selectedSetting.currentValue === 'visible' ? (...) : (...)}
    </Badge>
  </div>
</div>
```

Add `gap-2` to prevent cramping.

---

### Change 5: Fix Main Settings List Item Description (Lines 207-219)

**Before:**
```tsx
<div className="flex-1 min-w-0">
  <div className="flex items-center gap-2">
    <p className="font-medium text-sm">{setting.settingName}</p>
    {setting.memberVote === null && (
      <Badge className="text-[10px] bg-amber-500 text-white shrink-0">
        Vote
      </Badge>
    )}
  </div>
  <p className="text-xs text-muted-foreground line-clamp-1">
    {setting.settingDescription}
  </p>
</div>
```

**After:**
```tsx
<div className="flex-1 min-w-0">
  <div className="flex items-center gap-2 flex-wrap">
    <p className="font-medium text-sm truncate max-w-[70%]">{setting.settingName}</p>
    {setting.memberVote === null && (
      <Badge className="text-xs bg-amber-500 text-white shrink-0">
        Vote
      </Badge>
    )}
  </div>
  <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5 leading-relaxed">
    {setting.settingDescription}
  </p>
</div>
```

Key changes:
- Add `flex-wrap` to allow badge to wrap if needed
- Use `line-clamp-2` instead of `line-clamp-1` for description to show more text
- Add `leading-relaxed` for readability
- Fix minimum font size (change `text-[10px]` to `text-xs`)

---

### Change 6: Fix DrawerContent Overflow (Lines 118 and 342)

Add `overflow-hidden` to prevent content bleeding.

**Before:**
```tsx
<DrawerContent className="max-h-[90vh] flex flex-col">
```

**After:**
```tsx
<DrawerContent className="max-h-[90vh] flex flex-col overflow-hidden">
```

Apply to both drawer instances (main drawer at line 118 and vote drawer at line 342).

---

### Files to Modify

| File | Action |
|------|--------|
| `src/components/community/elections/ImpeachmentPrivacySettings.tsx` | **MODIFY** - Fix all flex containers, add min-w-0, restack layouts |

---

### Summary of Key CSS Fixes

| Location | Issue | Fix |
|----------|-------|-----|
| Setting Info (364-370) | Missing min-w-0 | Add `flex-1 min-w-0` |
| Show Button (433-447) | Missing min-w-0 | Add `min-w-0`, change to `items-start` |
| Hide Button (457-471) | Missing min-w-0 | Add `min-w-0`, change to `items-start` |
| Current Status (373-389) | justify-between clips | Add `gap-2` for spacing |
| Settings List (207-219) | line-clamp-1 too restrictive | Change to `line-clamp-2` |
| DrawerContent (118, 342) | Missing overflow-hidden | Add `overflow-hidden` |

---

### Expected Outcome

1. "Make this data visible to all valid members" - fully visible
2. "Protect member identity and privacy" - fully visible  
3. "Show who initiated the impeachment process" - wraps to 2 lines if needed
4. All vote options properly laid out on narrow mobile screens
5. No text clipping on any margin
6. Proper flex wrapping and shrinking behavior

