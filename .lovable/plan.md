

## Standardize Pagination Display at 50 Items

### Problem

The badge and info text always show "X of Y" format (e.g., "19 of 527", "5 of 20", "50 of 316") regardless of whether there are actually more items to load. This creates confusing variations:

- When search narrows 527 voters to 19, it shows "19 of 19" -- redundant
- When a candidate only has 20 votes, it shows "20 of 20" -- no pagination needed but looks like it
- When there are 527 voters, it shows "50 of 527" -- this is the only case where the "X of Y" format makes sense

### Rule

- **50 or fewer items**: Display all items, no "Load More" button, no "X of Y" text. Badge simply shows the total count (e.g., "19 voters" or "20 voters").
- **More than 50 items**: Display first 50, show "Load More" button, badge shows "50 of 527", info text says "Showing 50 of 527 voters".

---

### Technical Details

#### File: `src/components/admin/election/CandidateVotersListSheet.tsx`

**1. Simplify the count badge logic (lines 246-248)**

Replace the always-showing "X of Y" badge with conditional display:

- When all filtered voters are displayed (`displayedVoters.length === filteredVoters.length`): Show just the count, e.g., `"19 voters"`
- When there are more to load (`hasMore` is true): Show the "X of Y" format, e.g., `"50 of 527"`

```tsx
<Badge variant="secondary" className="text-xs">
  {hasMore
    ? `${displayedVoters.length} of ${filteredVoters.length}`
    : `${filteredVoters.length} voters`
  }
</Badge>
```

**2. Simplify the info text (lines 252-255)**

Replace the always-showing "Showing X of Y voters" line with conditional display:

- When there are more to load: Show `"Showing 50 of 527 voters"`
- When a search/filter narrowed results from a larger set: Show `"Found 19 voters"` (so the user knows their filter is active)
- When all items are shown and no filter: Show nothing (remove the text entirely to save space)

```tsx
{hasMore ? (
  <p className="text-xs text-muted-foreground">
    Showing {displayedVoters.length} of {filteredVoters.length} voters
  </p>
) : searchQuery || filterMode !== "all" ? (
  <p className="text-xs text-muted-foreground">
    Found {filteredVoters.length} of {voteCount} voters
  </p>
) : null}
```

**3. No changes needed to the Load More button logic**

The existing `hasMore` check already handles this correctly -- the button only appears when `filteredVoters.length > displayCount`. Since `displayCount` starts at 50, lists with 50 or fewer items never show the button.

---

### Expected Results

**Candidate with 20 votes (no search):**
```
Badge: "20 voters"
Info text: (none)
Load More: (hidden)
```

**Candidate with 527 votes (no search):**
```
Badge: "50 of 527"
Info text: "Showing 50 of 527 voters"
Load More: [Load More (477 remaining)]
```

**Candidate with 527 votes (search "j" returns 19):**
```
Badge: "19 voters"
Info text: "Found 19 of 527 voters"
Load More: (hidden)
```

**Candidate with 527 votes (search "j" returns 65):**
```
Badge: "50 of 65"
Info text: "Showing 50 of 65 voters"
Load More: [Load More (15 remaining)]
```

**After tapping "Load More" on 527 voters:**
```
Badge: "100 of 527"  ->  tap again -> "150 of 527"  -> ... -> "527 voters"
Info text: updates accordingly -> disappears when all shown
Load More: disappears when all shown
```

---

### Files to Modify

| File | Change |
|------|--------|
| `src/components/admin/election/CandidateVotersListSheet.tsx` | Update badge and info text to use conditional display logic |

### Mobile UX Impact

- Cleaner display for small lists (no redundant "5 of 5" or "20 of 20")
- Clear pagination indicator only when there are actually more items to load
- Search results clearly indicate they are filtered from a larger set
- Less visual noise on mobile screens
