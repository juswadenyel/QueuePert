// queueService.js
// QueuePert – CIT-U Queue Management System
// Service layer: all queue data fetching, mutations, and real-time helpers

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// ─── Ticket / Queue ────────────────────────────────────────────────────────────

export async function requestTicket(serviceType, studentInfo) {
  const res = await fetch(`${API_BASE}/queue/request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ serviceType, ...studentInfo }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function fetchQueueState() {
  const res = await fetch(`${API_BASE}/queue/state`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function trackTicket(ticketNumber) {
  const res = await fetch(`${API_BASE}/queue/track/${encodeURIComponent(ticketNumber)}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function callNextTicket(counterId) {
  const res = await fetch(`${API_BASE}/queue/next`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ counterId }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function resolveTicket(ticketNumber, resolution) {
  const res = await fetch(`${API_BASE}/queue/resolve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ticketNumber, resolution }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function setCounterStatus(status) {
  const res = await fetch(`${API_BASE}/queue/counter/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ counterId, status }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export async function fetchDailyStats() {
  const res = await fetch(`${API_BASE}/queue/stats/daily`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// ─── Real-time (SSE) ──────────────────────────────────────────────────────────

export function subscribeToQueue(onUpdate, onError) {
  const es = new EventSource(`${API_BASE}/queue/stream`);
  es.addEventListener('queue-update', (e) => {
    try { onUpdate(JSON.parse(e.data)); } catch (err) { onError?.(err); }
  });
  es.onerror = (err) => onError?.(err);
  return () => es.close();
}

export function subscribeToTicket(ticketNumber, onUpdate) {
  const es = new EventSource(
    `${API_BASE}/queue/stream/ticket/${encodeURIComponent(ticketNumber)}`
  );
  es.addEventListener('ticket-update', (e) => {
    try { onUpdate(JSON.parse(e.data)); } catch (err) { onError?.(err); }
  });
  es.onerror = (err) => onError?.(err);
  return () => es.close();
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function formatWait(minutes) {
  if (minutes === 0) return 'Now';
  if (minutes < 60) return `~${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `~${h} hr` : `~${h} hr ${m} min`;
}

export const SERVICE_LABELS = {
  registrar: 'Registrar',
  cashier:   'Cashier',
  guidance:  'Guidance & Counseling',
  osas:      'OSAS / Scholarships',
  it:        'IT Support',
};

export const SERVICE_PREFIX = {
  registrar: 'A',
  cashier:   'B',
  guidance:  'C',
  osas:      'D',
  it:        'E',
};

// Colors aligned with styles.css — maroon #7A1E2C, gold #C9A227
export const COUNTER_STATUS_CONFIG = {
  open:   { label: 'Serving',   color: '#7A1E2C' },
  break:  { label: 'On Break',  color: '#C9A227' },
  closed: { label: 'Closed',    color: '#888'    },
};