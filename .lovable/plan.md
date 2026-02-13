

# Fix "Find Friend" and "Invite People" Buttons on Profile Friends Tab

## Problem
The "Find Friend" and "Invite People" buttons on the profile's Friends tab currently only show placeholder toasts ("coming soon"). The project already has fully built `AddFriendsDialog` and `InviteMembersDialog` components -- they just need to be connected.

## Changes

### File: `src/components/profile/ProfileFriendsTab.tsx`
- Import `AddFriendsDialog` from `@/components/community/AddFriendsDialog`
- Import `InviteMembersDialog` from `@/components/community/InviteMembersDialog`
- Add two state variables: `showAddFriends` and `showInviteMembers` (both boolean, default false)
- Update `handleFindFriends` to set `showAddFriends = true` instead of showing a toast
- Update the "Invite People" button's `onClick` to set `showInviteMembers = true` instead of showing a toast
- Render both dialogs at the bottom of the component, passing the state and setter as `open` / `onOpenChange`

### No other files need changes
The dialogs are self-contained components that already handle search, member previews, and actions internally.

