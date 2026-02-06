

## Connect Message Action to Mobi-Chat

### Problem
The "Message" action in the leadership member actions menu (shown in screenshot) only displays a toast notification but doesn't actually open the Mobi-Chat interface.

### Solution
Update the `handleSendMessage` function to dispatch the `openChatWithUser` custom event, which the `MessagesSheet` component is already listening for.

---

## Implementation Details

### File: `src/components/community/leadership/LeadershipMemberActionsMenu.tsx`

**Lines 104-110 - Current Code:**
```tsx
const handleSendMessage = () => {
  toast({
    title: "Opening Chat",
    description: `Starting conversation with ${member.name}`,
  });
  // Navigate to chat or open chat drawer
};
```

**Updated Code:**
```tsx
const handleSendMessage = () => {
  // Dispatch custom event to open Mobi-Chat with this member
  window.dispatchEvent(
    new CustomEvent('openChatWithUser', {
      detail: {
        userId: member.id,
        userName: member.name,
      },
    })
  );
  
  toast({
    title: "Opening Chat",
    description: `Starting conversation with ${member.name}`,
  });
};
```

---

## How It Works

1. User taps "Message" in the leadership member dropdown menu
2. `handleSendMessage` dispatches a custom event with the member's `userId` and `userName`
3. `MessagesSheet` component (already mounted in app layout) receives the event
4. The sheet searches for a matching conversation by `userId` or `userName`
5. If found, it selects that conversation and opens the chat sheet
6. If not found, it defaults to the first conversation or opens the empty sheet

---

## Files to Modify

| File | Change |
|------|--------|
| `src/components/community/leadership/LeadershipMemberActionsMenu.tsx` | Update `handleSendMessage` to dispatch `openChatWithUser` event |

---

## Expected Outcome

- Tapping "Message" on any leadership member opens the Mobi-Chat sheet
- If a conversation exists with that member, it's automatically selected
- Full mobile-optimized chat interface opens immediately
- Toast notification confirms the action

