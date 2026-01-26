
# Simplified Campaign Royalty System for Admin Dashboard

## Understanding the Requirement

The Admin Dashboard currently shows too much analytics (views, clicks, feedback stats) that are not necessary for community admins. What's actually needed is a focused **Candidates' Campaign Royalty** section that shows:

1. The **community's share** of each candidate's campaign fees (the "royalty")
2. Each candidate has different campaign parameters (audience reach, duration), so royalties vary
3. Records tied to each candidate's campaign

---

## Current Components Analysis

| Component | Current Purpose | Keep/Simplify |
|-----------|----------------|---------------|
| `AdminCampaignsTab.tsx` | Campaign management with status stats + fee summary | Simplify - Remove aggregate fee summary card |
| `CampaignRoyaltySection.tsx` | Aggregate totals + per-candidate list | Simplify - Focus only on Community Royalty |
| `CampaignRoyaltyDetailSheet.tsx` | Full detail with analytics | Simplify - Remove Campaign Performance section |
| `AdminElectionSection.tsx` | Uses CampaignRoyaltySection | Keep as-is (integration point) |

---

## Proposed Changes

### 1. Simplify CampaignRoyaltySection.tsx

**Remove:**
- Total Fees stat card (line 56-61)
- Mobigate share stat card (line 70-77)
- Distribution Ratio Card with "Configure" button (lines 80-104)

**Keep:**
- Community Royalty Total (prominently displayed)
- Per-candidate royalty list with clear breakdown

**New Layout:**
```text
┌─────────────────────────────────────────┐
│  📊 Community Campaign Royalties        │
│  ─────────────────────────────────────  │
│  Total Earned: M8,502 (≈ ₦8,502)       │
│  From 4 paid campaigns                  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 👤 Chief Adebayo Okonkwo                │
│    President • 21 days                  │
│    Royalty: M2,550 (60% of M4,250)      │
│    Audiences: Community, Members, Global│
│                                    [>]  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 👤 Dr. Amina Bello                      │
│    Vice President • 14 days             │
│    Royalty: M1,404 (60% of M2,340)      │
│    Audiences: Community, Marketplace    │
│                                    [>]  │
└─────────────────────────────────────────┘
```

---

### 2. Simplify CampaignRoyaltyDetailSheet.tsx

**Remove:**
- Campaign Performance section (lines 204-227) with Views, Clicks, Feedback stats
- These are analytics that belong to the candidate's dashboard, not admin

**Keep:**
- Candidate Info card
- Campaign Parameters (duration, dates, audiences, tagline)
- Fee Breakdown (base fee, audience premium, total)
- Royalty Distribution (Community Share vs Mobigate Share)
- Payment timestamp
- Campaign ID

---

### 3. Simplify AdminCampaignsTab.tsx

**Remove:**
- Fee Summary Card (lines 145-167) - duplicates CampaignRoyaltySection data

**Keep:**
- Stats Row (Active/Draft/Paused/Ended counts) - useful for management
- Campaign list with status management actions
- Views/Endorsements stats in cards - these are for the candidate's benefit

---

### 4. Add Unique Parameters Display Per Candidate

Each candidate card in the royalty list will clearly show:
- Selected audience targets (Community Only, Members, Global, etc.)
- Campaign duration (days)
- Fee calculation: `Total Fee × 60% = Community Royalty`
- Payment date

This emphasizes that royalties vary based on candidate's choices.

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/admin/election/CampaignRoyaltySection.tsx` | Remove aggregate stats, simplify to Community Royalty focus |
| `src/components/admin/election/CampaignRoyaltyDetailSheet.tsx` | Remove Campaign Performance analytics section |
| `src/components/admin/election/AdminCampaignsTab.tsx` | Remove Fee Summary Card (already shown in Royalties section) |

---

## Mobile-First UI Considerations

- All cards remain touch-friendly with h-10+ targets
- Per-candidate royalty cards show stacked layout for clear reading
- Audience badges wrap properly on small screens
- Community royalty amount is prominently displayed in green

---

## Technical Details

### Royalty Calculation (Already Implemented)
```typescript
// Each candidate's royalty is calculated based on their chosen parameters:
communityShare = totalFeeInMobi * (communityPercentage / 100)
// Default: 60% to Community, 40% to Mobigate

// Example:
// Candidate A: 21 days + 3 audiences = M4,250 total → M2,550 royalty
// Candidate B: 7 days + 1 audience = M1,000 total → M600 royalty
```

### Data Flow (Unchanged)
```text
mockEnhancedCampaigns → CampaignRoyaltySection → CampaignRoyaltyDetailSheet
                     ↓
           Filter: paymentStatus === "paid"
                     ↓
           Display: communityShare per candidate
```

---

## Summary

This simplification:
1. Removes redundant aggregate analytics from Admin view
2. Focuses on **Community Campaign Royalties** - what admins actually need to see
3. Keeps per-candidate detail showing how their unique parameters affected the royalty
4. Removes campaign performance stats (Views/Clicks/Feedback) from admin detail view - those belong to candidates
5. Maintains mobile-first responsive design throughout
