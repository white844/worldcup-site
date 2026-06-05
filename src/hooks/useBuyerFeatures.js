/**
 * useWishlist — Buyer can star/save matches
 *
 * Persists to localStorage. Returns:
 *   savedIds      — Set<matchId>
 *   toggle(id)    — add or remove
 *   isSaved(id)   — boolean
 *   savedMatches  — filtered from allMatches
 */
import { useState, useCallback, useMemo, useRef } from "react";
import { toast } from "../components/Toast";

const WISHLIST_KEY = "ticketeer_wishlist";

function loadWishlist() {
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch { return new Set(); }
}

function saveWishlist(set) {
  try { localStorage.setItem(WISHLIST_KEY, JSON.stringify([...set])); } catch {}
}

export function useWishlist(allMatches = []) {
  const [savedIds, setSavedIds] = useState(loadWishlist);

  const toggle = useCallback((matchId, matchLabel) => {
    setSavedIds(prev => {
      const next = new Set(prev);
      if (next.has(matchId)) {
        next.delete(matchId);
        toast({ type: "info", message: `Removed from wishlist` });
      } else {
        next.add(matchId);
        toast({ type: "success", message: `★ Saved: ${matchLabel ?? "match"}` });
      }
      saveWishlist(next);
      return next;
    });
  }, []);

  const isSaved = useCallback((id) => savedIds.has(id), [savedIds]);

  const savedMatches = useMemo(
    () => allMatches.filter(m => savedIds.has(m.id)),
    [allMatches, savedIds]
  );

  return { savedIds, toggle, isSaved, savedMatches };
}

/**
 * usePriceAlerts — Buyer sets a max price per match.
 * When a listing drops below the alert price, a toast fires.
 *
 * Persists to localStorage. Returns:
 *   alerts         — Map<matchId, maxPrice>
 *   setAlert(id, price) — set or clear alert
 *   checkAlerts(matches) — call when prices change (e.g. on schedule tick)
 *
 * NOTE: `fired` is stored in a ref (not state) so checkAlerts stays stable
 * across renders and doesn't re-trigger the Marketplace useEffect on every tick.
 */

const ALERTS_KEY = "ticketeer_price_alerts";

function loadAlerts() {
  try {
    const raw = localStorage.getItem(ALERTS_KEY);
    return raw ? new Map(JSON.parse(raw)) : new Map();
  } catch { return new Map(); }
}

function saveAlerts(map) {
  try { localStorage.setItem(ALERTS_KEY, JSON.stringify([...map])); } catch {}
}

export function usePriceAlerts() {
  const [alerts, setAlertsState] = useState(loadAlerts);
  // useRef instead of useState so mutations don't recreate checkAlerts on every tick
  const firedRef = useRef(new Set());

  const setAlert = useCallback((matchId, maxPrice) => {
    setAlertsState(prev => {
      const next = new Map(prev);
      if (maxPrice === null || maxPrice === undefined) {
        next.delete(matchId);
        toast({ type: "info", message: "Price alert removed" });
      } else {
        next.set(matchId, Number(maxPrice));
        toast({ type: "success", message: `🔔 Alert set — notify when below $${maxPrice}` });
      }
      saveAlerts(next);
      return next;
    });
    // Reset fired state for this match so the alert can fire again after being updated
    firedRef.current.delete(matchId);
  }, []);

  const getAlert = useCallback((matchId) => alerts.get(matchId) ?? null, [alerts]);

  // Stable reference — only depends on alerts (Map), not on a fired Set in state
  const checkAlerts = useCallback((matches) => {
    if (alerts.size === 0) return;
    matches.forEach(m => {
      const maxPrice = alerts.get(m.id);
      if (maxPrice === undefined) return;
      if (m.price <= maxPrice && !firedRef.current.has(m.id)) {
        toast({
          type: "success",
          message: `🔔 Price alert: ${m.homeRaw} vs ${m.awayRaw} is now $${m.price} (below your $${maxPrice} alert)`,
        });
        firedRef.current.add(m.id);
      }
    });
  }, [alerts]);

  return { alerts, setAlert, getAlert, checkAlerts };
}
