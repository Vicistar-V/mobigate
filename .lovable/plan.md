

## Add Campaign Duration/Fees to Election Settings

### Overview
Add a "Campaign Duration/Fees" setting row within the Election Settings accordion in Community Settings. Tapping this row will open the existing `CampaignGlobalSettingsDrawer` to manage campaign pricing tiers. Also update the base fees to the new values specified.

---

## Changes Required

### 1. Update Base Fees in Campaign Data

**File:** `src/data/campaignSystemData.ts`

Update the `campaignDurationOptions` array with new fee values and add the missing 45 Days tier:

| Duration | Old Fee | New Fee |
|----------|---------|---------|
| 3 Days   | M500    | M5,000  |
| 7 Days   | M1,000  | M10,000 |
| 14 Days  | M1,800  | M18,000 |
| 21 Days  | M2,500  | M25,000 |
| 30 Days  | M3,200  | M32,000 |
| 45 Days  | (new)   | M40,000 |
| 60 Days  | M5,500  | M55,000 |
| 90 Days  | M7,500  | M75,000 |

---

### 2. Add Campaign Fees Setting to Election Settings Data

**File:** `src/data/adminSettingsData.ts`

Add a new special setting entry to `electionSettings` array that indicates it opens a custom drawer:

```typescript
{
  id: "election-6",
  key: "campaign_duration_fees",
  name: "Campaign Duration & Fees",
  description: "Configure campaign pricing tiers for election advertisements",
  category: "election_settings",
  currentValue: "8_tiers", // Display value showing number of tiers
  options: [], // Empty - uses custom drawer
  approvalPercentage: 100,
  hasPendingChange: false,
  isLocked: false,
  requiresMultiSig: true,
  lastUpdated: new Date("2025-02-01"),
  updatedBy: "System",
  isCustomDrawer: true, // New flag to indicate special handling
}
```

---

### 3. Integrate Drawer in Settings Tab

**File:** `src/components/admin/settings/AdminSettingsTab.tsx`

Add state and logic to open the `CampaignGlobalSettingsDrawer` when the Campaign Duration/Fees setting is clicked:

1. Import `CampaignGlobalSettingsDrawer`
2. Add state: `const [showCampaignSettings, setShowCampaignSettings] = useState(false);`
3. Modify `handleSettingClick` to check for `campaign_duration_fees` key and open the drawer instead of the standard detail sheet
4. Add the drawer component to the JSX

---

### 4. UI Layout in Election Settings

After implementation, the Election Settings accordion will show:

```text
Election Settings                    1 pending  ^
6 settings

+---------------------------------------+
| Voting Eligibility            🔒  >  |
| Financial Members (95%)              |
+---------------------------------------+
| Candidate Eligibility Period  🔒  >  |
| 2 Years (82%)                        |
+---------------------------------------+
| Voting Period Duration    ⏳ 🔒  >  |
| 3 Days (70%)              Pending    |
+---------------------------------------+
| Vote Change Window            🔒  >  |
| 30 Minutes (65%)                     |
+---------------------------------------+
| Primary Election Threshold    🔒  >  |
| 25% (78%)                            |
+---------------------------------------+
| Campaign Duration & Fees      🔒  >  | <-- NEW
| 8 tiers configured (100%)            |
+---------------------------------------+
```

---

### 5. Mobile Optimizations

All changes follow established mobile patterns:
- Drawer opens at 92vh max height
- Touch-optimized inputs with `touch-manipulation`
- `autoComplete="off"` and `spellCheck={false}` on inputs
- `onClick={(e) => e.stopPropagation()}` to prevent scroll issues

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/data/campaignSystemData.ts` | Update fee values, add 45 Days tier |
| `src/data/adminSettingsData.ts` | Add new Campaign Duration/Fees setting to electionSettings |
| `src/components/admin/settings/AdminSettingsTab.tsx` | Import drawer, add state, handle special click for campaign_duration_fees |

---

## Technical Implementation Details

### campaignSystemData.ts Changes
```typescript
export const campaignDurationOptions: CampaignDurationOption[] = [
  { days: 3,  feeInMobi: 5000,  label: "3 Days",  description: "Quick visibility boost" },
  { days: 7,  feeInMobi: 10000, label: "7 Days",  description: "Standard campaign period", popular: true },
  { days: 14, feeInMobi: 18000, label: "14 Days", description: "Extended reach campaign" },
  { days: 21, feeInMobi: 25000, label: "21 Days", description: "Comprehensive coverage", popular: true },
  { days: 30, feeInMobi: 32000, label: "30 Days", description: "Full month visibility" },
  { days: 45, feeInMobi: 40000, label: "45 Days", description: "Extended campaign period" },
  { days: 60, feeInMobi: 55000, label: "60 Days", description: "Extended two-month campaign" },
  { days: 90, feeInMobi: 75000, label: "90 Days", description: "Maximum exposure quarter" }
];
```

### AdminSettingsTab.tsx Changes
```typescript
// Import
import { CampaignGlobalSettingsDrawer } from "../election/CampaignGlobalSettingsDrawer";

// State
const [showCampaignSettings, setShowCampaignSettings] = useState(false);

// Modified click handler
const handleSettingClick = (setting: AdminSetting) => {
  if (setting.key === "campaign_duration_fees") {
    setShowCampaignSettings(true);
    return;
  }
  setSelectedSetting(setting);
  setShowSettingDetail(true);
};

// Add to JSX
<CampaignGlobalSettingsDrawer
  open={showCampaignSettings}
  onOpenChange={setShowCampaignSettings}
/>
```

---

## Expected Outcome

- "Campaign Duration & Fees" appears in Election Settings accordion
- Tapping opens the dedicated drawer with all 8 pricing tiers
- Fees reflect new values (M5,000 to M75,000)
- Admins can edit, add, or remove tiers
- Changes require multi-signature authorization
- All interfaces are mobile-optimized

