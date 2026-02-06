

## Mobile Optimization: Fix Right-Edge Clipping in Community Resources Dialog

### Root Causes Identified

The screenshots show content clipping on the right edge across **all tabs** (ID Cards, Letters, Publications/More). Three structural problems cause this:

1. **Excessive padding**: `p-4 sm:p-6` and `px-4 sm:px-6` are used throughout. On a 360px mobile screen, that is 16px padding on each side = 32px lost. Combined with card borders, internal padding, and the Dialog's built-in `gap-4`, content runs out of horizontal room.

2. **Horizontal flex layouts with rigid children**: Publication cards use a large 64px icon thumbnail + text + badge + button all in one row. Letter request cards put title + badge side-by-side. These overflow on narrow screens.

3. **No overflow containment**: The dialog and its inner cards lack `overflow-hidden`, allowing children to push beyond the visible area and create horizontal scroll.

---

### Changes Overview

| File | What Gets Fixed |
|------|----------------|
| `CommunityResourcesDialog.tsx` | All tabs: reduce padding, restack cards, add overflow containment |
| `ConstitutionViewer.tsx` | Reduce header/content padding, tighten mobile layout |

---

### File 1: `src/components/community/CommunityResourcesDialog.tsx`

#### A. Dialog Container - Add overflow containment

Change DialogContent class from:
```
max-w-3xl max-h-[90vh] p-0
```
To:
```
max-w-3xl max-h-[90vh] p-0 overflow-x-hidden
```

#### B. Header - Reduce padding

Change DialogHeader from `p-4 sm:p-6` to `p-3 pb-0`.

#### C. Tab List - Tighten horizontal padding

Change the TabsList wrapper from `px-4 sm:px-6` to `px-3`. Keep tab text at `text-[11px]` but ensure proper truncation.

#### D. ScrollArea - Reduce all tab content padding

Change every `TabsContent` from `p-4 sm:p-6` to `p-3` consistently.

#### E. ID Cards Tab - Tighten card internals

- Reduce Card's `CardHeader` and `CardContent` internal padding
- Ensure the centered photo/name/badge layout has `overflow-hidden` on wrapping container
- Change the ID card gradient container internal padding from `p-4` to `p-3`
- Reduce detail grid gap from `gap-2` to `gap-1.5`

#### F. Letters Tab - Restack letter request cards

The letter request history cards currently use `flex items-start justify-between` which puts the title and badge side-by-side. On narrow screens the badge clips.

**Restack to vertical:**
- Row 1: Title (full width, no truncation)
- Row 2: Status badge + date side-by-side (both small)
- Row 3: Purpose text
- Row 4: Letter number + Download button (if available)

#### G. More Tab (Publications) - Restack featured publication cards

The featured publications use a horizontal layout with a 64px icon box + content that overflows.

**Restack to vertical:**
- Remove the large icon box entirely (or shrink to 40px inline icon)
- Row 1: Title + type badge (with `flex-wrap` to prevent badge clipping)
- Row 2: Description (line-clamp-2)
- Row 3: Edition + file size + Download button

For "All Publications" cards:
- Shrink the icon from `p-2` to smaller
- Ensure title uses `line-clamp-1` with proper `min-w-0`
- Ensure Download button has `shrink-0`

#### H. Other Resources Section

- Reduce `CardContent p-3.5` to `p-3`
- Ensure all text has `min-w-0` and `truncate` on description lines

---

### File 2: `src/components/community/ConstitutionViewer.tsx`

#### A. Dialog Container

Change DialogContent from `max-w-4xl max-h-[95vh] p-0` to `max-w-3xl max-h-[95vh] p-0 overflow-x-hidden`.

#### B. Header padding

Change from `p-4 sm:p-6` to `p-3 pb-0`.

#### C. Tab list container

Change from `px-4 sm:px-6` to `px-3`.

#### D. Content padding

Change from `p-4 sm:p-6` to `p-3`.

---

### Technical Details

**Key CSS patterns applied throughout:**

```text
overflow-x-hidden  -- on dialog containers to prevent horizontal scroll
p-3                -- consistent mobile padding (12px) instead of 16px/24px
min-w-0            -- on all flex children that contain text
shrink-0           -- on fixed-size elements (icons, badges, buttons)
overflow-hidden    -- on card containers with complex layouts
flex-wrap          -- on rows containing title + badge combinations
```

**Publication card restack (before vs after):**

Before:
```
[64px Icon Box] [Title .... Badge]
                [Description text....]
                [Edition | Download]
```

After:
```
[Title text here]              [Badge]
[Description text, line-clamp-2]
[Edition info]      [Download button]
```

**Letter request card restack (before vs after):**

Before:
```
[Title text here]         [approved]  <-- badge clips
[Requested: date]
```

After:
```
[Title text here]
[approved badge] [Requested: date]
[Purpose: text...]
[Letter#]              [Download]
```

### Files Modified
1. `src/components/community/CommunityResourcesDialog.tsx`
2. `src/components/community/ConstitutionViewer.tsx`

