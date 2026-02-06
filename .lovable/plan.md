

## Status-Reflective Approve/Reject Buttons in Content Moderation

### What Changes

When a content item is approved or rejected, instead of the buttons disappearing instantly, they should change to show the action result:

- **Approved**: The Approve button changes to "Approved" (green background, disabled), and the Reject button hides
- **Rejected**: The Reject button changes to "Rejected" (red background, disabled), and the Approve button hides

This mirrors the existing Membership Request management pattern used elsewhere in the app.

---

### Files to Modify (6 total)

#### 1. `src/components/admin/content/PendingApprovalsTab.tsx` (lines 274-291)

The Pending Approvals tab is unique because items disappear from the list immediately when their status changes (since `getPendingApprovals()` filters for pending only). To show the status transition, we need local state to track recently acted-upon items.

**Add local state:**
```tsx
const [actionedItems, setActionedItems] = useState<Record<string, 'approved' | 'rejected'>>({});
```

**Wrap `onApprove` and `onReject` callbacks** to first record the action locally, then call the parent after a brief visual delay:
```tsx
const handleLocalApprove = (id: string) => {
  setActionedItems(prev => ({ ...prev, [id]: 'approved' }));
  setTimeout(() => onApprove(id), 1200);
};

const handleLocalReject = (id: string) => {
  setActionedItems(prev => ({ ...prev, [id]: 'rejected' }));
  onReject(id);
};
```

**Replace the actions row (lines 275-291)** with status-aware buttons:
- If `actionedItems[item.id] === 'approved'`: Show a single disabled green "Approved" button
- If `actionedItems[item.id] === 'rejected'`: Show a single disabled red "Rejected" button
- Otherwise: Show the normal Approve and Reject buttons

#### 2. `src/components/admin/content/NewsManagementTab.tsx` (lines 222-232)

Replace the conditional `{item.status === 'pending' && (...)}` block with status-aware rendering:
- If `item.status === 'published'`: Show disabled green "Approved" button
- If `item.status === 'rejected'`: Show disabled red "Rejected" button
- If `item.status === 'pending'`: Show active Approve and Reject buttons

#### 3. `src/components/admin/content/EventsManagementTab.tsx` (lines 251-260)

Same pattern as News -- replace conditional block with status-aware buttons.

#### 4. `src/components/admin/content/ArticlesManagementTab.tsx` (lines 265-274)

Same pattern as News -- replace conditional block with status-aware buttons.

#### 5. `src/components/admin/content/VibesManagementTab.tsx` (lines 231-240)

Same pattern as News -- replace conditional block with status-aware icon buttons (Vibes uses icon-only buttons due to compact grid layout).

#### 6. `src/components/admin/content/ContentPreviewSheet.tsx` (lines 238-256)

Replace the footer actions conditional with status-aware rendering:
- If `content.status === 'published'` and approve/reject callbacks exist: Show disabled green "Approved" button
- If `content.status === 'rejected'` and approve/reject callbacks exist: Show disabled red "Rejected" button
- Otherwise keep existing behavior

---

### Technical Details

**Button states pattern (used in all components):**

```tsx
{/* Status-aware approve/reject buttons */}
{item.status === 'published' && (
  <Button size="sm" variant="outline" className="h-9 text-sm gap-1.5 text-green-600 bg-green-50 border-green-200 flex-1" disabled>
    <Check className="h-4 w-4" /> Approved
  </Button>
)}
{item.status === 'rejected' && (
  <Button size="sm" variant="outline" className="h-9 text-sm gap-1.5 text-red-600 bg-red-50 border-red-200 flex-1" disabled>
    <X className="h-4 w-4" /> Rejected
  </Button>
)}
{item.status === 'pending' && (
  <>
    <Button size="sm" variant="outline" className="h-9 text-sm gap-1.5 text-green-600 flex-1" onClick={() => onApprove(item.id)}>
      <Check className="h-4 w-4" /> Approve
    </Button>
    <Button size="sm" variant="outline" className="h-9 text-sm gap-1.5 text-red-600 flex-1" onClick={() => onReject(item.id)}>
      <X className="h-4 w-4" /> Reject
    </Button>
  </>
)}
```

**PendingApprovalsTab special handling:**

Since items in this tab are filtered to pending-only and would vanish on status change, we use local `actionedItems` state to track the visual transition:
- On approve: record locally, show "Approved" button immediately, then call parent `onApprove` after 1.2s delay so the user sees the visual feedback
- On reject: record locally, show "Rejected" button immediately, then call parent `onReject` (which opens the rejection reason dialog)

**Sizing adjustments for each component:**
- PendingApprovalsTab: `h-9 text-sm flex-1` (full-width buttons)
- NewsManagementTab: `h-9 text-sm` (inline buttons)
- EventsManagementTab: `h-7 text-xs` (compact buttons)
- ArticlesManagementTab: `h-7 text-xs` (compact buttons)
- VibesManagementTab: `h-6 w-6 p-0` (icon-only for grid cards) with tooltip text
- ContentPreviewSheet: `flex-1` (footer full-width buttons)

### Summary

| File | Change |
|------|--------|
| PendingApprovalsTab.tsx | Add local action tracking state, show "Approved"/"Rejected" disabled buttons with visual delay |
| NewsManagementTab.tsx | Replace conditional with status-aware Approved/Rejected/Approve/Reject buttons |
| EventsManagementTab.tsx | Same status-aware button pattern |
| ArticlesManagementTab.tsx | Same status-aware button pattern |
| VibesManagementTab.tsx | Same status-aware icon button pattern |
| ContentPreviewSheet.tsx | Same status-aware button pattern in footer |
