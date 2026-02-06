

## Add Constitution Tab and "More" Resources - Mobile First

### What's Changing

The Community Resources dialog currently has 3 tabs: **ID Cards**, **Letters**, **Publications**. Based on the screenshot annotation, the user wants **Constitution** added as a tab, with a **More** option for additional resources.

### Approach

Instead of cramming 5+ tabs into a narrow mobile TabsList, the layout will use **4 tabs**: "ID Cards", "Letters", "Constitution", and "More" (with a horizontal dots icon). The "More" tab consolidates Publications and Other Resources into one place, keeping the mobile tab bar clean.

### File 1: `src/components/community/CommunityResourcesDialog.tsx`

**Tab restructure (line 161)**
- Change `grid-cols-3` to `grid-cols-4`
- Keep "ID Cards" and "Letters" tabs
- Add new "Constitution" tab (replacing Publications from the top-level)
- Add "More" tab with a `MoreHorizontal` icon that contains:
  - Publications section (moved here from its own tab)
  - Other Resources section with placeholder cards (Community Forum link, Help Center, FAQs, etc.)

**New state: `showConstitutionViewer`**
- When user taps the "View Full Document" button inside the Constitution tab, close the parent dialog and open `ConstitutionViewer` (same z-index pattern as ID Card and Letter downloads)

**Constitution tab content**
- A summary card showing:
  - Constitution title: "Constitution of Ndigbo Progressive Union"
  - Version, adopted date, last amended date, effective date
  - A list of article titles (compact, scrollable)
  - "View Full Document" button that opens the existing `ConstitutionViewer`
  - "Download PDF" button

**More tab content**
- **Publications** subsection (the existing publications UI moved here unchanged)
- **Other Resources** subsection with cards for:
  - Community Forum
  - Help Center
  - FAQs
  - Each card has a title, description, and action button

**Import additions**
- `ConstitutionViewer` from `@/components/community/ConstitutionViewer`
- `constitutionSections, constitutionMetadata` from `@/data/constitutionData`
- `MoreHorizontal`, `Scale`, `HelpCircle`, `MessageCircle` icons from lucide-react

### File 2: `src/data/constitutionData.ts`

**Update constitution metadata title (line 243)**
- Change `"Constitution of [Community Name]"` to `"Constitution of Ndigbo Progressive Union"`

### Implementation Details

**Constitution Tab UI (mobile-optimized)**
```
+----------------------------------+
| [Scale icon] Constitution        |
| of Ndigbo Progressive Union     |
| Version 2.1 | Effective 7/1/24  |
+----------------------------------+
| Adopted: Jan 15, 2024           |
| Last Amended: Jun 20, 2024      |
+----------------------------------+
| Articles:                        |
| [I] Name and Identity        >  |
| [II] Objectives and Purpose  >  |
| [III] Membership              >  |
| [IV] Governance               >  |
| ... (scrollable list)           |
+----------------------------------+
| [View Full Document]  [PDF]     |
+----------------------------------+
```

**More Tab UI (mobile-optimized)**
```
+----------------------------------+
| Publications                     |
| [Search bar]                     |
| [Featured pub cards...]         |
| [All publications list...]      |
+----------------------------------+
| Other Resources                  |
| [Community Forum card]          |
| [Help Center card]              |
| [FAQs card]                     |
+----------------------------------+
```

**Dialog close/reopen pattern for Constitution Viewer**
Same as ID Card and Letter downloads:
1. Close parent dialog
2. Wait 150ms
3. Open ConstitutionViewer
4. When ConstitutionViewer closes, reopen parent dialog after 150ms

### Summary

| Change | File | Purpose |
|--------|------|---------|
| Update tab grid to 4 columns | CommunityResourcesDialog.tsx | Fit Constitution and More tabs |
| Add Constitution tab content | CommunityResourcesDialog.tsx | Article summary, metadata, and full viewer link |
| Move Publications into More tab | CommunityResourcesDialog.tsx | Free up tab space for Constitution |
| Add Other Resources section | CommunityResourcesDialog.tsx | Community Forum, Help Center, FAQs cards |
| Wire ConstitutionViewer with z-index pattern | CommunityResourcesDialog.tsx | Open viewer without overlay conflicts |
| Update constitution title | constitutionData.ts | Replace placeholder with "Ndigbo Progressive Union" |

