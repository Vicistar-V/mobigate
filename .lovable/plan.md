

# Fix: Pass quizType to MobigateQuizLevelsManagement

## Issue Found

After a thorough file-by-file audit of the entire quiz admin system, nearly everything from the plan has been fully implemented. There is **one remaining gap**:

**`MobigateQuizLevelsManagement`** does not accept or use a `quizType` prop. It always loads from the same shared `DEFAULT_QUIZ_LEVELS` data regardless of which quiz type's Levels page you're on. This means Group Quiz Levels, Standard Solo Levels, Interactive Quiz Levels, etc., all show the exact same data -- breaking the "separate database per quiz type" requirement.

## What Needs to Change

### 1. Update `MobigateQuizLevelsManagement` component

- Add a `quizType` prop
- Display the quiz type label in the heading
- (Since this is a UI template, the same mock level data can be reused -- the key is that the component is **aware** of which quiz type it belongs to, ready for backend scoping)

### 2. Update `QuizLevelsPage` to pass `quizType`

- Pass the URL param down: `<MobigateQuizLevelsManagement quizType={qt} />`

### Files to Modify

- `src/components/mobigate/MobigateQuizLevelsManagement.tsx` -- Add `quizType` prop, use label in headings
- `src/pages/admin/quiz/QuizLevelsPage.tsx` -- Pass `quizType` to the component

Everything else (Routes, Sidebar, Dashboard, Questions, Categories, Monitor, Merchant Admin) is fully implemented and integrated.

