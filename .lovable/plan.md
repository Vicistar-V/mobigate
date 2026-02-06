
## Make Active Buttons and Fix Text in Election Views

### What This Does

Three improvements to the election results and voters list screens, all mobile-focused:

---

### 1. Make "Total Votes" and "With Remarks" Stat Boxes Clickable (CandidateVotersListSheet)

Currently, the "54 Total Votes" and "27 With Remarks" stat boxes in the candidate summary card are static display elements. They will become active, tappable buttons:

- **"Total Votes" tap**: Scrolls down to the voters list section and clears any active filter (shows all voters)
- **"With Remarks" tap**: Filters the voters list to show ONLY voters who left remarks, updates the search/display accordingly

Visual changes:
- Add `cursor-pointer active:bg-primary/10 transition-colors` to the Total Votes box
- Add `cursor-pointer active:bg-orange-500/10 transition-colors` to the With Remarks box
- Both get a subtle ring/border on tap for touch feedback

**File:** `src/components/admin/election/CandidateVotersListSheet.tsx`

Changes:
- Add a `filterMode` state: `"all" | "remarks_only"` (default `"all"`)
- When `filterMode === "remarks_only"`, additionally filter voters to only those with remarks
- Update the `filteredVoters` logic to respect both search AND filter mode
- Make "Total Votes" box clickable - resets filter to "all" and clears search
- Make "With Remarks" box clickable - sets filter to "remarks_only"
- Add a visual active/selected indicator on the currently active filter box
- When filter changes, reset `displayCount` back to `PAGE_SIZE`

---

### 2. Make Candidate Names/Avatars Clickable to Open Profile (AdminMainElectionSection and AdminPrimaryElectionsSection)

In the election results view (Image 282), clicking on a candidate's name or avatar should open the MemberPreviewDialog, allowing navigation to their full Mobigate profile.

**File:** `src/components/admin/election/AdminMainElectionSection.tsx`

Changes:
- Import `MemberPreviewDialog` and `ExecutiveMember` type
- Add `selectedMember` and `showMemberPreview` state
- Create `handleCandidateClick` that maps a candidate to `ExecutiveMember` and opens the preview
- Make the candidate name + avatar area clickable (the row with number, avatar, name) with touch feedback
- Keep the "Voters List" button separate (should NOT trigger the profile preview)
- Render `MemberPreviewDialog` at root level

**File:** `src/components/admin/election/AdminPrimaryElectionsSection.tsx`

Same pattern as above:
- Import `MemberPreviewDialog` and `ExecutiveMember`
- Add state and handler
- Make candidate name/avatar rows clickable
- Render `MemberPreviewDialog`

---

### 3. Fix Text Display (Already Fixed in Code)

The screenshot shows old text "Showing first 50 voters of 54 total" which was already corrected in the last edit to "Showing 50 of 54 voters". This is already deployed - the screenshot was taken before the fix was applied. No further changes needed.

---

### Technical Details

#### CandidateVotersListSheet.tsx Changes

**Add filter state:**
```tsx
const [filterMode, setFilterMode] = useState<"all" | "remarks_only">("all");
```

**Update filteredVoters logic:**
```tsx
const filteredVoters = voters.filter(voter => {
  const matchesSearch = voter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    voter.accreditationNumber.toLowerCase().includes(searchQuery.toLowerCase());
  const matchesFilter = filterMode === "all" || voter.remarks;
  return matchesSearch && matchesFilter;
});
```

**Make stat boxes interactive:**
```tsx
<div className="grid grid-cols-2 gap-3 mt-4">
  <button 
    className={cn(
      "text-center p-2 bg-background rounded-lg transition-colors",
      filterMode === "all" 
        ? "ring-2 ring-primary/30" 
        : "active:bg-primary/10"
    )}
    onClick={() => {
      setFilterMode("all");
      setSearchQuery("");
      setDisplayCount(PAGE_SIZE);
    }}
  >
    <p className="text-xl font-bold text-primary">{voteCount}</p>
    <p className="text-xs text-muted-foreground">Total Votes</p>
  </button>
  <button 
    className={cn(
      "text-center p-2 bg-background rounded-lg transition-colors",
      filterMode === "remarks_only" 
        ? "ring-2 ring-orange-500/30" 
        : "active:bg-orange-500/10"
    )}
    onClick={() => {
      setFilterMode("remarks_only");
      setSearchQuery("");
      setDisplayCount(PAGE_SIZE);
    }}
  >
    <p className="text-xl font-bold text-orange-500">{remarksCount}</p>
    <p className="text-xs text-muted-foreground">With Remarks</p>
  </button>
</div>
```

**Add filter indicator in the list header:**
```tsx
{filterMode === "remarks_only" && (
  <Badge 
    variant="secondary" 
    className="text-xs bg-orange-100 text-orange-700 cursor-pointer"
    onClick={() => {
      setFilterMode("all");
      setDisplayCount(PAGE_SIZE);
    }}
  >
    Remarks only x
  </Badge>
)}
```

---

#### AdminMainElectionSection.tsx Changes

**Add imports:**
```tsx
import { MemberPreviewDialog } from "@/components/community/MemberPreviewDialog";
import { ExecutiveMember } from "@/data/communityExecutivesData";
```

**Add state:**
```tsx
const [selectedMember, setSelectedMember] = useState<ExecutiveMember | null>(null);
const [showMemberPreview, setShowMemberPreview] = useState(false);
```

**Add handler:**
```tsx
const handleCandidateClick = (candidate: { id: string; name: string; avatar: string }) => {
  setSelectedMember({
    id: candidate.id,
    name: candidate.name,
    position: "Community Member",
    tenure: "",
    imageUrl: candidate.avatar,
    level: "officer",
    committee: "executive",
  });
  setShowMemberPreview(true);
};
```

**Make the candidate name/avatar row clickable:**
```tsx
<div 
  className="flex items-center gap-3 mb-2 cursor-pointer active:opacity-70 transition-opacity"
  onClick={() => handleCandidateClick(candidate)}
>
  {/* existing avatar + name content */}
</div>
```

**Add MemberPreviewDialog at component root:**
```tsx
<MemberPreviewDialog
  member={selectedMember}
  open={showMemberPreview}
  onOpenChange={setShowMemberPreview}
/>
```

---

#### AdminPrimaryElectionsSection.tsx Changes

Identical pattern to AdminMainElectionSection - add imports, state, handler, clickable row, and dialog.

---

### Files to Modify

| File | Change |
|------|--------|
| `src/components/admin/election/CandidateVotersListSheet.tsx` | Make stat boxes interactive with filter toggle |
| `src/components/admin/election/AdminMainElectionSection.tsx` | Make candidate names clickable to open profile |
| `src/components/admin/election/AdminPrimaryElectionsSection.tsx` | Make candidate names clickable to open profile |

### Mobile UX

- All interactive elements use `active:` states for touch feedback
- Filter toggle on stat boxes uses ring highlight to show active state
- Candidate rows use opacity transition on tap
- MemberPreviewDialog opens as bottom drawer on mobile (built-in behavior)
- "Remarks only" filter can be cleared via a dismissable badge
