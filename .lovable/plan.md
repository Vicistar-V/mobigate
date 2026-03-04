

## Plan: Context-Aware Quiz/Game/Show Buttons on Sub-Merchant Pages + Referral Reward System

### Problem
On a Sub-Merchant (Retail Merchant) profile page, the "Play Quiz", "Shows", "Live", and related buttons currently navigate to that sub-merchant's own quiz/game pages — but sub-merchants don't have their own quizzes, games, or shows. These buttons should instead open a list of Bulk (Major) Merchants that offer quiz/game activities, letting the user browse and select from those merchants' offerings.

Additionally, when a user initiates quiz/game activity from a Sub-Merchant's profile, the Sub-Merchant should earn a 1% referral reward on all charges/payments the user makes during that activity.

### Changes Required

**1. MerchantHomePage.tsx — Quick Actions context switch (major change)**

For sub-merchants (`!isMajorMerchant`), the quick action buttons "Play Quiz", "Shows", and "Live" will open a new **Quiz Merchants Drawer** instead of navigating directly to `/mobi-quiz-games/merchant/{id}`. This drawer lists Bulk Merchants that have quiz offerings, allowing the user to select one and navigate to that merchant's quiz page.

- "Play Quiz" button → opens Quiz Merchants Drawer (filtered to merchants with quiz offerings)
- "Shows" button → opens the same drawer (same merchant list, since shows are quiz seasons)
- "Live" button → opens Live Scoreboard (unchanged, since it's a global feature)
- "Gallery", "Events", "Contact" → unchanged (these are the sub-merchant's own content)

**2. New component: RetailMerchantQuizBrowseDrawer.tsx**

A new drawer component that:
- Lists all Bulk Merchants with active quiz/game offerings
- Shows each merchant's name, logo, category, active seasons count, and prize pools
- On merchant selection, navigates to `/mobi-quiz-games/merchant/{selectedMerchantId}` with a referral query parameter (`?ref={subMerchantId}`)
- Displays a small banner: "Activities initiated here earn rewards for [Sub-Merchant Name]"

**3. Shows/Events sections on Sub-Merchant pages — context-aware**

When viewing a sub-merchant profile:
- The "Upcoming & Live Shows" section will display shows from all Bulk Merchants (aggregated), not from the sub-merchant itself
- Each show card will include the source merchant's name
- Clicking a show card navigates to the source merchant's quiz page with the referral param

**4. Referral Reward Banner**

A small, non-intrusive banner/badge system:
- On the Sub-Merchant profile, near the quiz/game buttons, show: "🎁 This retailer earns 1% rewards on activities you start here"
- On the Quiz Games page when accessed via referral (`?ref=`), show a small banner: "Playing via [Retail Merchant Name] — they earn 1% reward"

**5. Referral tracking data model (UI mock only)**

Since this is UI-only, add a simple referral tracking type and mock display:
- Track `referringSubMerchantId` in quiz navigation flows
- Display referral info in transaction/receipt UIs
- Show accumulated referral earnings on Sub-Merchant management pages

### Files to Create/Modify

| File | Action |
|------|--------|
| `src/components/merchant/RetailMerchantQuizBrowseDrawer.tsx` | **Create** — Drawer listing bulk merchants with quiz offerings |
| `src/pages/MerchantHomePage.tsx` | **Modify** — Context-aware quick actions, shows sections, referral banner for sub-merchants |
| `src/pages/MobiQuizGames.tsx` | **Modify** — Read `?ref=` param and display referral banner |
| `src/pages/MerchantQuizGamesDetail.tsx` (if exists) | **Modify** — Pass through referral param |

### Technical Details

- The `isMajorMerchant` flag already exists in `MerchantHomePage.tsx` and will be reused
- Bulk merchants with quiz offerings will be sourced from `mockMerchants` (from `mobigateInteractiveQuizData`) cross-referenced with `allLocationMerchants` filtered to `merchantType === "bulk"`
- The referral parameter (`?ref=subMerchantId`) will be propagated through navigation and read via `useSearchParams`
- The 1% reward calculation will be displayed in UI as a mock stat (e.g., "Estimated Reward: ₦X")

