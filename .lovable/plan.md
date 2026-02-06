

## Make Advertisement Banner Clickable / Navigable

### Problem

The "Need an Architect for your Dream-Project? Click Here!" ad banner in the Community Accounts section is completely static -- tapping it does nothing. Since it's an advertisement, it should open/navigate to the advertiser's destination when tapped.

### Solution

Make the entire ad banner card a clickable element that opens the advertiser's URL in a new browser tab when tapped. This applies to:

1. **The inline "Architect" ad banner** -- the small gradient card between the filter buttons and the Sort dropdown
2. **The PremiumAdCard standard/compact layouts** -- make the entire card surface clickable (not just the CTA button), so users on mobile can tap anywhere on the ad to navigate

---

### File Changes

#### 1. `src/components/community/finance/CommunityAccountsTab.tsx` (lines 139-147)

**Current:** The Card and Button have no onClick handler.

**Fix:** Wrap the Card in a clickable container or add `onClick` + `cursor-pointer` to the Card itself. When tapped, open a sample advertiser URL (`window.open("https://example.com/architect-services", "_blank")`). Add `role="link"` and `cursor-pointer` for accessibility and visual feedback.

Replace:
- Static `Card` with a clickable Card that has `onClick={() => window.open("https://example.com/architect-services", "_blank")}` and `className` updated to include `cursor-pointer active:scale-[0.98] transition-transform touch-manipulation`
- The "Click Here!" Button also gets the same onClick so either tapping the card or the button works

#### 2. `src/components/PremiumAdCard.tsx` -- Standard layout (line 261)

**Current:** Only the CTA button at the bottom calls `handleCTA()` which opens `content.ctaUrl`.

**Fix:** Make the Card's main content area (media + headline + description) clickable too:
- Add `onClick={handleCTA}` and `cursor-pointer` to the media container div
- This way tapping the ad image/headline area navigates, not just the small CTA button
- Use `e.stopPropagation()` on the Close button, AlertCircle button, and EngagementBar to prevent them from triggering navigation

#### 3. `src/components/PremiumAdCard.tsx` -- Compact layout (line 441)

**Same treatment as standard:** Add `onClick={handleCTA}` and `cursor-pointer` to the main content wrapper div, with `e.stopPropagation()` on interactive child elements (close button, engagement bar).

#### 4. `src/components/AdCard.tsx` (line 22)

**Current:** The Card is non-interactive -- no navigation at all.

**Fix:** Add an optional `url` prop to `AdCardProps` and wire `onClick={() => url && window.open(url, "_blank")}` with `cursor-pointer` on the Card. The EngagementBar and its child dialogs use `e.stopPropagation()` to avoid triggering navigation.

---

### Technical Details

**CommunityAccountsTab inline ad banner:**
```tsx
<Card 
  className="p-2.5 bg-gradient-to-r from-yellow-50 to-orange-50 border-orange-200 overflow-hidden cursor-pointer active:scale-[0.98] transition-transform touch-manipulation"
  onClick={() => window.open("https://example.com/architect-services", "_blank")}
>
  <div className="flex items-center justify-between gap-2 text-xs">
    <span className="min-w-0 truncate">Need an <strong>Architect</strong> for your Dream-Project?</span>
    <span className="text-red-600 text-xs font-semibold shrink-0">Click Here!</span>
  </div>
</Card>
```

**PremiumAdCard -- standard layout media area:**
```tsx
{/* Clickable media + content area */}
<div onClick={handleCTA} className="cursor-pointer">
  {/* Media section */}
  ...
  {/* Headline + Description */}
  ...
</div>
{/* Non-clickable footer (engagement bar, close) with stopPropagation */}
```

**PremiumAdCard -- compact layout:**
```tsx
<div onClick={handleCTA} className="cursor-pointer flex gap-3 items-start">
  {/* Media Thumbnail */}
  ...
  {/* Title and Advertiser */}
  ...
</div>
```

**AdCard:**
```tsx
interface AdCardProps {
  image?: string;
  content?: string;
  timeRemaining?: string;
  url?: string;  // NEW
}

<Card 
  className="p-4 col-span-3 bg-muted/30 space-y-3 cursor-pointer active:scale-[0.98] transition-transform touch-manipulation"
  onClick={() => url && window.open(url, "_blank")}
>
```

### Summary

| File | Change |
|------|--------|
| CommunityAccountsTab.tsx | Add onClick + cursor-pointer to inline ad Card |
| PremiumAdCard.tsx | Make standard/compact layout media+content area clickable via handleCTA |
| AdCard.tsx | Add optional `url` prop, wire onClick to Card |

### Files Modified
1. `src/components/community/finance/CommunityAccountsTab.tsx`
2. `src/components/PremiumAdCard.tsx`
3. `src/components/AdCard.tsx`

