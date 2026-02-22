

## Add "Mobi-Quiz" Tab to Profile Page

This plan adds a new **Mobi-Quiz** tab to the main profile page, positioned right after the Community tab. It will showcase everything quiz-related about the user: stats overview, celebrity status, recent game history by mode, favorite merchants, and interactive navigation to deeper pages.

---

### What You'll Get

1. **New "Mobi-Quiz" tab** in the profile page tab bar, right after "Community"
2. **Hero Stats Card** - Games played, win rate, net profit, current streak, global rank, and a prominent "Mobi Celebrity" badge if qualified
3. **Performance Breakdown by Game Mode** - Cards for each mode (Group, Standard Solo, Interactive, Food for Home, Scholarship, Toggle) showing wins/losses and total earnings per mode. Tapping a mode card navigates to `/my-quiz-history` with that mode pre-filtered
4. **Recent Games Section** - Last 5 games from `quizGamesPlayedData` displayed as compact result cards. Tapping any opens the `QuizGameDetailDrawer` with full details
5. **Favorite Merchants Section** - Shows merchants the user has interacted with (from `mockMerchants`). Tapping navigates to `/mobi-quiz-games/merchant/:id`
6. **Quick Action Buttons** - "View Full History", "Play Now", and "Leaderboard" CTAs

---

### Technical Details

**1. Create `ProfileMobiQuizTab` component** (`src/components/profile/ProfileMobiQuizTab.tsx`)
- Import data from `mobigateQuizData` (player stats, wallet), `quizGamesPlayedData` (game history), and `mobigateInteractiveQuizData` (merchants)
- Hero section: Stats grid (2-col) with games played, win rate, net profit/loss, streak, global rank
- Celebrity badge: Conditionally rendered based on a mock flag (set to true for demo)
- Mode breakdown: Group results from `quizGamesPlayedData` by `gameMode`, show count + earnings per mode in tappable cards with mode-specific icons/colors
- Recent games: Map last 5 entries from `quizGamesPlayedData` into compact cards showing result badge, mode, score, and prize. Tap opens `QuizGameDetailDrawer`
- Merchants section: Show top 3 approved merchants from `mockMerchants` as avatar+name cards. Tap navigates to merchant detail page
- CTAs: "View Full History" links to `/my-quiz-history`, "Play Now" links to `/mobi-quiz-games`

**2. Update `Profile.tsx`**
- Import `ProfileMobiQuizTab`
- Add `<TabsTrigger value="mobi-quiz">Mobi-Quiz</TabsTrigger>` after the "community" trigger (line 784)
- Add `<TabsContent value="mobi-quiz"><ProfileMobiQuizTab /></TabsContent>` after the community TabsContent (line 911)

All styling is mobile-first with touch-manipulation, compact cards, and rounded-xl throughout, matching the existing ProfileCommunityTab pattern.

