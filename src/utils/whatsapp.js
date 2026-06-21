/**
 * contact.js (formerly whatsapp.js) — Centralized contact logic
 *
 * RULES:
 *  - Seller registration notifications → Facebook Messenger (site owner inbox)
 *  - Buyer→seller contact → per-seller contactUrl (Telegram or WhatsApp)
 *  - Amara Traoré buyer contact → WhatsApp (her personal number)
 *  - No duplicate links anywhere in the codebase
 */

const WA_PHONE       = "15617108214";    // Amara Traoré's WhatsApp (buyer contact only)
const MESSENGER_PAGE = "Getticketeer";   // Facebook page username

const CONTACT_MESSAGE = (match, teams) =>
  `Hi, I saw the listing on Ticketeer for "${match}" (${teams}) and I'm interested in buying. Is it still available?`;

/**
 * Sends a seller registration notification to the owner via Facebook Messenger.
 * Returns true if the window.open call was made (best-effort indicator).
 * Called from SellerForm after seller form submission.
 */
export function sendSellerRegistrationMessenger(data) {
  // Messenger doesn't support pre-filled ?text= params (unlike WhatsApp/Telegram).
  // We store the formatted submission in sessionStorage so SellerForm can display
  // it for the site owner to copy, then open the Messenger inbox for the alert.
  const summary = `🎫 New Seller Registration — Ticketeer\n\nFull Name: ${data.fullName}\nEmail: ${data.email}\nPhone: ${data.phone}\nLocation / Country: ${data.location}\n\nTicket Match: ${data.teams}\nMatch Date: ${data.matchDate}\nSeat / Section: ${data.seat}\nAsking Price (USD): $${data.price}\nAdditional Info: ${data.notes || "N/A"}\n\n⚠️ Awaiting manual review and approval before listing goes live.`;

  try { sessionStorage.setItem("ticketeer_last_submission", summary); } catch {}

  const win = window.open(`https://m.me/${MESSENGER_PAGE}`, "_blank", "noopener,noreferrer");
  return win !== null;
}

// Keep old name as alias so any missed references don't crash
export const sendSellerRegistrationWhatsApp = sendSellerRegistrationMessenger;

/**
 * Opens WhatsApp for a buyer — only used for Amara Traoré's listing
 * (the one seller whose contactUrl is a wa.me link).
 * Called from: MatchCard, TicketDetail, FeaturedMatches
 */
export function openContactWhatsApp(matchLabel, teamsLabel) {
  const msg = CONTACT_MESSAGE(matchLabel, teamsLabel);
  const url = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(msg)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

export { WA_PHONE };
