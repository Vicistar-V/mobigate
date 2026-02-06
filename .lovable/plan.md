

## Clean Up Remaining "X of Y" Text Pattern

### Context

The badge was already fixed in the last edit to show "19 voters" instead of "19 of 527" when all filtered results fit on one page. However, the info text below the badge still shows "Found 19 of 527 voters" when a search/filter is active, which uses the same "X of Y" pattern the user finds confusing.

### Change

Simplify the info text to completely eliminate any "X of Y" pattern when all items are already visible on screen. The "X of Y" format should ONLY appear when there is a Load More button (i.e., more than 50 items to show).

### File: `src/components/admin/election/CandidateVotersListSheet.tsx`

**Update the info text block (lines 255-263)**

Current:
```tsx
{hasMore ? (
  <p className="text-xs text-muted-foreground">
    Showing {displayedVoters.length} of {filteredVoters.length} voters
  </p>
) : (searchQuery || filterMode !== "all") ? (
  <p className="text-xs text-muted-foreground">
    Found {filteredVoters.length} of {voteCount} voters
  </p>
) : null}
```

New:
```tsx
{hasMore ? (
  <p className="text-xs text-muted-foreground">
    Showing {displayedVoters.length} of {filteredVoters.length} voters
  </p>
) : (searchQuery || filterMode !== "all") ? (
  <p className="text-xs text-muted-foreground">
    {filteredVoters.length} matching voters found
  </p>
) : null}
```

### Expected Results After Fix

**13 votes, search "j" returns 5:**
- Badge: `5 voters`
- Info text: `5 matching voters found`
- Load More: hidden

**527 votes, no search:**
- Badge: `50 of 527`
- Info text: `Showing 50 of 527 voters`
- Load More: visible

**527 votes, search "j" returns 19:**
- Badge: `19 voters`
- Info text: `19 matching voters found`
- Load More: hidden

**316 votes, search "j" returns 20:**
- Badge: `20 voters`
- Info text: `20 matching voters found`
- Load More: hidden

**527 votes, search returns 65:**
- Badge: `50 of 65`
- Info text: `Showing 50 of 65 voters`
- Load More: visible

### Summary

Only one line changes in one file. The "X of Y" pattern is now exclusively reserved for when there are actually more items to load (Load More button visible). All other cases use simple, clean counts.

| File | Change |
|------|--------|
| `src/components/admin/election/CandidateVotersListSheet.tsx` | Change "Found X of Y voters" to "X matching voters found" |
