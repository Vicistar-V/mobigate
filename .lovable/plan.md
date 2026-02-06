

## Update Quiz Time to 10 Seconds and Winning Structure to 20%

### What's Changing

Based on the screenshots, two values need updating across the entire quiz system:

1. **Time per Question**: Change default from 35s/30s/25s/etc. to **10 seconds** for all quizzes
2. **Winning Structure for 8-9/10**: Change from **50% Win** to **20% Win**
3. **Mobigate Admin**: Add a Quiz Settings card to the Mobigate Admin Dashboard so admins can edit these values

### Files to Modify

#### 1. `src/data/platformSettingsData.ts` -- Add Quiz Platform Settings

Add a new `PlatformQuizSettings` interface and export alongside existing withdrawal/fee settings:
- `defaultTimePerQuestion`: 10 (seconds), range 5-60
- `partialWinPercentage`: 20 (%), range 10-50
- `partialWinThreshold`: 8 (minimum correct for partial win)
- Getter/setter functions following the same pattern as `getMinimumWithdrawal()`

#### 2. `src/data/quizGameData.ts` -- Update Mock Data and Logic

- Change all `timeLimitPerQuestion` values from 30/25/45/30 to **10** (4 quizzes, lines 241, 260, 279, 298)
- Update `calculateWinnings` function (line 596-603): change `0.5` to `0.2` for partial win
- Update `quizRules` text (line 560): change "50% winning amount" to "20% winning amount"
- Update `createEmptyQuestion` default `timeLimit` from 30 to 10

#### 3. `src/data/communityQuizData.ts` -- Update Community Quiz Data and Logic

- Change all `timeLimitPerQuestion` values from 35/25/45/30 to **10** (lines 309, 329, 349, 369)
- Update `calculateCommunityWinnings` (line 520-528): change `0.5` to `0.2`
- Update `communityQuizRules` text (line 486): change "50% prize" to "20% prize"

#### 4. `src/data/mobigateQuizData.ts` -- Update Mobigate Quiz Data and Logic

- Change all `timeLimitPerQuestion` values from 25/30/20/20/25 to **10** (lines 315, 334, 353, 374, 395)
- Update `calculateMobigateWinnings` (line 564-572): change `0.5` to `0.2`
- Update `mobigateQuizRules` text (line 539): change "50% prize" to "20% prize"

#### 5. `src/components/community/QuizCreationDialog.tsx` -- Update Default Time

- Change default `timeLimitPerQuestion` state from `"30"` to `"10"` (line 53)
- Change `createEmptyQuestion` default `timeLimit` from 30 to 10 (line 39)

#### 6. UI: Winning Structure Displays (3 play dialogs)

Update the "50% Win" text to "20% Win" in the pre-game info cards:

- **`src/components/community/QuizGamePlayDialog.tsx`** (line 304): Change "50% Win" to "20% Win"
- **`src/components/community/CommunityQuizPlayDialog.tsx`** (line 152): Change "50% Win" to "20% Win"  
- **`src/components/community/MobigateQuizPlayDialog.tsx`** (line 142): Change "50% Win" to "20% Win"

#### 7. `src/components/mobigate/QuizSettingsCard.tsx` -- New File

Create a new Mobigate Admin settings card (following the `WithdrawalSettingsCard` pattern) with:
- **Time per Question** slider: Range 5s-60s, step 5s, default 10s
- **Partial Win Percentage** slider: Range 10%-50%, step 5%, default 20%
- Save button with toast confirmation
- Platform-wide info note explaining changes apply to all quizzes
- Mobile-optimized layout with touch-manipulation sliders

#### 8. `src/pages/admin/MobigateAdminDashboard.tsx` -- Wire New Settings Card

Replace the "More Settings Coming Soon" placeholder (lines 444-451) with the new `QuizSettingsCard` component.

---

### Technical Details

**Data layer changes** (platformSettingsData.ts):
```typescript
export interface PlatformQuizSettings {
  defaultTimePerQuestion: number;    // seconds
  timePerQuestionMin: number;
  timePerQuestionMax: number;
  partialWinPercentage: number;      // percentage
  partialWinMin: number;
  partialWinMax: number;
  lastUpdatedAt: Date;
  lastUpdatedBy: string;
}

export const platformQuizSettings: PlatformQuizSettings = {
  defaultTimePerQuestion: 10,
  timePerQuestionMin: 5,
  timePerQuestionMax: 60,
  partialWinPercentage: 20,
  partialWinMin: 10,
  partialWinMax: 50,
  lastUpdatedAt: new Date(),
  lastUpdatedBy: "Mobigate Admin",
};
```

**Winning calculation change** (all 3 data files):
```typescript
// Before
} else if (questionsCorrect >= 8) {
  return { percentage: 50, amount: winningAmount * 0.5, status: "partial_win" };
}

// After
} else if (questionsCorrect >= 8) {
  return { percentage: 20, amount: winningAmount * 0.2, status: "partial_win" };
}
```

**QuizSettingsCard** will follow the exact same mobile-optimized card pattern as `WithdrawalSettingsCard`:
- Card with icon header and current value badge
- Central value display
- Slider with min/max labels
- Dual display for both settings
- Info note about platform-wide impact
- Save button that appears only when values change

### Summary

| File | Change |
|------|--------|
| platformSettingsData.ts | Add PlatformQuizSettings interface, defaults, getters/setters |
| quizGameData.ts | All timeLimitPerQuestion to 10, winning calc 50% to 20%, rules text |
| communityQuizData.ts | All timeLimitPerQuestion to 10, winning calc 50% to 20%, rules text |
| mobigateQuizData.ts | All timeLimitPerQuestion to 10, winning calc 50% to 20%, rules text |
| QuizCreationDialog.tsx | Default time 30 to 10 |
| QuizGamePlayDialog.tsx | Display "20% Win" instead of "50% Win" |
| CommunityQuizPlayDialog.tsx | Display "20% Win" instead of "50% Win" |
| MobigateQuizPlayDialog.tsx | Display "20% Win" instead of "50% Win" |
| QuizSettingsCard.tsx | New Mobigate Admin quiz settings card |
| MobigateAdminDashboard.tsx | Wire QuizSettingsCard into Settings tab |

