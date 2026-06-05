# Tickteering — Project Notes

## Overview
Tickteering is a static React (Vite) resale marketplace for World Cup 2026 tickets.
There is no backend. All listings live in `src/data/index.js`.
Sellers submit via a registration form → WhatsApp message to the site owner for manual review.

---

## Architecture

### Pages
| Route | File | Title |
|---|---|---|
| `/` | `src/pages/Homepage.jsx` | Tickteering \| World Cup 2026 Tickets |
| `/marketplace` | `src/pages/Marketplace.jsx` | Browse Tickets \| Tickteering … |
| `/marketplace/:matchId` | `src/pages/TicketDetail.jsx` | [Team A] vs [Team B] \| Tickteering … |
| `/register` | `src/pages/Register.jsx` | Sign Up \| Tickteering … |
| `*` | `src/pages/NotFound.jsx` | Page Not Found \| Tickteering … |

All pages set `document.title` via `useEffect` and restore it on unmount.

### Components
- `Navbar` — sticky top bar; Sign Up + Sell Your Ticket CTAs; mobile drawer
- `Footer` — all links wired to real routes or hash sections (no dead `href="#"`)
- `SellModal` — intercepts sell intent; routes user to `/register?role=seller`
- `Logo` — brand name "T I C K T E E R I N G" with letter-spacing
- `PageShell` — wraps Navbar + Footer around page content

### Data
- All listings: `src/data/index.js` → `ALL_MATCHES` array
- To add a new approved listing: add an entry to `ALL_MATCHES` and redeploy

---

## Registration System (`src/pages/Register.jsx`)

### Buyer role
- Fields: name + email only (no password, no backend auth)
- On submit: clears any stale seller draft from `sessionStorage`, shows success screen
- Purpose: email capture for listing notifications

### Seller role
- Fields: personal info (name, email, phone, location) + ticket details (match, teams, date, seat, price, notes)
- Draft auto-saved to `sessionStorage` key `tickteering_seller_draft` on every keystroke
- Draft cleared only after seller confirms the WhatsApp was sent
- On submit: all fields sanitised (control chars removed, whitespace normalised), then `sendSellerRegistrationWhatsApp()` called
- Flow: form → **pending screen** (WhatsApp opens) → user confirms sent → success screen
- "Reopen WhatsApp" button debounced 5 s to prevent duplicate windows
- Seller is NOT listed until manual approval by owner

### `SignUpNudgeBanner`
- Exported from `Register.jsx`, rendered on both Homepage and Marketplace
- Two CTAs: "Create Free Account" → `/register?role=buyer`; "Sell a Ticket" → `/register?role=seller`

---

## WhatsApp (`src/utils/whatsapp.js`)

| Function | Purpose |
|---|---|
| `sendSellerRegistrationWhatsApp(data)` | Sends owner a formatted seller registration message |
| `openContactWhatsApp(match, teams)` | Opens buyer enquiry for a specific listing |

Phone number defined **once** as `WA_PHONE`. No other files should hardcode a wa.me URL.

---

## Branding Rules
- Site name: **T I C K T E E R I N G** (letter-spaced, always from `<Logo />`)
- Site title: **Tickteering | World Cup 2026 Tickets**
- Colour scheme: navy/blue primary, red accent — defined in `src/tokens.js`
- **Banned phrases** (must never appear in UI copy):
  - "no fake listings ever" / "no fakes"
  - "WhatsApp submissions only"
  - Any copy implying tickets are submitted via WhatsApp

---

## iOS / Mobile Notes
- Seller form date input: `width: 100%; min-width: 0` prevents Safari clip in grid columns
- All grids use `className="wc26-reg-grid"` with a media query collapsing to 1-col below 520 px
- Navbar collapses to hamburger drawer below 760 px

---

## What Was Removed
- `src/context/AuthContext.jsx` — deleted (unused)
- `openSellWhatsApp()` from whatsapp.js — deleted (was opening blank WA with no message)
- All "5,000+ sellers", "WhatsApp submissions only", "No fake listings" copy

---

## Deployment
This is a plain Vite + React project. To deploy:

```bash
npm install
npm run build
# dist/ folder is the deployable output
```

Set `<title>Tickteering | World Cup 2026 Tickets</title>` in `index.html` (the JS title hooks override per page, but `index.html` is the fallback before JS loads).

---

_Last updated: v3 — registration system, branding cleanup, 404 page, wired footer links, page titles_
