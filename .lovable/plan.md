
## Wire Up Inactive Buttons in "Other Members' Financial Summaries"

### Problem

In the "Other Members' Financial Summaries" section, all four interactive elements are completely static:
- **"View Now" button** -- does nothing
- **"Friends" link** -- does nothing
- **"Profile" link** -- does nothing  
- **"View Report" link** -- does nothing

### Solution

Wire each button/link to its appropriate existing component or navigation target. All changes are confined to a single file.

---

### File: `src/components/community/finance/OtherMembersFinancialSection.tsx`

#### Add State and Imports

- Import `useState` from React
- Import `useNavigate` from `react-router-dom`
- Import `useToast` from `@/hooks/use-toast`
- Import `MemberPreviewDialog` from `@/components/community/MemberPreviewDialog`
- Import `FinancialStatusDialog` from `./FinancialStatusDialog`

Add state variables:
- `selectedMember` -- tracks which member was tapped (for Profile preview)
- `showMemberPreview` -- controls the MemberPreviewDialog drawer
- `showFinancialReport` -- controls the FinancialStatusDialog
- `friendRequests` -- tracks which members have pending friend requests (local Set)

#### Wire "Friends" Button

When tapped, send a friend request to that member (toast confirmation + update local state to show "Request Sent"). If already sent, show disabled state. This mirrors the pattern used in `MemberPreviewDialog.handleAddFriend`.

```
onClick -> if already sent: disabled state
         -> else: add to friendRequests set, show toast "Friend request sent to {name}"
```

#### Wire "Profile" Button

When tapped, open the `MemberPreviewDialog` drawer showing the member's preview (avatar, name, position, mutual friends, action buttons). The member data is mapped from `otherMembersFinancialData` to the `ExecutiveMember` format expected by `MemberPreviewDialog`.

```
onClick -> set selectedMember to mapped member data
        -> set showMemberPreview = true
```

#### Wire "View Report" Button

When tapped, open the `FinancialStatusDialog` which shows the member's financial standing, compliance rate, outstanding balance, and payment history. Since this is a UI template, it will show the mock financial status data.

```
onClick -> set showFinancialReport = true
```

#### Wire "View Now" Button

When tapped, scroll down to the member list (or expand the section if collapsed). Since the members are already visible, this button will open a toast indicating "Viewing all member summaries" and could scroll to the first member card for visual feedback.

Alternatively, since members are already visible, wire it to navigate to a hypothetical full members list view -- but since this is a UI template, show a toast: "Viewing all financial summaries" to provide tactile feedback.

---

### Technical Details

**Member data mapping** (otherMembersFinancialData to ExecutiveMember format):

```typescript
const mappedMember = {
  id: member.id,
  name: member.name,
  imageUrl: member.avatar,
  position: "Community Member",
  isFriend: friendRequests.has(member.id),
};
```

**Button behavior summary:**

| Button | Action | Component/Navigation |
|--------|--------|---------------------|
| View Now | Toast feedback | Toast notification |
| Friends | Send friend request | Local state + toast |
| Profile | Open member preview | MemberPreviewDialog (Drawer) |
| View Report | Open financial report | FinancialStatusDialog |

### Mobile Optimization

- All triggered components (MemberPreviewDialog, FinancialStatusDialog) are already mobile-optimized with Drawer patterns
- Button touch targets maintained with existing `h-auto p-0` sizing
- No desktop breakpoints added -- purely mobile-focused

### Files Modified
1. `src/components/community/finance/OtherMembersFinancialSection.tsx`
