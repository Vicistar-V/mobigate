
## Create Campaign Duration & Fees Settings Interface

### Problem
Currently, the campaign duration options (3 Days = M500, 7 Days = M1,000, etc.) are hardcoded in `src/data/campaignSystemData.ts`. There is no admin interface to configure these values. Admins cannot adjust campaign pricing without modifying code.

### Solution
Create a new **Campaign Global Settings** drawer that allows admins to:
- View and edit existing duration tiers and their fees
- Add new duration options
- Remove existing options
- Toggle "Popular" badge for tiers
- Multi-signature authorization for changes

---

## Implementation Details

### 1. New File: `CampaignGlobalSettingsDrawer.tsx`

**Location:** `src/components/admin/election/CampaignGlobalSettingsDrawer.tsx`

**Key Features:**

#### Header Section
- Title: "Campaign Duration & Fees"
- Icon: Clock + Settings
- Description: "Configure pricing for campaign durations"

#### Current Configuration Display
- Grid showing all duration tiers with their fees
- Each card displays:
  - Duration label (e.g., "7 Days")
  - Current fee (e.g., "M1,000")
  - "Popular" badge if applicable
  - Edit/Delete action buttons

#### Duration Tier Editor
When editing a tier:
- Duration input (number of days)
- Fee input (in Mobi)
- Description field
- "Mark as Popular" toggle

#### Add New Duration Button
- Opens inline form to add new tier
- Validates for duplicate durations
- Saves to local state

#### Authorization Notice
- Multi-signature required (President + Secretary + Legal Adviser)
- Submit button triggers authorization flow

---

### 2. UI Layout (Mobile-First)

```text
+---------------------------------------+
| [Clock+Cog] Campaign Duration & Fees  |
|             Configure pricing tiers   |
+---------------------------------------+
|                                       |
| Current Duration Tiers                |
|                                       |
| +-----------------------------------+ |
| | 3 Days          M500              | |
| | Quick visibility boost   [Edit]  | |
| +-----------------------------------+ |
|                                       |
| +-----------------------------------+ |
| | 7 Days          M1,000 [Popular] | |
| | Standard campaign        [Edit]  | |
| +-----------------------------------+ |
|                                       |
| +-----------------------------------+ |
| | 14 Days         M1,800            | |
| | Extended reach           [Edit]  | |
| +-----------------------------------+ |
|                                       |
| +-----------------------------------+ |
| | 21 Days         M2,500 [Popular] | |
| | Comprehensive coverage   [Edit]  | |
| +-----------------------------------+ |
|                                       |
| +-----------------------------------+ |
| | 30 Days         M3,200            | |
| | Full month visibility    [Edit]  | |
| +-----------------------------------+ |
|                                       |
| +-----------------------------------+ |
| | 60 Days         M5,500            | |
| | Extended two-month       [Edit]  | |
| +-----------------------------------+ |
|                                       |
| +-----------------------------------+ |
| | 90 Days         M7,500            | |
| | Maximum exposure         [Edit]  | |
| +-----------------------------------+ |
|                                       |
| [+ Add New Duration Tier]             |
|                                       |
+---------------------------------------+
| [Shield] Multi-signature required     |
|          President + Secretary + LA   |
+---------------------------------------+
| [Submit Changes for Authorization]    |
+---------------------------------------+
```

---

### 3. Edit Tier Modal (Inline Form)

When user taps "Edit" on a tier:

```text
+---------------------------------------+
| Editing: 7 Days                       |
+---------------------------------------+
| Duration (Days) *                     |
| [  7  ]                              |
+---------------------------------------+
| Fee (in Mobi) *                       |
| [  1000  ]                           |
+---------------------------------------+
| Description                           |
| [Standard campaign period    ]        |
+---------------------------------------+
| [ ] Mark as Popular                   |
+---------------------------------------+
| [Cancel]  [Save Changes]              |
+---------------------------------------+
```

---

### 4. Integration with Admin Section

**File:** `src/components/admin/AdminElectionSection.tsx`

Add new button in the action list:
```tsx
<button 
  className="flex items-center gap-3 py-2.5 text-sm hover:bg-muted/50 -mx-1 px-1 rounded" 
  onClick={() => setShowCampaignSettings(true)}
>
  <Settings className="h-4 w-4 text-muted-foreground" />
  Campaign Settings
</button>
```

Add state and import:
```tsx
const [showCampaignSettings, setShowCampaignSettings] = useState(false);

// Import
import { CampaignGlobalSettingsDrawer } from "./election/CampaignGlobalSettingsDrawer";
```

---

### 5. Component Structure

```typescript
// Types for editing
interface EditableDurationOption {
  id: string;
  days: number;
  feeInMobi: number;
  label: string;
  description: string;
  popular: boolean;
}

interface CampaignGlobalSettingsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// State management
const [durationTiers, setDurationTiers] = useState<EditableDurationOption[]>([...]);
const [editingTier, setEditingTier] = useState<EditableDurationOption | null>(null);
const [showAddForm, setShowAddForm] = useState(false);
```

---

### 6. Mobile Input Optimizations

All inputs will include:
- `touch-manipulation` class
- `autoComplete="off"`
- `autoCorrect="off"`
- `spellCheck={false}`
- `onClick={(e) => e.stopPropagation()}`

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/components/admin/election/CampaignGlobalSettingsDrawer.tsx` | **CREATE** - New campaign settings drawer |
| `src/components/admin/AdminElectionSection.tsx` | **MODIFY** - Add button to open settings drawer |

---

## Expected Outcome

- Admins can view all campaign duration tiers and their fees
- Admins can edit existing tier fees and descriptions
- Admins can add new duration tiers (e.g., 45 Days = M4,000)
- Admins can remove tiers they no longer want to offer
- Admins can mark/unmark tiers as "Popular"
- Changes require multi-signature authorization
- All inputs are optimized for mobile text entry
- Consistent with existing mobile-first drawer patterns
