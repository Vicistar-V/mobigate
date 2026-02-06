

## Integrate Multi-Signature Authorization into Election Settings

### What Changes

Currently, when an admin changes an Election Setting (e.g., "Candidate Eligibility Period" from 2 Years to 3 Years) and taps "Submit Change," a simple confirmation dialog appears. This bypasses the established multi-signature authorization system.

The fix: Replace the simple `AlertDialog` with the `ModuleAuthorizationDrawer`, which enforces the **Elections** module rules: **President + Secretary + (PRO, Fin. Sec, or Legal Adviser)** -- 3 signatories required.

### What the User Will See

1. Admin changes a setting value (e.g., selects "3 Years" for Candidate Eligibility)
2. Taps "Submit Change"
3. The **ModuleAuthorizationDrawer** slides up (92vh on mobile)
4. Shows the setting being changed with old and new values
5. Each required officer enters their password to authorize
6. Once all 3+ signatures are collected, the change is applied
7. Toast confirms: "Change Submitted for Approval"

---

### File: `src/components/admin/election/ElectionSettingsSection.tsx`

**1. Add imports for the authorization system (lines 1-43)**

Add these imports:
- `ModuleAuthorizationDrawer` from `@/components/admin/authorization/ModuleAuthorizationDrawer`
- `Settings` icon from lucide (already imported)
- `renderActionDetails` and `getActionConfig` from `@/components/admin/authorization/authorizationActionConfigs`

**2. Add new action config for election settings (in authorizationActionConfigs.tsx)**

Add a new config entry under `elections` module:
```
update_election_setting: {
  title: "Update Election Setting",
  description: "Multi-signature authorization to modify election rules",
  icon: <Settings className="h-5 w-5 text-green-600" />,
  iconComponent: Settings,
  iconColorClass: "text-green-600",
}
```

**3. Replace state and handlers (lines 179-228)**

Replace:
- `showConfirmDialog` state with `showAuthDrawer` state
- `handleSave` to open the auth drawer instead of the dialog
- `confirmSave` becomes `handleAuthComplete` (called after successful multi-sig)

New state:
```tsx
const [showAuthDrawer, setShowAuthDrawer] = useState(false);
const [selectedSetting, setSelectedSetting] = useState<ElectionSetting | null>(null);
```

New handler flow:
```tsx
const handleSave = (setting: ElectionSetting) => {
  setSelectedSetting(setting);
  setShowAuthDrawer(true);
};

const handleAuthComplete = () => {
  // Apply the change after successful multi-sig authorization
  if (!selectedSetting) return;
  const newValue = pendingChanges[selectedSetting.id];
  if (!newValue) return;

  setSettings(prev => prev.map(s =>
    s.id === selectedSetting.id
      ? { ...s, currentValue: newValue, hasPendingChange: true, lastUpdated: new Date() }
      : s
  ));
  setPendingChanges(prev => {
    const { [selectedSetting.id]: _, ...rest } = prev;
    return rest;
  });
  toast({ title: "Setting Updated", description: "..." });
  setSelectedSetting(null);
};
```

**4. Replace AlertDialog with ModuleAuthorizationDrawer (lines 336-359)**

Remove the entire `AlertDialog` block and replace with:

```tsx
<ModuleAuthorizationDrawer
  open={showAuthDrawer}
  onOpenChange={setShowAuthDrawer}
  module="elections"
  actionTitle="Update Election Setting"
  actionDescription={
    selectedSetting
      ? `Change "${selectedSetting.name}" requires multi-signature authorization`
      : ""
  }
  actionDetails={
    selectedSetting ? (
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-green-500/10">
            <selectedSetting.icon className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="font-medium text-sm">{selectedSetting.name}</p>
            <p className="text-xs text-muted-foreground">{selectedSetting.description}</p>
          </div>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Current</span>
          <span>{currentLabel}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">New Value</span>
          <span className="font-bold text-primary">{newLabel}</span>
        </div>
      </div>
    ) : null
  }
  onAuthorized={handleAuthComplete}
/>
```

This shows the old and new values clearly so authorizing officers know exactly what they're approving.

---

### Files Modified

| File | Change |
|------|--------|
| `src/components/admin/election/ElectionSettingsSection.tsx` | Replace AlertDialog with ModuleAuthorizationDrawer; update state and handlers |
| `src/components/admin/authorization/authorizationActionConfigs.tsx` | Add `update_election_setting` config under the `elections` module |

### Authorization Flow (Elections Module)

The `elections` module requires **3 signatories**:
1. **President/Chairman** (required)
2. **Secretary** (required)
3. **One of:** PRO, Financial Secretary, or Legal Adviser (pick one)

If a Vice President or Assistant Secretary signs in place of their primary, the quorum increases to 4 and the Legal Adviser becomes mandatory.
