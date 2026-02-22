

## Plan: Scrollable Selection & TV Rounds with Duration-Based Date Entry

### What Changes

**1. Selection Rounds -- Horizontally Scrollable Rows**

Each selection round row (R1, R2, R3...) will become horizontally scrollable on mobile. The X (delete) button will be pinned/sticky on the right side, always visible and never overlapping the scrollable content. The scrollable area will contain:
- Round label (R1, R2...)
- Entries input
- Fee input
- **New**: Duration input (days) 
- **New**: Start date picker
- **New**: Auto-computed end date (read-only, calculated from start date + duration)

The layout per row:
```text
[Scrollable area >>>>>>>>>>>>>>>>>>>>>>>] [X]
 R1 | Entries | Fee | Duration(days) | Start Date | End Date(auto)
```

**2. TV Show Rounds -- Same Scrollable Pattern + Hours Support**

Same horizontal scroll treatment with sticky X button. The scrollable content will contain:
- Label input (e.g. "1st TV Show")
- Entries input
- Fee input
- **New**: Duration input (in hours, since TV shows can happen within a single day)
- **New**: Start date + time picker (datetime-local input for hour precision)
- **New**: Auto-computed end date/time (start + hours)

```text
[Scrollable area >>>>>>>>>>>>>>>>>>>>>>>] [X]
 Label | Entries | Fee | Duration(hrs) | Start DateTime | End DateTime(auto)
```

**3. Data Model Updates**

Add optional fields to the interfaces:

- `SelectionProcess`: add `durationDays?: number`, `startDate?: string`, `endDate?: string`
- `TVShowRound`: add `durationHours?: number`, `startDateTime?: string`, `endDateTime?: string`

### Technical Details

**File: `src/data/mobigateInteractiveQuizData.ts`**
- Add optional fields to `SelectionProcess` and `TVShowRound` interfaces

**File: `src/pages/MerchantPage.tsx`**
- Refactor each Selection Round row: wrap inputs in a horizontally scrollable `div` with `overflow-x-auto` and `flex-nowrap`, keep X button outside the scroll container with proper spacing
- Add duration (days) input, start date input, and auto-computed end date display per Selection Round
- Add handler logic: when duration + start date are set, compute end date using `addDays()`
- Refactor each TV Show Round row similarly: scrollable content with sticky X
- Add duration (hours) input, `datetime-local` start input, and auto-computed end datetime per TV Round
- Add handler logic: when duration hours + start datetime are set, compute end datetime using `addHours()`
- Import `addDays` and `addHours` from `date-fns`

**Scroll Container Pattern (per row):**
```
<div className="flex items-center gap-2">
  <div className="flex-1 overflow-x-auto min-w-0">
    <div className="flex items-center gap-2 min-w-max pb-1">
      {/* all inputs here */}
    </div>
  </div>
  {/* X button outside scroll, shrink-0 */}
  <button className="shrink-0 ml-1">X</button>
</div>
```

This ensures the X never scrolls away and there's no overlap with the scrollable content area. The `min-w-max` on the inner flex ensures content doesn't compress, forcing horizontal scroll on narrow viewports.

