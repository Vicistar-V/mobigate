

## Plan: Add "Winners" Tab to Merchant Quizzes Management

### What It Does

Adds a 5th tab called "Winners" to the Merchant Quizzes Management page. This tab shows a comprehensive, mobile-first view of all winners across the merchant's completed and in-progress seasons -- including the top 3 prize winners, consolation prize recipients, season stats, and payout tracking.

### What the Tab Contains

**1. Summary Stats Row (3 compact cards)**
- Total Winners (count across all seasons)
- Total Prizes Paid Out (sum of all winner payouts)
- Active Seasons with Winners (count)

**2. Season Filter**
- A Select dropdown to filter winners by season (default: "All Seasons")

**3. Per-Season Winner Sections**
Each season that has winners shows a collapsible card with:

- **Season header**: Season name, type badge, status badge
- **Top 3 Winners** (1st, 2nd, 3rd with Trophy/Crown/Medal icons):
  - Player name, avatar placeholder, state/country
  - Prize amount in NGN
  - Score and completion date
  - Payout status badge (Paid / Pending / Processing)
- **Consolation Prize Winners** (collapsible sub-section):
  - List of consolation winners with prize amounts
  - Total consolation pool and count
- **Season Prize Summary Card**:
  - Total Prize Pool, Prizes Paid, Prizes Pending
  - Progress bar showing payout completion percentage

**4. Empty State**
If the merchant has no winners yet, shows a friendly empty state with trophy icon.

### Data Approach

All winner data is mock/hardcoded inline in the component -- no new data files needed. The mock data references existing season IDs (s1, s2) and creates realistic winner entries with Nigerian names, states, scores, and dates.

### Technical Details

**File: `src/data/mobigateInteractiveQuizData.ts`**
- Add `SeasonWinner` interface: `{ id, seasonId, playerName, playerAvatar, state, country, position (1st/2nd/3rd/consolation), prizeAmount, score, completionDate, payoutStatus (paid/pending/processing) }`
- Add `mockSeasonWinners: SeasonWinner[]` array with ~12 entries across seasons s1 and s2

**File: `src/pages/MerchantPage.tsx`**
- Import `Trophy` icon (already imported), `mockSeasonWinners`, `SeasonWinner`
- Add new `WinnersTab` function component accepting `{ merchantId: string }`
  - State: `seasonFilter` (string, default "all"), `expandedConsolation` (Record for toggling consolation sections)
  - Filters `mockSeasonWinners` by `merchantId` (via season lookup) and `seasonFilter`
  - Groups winners by seasonId
  - Renders summary stats, season filter, per-season winner cards
- Update `TabsList` from `grid-cols-4` to `grid-cols-5`
- Add `Winners` TabsTrigger with Trophy icon
- Add `Winners` TabsContent rendering `WinnersTab`

**Mobile Focus:**
- All cards use full-width vertical stacking
- Winner entries use compact row layout with avatar + info + prize
- Touch-friendly h-11 minimum tap targets
- Collapsible consolation section to save vertical space
- No horizontal scrolling anywhere
