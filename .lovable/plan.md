

# Fix Missing Features: Raise Campaign Button + All Categories Option

## Issue 1: Add "Raise Campaign" Button to FundRaiser Campaigns Tab

**File: `src/components/community/fundraiser/FundRaiserViewCampaignsTab.tsx`**
- Accept an optional `onRaiseCampaign` prop
- Add a prominent full-width "Raise Campaign" button between the `FundRaiserHeader` and the "Active Campaigns" section
- Styled in rose/primary color with a `PlusCircle` icon
- On tap, calls `onRaiseCampaign` if provided, otherwise uses DOM method to click the "fundraiser-raise" tab trigger

**File: `src/pages/CommunityProfile.tsx`**
- Pass `onRaiseCampaign` callback to `FundRaiserViewCampaignsTab` that calls `handleTabChange("fundraiser-raise")` to switch to the campaign creation form

---

## Issue 2: Add "All Categories" Option to Quiz Levels Create Form

**File: `src/components/mobigate/CreateQuizLevelForm.tsx`**
- Add an "All Categories" option at the top of the category `Select` dropdown
- When "All Categories" is selected, the form creates a quiz level entry for every preset category (all 23) at once using the specified level, stake, and winning values
- Update `handleSubmit` to loop through all `PRESET_QUIZ_CATEGORIES` when "All Categories" is chosen, calling `onCreateLevel` for each
- Show a helper note when "All Categories" is selected: "This will create the level for all 23 categories"

**File: `src/components/mobigate/MobigateQuizLevelsManagement.tsx`**
- Update `handleCreate` to also accept batch creation (or the form will call it multiple times -- no changes needed if so)

---

## Technical Details

### Raise Campaign button layout:
```text
[ FundRaiser Header banner        ]
[ + Raise Campaign                ]  <-- NEW button
[ Active Campaigns       | Sort v ]
[ Campaign cards...               ]
```

### Quiz Levels "All Categories" in dropdown:
```text
[ All Categories          ]  <-- NEW, at top
[ Current Affairs         ]
[ Politics and Leadership ]
[ ...                     ]
[ Custom (Specify)        ]
```

When "All Categories" is selected and submitted, the form creates 1 level entry per category (23 entries total) with the same level tier, stake, and winning amount.

### Files to edit:
1. `src/components/community/fundraiser/FundRaiserViewCampaignsTab.tsx` -- add Raise Campaign button
2. `src/pages/CommunityProfile.tsx` -- pass onRaiseCampaign handler
3. `src/components/mobigate/CreateQuizLevelForm.tsx` -- add "All Categories" option + batch creation logic
