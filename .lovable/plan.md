

## Fix Resource Managers Click + Publications Text Input Errors

### Issues Identified

**Issue 1: Team Tab - Resource Manager cards are not clickable**
The Resource Manager cards (Margaret Okonkwo, Robert Adeyemi) in the Team tab are static -- tapping them does nothing. Per the user's annotation, clicking should open the member's profile preview via `MemberPreviewDialog`.

**Issue 2: Pubs Tab - Search input has text writing errors**
The "Search publications..." input loses focus while typing on mobile. This is a known pattern where inputs inside `ScrollArea` within mobile drawers need `touch-action: manipulation`, `onClick` with `e.stopPropagation()`, and mobile-optimized styling to prevent scroll logic from stealing focus.

---

### Changes in `src/components/community/ManageCommunityResourcesDialog.tsx`

**A. Add MemberPreviewDialog import and state**

Add to imports:
- Import `MemberPreviewDialog` from `@/components/community/MemberPreviewDialog`
- Import `ExecutiveMember` from `@/data/communityExecutivesData`

Add state variables:
```
const [selectedMember, setSelectedMember] = useState<ExecutiveMember | null>(null);
const [showMemberPreview, setShowMemberPreview] = useState(false);
```

**B. Add member click handler**

Create a handler to map resource manager data to `ExecutiveMember` format and open the preview:
```
const handleManagerClick = (manager: typeof mockResourceManagers[0]) => {
  setSelectedMember({
    id: manager.id,
    name: manager.name,
    position: "Resource Manager",
    tenure: "",
    imageUrl: manager.photo,
    level: "officer",
    committee: "executive",
  });
  setShowMemberPreview(true);
};
```

**C. Make Resource Manager cards clickable (lines 929-961)**

Add `onClick` and `active:scale-[0.99]` styling to each manager card, wrapping the existing card content in a clickable container:
- Add `cursor-pointer active:scale-[0.99] transition-transform` to the Card
- Add `onClick={() => handleManagerClick(manager)}` to the Card
- Move the Remove button's `onClick` to use `e.stopPropagation()` so it doesn't trigger the card click

**D. Fix all search inputs for mobile text entry**

For every `Input` element (ID Cards/Letters search on line 367-371 and Publications search on line 754-758), plus the upload form inputs (Title, Description, Edition, Pages):
- Add `style={{ touchAction: 'manipulation' }}` to prevent scroll interference
- Add `onClick={(e) => e.stopPropagation()}` to prevent ScrollArea from stealing focus
- Add `autoComplete="off"` to prevent mobile keyboard issues

The Pubs search input (line 754-758) specifically needs these mobile fixes applied.

The upload form inputs (Title, Description, Edition, Pages on lines 609-660) also need the same mobile fixes.

**E. Add MemberPreviewDialog component at the bottom**

Add the `MemberPreviewDialog` component alongside the existing `OfficialLetterDisplay` and `DigitalIDCardDisplay` at the bottom of the JSX return, right before the closing `</>`:

```tsx
{selectedMember && (
  <MemberPreviewDialog
    member={selectedMember}
    open={showMemberPreview}
    onOpenChange={setShowMemberPreview}
  />
)}
```

---

### Technical Details

**Manager Card clickability (lines 929-961):**

Current:
```tsx
<Card key={manager.id}>
  <CardContent className="p-4">
    ...
    {isOwner && (
      <Button onClick={() => handleRemoveManager(manager.id, manager.name)}>
```

New:
```tsx
<Card key={manager.id} className="cursor-pointer active:scale-[0.99] transition-transform" onClick={() => handleManagerClick(manager)}>
  <CardContent className="p-4">
    ...
    {isOwner && (
      <Button onClick={(e) => { e.stopPropagation(); handleRemoveManager(manager.id, manager.name); }}>
```

**Input mobile fixes pattern:**

Current:
```tsx
<Input
  placeholder="Search publications..."
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  className="pl-9"
/>
```

New:
```tsx
<Input
  placeholder="Search publications..."
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  className="pl-9 h-10 text-base"
  style={{ touchAction: 'manipulation' }}
  onClick={(e) => e.stopPropagation()}
  autoComplete="off"
/>
```

This fix is applied to all input fields in the dialog:
1. ID Cards/Letters search input (line 367)
2. Publications search input (line 754)
3. Publication Title input (line 609)
4. Publication Description textarea (line 618)
5. Publication Edition input (line 644)
6. Publication Pages input (line 655)

---

### Files Modified

| File | Change |
|------|--------|
| `ManageCommunityResourcesDialog.tsx` | Add MemberPreviewDialog import/state, make manager cards clickable with profile preview, fix all text inputs for mobile with touch-action and stopPropagation |

### What This Fixes

- Tapping a Resource Manager card opens their community profile preview
- The Remove button still works independently without triggering the profile
- All search and form inputs in the dialog work properly on mobile without focus loss or character dropping
- Text inputs have proper sizing (`text-base` to prevent iOS zoom) and touch behavior

