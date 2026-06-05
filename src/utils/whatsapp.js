/**
 * whatsapp.js — Centralized WhatsApp logic
 *
 * RULES:
 *  - ONE phone number, defined once here
 *  - No duplicate wa.me links anywhere in the codebase
 *  - Behavior: pre-filled message only — NO automation
 */

// ⚠️  UPDATE BEFORE GO-LIVE: replace with your production WhatsApp Business number
// Format: country code + number, no spaces or +  (e.g. "447911123456" for UK)
const WA_PHONE = "15617108214";

const CONTACT_MESSAGE = (match, teams) =>
  `Hi, I saw the listing on Ticketeer for "${match}" (${teams}) and I'm interested in buying. Is it still available?`;

/**
 * Sends a seller registration notification to the owner via WhatsApp.
 * Returns true if the window.open call was made (best-effort indicator).
 * Called from the Register page after seller form submission.
 */
export function sendSellerRegistrationWhatsApp(data) {
  const msg = `🎫 *New Seller Registration — Ticketeer*

*Full Name:* ${data.fullName}
*Email:* ${data.email}
*Phone:* ${data.phone}
*Location / Country:* ${data.location}

*Ticket Match:* ${data.teams}
*Match Date:* ${data.matchDate}
*Seat / Section:* ${data.seat}
*Asking Price (USD):* $${data.price}
*Additional Info:* ${data.notes || "N/A"}

⚠️ Awaiting manual review and approval before listing goes live.`;

  const url = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(msg)}`;
  const win = window.open(url, "_blank", "noopener,noreferrer");
  // Returns false if popup was blocked or user had no chance to send
  return win !== null;
}

/**
 * Opens WhatsApp for a buyer interested in a specific listing.
 * Called from: MatchCard, TicketDetail
 */
export function openContactWhatsApp(matchLabel, teamsLabel) {
  const msg = CONTACT_MESSAGE(matchLabel, teamsLabel);
  const url = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(msg)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

export { WA_PHONE };
