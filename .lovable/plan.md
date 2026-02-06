

# Mobile Optimization: Financial Overview/Wallet Drawer

## Problem

The Financial Overview drawer clips content on the right edge on mobile (~360px screens). The screenshots show:

1. **"Withdraw" button text cut off** on the right side of the 3-column quick action buttons
2. **Expenses card amounts clipped** on the right margin (e.g., "-N28,000" partially visible)
3. **Cumulative padding overload**: The drawer uses `px-4` (16px each side = 32px) on the content wrapper, plus card internal padding `p-3`/`p-4` (another 12-16px each side), consuming ~56-64px of a 360px viewport = only ~296px for actual content

Additionally, the `WalletWithdrawDialog` still uses a plain `Dialog` instead of the mobile `Drawer` pattern, and multiple components have `text-[9px]` and `text-[10px]` instances that violate the project's minimum `text-xs` (12px) standard.

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/community/finance/FinancialOverviewDialog.tsx` | Reduce outer padding, fix typography, add touch feedback |
| `src/components/community/finance/WalletWithdrawDialog.tsx` | Convert to mobile Drawer pattern, reduce padding |
| `src/components/common/DualCurrencyDisplay.tsx` | Upgrade `text-[10px]` to `text-xs` in sm variant |
| `src/components/community/QuizWalletDrawer.tsx` | Reduce padding, fix all `text-[9px]`/`text-[10px]` to `text-xs` |

## Detailed Changes

### 1. FinancialOverviewDialog.tsx -- Reclaim horizontal space and fix typography

**Content wrapper (line 460):**
- Change `px-4` to `px-2` on the inner content div -- saves 16px total horizontal space

**Wallet card badges (lines 93, 142):**
- Change `text-[10px]` to `text-xs` on the "Main Wallet" and "Quiz Wallet" badge labels

**"Last updated" text (lines 128, 173):**
- Change `text-[10px]` to `text-xs`

**Quiz Wallet Available/Reserved labels (lines 161, 167):**
- Change `text-[10px]` to `text-xs`

**Quick Action buttons (lines 208-221):**
- Add `touch-manipulation active:scale-[0.98]` to all three buttons (Top Up, Transfer, Withdraw)
- These are the 3-column buttons visible in the screenshot

**Monthly Summary cards (lines 224-260):**
- Change `text-[10px]` on Mobi amounts (lines 236-238, 254-256) to `text-xs`
- Change `text-[10px]` on "This month" labels (lines 239, 257) to `text-xs`

**Transaction list items (lines 269-301):**
- Change `text-[10px]` on transaction dates (line 284) to `text-xs`
- Change `text-[10px]` on status badges (line 296) to `text-xs`

**Quiz Wallet Transaction items (lines 416-450):**
- Change `text-[10px]` on dates (line 424) to `text-xs`
- Change `text-[9px]` on player name badges (line 428) to `text-xs`
- Change `text-[9px]` on Mobi amounts (line 445) to `text-xs`

**Quiz Wallet Quick Stats (lines 337-372):**
- Change `text-[10px]` labels (lines 340, 349, 358) to `text-xs`
- Change `text-[9px]` Mobi amounts (lines 344, 353, 367-368) to `text-xs`

**Quiz availability text (lines 319-320):**
- Change `text-[10px]` to `text-xs`

### 2. WalletWithdrawDialog.tsx -- Convert to mobile Drawer pattern

Currently uses a plain `Dialog` on all screen sizes, which doesn't provide the bottom-drawer experience on mobile.

**Changes:**
- Import `Drawer`, `DrawerContent`, `DrawerHeader`, `DrawerTitle` from `@/components/ui/drawer`
- Import `useIsMobile` from `@/hooks/use-mobile`
- Wrap content in a shared `Content` component (same pattern as `WalletTransferDialog`)
- On mobile: render as `Drawer` with `max-h-[92vh]`, bottom sheet
- On desktop: keep existing `Dialog`
- Add `touch-manipulation` to all interactive elements (buttons, inputs)
- Reduce internal padding from `p-4` to `p-3` on cards within the flow

### 3. DualCurrencyDisplay.tsx -- Fix minimum typography

**sm variant Mobi text (line 71):**
- Change `text-[10px]` to `text-xs` in the `mobiSizeClasses.sm` entry
- This fixes the secondary currency text size across all components that use `DualCurrencyDisplay` with `size="sm"`, including the transaction list in the Financial Overview

### 4. QuizWalletDrawer.tsx -- Reduce padding and fix typography

**Body padding (line 87):**
- Change `p-4` to `px-2 py-4` -- saves 16px horizontal space

**Balance card Available/Reserved labels (lines 100, 105):**
- Change `text-[10px]` to `text-xs`

**Balance card Mobi amounts (lines 102, 107):**
- Change `text-[9px]` to `text-xs`

**Quick Stats labels (lines 137, 141, 145):**
- Change `text-[10px]` to `text-xs`

**Transfer warning text (line 204):**
- Change `text-[10px]` to `text-xs`

**Transaction history items (lines 255-261):**
- Change `text-[9px]` on badge (line 255) to `text-xs`
- Change `text-[10px]` on player name (line 257) to `text-xs`
- Change `text-[10px]` on date/reference (line 260) to `text-xs`

**Transaction amount Mobi display (lines 268-269):**
- Change `text-[9px]` to `text-xs`

## Space Savings Summary

| Area | Before | After | Saved |
|------|--------|-------|-------|
| Content wrapper px | 16px each side | 8px each side | 16px total |
| Quiz drawer body px | 16px each side | 8px each side | 16px total |
| **Total reclaimed** | | | **16px per drawer** |

On a 360px screen, this means content goes from ~296px usable to ~312px usable -- enough to prevent the "Withdraw" button and expense amounts from clipping.

## Technical Notes

- The `WalletWithdrawDialog` conversion follows the exact same `isMobile ? Drawer : Dialog` pattern already established in `WalletTransferDialog` and `WalletTopUpDialog`
- Typography upgrades from `text-[9px]`/`text-[10px]` to `text-xs` (12px) follow the project's established minimum readability standard
- No structural layout changes to grids -- the padding reduction alone provides sufficient horizontal space
- All touch targets already meet 44px minimum; we're adding `touch-manipulation` for faster response

