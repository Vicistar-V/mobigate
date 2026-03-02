# Fix: Tiny Text, Button Text Cutoff, and Add Create Questions Button

## Issues Identified (from screenshots)

1. **Interactive Session Dialog - Scoring & Rules text too tiny** (lines 380-425): Multiple `text-[10px]` and `text-[11px]` instances in the lobby's "Scoring & Rules" card need upgrading to `text-xs` minimum.
2. **Interactive Session Dialog - Other tiny text**: `text-[10px]` on the local currency amount lines (line 356, 368, 536), Game Show badge (line 323), progress text (line 578).
3. **Interactive Quiz Play Dialog - Tiny text throughout**: `text-[10px]` on header subtitle (line 459), badge (line 469), score breakdown labels (lines 792, 797), stats labels (lines 861, 865, 869, 873), progress text (line 878), badge (line 785), and redemption warning text (lines 829-833). Also `text-[9px]` on stats labels.
4. **Interactive Quiz Play Dialog - Written progress text**: `text-[10px]` on line 752.
5. **Session Complete button text cutoff**: "Continue to Next Session (prize dissolved)" is too long for mobile. Shorten to "Continue to Next Session" with a subtitle or shorter parenthetical.
6. **Merchant Questions tab - Missing "Create Questions" button**: The QuestionIntegrationTab in MerchantPage.tsx needs a "Create Questions" button above the question list, allowing merchants to create their own questions.

## Plan

### File 1: `src/components/community/mobigate-quiz/InteractiveSessionDialog.tsx`

- **Line 323**: Change `text-[10px]` to `text-xs` on Game Show badge.
- **Line 356**: Change `text-[10px]` to `text-xs` on local amount.
- **Line 368**: Change `text-[10px]` to `text-xs` on local amount.
- **Lines 380-425 (Scoring & Rules)**: Upgrade all `text-[10px]` to `text-xs` and `text-[11px]` to `text-sm` for the scoring rules section.
- **Line 536**: Change `text-[10px]` to `text-xs` on local amount under instant prize.
- **Line 549**: Change `text-[10px]` to `text-xs` on reset description.
- **Line 578**: Change `text-[9px]` to `text-xs` on progress text.
- **Line 668**: Shorten "Continue to Next Session (prize dissolved)" to "Continue to Next Session" -- move "(prize dissolved)" info to a separate line or remove since the toast already explains it.

### File 2: `src/components/community/mobigate-quiz/InteractiveQuizPlayDialog.tsx`

- **Line 364**: Change `text-[10px]` to `text-xs` on saved confirmation subtitle.
- **Line 459**: Change `text-[10px]` to `text-xs` on header subtitle.
- **Line 469**: Change `text-[10px]` to `text-xs` on badge.
- **Line 752**: Change `text-[10px]` to `text-xs` on written question progress.
- **Line 785**: Change `text-[10px]` to `text-xs` on mode badge.
- **Lines 792, 797**: Change `text-[10px]` to `text-xs` on score breakdown labels.
- **Lines 829-833**: Change `text-[10px]` to `text-xs` on redemption warning items.
- **Lines 861, 865, 869, 873**: Change `text-[9px]` to `text-xs` on accumulated stats labels.
- **Line 878**: Change `text-[9px]` to `text-xs` on progress text.

### File 3: `src/pages/MerchantPage.tsx`

- Add a "Create Questions" button in the `QuestionIntegrationTab` component, placed between the sub-tabs and the integration counter (around line 1519).
- The button will open a dialog/sheet with the `CreateQuizQuestionForm` component (already exists at `src/components/mobigate/CreateQuizQuestionForm.tsx`).
- Add state for `showCreateForm` boolean toggle.
- When a question is created, add it to the available pool and show a success toast.

## Technical Details

### Typography fixes

All instances of `text-[10px]`, `text-[9px]`, and `text-[11px]` will be replaced:

- `text-[9px]` and `text-[10px]` become `text-xs` (12px)
- `text-[11px]` becomes `text-sm` (14px) for section headers, or `text-xs` for body text

### Button text fix

The "Continue to Next Session (prize dissolved)" button in InteractiveSessionDialog.tsx (line 668) will be shortened. The parenthetical text will be removed from the button label since the dissolution is already communicated via the toast notification.

### Create Questions button

- Import `CreateQuizQuestionForm` and add `Dialog` wrapper in `QuestionIntegrationTab`.
- Add a `+ Create Question` button with a `PlusCircle` icon next to the sub-tabs or below them.
- Created questions will be added to a local state array and rendered alongside the existing available questions.
- The form's `quizType` prop will be set to `"interactive"` since this is for merchant quizzes.

## Files Modified

1. `src/components/community/mobigate-quiz/InteractiveSessionDialog.tsx` -- fix tiny text + button text
2. `src/components/community/mobigate-quiz/InteractiveQuizPlayDialog.tsx` -- fix tiny text
3. `src/pages/MerchantPage.tsx` -- add Create Questions button + dialog

&nbsp;

Add: 'Create Quiz Questions' button, to enable Quiz Merchants add their custom Questions to their Quiz Game Sessions to backup the Mobigate Central Questions Bank. While Users Play Games on each Merchants' Quizzes, the System will supply like Questions from various available Questions Banks (Mobigate Central Questions Bank - 60%; the particular Merchant's Questions Bank - 30%; then, Other Merchants' respective Questions Banks - 10%)(Mobigate Admin will Set/Edit these).

&nbsp;

Implement the plan completely take your time and carefully implement every single thing and integrate all completely no need to rush and report to me just take your loooong time and make everything perfectly