
# Fix Input Flickering Across All Dialogs/Drawers

## Root Cause
**29 files** define their shared content as `const Content = () => (...)` -- an inline arrow function component. On every keystroke in an input field, React state updates, the parent re-renders, and React treats `Content` as a **new component** (because the function reference changes). This causes React to unmount and remount the entire content tree, destroying input focus and cursor position. The result: flickering text, lost cursor, and garbled input.

## Fix
Convert every `const Content = () => (...)` to `const content = (...)` (a JSX variable), and replace `<Content />` with `{content}`. This preserves element identity across re-renders.

## Files to Update (all 29 affected files)

**High priority (contain Input/Textarea -- visible flickering):**
1. `src/components/community/settings/RecommendAlternativeDialog.tsx`
2. `src/components/community/settings/RecommendNewSettingDialog.tsx`
3. `src/components/community/finance/WalletTransferDialog.tsx`
4. `src/components/community/finance/WalletTopUpDialog.tsx`
5. `src/components/community/elections/NominateCandidateSheet.tsx`
6. `src/components/community/ManageMembershipRequestsDialog.tsx`
7. `src/components/community/ManageCommunityGalleryDialog.tsx`
8. `src/components/community/meetings/SecretaryUploadMinutesDialog.tsx`
9. `src/components/admin/finance/ManageDuesLeviesDialog.tsx`
10. `src/components/admin/finance/MembersFinancialReportsDialog.tsx`
11. `src/components/admin/settings/AdminSettingsTab.tsx`
12. `src/components/admin/settings/SettingsDetailSheet.tsx`
13. `src/components/admin/election/FeeDistributionConfigDialog.tsx`

**Lower priority (display-only, no inputs but still best to fix):**
14. `src/components/community/finance/FinancialOverviewDialog.tsx`
15. `src/components/community/finance/FinancialObligationsDialog.tsx`
16. `src/components/community/finance/FinancialAuditDialog.tsx`
17. `src/components/community/meetings/MinutesDownloadDialog.tsx`
18. `src/components/community/meetings/MinutesAdoptionDialog.tsx`
19. `src/components/community/elections/NominationDetailsSheet.tsx`
20. `src/components/admin/finance/IncomeSourceDetailSheet.tsx`
21. `src/components/admin/finance/FloatingFundsDetailSheet.tsx`
22. `src/components/admin/finance/ExpenseSourceDetailSheet.tsx`
23. `src/components/admin/finance/DeficitsDetailSheet.tsx`
24. `src/components/admin/finance/AccountStatementsDialog.tsx`
25. `src/components/admin/election/CandidateVotersListSheet.tsx`
26. `src/components/admin/election/CampaignRoyaltyDetailSheet.tsx`
27. `src/components/admin/election/CampaignFeeDetailSheet.tsx`
28. `src/components/admin/election/AdminPrimaryManagementSheet.tsx`
29. `src/components/admin/election/CertificateOfReturnGenerator.tsx`
30. `src/components/admin/finance/LevyDetailSheet.tsx`

## Change Pattern (same for every file)

Before:
```typescript
const Content = () => (
  <div>...</div>
);

// Usage:
<Content />
```

After:
```typescript
const content = (
  <div>...</div>
);

// Usage:
{content}
```

## Technical Details
- Each file needs exactly 2-3 line changes: rename the variable, and replace 1-2 usages of `<Content />` with `{content}`
- No logic changes, no new dependencies, no behavioral changes
- This is a mechanical refactor with zero risk of breaking functionality
- Fixes the flickering for ALL input fields across the entire app, not just the Recommend Alternative dialog
