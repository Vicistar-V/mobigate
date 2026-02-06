

## Fix Mobile Overflow and Wire Inactive Buttons in Financial Accreditation Tab

### Problems Identified

From the screenshots, the **Financial Accreditation Tab** (`FinancialAccreditationTab.tsx`) has two major issues:

1. **Mobile overflow / edge clipping**: The member cards use `flex items-center gap-4` with a large avatar (h-14 w-14), member info text, AND a "View Details" button all in one horizontal row. On narrow mobile screens, the avatar clips on the left, and the "View Details" button clips on the right, causing unwanted horizontal scrolling.

2. **Inactive "View Details" button**: The button has no `onClick` handler -- tapping it does nothing.

---

### Solution

#### 1. Restack Member Cards Vertically for Mobile

Replace the current single-row horizontal layout with a **two-row vertically stacked** layout:

- **Row 1**: Avatar + Name + Registration (compact, no overflow)
- **Row 2**: Status Badge + Clearance Count + "View Details" button

This follows the existing `mobile-list-item-restacking` pattern used elsewhere in the app.

**Specific changes:**

| Current | Fixed |
|---------|-------|
| `flex items-center gap-4` (single row) | Vertical stack with two rows |
| Avatar `h-14 w-14` (too large for mobile row) | Reduced to `h-10 w-10` |
| "View Details" button in same row as avatar + text | Moved to second row, full-width |
| `gap-4` (too much spacing) | `gap-3` for tighter mobile fit |

#### 2. Wire "View Details" Button

When tapped, open the `CheckIndebtednessSheet` (existing component) which shows:
- Itemized list of financial obligations
- Total indebtedness with penalty calculation
- "Clear Debt Now" button
- "Get Accreditation Now!" button

This is the most appropriate existing component since "View Details" for a pending member means viewing what they owe and providing a path to clear it.

For already-accredited members, open the `FinancialStatusDialog` instead which shows compliance rate and payment history.

#### 3. Fix Stats Grid

Change `grid-cols-1 md:grid-cols-3` to just `grid-cols-3` so all three stat cards show side-by-side even on mobile (they're small enough). Reduce padding for mobile.

---

### File Modified

**`src/components/community/finance/FinancialAccreditationTab.tsx`**

#### Import additions:
- `useState` from React
- `FinancialStatusDialog` from `./FinancialStatusDialog`
- `CheckIndebtednessSheet` from `../elections/CheckIndebtednessSheet`
- `toast` from `sonner`

#### State additions:
- `showIndebtednessSheet` -- boolean to control the CheckIndebtednessSheet
- `showStatusDialog` -- boolean to control FinancialStatusDialog

#### Layout changes:

**Stats grid** -- change to `grid-cols-3` with reduced padding (`p-3` instead of `p-4`), smaller text sizes for mobile fit.

**Member cards** -- restructure from:
```
[Avatar] [Name / Reg / Badge] [View Details Button]
```
To vertically stacked:
```
[Avatar] [Name / Registration]
[Badge + Clearance Count] [View Details Button]
```

**View Details button** -- wire `onClick`:
- If member is accredited: `setShowStatusDialog(true)`
- If member is pending: `setShowIndebtednessSheet(true)`

Add `touch-manipulation active:scale-[0.97]` to the button for mobile feedback.

#### Render dialogs at bottom:
- `<FinancialStatusDialog>` controlled by `showStatusDialog`
- `<CheckIndebtednessSheet>` controlled by `showIndebtednessSheet`

### Technical Details

```tsx
// Restacked member card layout
<div className="space-y-2.5 p-3 rounded-lg border-2 ...">
  {/* Row 1: Avatar + Identity */}
  <div className="flex items-center gap-3">
    <Avatar className="h-10 w-10 shrink-0">...</Avatar>
    <div className="min-w-0 flex-1">
      <div className="font-semibold text-sm truncate">{member.name}</div>
      <div className="text-xs text-muted-foreground">{member.registration}</div>
    </div>
  </div>
  {/* Row 2: Badge + Action */}
  <div className="flex items-center justify-between gap-2">
    <div className="flex items-center gap-2">
      <Badge>...</Badge>
      <span className="text-xs">6/7 items cleared</span>
    </div>
    <Button 
      size="sm" 
      onClick={() => { /* open dialog */ }}
      className="touch-manipulation active:scale-[0.97] shrink-0"
    >
      View Details
    </Button>
  </div>
</div>
```

### Files Modified
1. `src/components/community/finance/FinancialAccreditationTab.tsx`

