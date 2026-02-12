
# Remove Custom Admin Headers -- Use Main Navigation

## Problem
The quiz management pages and advert management pages each render their own `MobigateAdminHeader` component (a separate purple gradient header with its own back button, bell icon, etc). This creates a disconnected navigation experience -- users lose access to the main sidebar, notifications, messages, and profile dropdown. Every other page in the app uses the standard `Header` + `AppSidebar` combo.

## Solution
Remove `MobigateAdminHeader` from all 8 affected pages and replace with the standard `Header` component, matching how every other page (Index, Community, Profile, etc.) works. The sidebar already has all the admin links, so navigation is handled.

## Pages to Update (8 files)

### Quiz Pages (5)
1. `src/pages/admin/quiz/QuizCategoriesPage.tsx` -- remove MobigateAdminHeader, add Header
2. `src/pages/admin/quiz/QuizLevelsPage.tsx` -- remove MobigateAdminHeader, add Header
3. `src/pages/admin/quiz/CreateQuestionPage.tsx` -- remove MobigateAdminHeader, add Header
4. `src/pages/admin/quiz/ManageQuestionsPage.tsx` -- remove MobigateAdminHeader, add Header
5. `src/pages/admin/quiz/MonitorQuizPage.tsx` -- remove MobigateAdminHeader, add Header

### Advert Pages (3)
6. `src/pages/admin/adverts/AdSlotRatesPage.tsx` -- remove MobigateAdminHeader, add Header
7. `src/pages/admin/adverts/ManageAdvertsPage.tsx` -- already just renders AdminManageAdverts (which has its own Header), no change needed
8. `src/pages/admin/adverts/PromotionalAdsPage.tsx` -- remove MobigateAdminHeader, add Header

### Admin Dashboard
9. `src/pages/admin/MobigateAdminDashboard.tsx` -- remove MobigateAdminHeader, add Header

## What Changes Per Page
For each page, the pattern is:
- Remove `import { MobigateAdminHeader }` line
- Add `import { Header } from "@/components/Header"`
- Replace `<MobigateAdminHeader title="..." subtitle="..." />` with `<Header />`
- Add a simple page title section below the Header (a small heading with the page name so users know where they are)
- Adjust `ScrollArea` height calc from `100vh-140px` to `100vh-80px` since the Header is a standard 64px

## What Stays the Same
- All page content, forms, cards, and functionality remain untouched
- The sidebar already contains all admin navigation links
- Mobile-first layout is preserved

## Result
Every admin page will have the same hamburger menu, logo, notifications, messages, and profile dropdown as the rest of the app. Users can navigate freely between any section using the sidebar without losing context.
