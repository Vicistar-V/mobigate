

## Fix Text/Writing Errors in Declare Election Form

### Problem
The text input fields in the "Declare Elections" drawer experience text entry errors on mobile devices. Users are unable to properly type into fields like "Election Name" and "Additional Notes" - the input loses focus or characters get dropped.

### Root Cause
Based on the established mobile input interaction pattern, Input and Textarea components inside Drawers with ScrollAreas need specific optimizations:
1. `touch-manipulation` CSS class to handle touch events properly
2. `autoComplete="off"` to prevent browser autocomplete interference
3. `autoCorrect="off"` and `spellCheck={false}` to prevent system keyboard interference
4. `e.stopPropagation()` on click events to prevent scroll logic from stealing focus

---

## Implementation Details

### File: `src/components/admin/election/DeclareElectionDrawer.tsx`

**Changes to Input Components:**

1. **Election Name Input (lines 414-419)**
```tsx
<Input
  id="electionName"
  placeholder={`e.g., ${new Date().getFullYear()} ${electionType === "general" ? "General" : "Supplementary"} Election`}
  value={electionName}
  onChange={(e) => setElectionName(e.target.value)}
  className="touch-manipulation"
  autoComplete="off"
  autoCorrect="off"
  spellCheck={false}
  onClick={(e) => e.stopPropagation()}
/>
```

2. **Nomination Start Date Input (lines 426-431)**
```tsx
<Input
  id="nominationStart"
  type="date"
  value={nominationStartDate}
  onChange={(e) => setNominationStartDate(e.target.value)}
  className="touch-manipulation"
  onClick={(e) => e.stopPropagation()}
/>
```

3. **Election Date Input (lines 435-440)**
```tsx
<Input
  id="electionDate"
  type="date"
  value={electionDate}
  onChange={(e) => setElectionDate(e.target.value)}
  className="touch-manipulation"
  onClick={(e) => e.stopPropagation()}
/>
```

4. **Vacancy Reason Details Input (lines 479-485)**
```tsx
<Input
  placeholder="Specify reason..."
  value={vacancy.reasonDetails || ""}
  onChange={(e) => updateVacancyReason(officeId, "other", e.target.value)}
  className="touch-manipulation"
  autoComplete="off"
  autoCorrect="off"
  spellCheck={false}
  onClick={(e) => e.stopPropagation()}
/>
```

5. **Additional Notes Textarea (lines 497-503)**
```tsx
<Textarea
  id="notes"
  placeholder="Any additional information about this election..."
  value={additionalNotes}
  onChange={(e) => setAdditionalNotes(e.target.value)}
  rows={3}
  className="touch-manipulation"
  autoComplete="off"
  autoCorrect="off"
  spellCheck={false}
  onClick={(e) => e.stopPropagation()}
/>
```

---

## Summary of Changes

| Input Field | Changes Applied |
|-------------|-----------------|
| Election Name | `touch-manipulation`, `autoComplete="off"`, `autoCorrect="off"`, `spellCheck={false}`, `onClick={stopPropagation}` |
| Nomination Date | `touch-manipulation`, `onClick={stopPropagation}` |
| Election Date | `touch-manipulation`, `onClick={stopPropagation}` |
| Vacancy Reason Details | `touch-manipulation`, `autoComplete="off"`, `autoCorrect="off"`, `spellCheck={false}`, `onClick={stopPropagation}` |
| Additional Notes | `touch-manipulation`, `autoComplete="off"`, `autoCorrect="off"`, `spellCheck={false}`, `onClick={stopPropagation}` |

---

## Files to Modify

| File | Change |
|------|--------|
| `src/components/admin/election/DeclareElectionDrawer.tsx` | Add mobile input optimization props to all Input and Textarea components |

---

## Expected Outcome

- Text entry in "Election Name" field works smoothly without dropping characters
- Additional Notes textarea maintains focus during typing
- Date pickers work correctly without focus issues
- All form inputs remain stable during user interaction on mobile devices

