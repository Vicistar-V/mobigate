

## Redesign Member Contributions Sheet for Community Input Tracking

### Understanding

The current `MemberContributionsSheet` incorrectly displays **financial obligations** (Monthly Dues, Special Levy, Building Fund). The user clarified that "Contributions" should reflect **inputs towards community growth and development**, such as:

- Projects led or supported
- Initiatives started
- Events organized/attended
- Volunteer work
- Community service activities
- Platform engagement (posts, comments, etc.)

---

## Implementation Details

### File: `src/components/community/leadership/MemberContributionsSheet.tsx`

**Complete redesign focusing on non-financial contributions:**

#### New Data Structure
```typescript
interface ContributionItem {
  id: string;
  type: "project" | "initiative" | "event" | "service" | "engagement";
  title: string;
  description: string;
  date: string;
  status: "completed" | "ongoing" | "planned";
  impact?: string; // e.g., "50 beneficiaries", "3 months"
  category: string;
}

interface ContributionStats {
  totalProjects: number;
  totalInitiatives: number;
  eventsOrganized: number;
  volunteerHours: number;
  impactScore: number; // 1-100 rating
}
```

#### New Mock Data
```typescript
const mockContributions = [
  {
    id: "1",
    type: "project",
    title: "Anambra Hospital Project, Jos",
    description: "Led fundraising and coordination for hospital construction",
    date: "2024-01-15",
    status: "ongoing",
    impact: "200+ beneficiaries",
    category: "Healthcare",
  },
  {
    id: "2",
    type: "initiative",
    title: "Free Scholarship Scheme",
    description: "Established scholarship program for less-privileged students",
    date: "2023-06-01",
    status: "completed",
    impact: "25 students sponsored",
    category: "Education",
  },
  // ... more contributions
];

const contributionStats = {
  totalProjects: 5,
  totalInitiatives: 8,
  eventsOrganized: 12,
  volunteerHours: 240,
  impactScore: 92,
};
```

#### New UI Components

**Stats Grid (4 cards):**
| Stat | Icon | Color |
|------|------|-------|
| Projects | FolderOpen | Blue |
| Initiatives | Lightbulb | Amber |
| Events | Calendar | Green |
| Impact Score | Star | Purple |

**Tab Filters:**
- All
- Projects
- Initiatives
- Events
- Service

**Contribution Cards:**
Each card displays:
1. **Header Row:** Type icon + Title + Status badge
2. **Description Row:** Brief description (line-clamp-2)
3. **Footer Row:** Date + Category tag + Impact metric

---

## Visual Layout (Mobile-First)

```text
+---------------------------------------+
| [Avatar] Member Name                  |
|         Position Title                |
+---------------------------------------+
| [Projects: 5] [Initiatives: 8]        |
| [Events: 12]  [Impact: 92/100]        |
+---------------------------------------+
| [All] [Projects] [Initiatives] ...    |
+---------------------------------------+
|                                       |
| +-----------------------------------+ |
| | [FolderOpen] Anambra Hospital     | |
| |              Project, Jos         | |
| |                         [ongoing] | |
| | Led fundraising and               | |
| | coordination for...               | |
| | Jan 2024 • Healthcare • 200+      | |
| +-----------------------------------+ |
|                                       |
| +-----------------------------------+ |
| | [Lightbulb] Free Scholarship      | |
| |             Scheme                | |
| |                       [completed] | |
| | Established scholarship           | |
| | program for less-privileged...    | |
| | Jun 2023 • Education • 25 students| |
| +-----------------------------------+ |
|                                       |
+---------------------------------------+
```

---

## Key Changes Summary

| Element | Before | After |
|---------|--------|-------|
| Title | "Member Contributions" | "Community Contributions" |
| Icon | Coins (financial) | Heart/Star (impact) |
| Data Type | Financial transactions | Projects, initiatives, events |
| Stats | Total $, This Year $, Pending $ | Projects, Initiatives, Events, Impact Score |
| Tabs | All, Completed, Pending | All, Projects, Initiatives, Events, Service |
| Cards | Dues/Levy items | Contribution items with impact metrics |

---

## Files to Modify

| File | Change |
|------|--------|
| `src/components/community/leadership/MemberContributionsSheet.tsx` | Complete redesign to show non-financial community contributions |

---

## Integration with Existing Data

The sheet will:
1. Pull `milestones` from the member's `ExecutiveMember` data
2. Display as "Projects/Initiatives" contribution items
3. Add mock data for events, volunteer service, and platform engagement
4. Calculate an "Impact Score" based on contribution quantity and quality

---

## Expected Outcome

- "Contributions" now shows community input and growth activities
- Projects, initiatives, and volunteer work are prominently displayed
- Impact metrics replace financial amounts
- Mobile-optimized with 48px touch targets and proper scrolling
- Consistent with the Executive Detail Sheet milestones display

