// QueueDisplay.jsx
// QueuePert – CIT-U Queue Management System
// Public display board — shown on monitors in waiting areas

import React, { useState, useEffect } from 'react';
import { fetchQueueState, subscribeToQueue, formatWait, COUNTER_STATUS_CONFIG } from './queueService';
import '../assets/styles.css';

// ─── Mock fallback data ────────────────────────────────────────────────────────
const MOCK_STATE = {
  counters: [
    { id:'c1', label:'Counter 01 · Registrar',  serviceType:'registrar', status:'open',   currentTicket:'A-047', serviceLabel:'Enrollment / OTR' },
    { id:'c2', label:'Counter 02 · Cashier',    serviceType:'cashier',   status:'open',   currentTicket:'B-022', serviceLabel:'Tuition & Fees' },
    { id:'c3', label:'Counter 03 · Guidance',   serviceType:'guidance',  status:'open',   currentTicket:'C-011', serviceLabel:'Counseling' },
    { id:'c4', label:'Counter 04 · OSAS',       serviceType:'osas',      status:'break',  currentTicket:null,    serviceLabel:'Scholarships' },
    { id:'c5', label:'Counter 05 · IT Support', serviceType:'it',        status:'closed', currentTicket:null,    serviceLabel:'Tech Assistance' },
  ],
  queue: [
    { ticketNumber:'A-048', serviceLabel:'Enrollment',  waitMinutes: 2,  position: 1 },
    { ticketNumber:'A-049', serviceLabel:'OTR Request', waitMinutes: 6,  position: 2 },
    { ticketNumber:'A-050', serviceLabel:'Enrollment',  waitMinutes: 10, position: 3 },
    { ticketNumber:'A-051', serviceLabel:'Document',    waitMinutes: 14, position: 4 },
  ],
  stats: { inQueue: 34, servedToday: 142, avgWait: 4, openCounters: 3, totalCounters: 5, clearTime: '2:40 PM' },
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function QueueDisplay() {
  const [state, setState]   = useState(MOCK_STATE);
  const [clock, setClock]   = useState('');
  const [dateStr, setDate]  = useState('');
  const [popMap, setPopMap] = useState({});

  // Clock tick
  useEffect(() => {
    function tick() {
      const now = new Date();
      const pad = n => String(n).padStart(2, '0');
      setClock(`${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`);
      const days   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      setDate(`${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`);
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Live data
  useEffect(() => {
    let unsub;
    fetchQueueState()
      .then(s => setState(s))
      .catch(() => {});

    unsub = subscribeToQueue(
      (update) => {
        setState(prev => {
          const pops = {};
          update.counters?.forEach(c => {
            const prev_c = prev.counters?.find(p => p.id === c.id);
            if (prev_c && prev_c.currentTicket !== c.currentTicket) pops[c.id] = Date.now();
          });
          if (Object.keys(pops).length) setPopMap(p => ({ ...p, ...pops }));
          return update;
        });
      },
      () => {}
    );

    return () => unsub?.();
  }, []);

  const { counters, queue, stats } = state;

  return (
    <div className="dashboard-page">

      {/* ── Navbar ── */}
      <div className="navbar">
        <div className="logo">QueuePert</div>
        <div className="nav-buttons">
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#000', letterSpacing: '1px' }}>
              {clock}
            </div>
            <div style={{ fontSize: '10px', color: '#3a1800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {dateStr}
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-wrapper">

        {/* ── Now Serving ── */}
        <div style={{ width: '100%', maxWidth: '1000px' }}>
          <h1 style={{ fontSize: '14px', color: '#000', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Now Serving
          </h1>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '14px' }}>
            {counters.map(c => {
              const cfg = COUNTER_STATUS_CONFIG[c.status] || COUNTER_STATUS_CONFIG.closed;
              const isPopping = popMap[c.id] && (Date.now() - popMap[c.id] < 600);
              return (
                <div key={c.id} className="panel" style={{ padding: '16px', textAlign: 'center' }}>
                  {/* Status badge */}
                  <span style={{
                    display: 'inline-block', padding: '2px 10px', borderRadius: '20px',
                    fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.8px',
                    marginBottom: '8px',
                    background: c.status === 'open'   ? 'rgba(122,30,44,0.12)'
                              : c.status === 'break'  ? 'rgba(201,162,39,0.2)'
                              : 'rgba(0,0,0,0.08)',
                    color:      c.status === 'open'   ? '#7A1E2C'
                              : c.status === 'break'  ? '#7a5c00'
                              : '#888',
                    border: `1px solid ${
                              c.status === 'open'  ? 'rgba(122,30,44,0.35)'
                            : c.status === 'break' ? 'rgba(201,162,39,0.4)'
                            : 'rgba(0,0,0,0.12)'}`,
                  }}>
                    {cfg.label}
                  </span>

                  {/* Counter ID */}
                  <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.8px', color: '#7A1E2C', marginBottom: '6px' }}>
                    {c.label}
                  </div>

                  {/* Ticket number */}
                  <div
                    className={isPopping ? 'pop-anim' : ''}
                    style={{
                      fontSize: '42px', fontWeight: 'bold', lineHeight: 1,
                      color: c.status === 'open' ? '#7A1E2C' : 'rgba(0,0,0,0.18)',
                    }}
                  >
                    {c.currentTicket || '—'}
                  </div>

                  {/* Service label */}
                  <div style={{ fontSize: '11px', color: '#555', marginTop: '6px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                    {c.serviceLabel}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Queue list + Stats ── */}
        <div className="main-row">

          {/* Upcoming queue */}
          <div className="panel" style={{ flex: 1 }}>
            <h1 style={{ fontSize: '13px', color: '#000', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              Upcoming · Registrar (A)
            </h1>
            {queue.map((t, i) => (
              <div
                key={t.ticketNumber}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 14px', borderRadius: '8px', marginBottom: '8px',
                  background: i === 0 ? 'rgba(122,30,44,0.1)' : 'rgba(0,0,0,0.04)',
                  border: `1px solid ${i === 0 ? 'rgba(122,30,44,0.3)' : 'rgba(0,0,0,0.07)'}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#7A1E2C' }}>
                    {t.ticketNumber}
                  </span>
                  <span style={{
                    fontSize: '9px', padding: '2px 8px', borderRadius: '20px',
                    background: i === 0 ? 'rgba(122,30,44,0.18)' : 'rgba(0,0,0,0.07)',
                    color: i === 0 ? '#7A1E2C' : '#888',
                  }}>
                    {i === 0 ? 'Next' : `#${t.position}`}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', color: '#7A1E2C', textTransform: 'uppercase' }}>{t.serviceLabel}</div>
                  <div style={{ fontSize: '10px', color: '#999' }}>{formatWait(t.waitMinutes)}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="panel" style={{ flex: 1 }}>
            <h1 style={{ fontSize: '13px', color: '#000', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              Today's Summary
            </h1>
            {[
              { label: 'In Queue Now',    value: stats.inQueue,                      hi: true },
              { label: 'Served Today',    value: stats.servedToday },
              { label: 'Avg Wait Time',   value: `${stats.avgWait} min` },
              { label: 'Counters Open',   value: `${stats.openCounters} / ${stats.totalCounters}` },
              { label: 'Est. Clear Time', value: stats.clearTime },
            ].map(s => (
              <div
                key={s.label}
                className="stat-box"
                style={{
                  width: '100%', height: 'auto', padding: '10px 16px', marginBottom: '8px',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}
              >
                <span style={{ fontSize: '11px', color: '#333' }}>{s.label}</span>
                <span style={{ fontSize: '22px', fontWeight: 'bold', color: s.hi ? '#7A1E2C' : '#000' }}>
                  {s.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Notice Ticker ── */}
        <div style={{
          width: '100%', maxWidth: '1000px',
          background: '#C9A227', borderRadius: '10px',
          padding: '10px 20px', display: 'flex', alignItems: 'center',
          gap: '16px', overflow: 'hidden',
        }}>
          <span style={{
            fontSize: '9px', textTransform: 'uppercase', letterSpacing: '1.2px',
            color: '#7A1E2C', fontWeight: 'bold', whiteSpace: 'nowrap',
            background: '#fff', padding: '4px 10px', borderRadius: '4px',
          }}>
            Notice
          </span>
          <span style={{ fontSize: '12px', color: '#3a1800', whiteSpace: 'nowrap', animation: 'qdMarquee 35s linear infinite' }}>
            Please have your Student ID and requirements ready before approaching the counter
            &nbsp;&nbsp;·&nbsp;&nbsp;
            Enrollment for 2nd semester is ongoing until April 18, 2026
            &nbsp;&nbsp;·&nbsp;&nbsp;
            Counter 05 (IT Support) is temporarily closed today
            &nbsp;&nbsp;·&nbsp;&nbsp;
            Scholarship applications for AY 2026–2027 are now open — inquire at OSAS (Counter 04)
          </span>
        </div>

        {/* ── Footer ── */}
        <div style={{
          width: '100%', maxWidth: '1000px',
          display: 'flex', justifyContent: 'space-between',
          fontSize: '11px', color: '#555',
        }}>
          <span>Powered by <strong>QueuePert</strong> · CIT-U Queue Management System</span>
          <span>Office hours: Mon–Fri &nbsp; 7:30 AM – 5:00 PM</span>
        </div>

      </div>

      {/* Minimal keyframes not in styles.css */}
      <style>{`
        @keyframes qdMarquee { 0%{transform:translateX(0)} 50%{transform:translateX(-40%)} 100%{transform:translateX(0)} }
        @keyframes popAnim   { 0%{transform:scale(0.8);opacity:0.4} 60%{transform:scale(1.06)} 100%{transform:scale(1);opacity:1} }
        .pop-anim { animation: popAnim 0.45s ease; }
      `}</style>
    </div>
  );
}