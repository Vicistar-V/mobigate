

## Plan: Make Boost Show Options Actually Functional

Currently all 6 Boost Show buttons just show a toast and close. This plan makes each one perform a real action using existing utilities and browser APIs.

### What Each Button Will Do

**1. Boost on Mobigate (internal feature)**
- Since this is a UI template with no backend, this will show a confirmation drawer/dialog with a "Confirm Boost" step (cost preview, duration selector like 7/14/30 days), then show a success state with a "Boosted" badge. Adds a `boosted` visual indicator on the season card.

**2. Share with Mobigate Users (Friends)**
- Opens a friends picker drawer showing the user's friends list (from `useFriendsList()` hook). User can select multiple friends, then tap "Send". Shows toast confirmation with count of friends notified.

**3. Share on Mobi-Store**
- Opens a mini-form drawer to set a promotional message and category for the Mobi-Store listing. Tap "List on Store" confirms. Shows a "Listed on Store" badge on the season card.

**4. Share on Social Media**
- Uses the existing `shareUtils.ts` functions (`shareToFacebook`, `shareToTwitter`, `shareToWhatsApp`) to actually open real share windows. Shows a sub-menu with individual platform buttons (Facebook, WhatsApp, Instagram, Twitter) that each open the correct share URL. Also attempts `navigator.share()` (Web Share API) on mobile if available.

**5. Share via Email**
- Opens a `mailto:` link with a pre-filled subject and body containing the season name, description, and a share URL. This opens the user's native email app.

**6. Share via SMS**
- Opens an `sms:` link with a pre-filled body containing the season info and share URL. This opens the native SMS app on mobile.

### Technical Details

**File: `src/pages/MerchantPage.tsx`**

- Import `shareToFacebook`, `shareToTwitter`, `shareToWhatsApp` from `@/lib/shareUtils`
- Import `useFriendsList` from `@/hooks/useWindowData`
- Add new state: `boostStep` (to track sub-views like friends picker, boost confirm, social picker)
- Generate share URL per season: `${window.location.origin}/quiz-season/${season.id}`
- Generate share text: `"Join ${season.name} on Mobigate! Play quizzes and win prizes."`

**Button 1 - Boost on Mobigate:**
- Replace toast-only with a sub-view showing boost duration options (7/14/30 days) with mock pricing
- "Confirm Boost" button sets a local `boostedSeasons` state Set to show a "Boosted" badge

**Button 2 - Share with Friends:**
- Show inline friend list from `useFriendsList()` with checkboxes
- "Send to X friends" button at bottom
- Toast confirms with friend count

**Button 3 - Share on Mobi-Store:**
- Show a small form (promotional message textarea)
- "List on Store" confirms and adds to local `storeListed` state

**Button 4 - Social Media:**
- Replace single button with expandable sub-buttons for each platform
- Each calls the real share util function (opens actual Facebook/Twitter/WhatsApp share URLs)
- Add "Share via device" option using `navigator.share()` API for native mobile sharing

**Button 5 - Email:**
- `window.location.href = \`mailto:?subject=...&body=...\`` with season details and share link
- Opens native email client

**Button 6 - SMS:**
- `window.location.href = \`sms:?body=...\`` with season info and link
- Opens native SMS app on mobile

**File: `src/lib/shareUtils.ts`**
- Add `shareViaEmail(subject: string, body: string)` helper
- Add `shareViaSMS(body: string)` helper
- Add `shareViaNative(title: string, text: string, url: string)` helper using Web Share API
- Add `shareToInstagram(url: string)` helper (opens Instagram with a copy-link fallback since Instagram doesn't have a direct web share URL)

### New State Variables in MerchantPage
- `boostStep: 'menu' | 'boost-confirm' | 'friends-picker' | 'store-form' | 'social-picker' | null`
- `boostedSeasons: string[]` - tracks which seasons are boosted (visual badge)
- `storeListedSeasons: string[]` - tracks which are listed on store
- `selectedFriends: string[]` - for the friends picker
- `boostDuration: number` - selected boost duration in days

