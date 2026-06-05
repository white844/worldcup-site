import { useMemo } from "react";

// Deterministic seed from a match ID string — same output every render,
// stable across filter changes, matches TicketDetail's own useMatchUrgency.
function seedFrom(id) {
  return id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
}

export function useUrgency(matches) {
  return useMemo(() =>
    matches.map(m => {
      const s = seedFrom(m.id);
      return { tickets: (s % 7) + 1, viewers: (s % 48) + 12 };
    }),
  [matches]);
}
