
## Plan: Restack Winners Tab Cards for Mobile

### Problems Identified
1. Highlight button is just a star icon -- needs text "Highlight" and a confirmation dialog
2. Winner avatar shows initials instead of actual images (data has `playerAvatar` URLs)
3. Duplicate currency display -- "NN6,000,000" shown redundantly
4. Card layout wastes space with side-by-side elements that could stack better on mobile
5. Share button is tiny and easy to miss

### Changes (all in `src/pages/MerchantPage.tsx`, WinnersTab function)

**1. Replace initials avatar with actual image**
- Use `winner.playerAvatar` in an `<img>` tag with rounded-lg (square-rounded) styling instead of the initials circle

**2. Restack winner card layout for mobile (3-row pattern)**
- Row 1: Position icon + Avatar image + Name + Payout badge
- Row 2: Location, Prize amount (single currency, no duplication), Score
- Row 3: Tier badge, fans, followers, date, Highlight button, Share button

**3. Add "Highlight" button with text + confirmation**
- Replace the star-only icon button with a visible button showing star icon + "Highlight" text
- When highlighted, show "Highlighted" with filled star
- Add an `AlertDialog` confirmation before toggling: "Highlight Winner? This will feature them in the quiz carousel."

**4. Fix duplicate currency**
- Use single format: "NN6,000,000" with the Naira symbol only once (remove redundant formatLocalAmount that adds extra symbol)

**5. Consolidate share button inline with highlight**
- Place Share and Highlight buttons side by side in Row 3 as compact pill buttons

### Technical Details

- Add `AlertDialog` imports (already available in the project)
- Add state for `highlightConfirmWinner: SeasonWinner | null` to manage the confirmation dialog
- Use `<img src={winner.playerAvatar} className="h-11 w-11 rounded-lg object-cover" />` for real photos
- Remove the absolute-positioned star button, replace with inline "Highlight"/"Highlighted" button in the metadata row
- Single currency format: remove the NN prefix duplication, use `formatLocalAmount(winner.prizeAmount, "NGN")` only once with proper prefix
