

# Mobigate Admin Quiz Level Management System

## Overview
Add a dedicated "Quiz" tab to the Mobigate Admin Dashboard for creating and managing Mobigate Quiz Levels. All 23 categories and 13 level tiers from the PDF will be pre-populated and immediately available, with the ability for admins to add custom categories and levels.

## What Gets Built

### 1. New "Quiz" Tab on Mobigate Admin Dashboard
- Replace the 4-tab layout (Overview, Elections, Revenue, Settings) with a 5-tab horizontally scrollable layout
- New "Quiz" tab with a trophy/gamepad icon

### 2. Quiz Level Data File (`src/data/mobigateQuizLevelsData.ts`)
A data file containing all pre-set quiz levels extracted from the PDF:

**23 Pre-set Categories:**
- Current Affairs, Politics and Leadership, Science and Technology, Morals and Religion, Literature and Reading, Agriculture and Farming, Healthcare and Medicare, Transportation and Vacation, Basic and General Education, Sports and Physical Fitness, Skills and Crafts, Business and Entrepreneurship, Entertainment and Leisure, Environment and Society, Basic Law, Family and Home, Civic Education and Responsibilities, Mentorship and Individual Development, Discoveries and Inventions, Culture and Tradition, Real Estate and Physical Development, Information Technology, General and Basic Knowledge

**13 Pre-set Level Tiers (with default stake/winning values):**

| Level | Stake (Mobi) | Winning (Mobi) |
|-------|-------------|----------------|
| Beginner Level | 200 | 1,000 |
| Starter Level | 500 | 1,500 |
| Standard Level | 1,000 | 3,000 |
| Business Level | 2,000 | 6,000 |
| Professional Level | 3,000 | 9,000 |
| Enterprise Level | 5,000 | 15,000 |
| Entrepreneur Level | 10,000 | 30,000 |
| Deluxe Package | 20,000 | 60,000 |
| Deluxe Gold Package | 30,000 | 150,000 |
| Deluxe Super | 50,000 | 200,000 |
| Deluxe Super Plus | 100,000 | 500,000 |
| Millionaire Suite | 200,000 | 1,000,000 |
| Millionaire Suite Plus | 500,000 | 5,000,000 |

All entries pre-set with status ACTIVE. Category-specific variations in winning amounts (as per PDF) will be reflected.

### 3. Quiz Tab Content - Two Sections

**Section A: Create New Quiz Level (Top of Tab)**
A mobile-optimized form with:
- **Select Category**: Dropdown with all 23 pre-set categories + "Custom (Specify)" option at the bottom. When "Custom" is selected, a text input appears below for typing a custom category name
- **Select Level**: Dropdown with all 13 pre-set level tiers + "Custom (Specify)" option. When "Custom" is selected, a text input appears for typing a custom level name. Note displayed: "Avoid special characters and symbols like &, use 'and' instead. This feature is not editable in future."
- **Minimum Stake Amount**: Numeric input (Mobi), placeholder "e.g. 500 (Do not put comma)"
- **Winning Amount**: Numeric input (Mobi), placeholder "e.g. 1000 (Do not put comma)"
- **Status Toggle**: Switch defaulting to ACTIVE
- **Create Button**: Full-width, mobile-friendly (h-12)

**Section B: Quiz Levels Details (Below Form)**
- Summary stats card showing total levels, active count, inactive count
- Filter bar: filter by category (dropdown) and search by level name
- Scrollable list of all quiz level cards, each showing:
  - Level name (bold) + Category (badge)
  - Stake amount and Winning amount in Mobi
  - Active/Inactive status toggle (switch)
  - Delete button (with confirmation)
- Cards grouped or sortable by category

### 4. Component Structure

**New files:**
- `src/data/mobigateQuizLevelsData.ts` -- All pre-populated data (categories, levels, quiz entries)
- `src/components/mobigate/MobigateQuizManagement.tsx` -- Main quiz tab content component
- `src/components/mobigate/CreateQuizLevelForm.tsx` -- The creation form
- `src/components/mobigate/QuizLevelCard.tsx` -- Individual quiz level display card
- `src/components/mobigate/QuizLevelFilters.tsx` -- Filter/search bar

**Modified files:**
- `src/pages/admin/MobigateAdminDashboard.tsx` -- Add 5th "Quiz" tab, make tabs horizontally scrollable for mobile

## Technical Details

- All data is mock/static (UI template only, no backend)
- State managed with useState for CRUD operations on the quiz levels array
- Toast notifications for create, toggle status, and delete actions
- Mobile-first: all inputs h-12, text-base, touch-manipulation; cards full-width with proper padding
- Uses existing Mobi formatting utilities (`formatMobi`, `formatLocalAmount`)
- Tab bar switches to horizontal scroll (`overflow-x-auto`) to accommodate 5 tabs on mobile
- Custom category/level inputs use the same pattern as the advertisement "Other (Specify)" feature

