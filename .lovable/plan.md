
## Fix Candidate Clearance Card Layout for Mobile

### Problem Identified

Looking at the screenshot, two issues are visible:

1. **Candidate names are truncated** - "Paulson Chinedu Okonkwo" shows as "Paulson Chin..." due to the `truncate` class
2. **Status badge position** - The "Approved" badge is on the same line as the name, but should be on the same line as the office (President General)

---

## Implementation Details

### File: `src/components/admin/election/AdminClearancesTab.tsx`

**Lines 161-171 - Current Layout:**
```tsx
<div className="flex-1 min-w-0">
  <div className="flex items-start gap-2">
    <div className="flex-1 min-w-0">
      <h4 className="font-semibold text-base truncate leading-tight">{request.candidateName}</h4>
      <p className="text-sm text-primary">{request.office}</p>
    </div>
    <Badge className={`text-xs shrink-0 capitalize whitespace-nowrap ${getStatusColor(request.status)}`}>
      {request.status.replace('_', ' ')}
    </Badge>
  </div>
</div>
```

**New Layout (Full name on its own line, Badge with Office):**
```tsx
<div className="flex-1 min-w-0">
  {/* Name on its own line - full width, no truncation */}
  <h4 className="font-semibold text-base leading-tight">{request.candidateName}</h4>
  
  {/* Office + Badge on same line */}
  <div className="flex items-center gap-2 mt-0.5">
    <p className="text-sm text-primary">{request.office}</p>
    <Badge className={`text-xs shrink-0 capitalize whitespace-nowrap ${getStatusColor(request.status)}`}>
      {request.status.replace('_', ' ')}
    </Badge>
  </div>
</div>
```

---

## Changes Summary

| Element | Before | After |
|---------|--------|-------|
| Candidate name | `truncate` class (cuts off long names) | No truncate (shows full name) |
| Badge position | Same row as name | Same row as office |
| Layout structure | Nested flex with name+badge | Name on own line, office+badge row below |

---

## Files to Modify

| File | Change |
|------|--------|
| `src/components/admin/election/AdminClearancesTab.tsx` | Restructure lines 161-171 to show full names and move badge to office row |

---

## Expected Outcome

- Full candidate names displayed (e.g., "Paulson Chinedu Okonkwo" instead of "Paulson Chin...")
- "Approved" badge appears on the same line as "President General"
- Clean vertical stacking for mobile readability
- No text overflow or truncation issues
