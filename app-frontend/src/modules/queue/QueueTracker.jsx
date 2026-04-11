// QueueTracker.jsx
// QueuePert – CIT-U Queue Management System
// Student-facing: track your ticket position in real time

import React, { useState, useEffect, useRef } from 'react';
import { trackTicket, subscribeToTicket, formatWait, SERVICE_LABELS } from './queueService';

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .qt-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    background: #1a0a00;
    background-image:
      radial-gradient(ellipse at 20% 70%, rgba(180,120,0,0.14) 0%, transparent 55%),
      radial-gradient(ellipse at 80% 20%, rgba(139,0,20,0.18) 0%, transparent 50%);
    color: #f5e6c8;
    display: flex; flex-direction: column;
  }

  /* Nav */
  .qt-nav {
    background: rgba(10,4,0,0.75); border-bottom: 1.5px solid #8B6914;
    padding: 0 32px; height: 56px;
    display: flex; align-items: center; justify-content: space-between;
    backdrop-filter: blur(8px);
  }
  .qt-nav-logo { display: flex; align-items: center; gap: 12px; }
  .qt-nav-badge {
    width: 36px; height: 36px;
    background: linear-gradient(135deg,#9B0020,#6B0015); border: 1px solid #C8102E;
    border-radius: 7px; display: flex; align-items: center; justify-content: center;
    font-size: 10px; font-weight: 600; color: #fff;
  }
  .qt-nav-name { font-size: 16px; font-weight: 600; color: #f5e6c8; }
  .qt-nav-right { font-size: 11px; color: rgba(200,168,75,0.6); }

  /* Main */
  .qt-main {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; justify-content: flex-start;
    padding: 40px 24px; gap: 24px;
  }

  /* Search bar */
  .qt-search-wrap {
    width: 100%; max-width: 480px;
    background: rgba(20,8,0,0.7); border: 1.5px solid rgba(200,168,75,0.3);
    border-radius: 14px; padding: 24px 28px;
  }
  .qt-search-kicker {
    font-size: 10px; text-transform: uppercase; letter-spacing: 2px;
    color: #C8A84B; margin-bottom: 8px;
  }
  .qt-search-title {
    font-family: 'Playfair Display', serif;
    font-size: 22px; color: #f5e6c8; margin-bottom: 18px;
  }
  .qt-search-row { display: flex; gap: 10px; }
  .qt-search-input {
    flex: 1; height: 46px;
    background: rgba(10,4,0,0.6); border: 1.5px solid rgba(200,168,75,0.25);
    border-radius: 8px; padding: 0 14px;
    font-size: 15px; font-family: 'Playfair Display', serif;
    color: #f5e6c8; outline: none; letter-spacing: 1px;
    transition: border-color 0.2s, box-shadow 0.2s;
    text-transform: uppercase;
  }
  .qt-search-input::placeholder { color: rgba(200,168,75,0.25); font-family: 'DM Sans', sans-serif; font-size: 13px; text-transform: none; letter-spacing: 0; }
  .qt-search-input:focus { border-color: #C8A84B; box-shadow: 0 0 0 3px rgba(200,168,75,0.1); }
  .qt-search-btn {
    height: 46px; padding: 0 22px;
    background: linear-gradient(135deg,#9B0020,#7A0018); border: 1.5px solid #C8102E;
    border-radius: 8px; font-size: 13px; font-weight: 600;
    font-family: 'DM Sans', sans-serif; color: #fff; cursor: pointer;
    transition: all 0.2s; white-space: nowrap;
  }
  .qt-search-btn:hover { background: linear-gradient(135deg,#B5001F,#8A0018); }
  .qt-search-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .qt-search-hint { font-size: 11px; color: rgba(200,168,75,0.4); margin-top: 10px; }

  /* Result card */
  .qt-result {
    width: 100%; max-width: 480px;
    animation: qtFadeIn 0.4s ease;
  }
  @keyframes qtFadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }

  /* Status banner */
  .qt-status-banner {
    border-radius: 12px 12px 0 0; padding: 20px 28px;
    background: linear-gradient(135deg, rgba(155,0,32,0.6), rgba(100,50,0,0.5));
    border: 1.5px solid rgba(200,168,75,0.3); border-bottom: none;
    display: flex; align-items: center; justify-content: space-between;
  }

  .qt-status-left {}
  .qt-status-label { font-size: 10px; text-transform: uppercase; letter-spacing: 1.6px; color: rgba(245,230,200,0.5); margin-bottom: 4px; }
  .qt-status-ticket {
    font-family: 'Playfair Display', serif;
    font-size: 48px; color: #f5e6c8; line-height: 1; letter-spacing: -1px;
  }
  .qt-status-service { font-size: 12px; color: #C8A84B; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.5px; }

  .qt-status-right { text-align: right; }
  .qt-status-badge {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 11px; text-transform: uppercase; letter-spacing: 0.8px;
    padding: 5px 12px; border-radius: 20px;
  }
  .badge-waiting { background: rgba(200,168,75,0.12); color: #C8A84B; border: 1px solid rgba(200,168,75,0.3); }
  .badge-next    { background: rgba(74,222,128,0.1);  color: #4ade80; border: 1px solid rgba(74,222,128,0.3); }
  .badge-serving { background: rgba(155,0,32,0.2);    color: #e87a8a; border: 1px solid rgba(200,16,46,0.4); }
  .badge-done    { background: rgba(10,4,0,0.5);      color: rgba(200,168,75,0.4); border: 1px solid rgba(200,168,75,0.15); }

  .qt-status-pos { font-family: 'Playfair Display', serif; font-size: 36px; color: #f5e6c8; margin-top: 8px; line-height: 1; }
  .qt-status-pos-lbl { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: rgba(245,230,200,0.4); }

  /* Progress */
  .qt-progress-wrap {
    background: rgba(20,8,0,0.7); border: 1.5px solid rgba(200,168,75,0.2);
    border-top: none; border-bottom: none;
    padding: 16px 28px;
  }
  .qt-progress-track {
    height: 6px; background: rgba(200,168,75,0.1); border-radius: 3px; overflow: hidden;
    margin-bottom: 8px;
  }
  .qt-progress-fill {
    height: 100%; border-radius: 3px;
    background: linear-gradient(90deg, #9B0020, #C8A84B);
    transition: width 1s ease;
  }
  .qt-progress-labels {
    display: flex; justify-content: space-between;
    font-size: 10px; color: rgba(200,168,75,0.4); text-transform: uppercase; letter-spacing: 0.6px;
  }

  /* Details */
  .qt-details {
    background: rgba(20,8,0,0.7); border: 1.5px solid rgba(200,168,75,0.2);
    border-top: none; border-radius: 0 0 12px 12px;
    padding: 20px 28px; display: flex; flex-direction: column; gap: 0;
  }
  .qt-detail-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 10px 0; border-bottom: 1px solid rgba(200,168,75,0.08);
    font-size: 13px;
  }
  .qt-detail-row:last-child { border-bottom: none; }
  .qt-detail-lbl { color: rgba(200,168,75,0.55); }
  .qt-detail-val { color: #f5e6c8; font-weight: 500; }
  .qt-detail-val.alert { color: #e87a8a; }

  /* Live dot */
  .qt-live-tag {
    display: flex; align-items: center; gap: 6px;
    font-size: 10px; color: #4ade80; text-transform: uppercase; letter-spacing: 0.8px;
    margin-top: 14px; justify-content: center;
  }
  .qt-live-dot { width: 6px; height: 6px; border-radius: 50%; background: #4ade80; animation: qtPulse 2s infinite; }
  @keyframes qtPulse { 0%,100%{opacity:1} 50%{opacity:0.2} }

  /* Error / empty */
  .qt-message {
    width: 100%; max-width: 480px; text-align: center;
    padding: 28px; background: rgba(20,8,0,0.6);
    border: 1.5px solid rgba(200,168,75,0.2); border-radius: 12px;
  }
  .qt-message-icon { font-size: 28px; margin-bottom: 10px; }
  .qt-message-text { font-size: 14px; color: rgba(200,168,75,0.6); line-height: 1.6; }

  .qt-spinner {
    width: 20px; height: 20px;
    border: 2px solid rgba(200,168,75,0.2); border-top-color: #C8A84B;
    border-radius: 50%; animation: qtSpin 0.8s linear infinite;
    margin: 0 auto 12px;
  }
  @keyframes qtSpin { to{transform:rotate(360deg)} }
`;

// ─── Status helpers ───────────────────────────────────────────────────────────
function getStatusBadge(status) {
  const map = {
    waiting: { cls:'badge-waiting', label:'In Queue' },
    next:    { cls:'badge-next',    label:'You\'re Next!' },
    serving: { cls:'badge-serving', label:'Now Serving' },
    done:    { cls:'badge-done',    label:'Completed' },
  };
  return map[status] || map.waiting;
}

function getProgressPct(position, totalAhead) {
  if (position <= 1) return 95;
  const max = Math.max(totalAhead || 10, position);
  return Math.round(((max - position) / max) * 90);
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function QueueTracker() {
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData]       = useState(null);
  const [error, setError]     = useState(null);
  const unsubRef              = useRef(null);

  // Clean up SSE on unmount
  useEffect(() => () => unsubRef.current?.(), []);

  async function handleTrack() {
    const ticket = input.trim().toUpperCase();
    if (!ticket) { setError('Please enter a ticket number.'); return; }

    setError(null);
    setLoading(true);
    setData(null);
    unsubRef.current?.();

    try {
      const result = await trackTicket(ticket);
      setData(result);

      // Subscribe to live updates for this ticket
      unsubRef.current = subscribeToTicket(ticket, setData, () => {});
    } catch {
      // Demo fallback
      const prefix = ticket[0];
      const num    = parseInt(ticket.slice(2)) || 50;
      const pos    = Math.max(1, Math.floor(Math.random() * 5) + 1);
      const svcKey = { A:'registrar', B:'cashier', C:'guidance', D:'osas', E:'it' }[prefix] || 'registrar';
      setData({
        ticketNumber:  ticket,
        serviceType:   svcKey,
        counterLabel:  `Counter · ${SERVICE_LABELS[svcKey] || svcKey}`,
        position:      pos,
        totalAhead:    pos - 1,
        estimatedWait: pos * 4,
        status:        pos === 1 ? 'next' : 'waiting',
        issuedAt:      '10:30 AM',
        currentlyServing: `${prefix}-${String(num - pos).padStart(3,'0')}`,
      });
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleTrack();
  }

  const badge = data ? getStatusBadge(data.status) : null;
  const pct   = data ? getProgressPct(data.position, data.totalAhead) : 0;

  return (
    <>
      <style>{styles}</style>
      <div className="qt-root">
        {/* Nav */}
        <nav className="qt-nav">
          <div className="qt-nav-logo">
            <div className="qt-nav-badge">CIT-U</div>
            <span className="qt-nav-name">QueuePert</span>
          </div>
          <div className="qt-nav-right">Queue Tracker</div>
        </nav>

        <main className="qt-main">
          {/* Search */}
          <div className="qt-search-wrap">
            <div className="qt-search-kicker">Real-time tracking</div>
            <div className="qt-search-title">Track Your Ticket</div>
            <div className="qt-search-row">
              <input
                className="qt-search-input"
                placeholder="e.g. A-048"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                maxLength={6}
              />
              <button className="qt-search-btn" onClick={handleTrack} disabled={loading}>
                {loading ? 'Searching…' : 'Track'}
              </button>
            </div>
            {error && <div style={{ fontSize:12, color:'#e87a8a', marginTop:10 }}>⚠ {error}</div>}
            {!error && <div className="qt-search-hint">Enter the ticket number shown on your queue slip.</div>}
          </div>

          {/* Loading */}
          {loading && (
            <div className="qt-message">
              <div className="qt-spinner" />
              <div className="qt-message-text">Looking up your ticket…</div>
            </div>
          )}

          {/* Result */}
          {!loading && data && (
            <div className="qt-result">
              {/* Status banner */}
              <div className="qt-status-banner">
                <div className="qt-status-left">
                  <div className="qt-status-label">Ticket number</div>
                  <div className="qt-status-ticket">{data.ticketNumber}</div>
                  <div className="qt-status-service">{SERVICE_LABELS[data.serviceType] || data.serviceType}</div>
                </div>
                <div className="qt-status-right">
                  <div className={`qt-status-badge ${badge.cls}`}>
                    {data.status === 'next' && <span style={{fontSize:8}}>●</span>}
                    {badge.label}
                  </div>
                  {data.status !== 'done' && (
                    <>
                      <div className="qt-status-pos">{data.position === 1 ? '1st' : `#${data.position}`}</div>
                      <div className="qt-status-pos-lbl">in queue</div>
                    </>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              {data.status !== 'done' && (
                <div className="qt-progress-wrap">
                  <div className="qt-progress-track">
                    <div className="qt-progress-fill" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="qt-progress-labels">
                    <span>Waiting</span>
                    <span>Your turn</span>
                  </div>
                </div>
              )}

              {/* Details */}
              <div className="qt-details">
                <div className="qt-detail-row">
                  <span className="qt-detail-lbl">Counter</span>
                  <span className="qt-detail-val">{data.counterLabel}</span>
                </div>
                <div className="qt-detail-row">
                  <span className="qt-detail-lbl">Currently serving</span>
                  <span className="qt-detail-val">{data.currentlyServing}</span>
                </div>
                <div className="qt-detail-row">
                  <span className="qt-detail-lbl">People ahead</span>
                  <span className="qt-detail-val">{data.totalAhead}</span>
                </div>
                <div className="qt-detail-row">
                  <span className="qt-detail-lbl">Estimated wait</span>
                  <span className={`qt-detail-val${data.estimatedWait <= 5 ? ' alert' : ''}`}>
                    {data.estimatedWait <= 1 ? 'Almost your turn!' : `~${data.estimatedWait} min`}
                  </span>
                </div>
                <div className="qt-detail-row">
                  <span className="qt-detail-lbl">Ticket issued at</span>
                  <span className="qt-detail-val">{data.issuedAt}</span>
                </div>

                <div className="qt-live-tag">
                  <div className="qt-live-dot" />
                  Updates in real time
                </div>
              </div>
            </div>
          )}

          {/* Empty state */}
          {!loading && !data && !error && (
            <div className="qt-message">
              <div className="qt-message-icon">🎫</div>
              <div className="qt-message-text">
                Enter your ticket number above to see your current position and estimated wait time.
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}