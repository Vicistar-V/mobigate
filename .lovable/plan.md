

## Make Campaign Elements Interactive: Profile Links and Feedback Reader

### What This Fixes

From the screenshots, three elements in the Election Campaign UI are currently non-interactive and need to be wired up:

1. **Candidate Name/Photo** on the Campaign Full View sheet -- tapping should open the candidate's main profile
2. **"16 responses" badge** in the Write Feedback dialog -- tapping should open the CandidateFeedbackSheet so users can read existing feedback
3. **Candidate Avatar/Name** in the Write Feedback dialog -- tapping should open the candidate's main profile

---

### Files to Modify

| File | Changes |
|------|---------|
| `CampaignFullViewSheet.tsx` | Make candidate name + avatar clickable to navigate to `/profile/:candidateId` |
| `CampaignFeedbackDialog.tsx` | Wire "responses" badge to open `CandidateFeedbackSheet`; make avatar + name clickable to navigate to profile |
| `CampaignBannerCard.tsx` | Make candidate name clickable to navigate to profile |

---

### File 1: `src/components/community/elections/CampaignFullViewSheet.tsx`

**Changes:**
- Import `useNavigate` from react-router-dom
- Wrap the candidate Avatar and Name in the header section with a clickable container
- On tap, navigate to `/profile/${campaign.candidateId}`
- Add `touch-manipulation active:scale-[0.97]` for mobile feedback
- Add a subtle visual indicator (e.g., underline or chevron) showing the name is tappable

**Implementation detail:**
```
// In the SheetHeader section (around lines 74-86):
// Wrap avatar + name in a clickable div
<div
  className="flex items-start gap-3 cursor-pointer touch-manipulation active:opacity-80"
  onClick={() => navigate(`/profile/${campaign.candidateId}`)}
>
  <Avatar>...</Avatar>
  <div>
    <SheetTitle className="text-lg underline-offset-2 hover:underline">
      {campaign.candidateName}
    </SheetTitle>
    <p className="text-sm text-primary">Candidate for {campaign.office}</p>
  </div>
</div>
```

### File 2: `src/components/community/elections/CampaignFeedbackDialog.tsx`

**Changes:**

**A. Make "responses" badge clickable to open feedback reader:**
- Import `CandidateFeedbackSheet` component
- Add state: `showFeedbackList` (boolean)
- Change the Badge from static to a `<button>` / clickable element
- On tap, set `showFeedbackList(true)` to open the `CandidateFeedbackSheet`
- Render `CandidateFeedbackSheet` at the bottom of the component

**B. Make candidate avatar + name clickable to open profile:**
- Import `useNavigate` from react-router-dom
- Wrap the avatar + name section in a clickable container
- On tap, navigate to `/profile/${campaign.candidateId}`
- Add touch feedback styling

**Implementation detail for the responses badge:**
```
// Change Badge to clickable:
<Badge
  variant="outline"
  className="shrink-0 text-xs font-medium px-2.5 py-1 border-primary/30 bg-primary/5 
             cursor-pointer touch-manipulation active:scale-[0.95] hover:bg-primary/10"
  onClick={() => setShowFeedbackList(true)}
>
  {campaign.feedbackCount} responses
</Badge>

// At the bottom, render the sheet:
<CandidateFeedbackSheet
  open={showFeedbackList}
  onOpenChange={setShowFeedbackList}
  campaign={campaign}
/>
```

**Implementation detail for the avatar/name:**
```
// Wrap avatar + candidate info in clickable container:
<div
  className="flex items-start gap-3 cursor-pointer touch-manipulation active:opacity-80"
  onClick={() => navigate(`/profile/${campaign.candidateId}`)}
>
  <Avatar>...</Avatar>
  <div>
    <h4 className="font-semibold text-base leading-tight underline-offset-2 hover:underline">
      {campaign.candidateName}
    </h4>
    <p className="text-sm text-muted-foreground">Candidate for {campaign.office}</p>
  </div>
</div>
```

### File 3: `src/components/community/elections/CampaignBannerCard.tsx`

**Changes:**
- Import `useNavigate` from react-router-dom
- Make the candidate name text clickable (not the entire card, since the card already has an onClick for viewing the campaign)
- On tap of name, stop propagation and navigate to `/profile/${campaign.candidateId}`

**Implementation detail:**
```
// In the full-size card (line 91):
<h4
  className="font-bold text-sm cursor-pointer touch-manipulation active:opacity-70 hover:underline"
  onClick={(e) => {
    e.stopPropagation();
    navigate(`/profile/${campaign.candidateId}`);
  }}
>
  {campaign.candidateName}
</h4>
```

---

### Technical Summary

- All three components get `useNavigate` for profile navigation
- The `CampaignFeedbackDialog` gets a new state + renders `CandidateFeedbackSheet` for reading responses
- Touch feedback is achieved with `touch-manipulation active:scale-[0.95]` or `active:opacity-80`
- `e.stopPropagation()` is used on the banner card name to prevent triggering the parent card's onClick
- No new files need to be created -- all changes use existing components (`CandidateFeedbackSheet`, profile route)
