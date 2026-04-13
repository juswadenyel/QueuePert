// queueService.js
// QueuePert – CIT-U Queue Management System
// Service layer: all queue data fetching, mutations, and real-time helpers

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// ─── Ticket / Queue ────────────────────────────────────────────────────────────

/**
 * Request a new queue ticket for a given service counter.
 * @param {string} serviceType  e.g. 'registrar' | 'cashier' | 'guidance' | 'osas' | 'it'
 * @param {object} studentInfo  { studentId, name, email, purpose }
 * @returns {Promise<{ ticketNumber, position, estimatedWait, counterLabel }>}
 */
export async function requestTicket(serviceType, studentInfo) {
  const res = await fetch(`${API_BASE}/queue/request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ serviceType, ...studentInfo }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

/**
 * Fetch the current live queue state for all counters.
 * @returns {Promise<Counter[]>}
 *   Counter: { id, label, serviceType, status, currentTicket, queue: Ticket[] }
 */
export async function fetchQueueState() {
  const res = await fetch(`${API_BASE}/queue/state`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

/**
 * Fetch position + estimated wait for a single ticket.
 * @param {string} ticketNumber  e.g. 'A-047'
 * @returns {Promise<{ ticketNumber, position, estimatedWait, status, counterLabel }>}
 */
export async function trackTicket(ticketNumber) {
  const res = await fetch(`${API_BASE}/queue/track/${encodeURIComponent(ticketNumber)}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

/**
 * Admin: call the next ticket at a given counter.
 * @param {string} counterId
 * @returns {Promise<{ calledTicket, nextTicket, remainingCount }>}
 */
export async function callNextTicket(counterId) {
  const res = await fetch(`${API_BASE}/queue/next`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ counterId }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

/**
 * Admin: mark a ticket as done / no-show.
 * @param {string} ticketNumber
 * @param {'done'|'noshow'} resolution
 */
export async function resolveTicket(ticketNumber, resolution) {
  const res = await fetch(`${API_BASE}/queue/resolve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ticketNumber, resolution }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

/**
 * Admin: open or close a counter.
 * @param {string} counterId
 * @param {'open'|'break'|'closed'} status
 */
export async function setCounterStatus(counterId, status) {
  const res = await fetch(`${API_BASE}/queue/counter/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ counterId, status }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// ─── Analytics ────────────────────────────────────────────────────────────────

/**
 * Fetch daily summary stats.
 * @returns {Promise<{ totalServed, avgWaitMinutes, peakHour, countersOpen }>}
 */
export async function fetchDailyStats() {
  const res = await fetch(`${API_BASE}/queue/stats/daily`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// ─── Real-time (WebSocket / SSE) ──────────────────────────────────────────────

/**
 * Subscribe to live queue updates via Server-Sent Events.
 * Returns a cleanup function — call it to close the connection.
 *
 * @param {function} onUpdate  Called with the latest queue state on every update
 * @param {function} onError   Called on connection error
 * @returns {function}         Cleanup / unsubscribe
 *
 * @example
 *   const unsub = subscribeToQueue(setState, console.error);
 *   // later:
 *   unsub();
 */
export function subscribeToQueue(onUpdate, onError) {
  const es = new EventSource(`${API_BASE}/queue/stream`);

  es.addEventListener('queue-update', (e) => {
    try {
      onUpdate(JSON.parse(e.data));
    } catch (err) {
      onError?.(err);
    }
  });

  es.onerror = (err) => {
    onError?.(err);
  };

  return () => es.close();
}

/**
 * Subscribe to updates for a specific ticket number.
 * Useful in QueueTracker so the student gets notified when their turn is near.
 *
 * @param {string}   ticketNumber
 * @param {function} onUpdate
 * @param {function} onError
 * @returns {function} cleanup
 */
export function subscribeToTicket(ticketNumber, onUpdate, onError) {
  const es = new EventSource(
    `${API_BASE}/queue/stream/ticket/${encodeURIComponent(ticketNumber)}`
  );

  es.addEventListener('ticket-update', (e) => {
    try {
      onUpdate(JSON.parse(e.data));
    } catch (err) {
      onError?.(err);
    }
  });

  es.onerror = (err) => onError?.(err);

  return () => es.close();
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Format estimated wait in minutes to a human label. */
export function formatWait(minutes) {
  if (minutes === 0) return 'Now';
  if (minutes < 60) return `~${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `~${h} hr` : `~${h} hr ${m} min`;
}

/** Map a serviceType key to a display label. */
export const SERVICE_LABELS = {
  registrar: 'Registrar',
  cashier: 'Cashier',
  guidance: 'Guidance & Counseling',
  osas: 'OSAS / Scholarships',
  it: 'IT Support',
};

/** Map a serviceType to its ticket prefix letter. */
export const SERVICE_PREFIX = {
  registrar: 'A',
  cashier: 'B',
  guidance: 'C',
  osas: 'D',
  it: 'E',
};

/** Counter status display config. */
export const COUNTER_STATUS_CONFIG = {
  open:   { label: 'Serving',  color: '#4ade80' },
  break:  { label: 'On Break', color: '#f59e0b' },
  closed: { label: 'Closed',   color: '#9a6a5a' },
};