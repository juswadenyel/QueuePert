// QueueTracker.jsx
// QueuePert – CIT-U Queue Management System
// Student-facing: track your ticket position in real time

import React, { useState, useEffect, useRef } from 'react';
import { trackTicket, subscribeToTicket, formatWait, SERVICE_LABELS } from './queueService';
import '../assets/styles.css';

// ─── Status helpers ───────────────────────────────────────────────────────────
function getStatusLabel(status) {
  return { waiting:'In Queue', next:"You're Next!", serving:'Now Serving', done:'Completed' }[status] || 'In Queue';
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
      unsubRef.current = subscribeToTicket(ticket, setData, () => {});
    } catch {
      // Demo fallback
      const prefix = ticket[0];
      const num    = parseInt(ticket.slice(2)) || 50;
      const pos    = Math.max(1, Math.floor(Math.random() * 5) + 1);
      const svcKey = { A:'registrar', B:'cashier', C:'guidance', D:'osas', E:'it' }[prefix] || 'registrar';
      setData({
        ticketNumber:     ticket,
        serviceType:      svcKey,
        counterLabel:     `Counter · ${SERVICE_LABELS[svcKey] || svcKey}`,
        position:         pos,
        totalAhead:       pos - 1,
        estimatedWait:    pos * 4,
        status:           pos === 1 ? 'next' : 'waiting',
        issuedAt:         '10:30 AM',
        currentlyServing: `${prefix}-${String(num - pos).padStart(3, '0')}`,
      });
    } finally {
      setLoading(false);
    }
  }

  const pct = data ? getProgressPct(data.position, data.totalAhead) : 0;

  return (
    <div className="login-page">

      {/* ── Navbar ── */}
      <div className="navbar">
        <div className="logo">QueuePert</div>
        <div className="nav-buttons">
          <span style={{ fontSize: '13px', color: '#3a1800', fontWeight: '600' }}>
            Queue Tracker
          </span>
        </div>
      </div>

      <main style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '40px 24px', gap: '24px', width: '100%',
      }}>

        {/* ── Search box ── */}
        <div className="containerLogin" style={{ width: '100%', maxWidth: '480px' }}>
          <h1>Track Your Ticket</h1>
          <p className="description">Enter the ticket number shown on your queue slip.</p>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <input
              type="text"
              placeholder="e.g. A-048"
              value={input}
              maxLength={6}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleTrack()}
              style={{ flex: 1, textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '1px' }}
            />
            <button
              className="action-btn"
              onClick={handleTrack}
              disabled={loading}
              style={{ width: 'auto', padding: '0 22px', margin: 0 }}
            >
              {loading ? 'Searching…' : 'Track'}
            </button>
          </div>

          {error && (
            <p style={{ color: '#7A1E2C', fontSize: '13px', marginTop: '8px' }}>⚠ {error}</p>
          )}
        </div>

        {/* ── Loading ── */}
        {loading && (
          <div className="container" style={{ maxWidth: '480px', textAlign: 'center' }}>
            <p className="description">Looking up your ticket…</p>
          </div>
        )}

        {/* ── Result ── */}
        {!loading && data && (
          <div className="containerPriority" style={{ maxWidth: '480px', textAlign: 'left' }}>

            {/* Status banner */}
            <div style={{
              background: '#C9A227', margin: '-35px -35px 20px -35px',
              padding: '20px 28px', borderRadius: '15px 15px 0 0',
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            }}>
              <div>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#3a1800', marginBottom: '4px' }}>
                  Ticket Number
                </div>
                <div style={{ fontSize: '42px', fontWeight: 'bold', color: '#000', lineHeight: 1, letterSpacing: '-1px' }}>
                  {data.ticketNumber}
                </div>
                <div style={{ fontSize: '11px', color: '#7A1E2C', textTransform: 'uppercase', marginTop: '4px', fontWeight: 'bold' }}>
                  {SERVICE_LABELS[data.serviceType] || data.serviceType}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{
                  display: 'inline-block', padding: '4px 12px', borderRadius: '20px',
                  fontSize: '11px', textTransform: 'uppercase', fontWeight: 'bold',
                  background: '#7A1E2C', color: '#fff',
                }}>
                  {getStatusLabel(data.status)}
                </span>
                {data.status !== 'done' && (
                  <>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#000', marginTop: '6px', lineHeight: 1 }}>
                      {data.position === 1 ? '1st' : `#${data.position}`}
                    </div>
                    <div style={{ fontSize: '10px', color: '#7a5c00', textTransform: 'uppercase' }}>in queue</div>
                  </>
                )}
              </div>
            </div>

            {/* Progress bar */}
            {data.status !== 'done' && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{ height: '8px', background: 'rgba(122,30,44,0.12)', borderRadius: '4px', overflow: 'hidden', marginBottom: '6px' }}>
                  <div style={{
                    height: '100%', width: `${pct}%`,
                    background: 'linear-gradient(90deg, #7A1E2C, #C9A227)',
                    borderRadius: '4px', transition: 'width 1s ease',
                  }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#888', textTransform: 'uppercase' }}>
                  <span>Waiting</span>
                  <span>Your turn</span>
                </div>
              </div>
            )}

            {/* Detail rows */}
            {[
              { label: 'Counter',           value: data.counterLabel },
              { label: 'Currently Serving', value: data.currentlyServing },
              { label: 'People Ahead',      value: data.totalAhead },
              { label: 'Estimated Wait',    value: data.estimatedWait <= 1 ? 'Almost your turn!' : `~${data.estimatedWait} min`, hi: data.estimatedWait <= 5 },
              { label: 'Ticket Issued At',  value: data.issuedAt },
            ].map(row => (
              <div
                key={row.label}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '9px 0', borderBottom: '1px solid rgba(0,0,0,0.08)', fontSize: '13px',
                }}
              >
                <span style={{ color: '#555' }}>{row.label}</span>
                <span style={{ fontWeight: 'bold', color: row.hi ? '#7A1E2C' : '#000' }}>{row.value}</span>
              </div>
            ))}

            {/* Live indicator */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '14px' }}>
              <div style={{
                width: '7px', height: '7px', borderRadius: '50%', background: '#7A1E2C',
                animation: 'livePulse 2s infinite',
              }} />
              <span style={{ fontSize: '10px', color: '#7A1E2C', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 'bold' }}>
                Updates in real time
              </span>
            </div>
          </div>
        )}

        {/* ── Empty state ── */}
        {!loading && !data && !error && (
          <div className="container" style={{ maxWidth: '480px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>🎫</div>
            <p className="description">
              Enter your ticket number above to see your current position and estimated wait time.
            </p>
          </div>
        )}

      </main>

      <style>{`@keyframes livePulse { 0%,100%{opacity:1} 50%{opacity:0.25} }`}</style>
    </div>
  );
}