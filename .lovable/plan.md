

## Plan: Add "Manage Communities" to Mobigate Admin

### Context
The Mobigate Admin dashboard currently has tabs for Overview, Elections, Revenue, Quiz, Adverts, Merchants, and Settings. There is no "Communities" management section, even though communities are a core entity on the platform. Community admins manage membership, content, finances, elections, meetings, leadership, and settings at the individual community level, but the platform (Mobigate) admin has no oversight or regulatory controls over communities.

### What Community Admin Currently Handles
From the `CommunityAdminDashboard`, each community admin manages:
1. **Membership** -- approve/reject requests, view all members, block/suspend
2. **Content** -- moderate news, events, gallery, resources
3. **Finances** -- financial overview, audit, obligations, defaulting members
4. **Elections** -- campaigns, results, accreditation, clearances, voting config
5. **Meetings** -- upcoming/past meetings, attendance, resolutions, conflicts, roll call
6. **Leadership** -- executives, ad-hoc committees, election results, change history
7. **Settings** -- constitution, privacy, notifications, democratic governance

### What Mobigate Admin Should Regulate
The platform admin needs a higher-level oversight view -- not duplicating community admin functions, but regulating and monitoring communities:

### Proposed "Manage Communities" Page (`/mobigate-admin/communities`)
A dedicated page (similar to `ManageMerchantsPage`) with tabs:

**Tab 1: All Communities**
- Searchable, filterable list of all communities (by type, status, location)
- Each community card shows: name, type, member count, status (Active/Inactive/Suspended/Flagged), creation date
- Clicking opens a detail drawer with:
  - Community overview (stats, leadership, type)
  - Quick actions: Suspend, Flag, Deactivate (password-gated with 4-admin auth)
  - Link to "View Community Admin Dashboard" (read-only)
  - Financial summary (dues collected, wallet balance)
  - Compliance status (constitution uploaded, elections held)

**Tab 2: Applications / New Communities**
- Pending community creation requests (if moderation is enabled)
- Approve/reject with reason

**Tab 3: Complaints**
- Reports filed against communities (similar to Merchant Complaints tab)
- Filter by status, category, date
- Stats grid: Total, Pending, Resolved, Escalated, Penalised

**Tab 4: Settings**
- Platform-wide community rules (password-gated):
  - **Community Creation Fees** -- fee to create a community
  - **Minimum Members** -- threshold before a community goes active
  - **Election Regulations** -- platform rules for community elections
  - **Content Policies** -- what communities can/cannot post
  - **Financial Compliance** -- reporting requirements, audit triggers
  - **Community Suspension/Deactivation Rules**

### Implementation

**Files to create:**
1. `src/pages/admin/ManageCommunitiesPage.tsx` -- Main page with 4 tabs (All Communities, Applications, Complaints, Settings), following the exact same pattern as `ManageMerchantsPage.tsx`
2. Mock data for communities list, applications, complaints embedded in the page

**Files to modify:**
1. `src/pages/admin/MobigateAdminDashboard.tsx` -- Add "Communities" tab trigger that navigates to `/mobigate-admin/communities` (same pattern as the Merchants tab)
2. `src/App.tsx` -- Add route: `/mobigate-admin/communities` -> `ManageCommunitiesPage`

### UI Pattern
- Follows the established Mobigate admin patterns: `Header` at top, tabs navigation, drawer-based detail views, password-gated settings sections
- Mobile-first with touch-friendly cards and compact layouts
- Uses existing community mock data from `communityData.ts` plus new mock data for platform-level stats

