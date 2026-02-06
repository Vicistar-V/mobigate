
# Mobile Optimization: Financial Audit Clipping + Full Label Text Fixes

## Problems Identified (from screenshots)

### Issue 1: Financial Audit -- Risk Indicators clipping (image 328)
The "Recoverable/pending amounts" description under "Floating Funds" is clipped on the right edge. Root cause: the Drawer's inner container uses `px-4` (16px each side) plus `p-4` on the Risk Indicators Card plus `p-3` on each inner box = cumulative ~44px per side, leaving only ~272px on a 360px screen. The large currency amounts (N750,000.00 / M750,000.00) combined with the label text overflow the available width.

### Issue 2: "Dir." should be "Director" (image 329)
The multi-signature text reads "PRO or Dir. of Socials" throughout the app. The user wants "Director" written in full. This abbreviation exists in **9 locations across 7 files**.

### Issue 3: "Pending Auth" should be "Pending Authorization" (image 330)  
The election status badge reads "Pending Auth" -- the user wants it to say the full word. This is in **1 file, 1 location**.

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/admin/finance/AdminFinancialAuditDialog.tsx` | Reduce drawer padding, restack Risk Indicators vertically with full-width layout |
| `src/types/adminAuthorization.ts` | Change "Dir. of Socials" to "Director of Socials" in display titles and description function |
| `src/components/admin/election/AdminDeclareElectionTab.tsx` | Change "Pending Auth" to "Pending Authorization"; change "Dir." to "Director" |
| `src/components/admin/election/DeclareElectionDrawer.tsx` | Change "Dir. of Socials" to "Director of Socials" (2 occurrences) |
| `src/components/community/leadership/ApplyElectionResultsSection.tsx` | Change "Dir. of Socials" to "Director of Socials" (2 occurrences) |
| `src/components/admin/leadership/ApplyElectionResultsSheet.tsx` | Change "Dir. of Socials" to "Director of Socials" (2 occurrences) |
| `src/components/admin/AdminLeadershipSection.tsx` | Change "Dir. Socials" to "Director of Socials" |
| `src/components/admin/AdminElectionSection.tsx` | Change "Dir. Socials" to "Director of Socials" |

---

## Detailed Changes

### 1. Financial Audit Dialog (`AdminFinancialAuditDialog.tsx`)

**Drawer container padding (line 458)**:
- Change `px-4 pb-6` to `px-2 pb-6` -- reclaims 16px total horizontal space

**Risk Indicators Card (lines 183-218)**:
- Change outer Card from `p-4` to `p-2.5` -- saves another 12px total
- Change each inner risk indicator box from `p-3` to `p-2.5`
- Change the layout of each risk indicator from horizontal `flex items-start justify-between gap-3` to a **vertical stack**: icon + label on one line, amount below it on its own line. This prevents the long currency string from competing with the label for horizontal space.

Current layout (clips):
```text
[icon] Total Deficits        N325,000.00 (M325,000.00)
```

New layout (fits):
```text
[icon] Total Deficits
N325,000.00
(M325,000.00)
Debts community owes
```

**Summary Cards (lines 138-180)**:
- Change the grid wrapper from `gap-3` to `gap-2` to tighten spacing
- Change each summary Card from `p-3` to `p-2.5`
- These cards already have `min-w-0` and `break-words` which is good

**Balance Flow Card (line 230)**:
- Change from `p-4` to `p-3` to match the reduced outer padding

**Deficits Breakdown Card (line 261) and Floating Funds Card (line 293)**:
- Change from `p-4` to `p-3`

### 2. "Dir." to "Director" -- All Occurrences

**`src/types/adminAuthorization.ts`**:
- Line 89: Change `"Dir. of Socials"` to `"Director of Socials"`
- Line 374: Change `"President + Secretary + (PRO or Dir. of Socials)"` to `"President + Secretary + (PRO or Director of Socials)"`

**`src/components/admin/election/AdminDeclareElectionTab.tsx`**:
- Line 162: Change `(PRO or Dir. of Socials)` to `(PRO or Director of Socials)`

**`src/components/admin/election/DeclareElectionDrawer.tsx`**:
- Line 601: Change `(PRO or Dir. of Socials)` to `(PRO or Director of Socials)`
- Line 602: Change `(Dir. of Socials or another Admin)` to `(Director of Socials or another Admin)`

**`src/components/community/leadership/ApplyElectionResultsSection.tsx`**:
- Line 172: Change `(PRO or Dir. of Socials)` to `(PRO or Director of Socials)`
- Line 307: Change `(PRO or Dir. of Socials)` to `(PRO or Director of Socials)`

**`src/components/admin/leadership/ApplyElectionResultsSheet.tsx`**:
- Line 188: Change `(PRO or Dir. of Socials)` to `(PRO or Director of Socials)`
- Line 321: Change `(PRO or Dir. of Socials)` to `(PRO or Director of Socials)`

**`src/components/admin/AdminLeadershipSection.tsx`**:
- Line 206: Change `(PRO or Dir. Socials)` to `(PRO or Director of Socials)`

**`src/components/admin/AdminElectionSection.tsx`**:
- Line 273: Change `(PRO or Dir. Socials)` to `(PRO or Director of Socials)`

### 3. "Pending Auth" to "Pending Authorization"

**`src/components/admin/election/AdminDeclareElectionTab.tsx`**:
- Line 98: Change badge text from `Pending Auth` to `Pending Authorization`

---

## Space Savings Summary (Financial Audit)

| Area | Before | After | Saved |
|------|--------|-------|-------|
| Drawer content padding | 16px each side | 8px each side | 16px total |
| Risk Card outer padding | 16px each side | 10px each side | 12px total |
| Risk indicator inner padding | 12px each side | 10px each side | 4px total |
| Amount layout | Horizontal (competing) | Vertical (stacked) | Full width for amounts |
| **Total horizontal savings** | | | ~32px |

This brings effective content width from ~272px back to ~304px+ on a 360px screen, and the vertical restacking of amounts eliminates horizontal competition entirely.
