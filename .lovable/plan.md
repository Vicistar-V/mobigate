

## Fix Non-Working Edit/Hide/Delete Buttons in Gallery Albums

### Root Cause

The `ManageCommunityGalleryDialog.tsx` component defines its main content as an inner component function:

```tsx
const Content = () => ( ... );  // Line 392
```

Then renders it as a JSX component:

```tsx
<Content />   // Lines 1193 and 1202
```

This is the same pattern that has been fixed across 10+ other components in this project. When React sees `<Content />`, it treats it as a new component type on every parent re-render, unmounting and remounting the entire DOM tree. This causes:

- Buttons (Edit, Hide, Delete) to lose their click handlers mid-tap
- Inputs to lose focus while typing
- State updates to feel unresponsive

### Fix

**File: `src/components/community/ManageCommunityGalleryDialog.tsx`**

**Change 1: Convert JSX component invocation to direct function call (mobile)**

Line 1193:
```
Before: <Content />
After:  {Content()}
```

**Change 2: Convert JSX component invocation to direct function call (desktop)**

Line 1202:
```
Before: <Content />
After:  {Content()}
```

**Change 3: Fix search input for mobile text entry**

Line 403-408 -- add mobile-optimized attributes to the search input:
- `style={{ touchAction: 'manipulation' }}` to prevent scroll interference
- `onClick={(e) => e.stopPropagation()}` to prevent ScrollArea from stealing focus
- `autoComplete="off"` to prevent mobile keyboard issues
- `className="pl-9 h-10 text-base"` to prevent iOS zoom on focus

### Summary

| Change | Location | Purpose |
|--------|----------|---------|
| `Content()` instead of `<Content />` | Lines 1193, 1202 | Prevent DOM unmount/remount on re-render |
| Mobile input attributes | Line 403-408 | Prevent search input focus loss on mobile |

### What This Fixes

- Edit button on album cards will open the edit form
- Hide/Show button will toggle album visibility
- Delete button will trigger the confirmation dialog
- Search input will work properly on mobile without focus loss
