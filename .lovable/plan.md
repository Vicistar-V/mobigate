
## Fix "Accredited Voters" Menu Navigation

### Problem Identified

Clicking "Accredited Voters" in the Community Menu does nothing because:

1. **Missing Tab Handler**: The menu uses `"election-accredited-voters"` but `CommunityProfile.tsx` has no matching route handler for this tab ID
2. **Isolated Subtab State**: The `ElectionAccreditationTab` component manages its own internal subtab state (`'financial' | 'activities' | 'accredited'`) and doesn't accept props to initialize to a specific view

---

## Solution

Create a dedicated route for "Accredited Voters" that renders `ElectionAccreditationTab` with the `'accredited'` subtab pre-selected.

---

## Implementation Details

### 1. Update ElectionAccreditationTab to Accept Initial Subtab

**File**: `src/components/community/elections/ElectionAccreditationTab.tsx`

**Changes**:
- Add optional `initialSubTab` prop to component
- Initialize `activeSubTab` state from prop (default to `'financial'`)

```tsx
interface ElectionAccreditationTabProps {
  initialSubTab?: 'financial' | 'activities' | 'accredited';
}

export const ElectionAccreditationTab = ({ 
  initialSubTab = 'financial' 
}: ElectionAccreditationTabProps) => {
  const [activeSubTab, setActiveSubTab] = useState<'financial' | 'activities' | 'accredited'>(initialSubTab);
  // ... rest of component
}
```

---

### 2. Add Route Handler in CommunityProfile.tsx

**File**: `src/pages/CommunityProfile.tsx`

**Changes**:
- Add new conditional render for `"election-accredited-voters"` tab
- Pass `initialSubTab="accredited"` to `ElectionAccreditationTab`

```tsx
{activeTab === "election-accredited-voters" && (
  <div className="mt-6">
    <ElectionAccreditationTab initialSubTab="accredited" />
  </div>
)}
```

---

## Files to Modify

| File | Change |
|------|--------|
| `src/components/community/elections/ElectionAccreditationTab.tsx` | Add `initialSubTab` prop with TypeScript interface |
| `src/pages/CommunityProfile.tsx` | Add `"election-accredited-voters"` tab handler |

---

## Expected Outcome

1. Tapping "Accredited Voters" in the Community Menu navigates to the Election Accreditation view
2. The "Accredited Voters" subtab is automatically selected on entry
3. Users can still switch between Financial, Activities, and Accredited Voters tabs within the view
4. Existing navigation to `"election-accreditation"` continues to work with default "Financial" subtab
