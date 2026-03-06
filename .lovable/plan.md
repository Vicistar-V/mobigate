

# Plan: Implement "Penalised" and "Reported" Tags on User/Merchant Headers

## What We're Building

A tagging system that shows **"Penalised (12x)"** and **"Reported (10x)"** badges next to user/merchant names across the platform. These tags:
- Show the total count of penalties or reports
- Auto-hide if no new offences/reports in 12 months
- Can be manually hidden by admin
- Re-appear (including old hidden ones) if new reports/penalties occur
- Are never permanently deleted

## Technical Approach

### 1. Create a Tag Data System (`src/data/userTags.ts`)
- Define a `UserTag` interface with fields: `userId`, `type` ("penalised" | "reported"), `count`, `entries[]` (each with date, description, hidden flag), `manuallyHidden`, `lastOffenceDate`
- Implement helper functions:
  - `getVisibleTags(userId)` — returns tags where `manuallyHidden` is false AND (`lastOffenceDate` is within 12 months OR there are recent entries)
  - `hideTag(userId, type)` — sets `manuallyHidden = true`
  - `addOffence(userId, type)` — increments count, unhides all previous entries, sets `manuallyHidden = false`
- Provide mock data for several users/merchants

### 2. Create a Reusable `UserTagBadges` Component (`src/components/UserTagBadges.tsx`)
- Mobile-first, inline badges that sit next to a user's name
- "Penalised (12x)" in red, "Reported (10x)" in amber/orange
- Compact pill-style badges using existing `Badge` component
- Tapping a badge opens a bottom drawer showing full offence/report history with dates
- Normal readable text size (text-xs minimum)

### 3. Integrate Tags Into Key Locations
- **GreetingCard.tsx** (line ~87): Add `<UserTagBadges userId={currentUserId} />` below the `fullName` heading
- **AdminComplaintsTab.tsx**: Show tags next to `merchantName` in complaint cards and the detail drawer
- **Profile pages**: Add tags next to user display names where they appear in headers

### 4. Admin Tag Management
- In the complaint detail drawer, add a "Hide Tag" button that lets admin manually hide a tag for a merchant
- Show a subtle indicator when a tag is manually hidden (admin-only visibility)

### Files to Create
- `src/data/userTags.ts` — tag data model, mock data, helper functions
- `src/components/UserTagBadges.tsx` — reusable tag badge component with history drawer

### Files to Modify
- `src/components/GreetingCard.tsx` — add tags next to user name
- `src/components/admin/AdminComplaintsTab.tsx` — add tags next to merchant names in cards and detail drawer

