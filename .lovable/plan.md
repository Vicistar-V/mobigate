

# Mobigate Quiz Games - Full User-Facing System

## Overview
Transform the existing basic Mobigate Quiz Dialog into a comprehensive quiz games hub featuring all 5 game types from the blueprint. The current "Play Mobigate Quiz" button in the Community Menu will open a redesigned landing page showcasing all quiz game modes.

## What Currently Exists
- A simple `MobigateQuizDialog` showing a flat list of quizzes with tabs (Quizzes, Global, My Stats, Rules)
- A `MobigateQuizPlayDialog` with 10-question gameplay, timer, A-H options
- Mock data in `mobigateQuizData.ts` with basic quiz entries
- Admin quiz level management (categories + tiers) already built

## What Gets Built

### 1. Mobigate Quiz Hub (Replaces current MobigateQuizDialog)
A redesigned landing dialog showing 5 quiz game modes as tappable cards:

| Game Mode | Card Color | Description |
|-----------|-----------|-------------|
| Group Quiz | Purple gradient | Invite 3-10 friends, consensus stake, winner takes multiplied prizes |
| Standard Quiz | Amber gradient | Select category and level, play 10 questions, continue for multiplied prizes |
| Interactive Quiz | Blue gradient | Merchant-based seasons with selection levels and live shows |
| Food for Home Quiz | Green gradient | Select grocery items, play to win them |
| Scholarship Quiz | Indigo gradient | Play to win annual scholarship funding |

Each card shows: game name, short description, min stake, and a "Play" button.
Below the game mode cards: wallet balance bar, global stats summary, and a "View Leaderboard" link.

### 2. Group Quiz Game Flow (Section A of Blueprint)
**New components:**
- `GroupQuizInviteSheet.tsx` - Drawer to invite 3-10 friends from contacts
- `GroupQuizLobbySheet.tsx` - Waiting room showing participants, stake negotiation, "Play Now" countdown
- `GroupQuizPlayDialog.tsx` - Shared gameplay with simultaneous questions, live scores, draw-game resolution

**Key rules from blueprint:**
- Min 3, max 10 participants
- Min stake: 5,000 Mobi (admin-configurable threshold)
- Host sets stake, others accept/approve or negotiate consensus
- Wallets debited on acceptance
- 30-60 second countdown after first 3 click "Play Now"
- Latecomers cut off, no refund
- Winning prizes: 200% (3-4 players), 300% (5-6), 400% (7-9), 500% (10)
- Draw resolution: extra questions for tied players until one winner

### 3. Standard Solo Quiz (Section C - "2nd Quiz Process")
**Enhances existing `MobigateQuizPlayDialog.tsx`:**
- Step 1: Select Category (from admin-set 23 categories)
- Step 2: Select Level (from admin-set 13 tiers with stake/winning)
- Step 3: Play 10 questions (existing gameplay)
- 100% correct = full prize; 80%+ = bonus game at 50% stake
- Winner can "Exit with Prize" or continue to 2nd session for 3x prize
- Each successive session charges original fee again
- Up to 10 sessions, each doubling the last prize
- Fail at any point = lose everything unredeemed

**New component:** `StandardQuizCategorySelectSheet.tsx` - category + level selector using admin data

### 4. Interactive Quiz Game (Section B)
**New components:**
- `InteractiveQuizMerchantSheet.tsx` - Browse merchants offering quiz seasons
- `InteractiveQuizSeasonSheet.tsx` - Select season type (Short/Medium/Complete) with selection levels
- `InteractiveQuizPlayDialog.tsx` - 15 questions (10 objective + 5 non-objective with text input)

**Key rules:**
- 15 questions per session (10 multiple-choice, 5 typed answers)
- 100% pass qualifies for Interactive Session or take 500% of stake
- Seasons with 5-7 selection levels, progressive fees
- Final 3 levels are "Live Shows"
- Winners crowned "Mobi-Celebrity"

### 5. Food for Home Quiz (Section D)
**New components:**
- `FoodQuizItemSelectSheet.tsx` - Grid of grocery items with checkboxes and market prices
- `FoodQuizPlayDialog.tsx` - 15-20 questions (10 objective with A-H options + 5 typed non-objective)

**Key rules:**
- Select grocery items, stake = 20% of total item value (admin-configurable)
- 100% correct wins items
- 70-80% correct can request "Bonus Questions" (3-4 extra) at 50% extra stake
- 30-second timeout on bonus accept/reject
- Bonus database is separate
- Redemption: collect at Mobi-Store or credit wallet equivalent

### 6. Scholarship Quiz (Section E)
**New components:**
- `ScholarshipQuizSetupSheet.tsx` - Input annual scholarship budget, see Mobi conversion and stake (20%)
- `ScholarshipQuizPlayDialog.tsx` - 15 questions (10 objective + 5 non-objective)

**Key rules:**
- User inputs scholarship budget in local currency, system converts to Mobi
- Stake = 20% of budget
- 100% correct wins; 70-99% can get bonus questions
- One game = one year of funding
- Winners get free Mobi-School access
- Prize credited 21 days after winning

### 7. Shared Components
- `QuizBonusQuestionsDialog.tsx` - Reusable bonus questions flow (50% extra stake, 3-4 questions, 30s timeout, accept/reject)
- `NonObjectiveQuestionCard.tsx` - Text input question card with multi-answer matching
- `QuizPrizeRedemptionSheet.tsx` - Prize collection options (Mobi-Store pickup, wallet credit, delivery)

### 8. Mock Data Files
- `src/data/mobigateGroupQuizData.ts` - Mock friends list, lobby data, group game history
- `src/data/mobigateInteractiveQuizData.ts` - Mock merchants, seasons, selection levels
- `src/data/mobigateFoodQuizData.ts` - Mock grocery items with prices
- `src/data/mobigateScholarshipQuizData.ts` - Mock scholarship setup data
- `src/data/mobigateBonusQuestionsData.ts` - Separate bonus questions pool

## Technical Details

### File Structure
```text
src/components/community/mobigate-quiz/
  MobigateQuizHub.tsx              -- Main hub replacing current dialog
  GroupQuizInviteSheet.tsx          -- Friend invitation
  GroupQuizLobbySheet.tsx          -- Waiting/stake negotiation
  GroupQuizPlayDialog.tsx          -- Multiplayer gameplay
  StandardQuizCategorySelect.tsx   -- Category + level picker
  StandardQuizContinueSheet.tsx    -- Continue/exit with prize flow
  InteractiveQuizMerchantSheet.tsx -- Merchant browser
  InteractiveQuizSeasonSheet.tsx   -- Season/level selector
  FoodQuizItemSelectSheet.tsx      -- Grocery item picker
  ScholarshipQuizSetupSheet.tsx    -- Budget input + conversion
  QuizBonusQuestionsDialog.tsx     -- Shared bonus flow
  NonObjectiveQuestionCard.tsx     -- Text-input question
  QuizPrizeRedemptionSheet.tsx     -- Prize collection options

src/data/
  mobigateGroupQuizData.ts
  mobigateInteractiveQuizData.ts
  mobigateFoodQuizData.ts
  mobigateScholarshipQuizData.ts
  mobigateBonusQuestionsData.ts
```

### Modified Files
- `src/components/community/CommunityMainMenu.tsx` - Update to open new hub
- `src/components/community/MobigateQuizDialog.tsx` - Replace with hub component
- `src/data/mobigateQuizData.ts` - Extend with standard quiz category/level integration

### Mobile-First Design
- All sheets use Drawer (vaul) for mobile-native feel
- Touch targets minimum 44px (h-11/h-12)
- Vertical stacking throughout, no horizontal cramming
- ScrollArea for long content
- Cards with rounded corners, gradient backgrounds per game type
- Currency always shows local first with Mobi in parentheses

### State Management
- All UI-template mock data, no backend
- useState for game flow state machines
- Toast notifications for wallet debits, game results, and errors

### Navigation Flow
```text
Community Menu > Play Mobigate Quiz
  > Quiz Hub (5 game mode cards)
    > Group Quiz > Invite > Lobby > Play > Results
    > Standard Quiz > Select Category > Select Level > Play > Continue/Exit
    > Interactive Quiz > Choose Merchant > Choose Season > Play Sessions
    > Food for Home > Select Items > Play > Win/Lose > Redeem
    > Scholarship Quiz > Set Budget > Play > Win/Lose > Redemption
```

