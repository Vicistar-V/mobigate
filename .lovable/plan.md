

## Highlighted Winners Carousel Adjustments

Three changes to the carousel cards in `HighlightedWinnersCarousel.tsx`:

### 1. Reduce button padding
The "Join Fans" button currently has `py-2.5` which is too generous. Change to `py-1` so the button hugs the text content without wasted space.

### 2. Reduce image border-radius by 50%
The image container currently uses `rounded-2xl` (1rem / 16px). Reduce to `rounded-lg` (0.5rem / 8px) -- roughly 50% less curve.

### 3. Make image slightly bigger
Increase from `h-[72px] w-[72px]` to `h-[82px] w-[82px]`.

### Technical Details

**File:** `src/components/community/mobigate-quiz/HighlightedWinnersCarousel.tsx`

- **Line 123:** Change `h-[72px] w-[72px] rounded-2xl` to `h-[82px] w-[82px] rounded-lg`
- **Line 147:** Change `py-2.5 rounded-xl` to `py-1 rounded-lg`

No other text, layout, or functionality changes.

