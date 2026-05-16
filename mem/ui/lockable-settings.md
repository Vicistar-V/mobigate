---
name: LockableSetting component
description: Reusable 🔒/🔓 lock + manual input wrapper for protecting settings across the admin/community/merchant areas
type: design
---
Component: `src/components/common/LockableSetting.tsx`

Wrap every editable setting (sliders, inputs, toggles, selects) with
`LockableSetting`. All settings must:
1. Start LOCKED by default (`useState(true)` for `locked`).
2. Show a Lock/Unlock toggle button with 🔒/🔓 affordance.
3. Re-lock automatically after a successful save (call `setLocked(true)` in
   the save handler).
4. Disable the Save button while `locked` is true (use "Unlock to Save" label).
5. Always offer a manual numeric input alongside any slider — clamp on `onBlur`,
   never on `onChange`.

Example wiring:
```tsx
const [locked, setLocked] = useState(true);
<LockableSetting label="Rate" locked={locked} onLockedChange={setLocked} displayValue={`${rate}%`}>
  {(unlocked) => (
    <>
      <Slider disabled={!unlocked} ... />
      <Input disabled={!unlocked} onBlur={(e) => setRate(clamp(...))} />
    </>
  )}
</LockableSetting>
```

Already applied in:
- `ServiceChargeConfigCard`
- `NominationFeeSettingsSection` (EditFeeDialog)

Apply this pattern to every new settings UI going forward — admin, community,
merchant, mobigate.
