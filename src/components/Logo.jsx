import { Link } from "react-router-dom";
import { TicketeerWordmark } from "./TicketeerLogo";

export default function Logo({ dark = false }) {
  return (
    <Link
      to="/"
      style={{
        display: "flex",
        alignItems: "center",
        textDecoration: "none",
        flexShrink: 0,
      }}
    >
      <TicketeerWordmark height={38} dark={dark} />
    </Link>
  );
}
