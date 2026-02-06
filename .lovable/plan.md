

## Fix "Schedule New Primary" Button Not Working

### Problem Identified
The "Schedule New Primary" button in `AdminPrimaryElectionsSection.tsx` (line 149) is completely inactive because it has **no `onClick` handler**:

```tsx
<Button className="w-full bg-green-600 hover:bg-green-700 gap-2">
  <Plus className="h-4 w-4" />
  Schedule New Primary
</Button>
```

---

## Solution

Create a new mobile-first `SchedulePrimaryDrawer` component and connect it to the button.

---

## Implementation Details

### 1. Create New Component: `SchedulePrimaryDrawer.tsx`

**Location:** `src/components/admin/election/SchedulePrimaryDrawer.tsx`

A mobile-optimized bottom drawer (92vh) for scheduling new primary elections.

**Form Fields:**
- **Office Selection** - Dropdown of offices requiring a primary
- **Scheduled Date** - Date picker for primary election day
- **Start Time** - Time input (e.g., 09:00)
- **End Time** - Time input (e.g., 17:00)
- **Advancement Rules** (display-only)
  - Auto-qualify threshold: 25%
  - Maximum advancing: 4
  - Minimum advancing: 2

**UI Layout (Mobile):**
```text
+---------------------------------------+
| [<] Schedule Primary Election         |
+---------------------------------------+
| Select Office *                       |
| [  Secretary General       v  ]       |
|                                       |
| Scheduled Date *                      |
| [  Feb 28, 2025            📅  ]      |
|                                       |
| Voting Time *                         |
| Start [09:00]     End [17:00]         |
|                                       |
+---------------------------------------+
| [Info] Advancement Rules              |
| • ≥25% = Auto-qualifies               |
| • Max 4 candidates advance            |
| • Min 2 candidates required           |
+---------------------------------------+
|                                       |
| [   Schedule Primary   ]              |
|                                       |
+---------------------------------------+
```

---

### 2. Integrate Drawer in AdminPrimaryElectionsSection

**File:** `src/components/admin/election/AdminPrimaryElectionsSection.tsx`

**Changes:**
1. Import the new `SchedulePrimaryDrawer` component
2. Add state: `const [showScheduleDrawer, setShowScheduleDrawer] = useState(false);`
3. Add `onClick` handler to the button:

```tsx
<Button 
  className="w-full bg-green-600 hover:bg-green-700 gap-2"
  onClick={() => setShowScheduleDrawer(true)}
>
  <Plus className="h-4 w-4" />
  Schedule New Primary
</Button>
```

4. Render the drawer at the end of the component:

```tsx
<SchedulePrimaryDrawer
  open={showScheduleDrawer}
  onOpenChange={setShowScheduleDrawer}
  onScheduled={() => {
    toast({
      title: "Primary Scheduled",
      description: "The primary election has been scheduled successfully"
    });
    setShowScheduleDrawer(false);
  }}
/>
```

---

### 3. Data for Office Selection

Filter offices that need primaries from `mockPrimaryElections` or create a list of available offices:

```typescript
// Offices available for primary scheduling
const availableOffices = [
  { id: "office-3", name: "Secretary General" },
  { id: "office-4", name: "Treasurer" },
  { id: "office-5", name: "Financial Secretary" },
  { id: "office-6", name: "Public Relations Officer" },
  { id: "office-7", name: "Welfare Officer" },
];
```

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/components/admin/election/SchedulePrimaryDrawer.tsx` | **CREATE** - New drawer component for scheduling primaries |
| `src/components/admin/election/AdminPrimaryElectionsSection.tsx` | **MODIFY** - Add state, onClick handler, and render drawer |

---

## Mobile Optimizations

Following established patterns:
- Drawer uses `max-h-[92vh]` with rounded top corners (`rounded-t-2xl`)
- Container uses `p-0` with internal padding on scrollable body
- Touch-optimized inputs with `touch-manipulation` class
- `autoComplete="off"`, `autoCorrect="off"`, `spellCheck={false}` on inputs
- `onClick={(e) => e.stopPropagation()}` to prevent scroll stealing focus
- Minimum 44px touch targets for all interactive elements
- Date picker uses mobile-friendly calendar popup
- Time inputs use native time pickers where possible

---

## Component Structure

```typescript
interface SchedulePrimaryDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onScheduled?: () => void;
}

// Form state
const [selectedOffice, setSelectedOffice] = useState("");
const [scheduledDate, setScheduledDate] = useState<Date | undefined>();
const [startTime, setStartTime] = useState("09:00");
const [endTime, setEndTime] = useState("17:00");
const [isSubmitting, setIsSubmitting] = useState(false);

// Validation
const isValid = selectedOffice && scheduledDate && startTime && endTime;

// Submit handler
const handleSchedule = () => {
  if (!isValid) return;
  setIsSubmitting(true);
  // Simulate API call
  setTimeout(() => {
    onScheduled?.();
    setIsSubmitting(false);
    // Reset form
  }, 1000);
};
```

---

## Expected Outcome

1. Tapping "Schedule New Primary" opens the scheduling drawer
2. Admin selects an office from the dropdown
3. Admin sets the date and voting time range
4. Advancement rules are displayed for reference
5. On submit, shows loading state then success toast
6. Drawer closes and the new primary appears in the list

