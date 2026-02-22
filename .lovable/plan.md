

## Fix Admin Quiz Category & Level Selection Defaults

### Problem
1. **Create Level form** — The category selector is a single-select dropdown with an "All Categories" option. Admins cannot pick *specific multiple* categories (e.g., only 5 out of 23). It needs to become a multi-select checkbox list, matching the pattern already used for level selection in the question form.

2. **Create Question form** — The "Apply to Level" section defaults to `["All Levels"]` (everything pre-checked). It should start empty so admins manually select which levels apply.

Both fixes apply universally across all quiz types (Group, Standard Solo, Interactive, Food for Home, Scholarship) since they share these same components.

---

### Changes

#### 1. `src/components/mobigate/CreateQuizQuestionForm.tsx`
- Change the default value of `selectedLevels` from `["All Levels"]` to `[]` (empty array)
- This single line change ensures no levels are pre-selected when creating a question

#### 2. `src/components/mobigate/CreateQuizLevelForm.tsx`
- Replace the single-select `Select` dropdown for categories with a multi-select checkbox list (same UI pattern as the level checkboxes in the question form)
- Add an "All Categories" master checkbox at the top that toggles all 23 categories
- Add a "Deselect All" button when any are selected
- Add a "Custom" text input option for specifying a category not in the preset list
- Keep the existing "Custom (Specify)" functionality
- Update `handleSubmit` to iterate over all selected categories (instead of only handling `__all__` vs single)
- Default selection: empty (nothing pre-checked)
- Show a helper text indicating how many categories are selected

### Technical Details

The category multi-select will follow this structure:
- State changes from `selectedCategory: string` to `selectedCategories: string[]`
- Checkbox list in a scrollable container with `max-h-48 overflow-y-auto`
- "All Categories" checkbox at top with bidirectional sync (auto-checks when all individuals are checked, unchecks when any is removed)
- Custom category input appears when a "Custom" checkbox is toggled
- On submit, the form loops through all selected categories and calls `onCreateLevel` for each one
- All touch targets remain 44px+ for mobile usability

No changes needed to parent components or other files — these two components are shared across all quiz types.

