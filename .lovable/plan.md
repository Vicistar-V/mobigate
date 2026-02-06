

## Fix Mobile Text Input "Writing Errors" - Inner Component Pattern Issue

### Problem Identified

The global `stopPropagation` fix in `Input.tsx` and `Textarea.tsx` is correctly applied, but **text inputs still flicker and produce erratic typing on mobile** because of a different issue:

**Root Cause: Inner Component Definition Pattern**

In multiple dialogs/drawers, sub-components like `Content`, `DrawerBodyContent`, and `FooterContent` are defined as arrow functions **inside** the main component, then used as JSX tags:

```tsx
// PROBLEM: Defined inside component
const DrawerBodyContent = () => (
  <ScrollArea>
    <Input value={electionName} onChange={...} />
  </ScrollArea>
);

// Used as JSX element
return <DrawerBodyContent />;
```

**Why this fails:**
1. User types a character in the input
2. `onChange` updates state (e.g., `setElectionName`)
3. Parent component re-renders
4. `DrawerBodyContent` is **redefined as a new function** (new reference)
5. React sees a completely different component type
6. React **unmounts the old content** (destroying keyboard focus) and **mounts new content**
7. Input loses focus, keyboard flickers, text appears corrupted

### Solution: Call Inner Functions Instead of Rendering as Components

Change from using JSX tags to calling functions directly:

```tsx
// BEFORE (causes re-mount):
<DrawerBodyContent />

// AFTER (stable, no re-mount):
{DrawerBodyContent()}
```

When called as a function, React treats the returned elements as part of the parent's tree, not as a separate component. This prevents unmounting/remounting.

---

### Files to Modify

| File | Inner Functions | Lines |
|------|-----------------|-------|
| `src/components/admin/election/DeclareElectionDrawer.tsx` | `DrawerBodyContent`, `FooterContent` | 670, 671, 717, 719 |
| `src/components/admin/finance/ManageDuesLeviesDialog.tsx` | `Content` | 464, 497 |
| `src/components/admin/finance/AccountStatementsDialog.tsx` | `Content` | 487, 498 |
| `src/components/admin/finance/MembersFinancialReportsDialog.tsx` | `Content` | ~385, ~399 |
| `src/components/admin/finance/AdminFinancialAuditDialog.tsx` | `Content` | Multiple locations |
| `src/components/admin/finance/IncomeSourceDetailSheet.tsx` | `Content` | Check for pattern |
| `src/components/admin/finance/ExpenseSourceDetailSheet.tsx` | `Content` | Check for pattern |
| `src/components/admin/finance/FloatingFundsDetailSheet.tsx` | `Content` | Check for pattern |
| `src/components/admin/finance/DeficitsDetailSheet.tsx` | `Content` | Check for pattern |
| `src/components/admin/settings/AdminSettingsTab.tsx` | `Content` | Check for pattern |

---

### Implementation Details

#### 1. DeclareElectionDrawer.tsx (Primary Fix - Election Details)

**Line 670-671 (Mobile):**
```tsx
// Before:
<DrawerBodyContent />
<FooterContent />

// After:
{DrawerBodyContent()}
{FooterContent()}
```

**Line 717-719 (Desktop):**
```tsx
// Before:
<div className="flex-1 overflow-hidden">
  <DrawerBodyContent />
</div>
<FooterContent />

// After:
<div className="flex-1 overflow-hidden">
  {DrawerBodyContent()}
</div>
{FooterContent()}
```

#### 2. ManageDuesLeviesDialog.tsx

**Line 464 (Mobile) and 497 (Desktop):**
```tsx
// Before:
<ScrollArea className="flex-1 p-4 overflow-y-auto touch-auto">
  <Content />
</ScrollArea>

// After:
<ScrollArea className="flex-1 p-4 overflow-y-auto touch-auto">
  {Content()}
</ScrollArea>
```

#### 3. AccountStatementsDialog.tsx

**Line 487 (Mobile) and 498 (Desktop):**
```tsx
// Before:
<div className="flex-1 overflow-y-auto touch-auto overscroll-contain p-4">
  <Content />
</div>

// After:
<div className="flex-1 overflow-y-auto touch-auto overscroll-contain p-4">
  {Content()}
</div>
```

#### 4. All Other Finance Detail Sheets

Apply same pattern - find `<Content />` usage and replace with `{Content()}`.

---

### Technical Summary

| Pattern | Behavior | Result |
|---------|----------|--------|
| `<Content />` | Creates new component instance each render | Input unmounts, loses focus |
| `{Content()}` | Inlines returned JSX into parent tree | Input stays mounted, focus preserved |

---

### Expected Outcome

1. Text inputs maintain focus while typing
2. No keyboard flickering on mobile
3. Text appears correctly as typed
4. Smooth typing experience in Election Details, Dues & Levies, Account Statements, and all other affected dialogs
5. The fix works alongside the existing `stopPropagation` protection

