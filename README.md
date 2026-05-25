# Mobigate

Mobigate is a mobile-first social, commerce and rewards platform built around the **Mobi** in-app currency. It blends social networking (Posts, Wall Status, Gifts, Communities), a merchant ecosystem (Bulk & Retail Merchants, Vouchers), quizzes and games, advertising, and an admin control plane — all in one Progressive Web experience designed for phones first.

---

## Tech Stack

- **React 18** + **TypeScript 5**
- **Vite 5** for builds and dev server
- **Tailwind CSS v3** with a semantic design-token system (HSL tokens in `src/index.css` + `tailwind.config.ts`)
- **shadcn/ui** primitives (Radix UI under the hood)
- **React Router** for client-side routing
- **TanStack Query** for async state
- **PHP backend** (existing) — the React app integrates with PHP-rendered data via `window.*` bridge variables (e.g. `window.__USER_PROFILE__`)

---

## Project Structure

```
src/
  components/      Reusable UI (cards, dialogs, drawers, selectors)
    admin/         Admin-only controls (multi-sig protected actions)
    chat/          Messaging UI
    common/        Cross-cutting widgets (AudiencePrivacySelector, LegalCopyrightAcceptance, …)
    media/         Media gallery, player, viewer
    merchant/      Bulk & Retail merchant flows
    monetization/  Eligibility cards, fee notices
    profile/       Profile sections, edit dialogs
  data/            Static config & policy modules (monetizationPolicy, platformSettings, …)
  hooks/           Custom React hooks (useWindowData, useChat, …)
  pages/           Route-level screens
  types/           Global TS types (window bridge, posts, …)
public/            Static assets served as-is
```

---

## Key Domain Concepts

- **Currency**: `Mobi` (M) — base rate 1 Mobi = 1 NGN (₦). All money is shown with full figures and 2 decimals (e.g. `₦150,000.00`).
- **Merchants**: *Bulk Merchants* (major) and *Retail Merchants* (sub-merchants).
- **Wallets**: 3-wallet model — Mobi Wallet, NGN Wallet, Sundry Wallet — with Buy/Sell spreads to block voucher arbitrage.
- **Security**: 4-admin multi-signature protocol for sensitive actions (Admin-1 solo, or 2 + 3 + 4 together).
- **Monetisation gating**: Posts can be monetised only when a user meets Friend/Follower/Following thresholds and is Verified.
- **Audience privacy**: Posts can target Public, Friends, Other Connections, Private, or a Custom allow-list, with an optional exclude-list.

---

## UI / UX Guidelines

- **Mobile-first**: target 360px viewport. Sheets/drawers use `92dvh` instead of desktop layouts. Metadata restacks vertically on small screens.
- **Design tokens**: never hard-code colors — always use semantic tokens from `index.css` / `tailwind.config.ts` (HSL).
- **Form UX**: numeric inputs clamp on `onBlur`, never `onChange`.
- **Performance**: define sub-components outside main functions to prevent mobile keyboard focus loss.
- **Printing**: never use `window.print()` on mobile — use jsPDF + html2canvas.

---

## Local Development

Requires **Node 18+** (Node 20 recommended).

```sh
# 1. Install dependencies
npm install

# 2. Start the dev server (http://localhost:5173)
npm run dev

# 3. Production build
npm run build

# 4. Preview the production build locally
npm run preview
```

### Environment

The React app reads the PHP API base URL from `VITE_API_URL` (defaults to `/api` when unset). Most pages additionally hydrate from `window.__*__` variables injected server-side by PHP — when running in pure dev mode, mock fallbacks in `src/data/*` are used.

---

## Deployment

The frontend is built into static assets (`dist/`) and served by the existing PHP backend. Build with `npm run build` and ship the `dist/` directory alongside the PHP application.

---

## License

Proprietary — © Mobigate. All rights reserved.
