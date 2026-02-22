
# Merchant Question Bank: Switch from Create to Integrate + Add Initialization Fee

## Status: ✅ COMPLETED

## What was done:

### 1. Question Integration Tab (replaced Question Bank Tab)
- Merchants can no longer create/edit/delete questions
- New browse-and-integrate UI with Available vs Integrated toggle views
- Admin objective questions sourced from `INITIAL_ADMIN_QUESTIONS` (active only)
- Non-objective and bonus questions sourced from `mockQuestions`
- Integration counter shows "X of Y questions integrated" per sub-tab
- Read-only question display with options, category, difficulty, time limit
- Alternative Answers editable by merchant on non-objective questions only
- Integrate/Remove buttons with toast feedback

### 2. Season Initialization Fee
- Entry fee defaults to ₦200 (M200) with descriptive label
- Maximum Initial Participants field defaults to 10,000
- Total Initial Registration Revenue calculated and displayed
- Season cards show Registration Info section with fee, max participants, and revenue
- All mock seasons updated to ₦200 entry fee and 10,000 participant cap

### Files Modified
- `src/pages/MerchantPage.tsx` — QuestionBankTab → QuestionIntegrationTab, season form + card updates
- `src/data/mobigateInteractiveQuizData.ts` — Mock season data updated
