

## Implement Minimum Withdrawal Settings for Mobigate Admin

### Overview
Update the minimum withdrawal amount from M1,000 to M10,000 and create a Mobigate Admin settings interface to configure this value dynamically.

---

### Current State Analysis

**Hardcoded Value Location:**
- File: `src/components/community/finance/WalletWithdrawDialog.tsx` (Line 51)
- Current value: `const minWithdrawal = 1000;`

**Mobigate Admin Dashboard:**
- File: `src/pages/admin/MobigateAdminDashboard.tsx`
- Has 3 tabs: Overview, Elections, Revenue
- Currently no dedicated "Settings" tab for platform-wide configurations

---

### Implementation Details

#### 1. Create Platform Settings Data File

**File:** `src/data/platformSettingsData.ts`

Create a centralized configuration file for all platform-level settings accessible only to Mobigate Admin:

```typescript
export const platformWithdrawalSettings = {
  minimumWithdrawal: 10000,  // M10,000 (updated from 1,000)
  minimumWithdrawalMin: 1000,   // Slider minimum
  minimumWithdrawalMax: 50000,  // Slider maximum
  lastUpdatedAt: new Date(),
  lastUpdatedBy: "Mobigate Admin",
};

export function getMinimumWithdrawal(): number {
  return platformWithdrawalSettings.minimumWithdrawal;
}
```

---

#### 2. Create Withdrawal Settings Component

**File:** `src/components/mobigate/WithdrawalSettingsCard.tsx`

A mobile-first settings card (modeled after `ServiceChargeConfigCard.tsx`):

**Features:**
- Current minimum withdrawal display with Badge
- Slider for adjusting value (M1,000 - M50,000 range)
- Real-time preview showing both Mobi and local currency (following dual-currency protocol)
- Save button with loading state
- Info note explaining the setting

**UI Layout (Mobile):**
```text
+---------------------------------------+
| [Wallet] Minimum Withdrawal           |
|         Platform-wide limit      [M10K]
+---------------------------------------+
|                                       |
| [=====|==========] Slider             |
| M1,000    M10,000        M50,000      |
|                                       |
+---------------------------------------+
| [!] This is the minimum amount users  |
|     can withdraw from their wallet    |
+---------------------------------------+
|                                       |
| [ Save Minimum Withdrawal ]           |
|                                       |
+---------------------------------------+
```

---

#### 3. Add Settings Tab to Mobigate Admin Dashboard

**File:** `src/pages/admin/MobigateAdminDashboard.tsx`

**Changes:**
1. Add new "Settings" tab to the TabsList (making it 4 columns)
2. Create new TabsContent for settings
3. Import and render `WithdrawalSettingsCard`

**Updated Tab Bar:**
```tsx
<TabsList className="w-full grid grid-cols-4 h-auto mb-4">
  <TabsTrigger value="overview">Overview</TabsTrigger>
  <TabsTrigger value="elections">Elections</TabsTrigger>
  <TabsTrigger value="revenue">Revenue</TabsTrigger>
  <TabsTrigger value="settings">Settings</TabsTrigger>
</TabsList>
```

**Settings Tab Content:**
```tsx
<TabsContent value="settings">
  <ScrollArea className="h-[calc(100vh-200px)]">
    <div className="space-y-4 pb-6">
      {/* Mobigate-Only Notice */}
      <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg">
        <Shield className="h-5 w-5 text-primary" />
        <div>
          <p className="text-sm font-medium">Platform Settings</p>
          <p className="text-xs text-muted-foreground">
            Configure platform-wide policies and limits
          </p>
        </div>
      </div>

      {/* Withdrawal Settings */}
      <WithdrawalSettingsCard />

      {/* Future: More platform settings can go here */}
    </div>
  </ScrollArea>
</TabsContent>
```

---

#### 4. Update WalletWithdrawDialog to Use Dynamic Value

**File:** `src/components/community/finance/WalletWithdrawDialog.tsx`

**Changes (Line 51):**
```tsx
// Before:
const minWithdrawal = 1000;

// After:
import { getMinimumWithdrawal } from "@/data/platformSettingsData";
// ...
const minWithdrawal = getMinimumWithdrawal();
```

This ensures the withdrawal dialog dynamically reads the current minimum from the platform settings.

---

### Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `src/data/platformSettingsData.ts` | **CREATE** | Platform-wide settings data file |
| `src/components/mobigate/WithdrawalSettingsCard.tsx` | **CREATE** | Mobile-first settings card component |
| `src/pages/admin/MobigateAdminDashboard.tsx` | **MODIFY** | Add Settings tab with WithdrawalSettingsCard |
| `src/components/community/finance/WalletWithdrawDialog.tsx` | **MODIFY** | Import and use dynamic minimum value |

---

### Mobile Optimizations

Following established patterns:
- Card uses full-width layout with proper padding
- Slider has clear min/max labels with current value displayed
- Touch-optimized slider with adequate touch target (44px)
- Dual-currency display (Mobi primary, local currency secondary)
- Save button full-width with loading state
- Info alerts use compact mobile-friendly layout

---

### Technical Details

**Dual Currency Protocol:**
- Mobigate-managed values lead with Mobi (M): `M10,000 (≈ ₦10,000)`
- Using existing `formatMobi()` and `formatLocalAmount()` utilities

**Component Props:**
```typescript
interface WithdrawalSettingsCardProps {
  currentMinimum?: number;
  onSave?: (newMinimum: number) => void;
}
```

---

### Expected Outcome

1. Minimum withdrawal updates from M1,000 to M10,000 immediately
2. Mobigate Admin Dashboard shows new "Settings" tab
3. Settings tab contains "Minimum Withdrawal" configuration card
4. Admin can adjust value using slider (M1,000 - M50,000 range)
5. Changes persist and apply to all member withdrawal interfaces
6. WalletWithdrawDialog shows updated minimum with dual-currency display

