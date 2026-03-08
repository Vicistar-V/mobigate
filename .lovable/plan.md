

## Plan: Fix Deactivation Authorization Drawer Stacking Issue

### Problem
When admin selects "Deactivate Permanently" and clicks "Apply Penalty" inside the complaint detail drawer, a **second drawer** (`ModuleAuthorizationDrawer`) opens on top of the first. This causes visual corruption — the authorization content renders over a black/broken background because two drawers are stacked (both using vaul's Drawer component which manipulates body/overlay).

### Root Cause
Two `Drawer` components are open simultaneously:
1. **Complaint Detail Drawer** (lines 525-876) — remains open
2. **ModuleAuthorizationDrawer** (lines 878-914) — opens on top

Vaul drawers don't nest cleanly on mobile, causing the black overlay and broken rendering.

### Solution: Inline the Authorization Panel
Instead of opening a second drawer, **replace the complaint drawer's content** with the authorization panel when deactivation is triggered. This keeps everything inside a single drawer.

### Files to Modify

| File | Change |
|------|--------|
| `src/components/admin/AdminComplaintsTab.tsx` | Replace `ModuleAuthorizationDrawer` usage with inline `ModuleAuthorizationPanel` rendered inside the existing complaint drawer when `showDeactivationAuth` is true |

### Technical Approach

1. **Import `ModuleAuthorizationPanel`** directly (instead of the Drawer wrapper)
2. **When `showDeactivationAuth` is true**, the complaint drawer renders the `ModuleAuthorizationPanel` instead of the complaint details + penalty form
3. **When auth completes or is cancelled**, switch back to the complaint view
4. **Remove the separate `ModuleAuthorizationDrawer`** component usage at the bottom

This is a single-file change — swap the drawer-within-a-drawer pattern for a view-switching pattern inside one drawer.

