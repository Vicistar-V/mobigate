

## Plan: Add "Complaints" Tab to Manage Merchants Admin Page

### What We're Building

A new **"Complaints"** tab on the `/mobigate-admin/merchants` page, positioned right after "Applications". This tab gives admins a full interface to view, filter, and manage all merchant report cases submitted by users.

### Tab Layout

```text
[ All Merchants ] [ Applications (4) ] [ Complaints (3) ] [ Settings ]
```

The Complaints tab will show:
1. **Summary stats row** — Total, Pending, Investigating, Resolved, Dismissed counts with color-coded styling
2. **Filter chips** — Filter by status (All / Pending / Investigating / Resolved / Dismissed) and by category (Scam/Fraud, Harassment, etc.)
3. **Complaint cards list** — Each card shows:
   - Category badge + status badge (color-coded)
   - Merchant name the complaint is against
   - Truncated description
   - Reporter info (or "Anonymous")
   - Submission date + reference number
   - Action buttons: "Investigate", "Resolve", "Dismiss" depending on current status
4. **Complaint detail drawer** — Tapping a card opens a 92vh drawer with full details, resolution history, and action buttons

### Files to Modify/Create

| File | Action |
|------|--------|
| `src/components/admin/AdminComplaintsTab.tsx` | **Create** — Full complaints management UI component |
| `src/pages/admin/ManageMerchantsPage.tsx` | **Modify** — Add "Complaints" tab with badge count, import and render the new component |

### Technical Details

- Reuses the `reportCategories`, status types, and mock data patterns from `MerchantReportDrawer.tsx` (but with expanded admin-specific mock data covering multiple merchants)
- Mock complaints data will include merchant names, reporter info, dates, categories, statuses, and resolution notes
- Status transitions: Pending → Investigating → Resolved/Dismissed (with required reason textarea for Resolve/Dismiss)
- Admin actions use toast confirmations with beast-mode processing animation (2s delay + spinner)
- Complaint detail drawer: 92vh, `overflow-y-auto touch-auto overscroll-contain`, with action buttons pinned to bottom
- All touch targets h-11 minimum, no font size reductions, mobile-only focus

