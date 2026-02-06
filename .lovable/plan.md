

## Make Voter Cards Clickable to Open User Profile

### What This Does
Each voter card in the "Voters List" (shown in the screenshot) will become fully tappable. Clicking anywhere on a voter card (John Garcia, Daniel Garcia, John Udeh, etc.) will open the Member Preview drawer, which shows the user's photo, name, position, and provides a "View Profile" button to navigate to their full Mobigate profile.

### Flow
```text
Tap voter card (e.g. "John Garcia")
        |
        v
Opens MemberPreviewDialog (bottom drawer)
  - Shows photo, name, online status
  - "View Profile" button -> /profile/:id
  - Add Friend / Message / Add to Circle
```

---

### Technical Details

#### File: `src/components/admin/election/CandidateVotersListSheet.tsx`

**1. Add MemberPreviewDialog import and state**

Add imports for `MemberPreviewDialog` and the `ExecutiveMember` type. Add state variables to track:
- `selectedMember` - the voter mapped to an `ExecutiveMember` object
- `showMemberPreview` - whether the preview drawer is open

**2. Create voter-to-member mapper function**

Since `MemberPreviewDialog` expects an `ExecutiveMember` object, create a helper that maps a `CandidateVoter` to the required shape:

```tsx
const mapVoterToMember = (voter: CandidateVoter): ExecutiveMember => ({
  id: voter.id,
  name: voter.name,
  position: "Community Member",
  tenure: "",
  imageUrl: voter.avatar,
  level: "officer",
  committee: "executive",
});
```

**3. Add click handler**

```tsx
const handleVoterClick = (voter: CandidateVoter) => {
  setSelectedMember(mapVoterToMember(voter));
  setShowMemberPreview(true);
};
```

**4. Make voter cards fully tappable**

Wrap each voter `Card` content with a clickable container:
- Change the outer `Card` to have `cursor-pointer` and `active:bg-muted/50` for touch feedback
- Add `onClick={() => handleVoterClick(voter)}` to the Card
- Add a subtle `ChevronRight` indicator on the right side (already imported but unused)

**5. Add MemberPreviewDialog to JSX**

Render the dialog outside the drawer/sheet to prevent z-index conflicts:

```tsx
<MemberPreviewDialog
  member={selectedMember}
  open={showMemberPreview}
  onOpenChange={setShowMemberPreview}
/>
```

---

### Visual Changes on Mobile

**Before:** Voter cards are static display-only items
**After:** Each voter card has:
- Touch ripple/feedback on tap (`active:bg-muted/50 transition-colors`)
- A subtle chevron indicator on the right side showing it's tappable
- Opens the member preview drawer on tap
- From the preview, users can navigate to the full Mobigate profile

---

### Files to Modify

| File | Change |
|------|--------|
| `src/components/admin/election/CandidateVotersListSheet.tsx` | Add MemberPreviewDialog integration, make voter cards clickable |

No new files needed. Uses existing `MemberPreviewDialog` component and `ExecutiveMember` interface.

