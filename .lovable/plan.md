

## Plan: Move Highlighted Winners Carousel to MerchantDetailPage

### Problem
The carousel was added to the WinnersTab on MerchantPage (merchant admin view), but it should be on the **MerchantDetailPage** -- the page where users actually browse and play quizzes (the page shown in the screenshot at `/mobi-quiz-games/merchant/:merchantId`).

### Changes

**1. `src/pages/MerchantDetailPage.tsx`**
- Import `HighlightedWinnersCarousel`
- Add the carousel between the "Verified Merchant" info card and the "Quiz Platform Settings" section
- This is where users see and play quizzes, so this is the correct location

**2. `src/pages/MerchantPage.tsx`**
- Remove the `HighlightedWinnersCarousel` import and usage from the WinnersTab (it doesn't belong in the merchant admin view)

### Result
Users browsing a merchant's quiz page will see the auto-scrolling highlighted winners carousel right below the merchant info, before the quiz settings and seasons. Tapping a card opens the profile drawer, tapping "Fan" costs M200 -- all existing functionality preserved, just in the right place.

