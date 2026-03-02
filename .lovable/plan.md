
# Add Distribution Channels with Manual Recharge PIN Flow

## Overview
Add 4 new distribution channels to the "Distribute Vouchers" page (step 7). Each channel sends voucher PINs to recipients via a different method, and recipients must manually recharge the PIN themselves. Each channel gets its own input form drawer and a simulated send flow.

## New Distribution Channels
1. **Send to Someone's Email** -- enter recipient email + voucher amount, "send" the PIN
2. **Send to Someone's Mobi-Chat** -- search/select a Mobigate user + voucher amount
3. **Send to Someone's WhatsApp** -- enter phone number + voucher amount, opens WhatsApp-style share
4. **Send to Someone's Telephone (SMS)** -- enter phone number + voucher amount, sends via SMS

## Changes

### 1. Update Step Type and State (BuyVouchersPage.tsx)
- Extend the `Step` type to include 4 new steps: `"sendEmail"`, `"sendMobiChat"`, `"sendWhatsApp"`, `"sendSMS"`
- Add state for each channel's form fields (email address, phone number, selected amount, etc.)
- Add handlers for navigating to each channel and processing the "send"

### 2. Add 4 New Channel Cards to the Distribute Step (BuyVouchersPage.tsx)
Insert between "Mobigate Friends" and "Use Remaining for Myself" in `renderDistributeStep`:
- **Email** card with Mail icon (blue)
- **Mobi-Chat** card with MessageCircle icon (primary)
- **WhatsApp** card with MessageCircle icon (green)
- **SMS** card with Phone icon (orange)

Each card navigates to its respective step.

### 3. Create Send-via-Channel Render Functions (BuyVouchersPage.tsx)
Each channel renders a full-screen mobile form with:
- Sticky header with back button and channel name
- Balance banner (same as existing distribute step)
- **Recipient input** (email field / Mobigate user search / phone field)
- **Amount input** with quick-amount buttons (M100, M500, M1000, M5000)
- **Voucher PIN preview** area showing the PIN(s) that will be sent
- A note: "Recipient will need to manually recharge this PIN"
- **Send button** (disabled until valid recipient + amount > 0)

After sending:
- Loading spinner (3s simulated)
- Success screen showing: channel icon, recipient info, amount sent, and a reminder that "Recipient must recharge the PIN manually using the Redeem Voucher feature"
- "Continue" button returns to the distribute step with updated balance

### 4. Manual Recharge Note
Each channel's success screen includes a clearly visible info box:
- "The voucher PIN has been sent. The recipient must enter it manually in the 'Redeem Voucher' section to credit their wallet."

## Technical Details

### File: `src/pages/BuyVouchersPage.tsx`
- Step type becomes: `"vouchers" | "countries" | "merchants" | "payment" | "processing" | "success" | "distribute" | "sendToUsers" | "sendEmail" | "sendMobiChat" | "sendWhatsApp" | "sendSMS" | "redeemPin" | "redeemProcessing" | "redeemSuccess"`
- New state variables: `channelRecipient` (string), `channelAmount` (number), `channelSending` (boolean), `channelSent` (boolean)
- Each channel re-uses the same simulated send flow: set loading, wait 3-4s, show success, deduct from `remainingMobi`, add to `transfers`
- Mock PIN generation: 16-digit random numeric string displayed in the success screen
- For Mobi-Chat: reuse existing `mockFriends` data for user selection
- For WhatsApp/SMS: phone number input with `inputMode="tel"`
- For Email: email input with `inputMode="email"`
- Import `Mail`, `Phone`, `MessageCircle` icons from lucide-react (most already imported)
- Back navigation from any channel step returns to `"distribute"`
- All forms follow mobile-first 360px design with touch-manipulation, active:scale, and proper input sizing
