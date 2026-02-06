

## Add "Load More" Pagination to Voters List

### Problem
Currently, the `generateMockVoters` function caps at 50 voters (`Math.min(voteCount, 50)`), and when the total vote count exceeds 50 (e.g., 54 votes), the remaining voters are inaccessible. The UI shows "Showing first 50 voters of 54 total" but provides no way to view the rest.

### Solution
Replace the hard 50-voter cap with a paginated "Load More" approach that generates ALL voters upfront but displays them in pages of 50, with a prominent "Load More" button at the bottom to reveal the next batch.

---

### Technical Details

#### File: `src/components/admin/election/CandidateVotersListSheet.tsx`

**1. Remove the 50-voter cap from `generateMockVoters`**

Change line 62 from:
```tsx
const voterCount = Math.min(voteCount, 50);
```
to:
```tsx
const voterCount = voteCount;
```

This generates all voters (the full `voteCount`), not just the first 50.

---

**2. Add pagination state**

Add a `displayCount` state to track how many voters are currently visible, starting at 50:

```tsx
const [displayCount, setDisplayCount] = useState(50);
```

Also add a constant for page size:
```tsx
const PAGE_SIZE = 50;
```

---

**3. Slice the filtered voters for display**

Instead of rendering all `filteredVoters`, only render the first `displayCount`:

```tsx
const displayedVoters = filteredVoters.slice(0, displayCount);
const hasMore = filteredVoters.length > displayCount;
const remainingCount = filteredVoters.length - displayCount;
```

---

**4. Add "Load More" button after the voter cards**

After the voter cards list and before the footer note, add a "Load More" button that appears only when there are more voters to show:

```tsx
{hasMore && (
  <Button
    variant="outline"
    className="w-full h-11 text-sm font-medium"
    onClick={() => setDisplayCount(prev => prev + PAGE_SIZE)}
  >
    <ChevronDown className="h-4 w-4 mr-2" />
    Load More ({remainingCount} remaining)
  </Button>
)}
```

---

**5. Update the badge and info text**

Update the badge to show displayed vs total:
```tsx
<Badge variant="secondary" className="text-xs">
  {displayedVoters.length} of {voteCount}
</Badge>
```

Update the info text:
```tsx
<p className="text-xs text-muted-foreground">
  Showing {displayedVoters.length} of {filteredVoters.length} voters
  {filteredVoters.length < voteCount ? ` (filtered from ${voteCount})` : ""}
</p>
```

---

**6. Reset display count when search changes**

When the user types a search query, reset the display count back to 50 so pagination starts fresh for filtered results:

```tsx
const handleSearchChange = (value: string) => {
  setSearchQuery(value);
  setDisplayCount(PAGE_SIZE);
};
```

---

**7. Add `ChevronDown` icon import**

Add `ChevronDown` to the lucide-react imports for the "Load More" button icon.

---

**8. Add `Button` import**

Add `Button` from `@/components/ui/button` since it's not currently imported.

---

### Files to Modify

| File | Change |
|------|--------|
| `src/components/admin/election/CandidateVotersListSheet.tsx` | Remove 50-cap, add pagination state, "Load More" button, update counts |

---

### Mobile UX Details

- The "Load More" button uses `h-11` for comfortable touch target
- Full-width button (`w-full`) for easy tapping
- Shows exact remaining count (e.g., "Load More (4 remaining)")
- Automatically disappears when all voters are shown
- Search resets pagination to prevent confusion
- Button placed right after the last voter card, before the footer

---

### Expected Result

```text
[Voter Card 1]
[Voter Card 2]
...
[Voter Card 50]

[ Load More (4 remaining) ]   <-- New button

[Footer Note]
```

After tapping "Load More":
```text
[Voter Card 1]
...
[Voter Card 54]

[Footer Note]   <-- Button disappears, all shown
```

