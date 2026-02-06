

# Mobile Optimization: Financial Accreditation Member Cards

## Problems Identified

From the screenshot on a ~360px mobile screen:

1. **Right margin clipping**: The "View Details" buttons are cut off on the right edge. This is caused by cumulative padding: main container (8px) + Card wrapper (12px) + member item (12px) = 32px per side, leaving only ~296px for actual content
2. **Buttons appear inactive**: The yellow "View Details" button on the yellow member card background has poor contrast, making it look disabled/inactive
3. **Horizontal cramming**: Row 2 tries to fit status badge + cleared count + "View Details" button all in one row, which overflows

## Solution

Restructure the member cards in `FinancialAccreditationTab.tsx` with a fully restacked vertical layout optimized for narrow mobile screens.

---

## File to Modify

| File | What Changes |
|------|-------------|
| `src/components/community/finance/FinancialAccreditationTab.tsx` | Restructure member cards for mobile |

---

## Changes in Detail

### Member Card Restructure (lines 70-133)

**Current layout** (horizontal, causes clipping):
```text
Row 1: [Avatar] [Name + Registration]
Row 2: [Badge] [X/Y cleared]  ......  [View Details]  <-- clips here
```

**New layout** (vertical, mobile-safe):
```text
Row 1: [Avatar] [Name]
                [Registration]
Row 2: [Badge "Pending"]  [6/7 items cleared]
Row 3: [====== View Details (full-width button) ======]
```

Specific changes:

1. **Reduce card padding**: From `p-3` to `p-2.5` to reclaim horizontal space
2. **Reduce card parent padding**: From `p-3` to `p-2` on the wrapping Card
3. **Row 2 becomes status-only**: Remove the button from the badge row. Show badge and cleared count text, no button competing for space
4. **Row 3 is a full-width button**: "View Details" becomes its own full-width row at the bottom of the card. This eliminates any possibility of right-edge clipping
5. **Fix button contrast**: 
   - Pending cards: Use a dark foreground button (e.g., `bg-amber-700 text-white`) instead of yellow-on-yellow
   - Accredited cards: Use a green outline button with visible border
6. **Reduce gap between rows**: From `space-y-2.5` to `space-y-2` for compactness
7. **Text sizes**: Ensure all text meets the minimum `text-xs` (12px) standard per project typography rules

This restacking pattern follows the existing `mobile-list-item-restacking` convention used in Member Requests, Content entries, and Candidate Clearance cards.
