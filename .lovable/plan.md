

# Integrate Multi-Signature Authorization into Community Settings Approve/Disapprove

## Problem
The Approve and Disapprove buttons on pending admin setting proposals (in `CommunitySettingsSheet`) currently work as simple one-click votes. Per the governance rules, these actions should require **multi-signature authorization** (3 signatures: President + Secretary + Legal Adviser) before a vote is officially recorded.

The "Settings Pending Approval" banner on the Community page is already connected and opens the settings sheet correctly.

## Solution
Wire the Approve/Disapprove buttons in `AdminSettingProposalCard` to trigger the `ModuleAuthorizationDrawer` with the `settings` module before the vote is recorded. This uses the existing multi-sig infrastructure that's already configured for the settings module.

## Changes

### 1. Update `src/components/community/settings/AdminSettingProposalCard.tsx`
- Import `ModuleAuthorizationDrawer` and `getActionConfig`, `renderActionDetails`
- Add state for `authDrawerOpen` and `pendingVote` (to track whether user tapped approve or disapprove)
- When user taps Approve or Disapprove, store the vote type and open the `ModuleAuthorizationDrawer` instead of directly voting
- Add a new action config entry: use `settings` module with a contextual action key (e.g., `"change_privacy"` or a new `"approve_setting"` / `"disapprove_setting"`)
- On successful multi-sig authorization callback, execute the actual `onVote()` with the pending vote
- Pass `actionDetails` showing the setting name, current value, proposed value, and the vote direction

### 2. Add action configs in `src/components/admin/authorization/authorizationActionConfigs.tsx`
- Add two new entries under the `settings` module:
  - `approve_setting`: "Approve Setting Change" -- for approving a proposed setting
  - `disapprove_setting`: "Disapprove Setting Change" -- for disapproving a proposed setting

## Technical Details

**Flow:**
```text
User taps [Approve] or [Disapprove]
  --> Store vote type in state
  --> Open ModuleAuthorizationDrawer (module="settings", action="approve_setting" or "disapprove_setting")
  --> Admin signatories enter their passwords (3 required: President + Secretary + Legal Adviser)
  --> On authorization success --> call onVote(proposalId, voteType)
  --> Show confirmation toast
```

**Action details rendered in the drawer will show:**
- Setting name (e.g., "Community Finances Visibility")
- Current value vs Proposed value
- Vote direction (Approve or Disapprove)

**Files to edit:**
1. `src/components/admin/authorization/authorizationActionConfigs.tsx` -- add `approve_setting` and `disapprove_setting` configs
2. `src/components/community/settings/AdminSettingProposalCard.tsx` -- wire buttons to open `ModuleAuthorizationDrawer`, execute vote on authorization success

