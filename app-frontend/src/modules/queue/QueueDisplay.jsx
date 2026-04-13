// QueueDisplay.jsx
// QueuePert – CIT-U Queue Management System
// Public display board — shown on monitors in waiting areas

import React, { useState, useEffect, useCallback } from 'react';
import { fetchQueueState, subscribeToQueue, formatWait, COUNTER_STATUS_CONFIG } from './queueService';

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .qd-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    background: #1a0a00;
    background-image:
      radial-gradient(ellipse at 20% 50%, rgba(180,120,0,0.18) 0%, transparent 60%),
      radial-gradient(ellipse at 80% 20%, rgba(139,0,20,0.22) 0%, transparent 55%);
    color: #f5e6c8;
    display: flex;
    flex-direction: column;
  }

  .qd-header {
    background: rgba(10,4,0,0.7);
    border-bottom: 2px solid #8B6914;
    padding: 14px 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    backdrop-filter: blur(8px);
  }

  .qd-logo-row { display: flex; align-items: center; gap: 14px; }

  .qd-logo-badge {
    width: 44px; height: 44px;
    background: linear-gradient(135deg, #9B0020, #6B0015);
    border: 1.5px solid #C8102E;
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 600; color: #fff; letter-spacing: 0.3px;
  }

  .qd-brand { display: flex; flex-direction: column; }
  .qd-brand-main { font-size: 18px; font-weight: 600; color: #f5e6c8; letter-spacing: 0.2px; }
  .qd-brand-sub  { font-size: 10px; color: #C8A84B; text-transform: uppercase; letter-spacing: 1.2px; margin-top: 1px; }

  .qd-header-right { display: flex; align-items: center; gap: 24px; }

  .qd-live { display: flex; align-items: center; gap: 6px; font-size: 11px; color: #4ade80; text-transform: uppercase; letter-spacing: 1px; }
  .qd-live-dot { width: 7px; height: 7px; border-radius: 50%; background: #4ade80; animation: qdPulse 2s infinite; }
  @keyframes qdPulse { 0%,100%{opacity:1} 50%{opacity:0.25} }

  .qd-clock { font-family: 'Playfair Display', serif; font-size: 26px; color: #f5e6c8; letter-spacing: 1px; }
  .qd-date  { font-size: 10px; color: #C8A84B; text-align: right; text-transform: uppercase; letter-spacing: 0.6px; margin-top: 2px; }

  .qd-body { flex: 1; padding: 28px 32px; display: flex; flex-direction: column; gap: 22px; }

  /* Section label */
  .qd-label {
    font-size: 10px; text-transform: uppercase; letter-spacing: 1.6px; color: #C8A84B;
    display: flex; align-items: center; gap: 10px; margin-bottom: 14px;
  }
  .qd-label::after { content:''; flex:1; height:1px; background: rgba(200,168,75,0.25); }

  /* Counter cards */
  .qd-counters { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; }

  .qd-counter {
    background: rgba(20,8,0,0.6);
    border: 1px solid rgba(200,168,75,0.2);
    border-radius: 12px;
    padding: 18px 20px;
    position: relative;
    overflow: hidden;
    transition: border-color 0.3s;
  }
  .qd-counter::before {
    content:''; position:absolute; top:0; left:0; right:0; height:3px;
    background: rgba(200,168,75,0.15);
  }
  .qd-counter.serving { border-color: rgba(200,168,75,0.5); }
  .qd-counter.serving::before { background: linear-gradient(90deg, #C8A84B, #9B0020); }

  .qd-counter-id { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #C8A84B; margin-bottom: 10px; }

  .qd-ticket {
    font-family: 'Playfair Display', serif;
    font-size: 44px; color: #f5e6c8; line-height: 1; letter-spacing: -1px;
  }
  .qd-counter:not(.serving) .qd-ticket { color: rgba(245,230,200,0.2); }

  .qd-service { font-size: 11px; color: rgba(200,168,75,0.7); margin-top: 6px; text-transform: uppercase; letter-spacing: 0.5px; }

  .qd-badge {
    position: absolute; top: 14px; right: 14px;
    font-size: 9px; text-transform: uppercase; letter-spacing: 0.8px;
    padding: 3px 9px; border-radius: 20px;
  }
  .badge-serving { background: rgba(74,222,128,0.12); color: #4ade80; border: 1px solid rgba(74,222,128,0.25); }
  .badge-break   { background: rgba(245,158,11,0.12); color: #f59e0b; border: 1px solid rgba(245,158,11,0.25); }
  .badge-closed  { background: rgba(100,60,40,0.3);   color: #9a7a6a; border: 1px solid rgba(100,60,40,0.5); }

  @keyframes qdPop { 0%{transform:scale(0.8);opacity:0.4} 60%{transform:scale(1.06)} 100%{transform:scale(1);opacity:1} }
  .qd-pop { animation: qdPop 0.45s ease; }

  /* Queue + stats row */
  .qd-bottom { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }

  .qd-panel {
    background: rgba(20,8,0,0.55);
    border: 1px solid rgba(200,168,75,0.18);
    border-radius: 12px;
    padding: 20px 24px;
  }

  .qd-queue-list { display: flex; flex-direction: column; gap: 8px; }

  .qd-qi {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 14px; border-radius: 8px;
    background: rgba(200,168,75,0.05);
    border: 1px solid rgba(200,168,75,0.1);
  }
  .qd-qi:first-child { border-color: rgba(200,168,75,0.35); background: rgba(200,168,75,0.1); }

  .qd-qi-num { font-family: 'Playfair Display', serif; font-size: 22px; color: #f5e6c8; }
  .qd-qi-right { display: flex; flex-direction: column; align-items: flex-end; gap: 2px; }
  .qd-qi-type  { font-size: 11px; color: #C8A84B; text-transform: uppercase; letter-spacing: 0.4px; }
  .qd-qi-wait  { font-size: 10px; color: rgba(200,168,75,0.5); }
  .qd-qi-pos   { font-size: 9px; padding: 2px 8px; border-radius: 20px; background: rgba(155,0,32,0.3); color: #e87a8a; margin-left: 10px; }
  .qd-qi:first-child .qd-qi-pos { background: rgba(200,168,75,0.25); color: #C8A84B; }

  /* Stats */
  .qd-stats { display: flex; flex-direction: column; gap: 10px; }
  .qd-stat  {
    display: flex; justify-content: space-between; align-items: center;
    padding: 12px 16px; border-radius: 8px;
    background: rgba(200,168,75,0.05); border: 1px solid rgba(200,168,75,0.1);
  }
  .qd-stat-lbl { font-size: 11px; color: rgba(200,168,75,0.7); text-transform: uppercase; letter-spacing: 0.6px; }
  .qd-stat-val { font-family: 'Playfair Display', serif; font-size: 22px; color: #f5e6c8; }
  .qd-stat.hi .qd-stat-val { color: #C8102E; }

  .qd-progress { height: 3px; background: rgba(200,168,75,0.12); border-radius: 2px; margin-top: 6px; overflow: hidden; }
  .qd-progress-fill { height: 100%; background: linear-gradient(90deg,#9B0020,#C8A84B); border-radius: 2px; transition: width 1s ease; }

  /* Ticker */
  .qd-ticker {
    background: rgba(10,4,0,0.6); border: 1px solid rgba(200,168,75,0.18);
    border-radius: 10px; padding: 12px 24px;
    display: flex; align-items: center; gap: 16px; overflow: hidden;
  }
  .qd-ticker-label { font-size: 10px; text-transform: uppercase; letter-spacing: 1.2px; color: #C8102E; white-space: nowrap; font-weight: 600; border-right: 1px solid rgba(200,168,75,0.2); padding-right: 16px; }
  .qd-ticker-text  { font-size: 12px; color: rgba(200,168,75,0.75); white-space: nowrap; animation: qdMarquee 35s linear infinite; }
  @keyframes qdMarquee { 0%{transform:translateX(0)} 50%{transform:translateX(-40%)} 100%{transform:translateX(0)} }

  .qd-footer {
    background: rgba(10,4,0,0.7); border-top: 1px solid rgba(200,168,75,0.18);
    padding: 10px 32px; display: flex; justify-content: space-between; align-items: center;
  }
  .qd-footer-brand { font-size: 11px; color: rgba(200,168,75,0.4); }
  .qd-footer-brand span { color: #C8102E; font-weight: 600; }
  .qd-footer-hours { font-size: 11px; color: rgba(200,168,75,0.35); }

  .qd-error {
    flex:1; display:flex; align-items:center; justify-content:center;
    color: rgba(200,168,75,0.5); font-size:14px;
  }
`;

// ─── Mock fallback data (used until real API connects) ─────────────────────────
const MOCK_STATE = {
  counters: [
    { id:'c1', label:'Counter 01 · Registrar',  serviceType:'registrar', status:'open',   currentTicket:'A-047', serviceLabel:'Enrollment / OTR' },
    { id:'c2', label:'Counter 02 · Cashier',    serviceType:'cashier',   status:'open',   currentTicket:'B-022', serviceLabel:'Tuition & Fees' },
    { id:'c3', label:'Counter 03 · Guidance',   serviceType:'guidance',  status:'open',   currentTicket:'C-011', serviceLabel:'Counseling' },
    { id:'c4', label:'Counter 04 · OSAS',       serviceType:'osas',      status:'break',  currentTicket:null,    serviceLabel:'Scholarships' },
    { id:'c5', label:'Counter 05 · IT Support', serviceType:'it',        status:'closed', currentTicket:null,    serviceLabel:'Tech Assistance' },
  ],
  queue: [
    { ticketNumber:'A-048', serviceLabel:'Enrollment',   waitMinutes: 2,  position: 1 },
    { ticketNumber:'A-049', serviceLabel:'OTR Request',  waitMinutes: 6,  position: 2 },
    { ticketNumber:'A-050', serviceLabel:'Enrollment',   waitMinutes: 10, position: 3 },
    { ticketNumber:'A-051', serviceLabel:'Document',     waitMinutes: 14, position: 4 },
  ],
  stats: { inQueue: 34, servedToday: 142, avgWait: 4, openCounters: 3, totalCounters: 5, clearTime: '2:40 PM' },
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function QueueDisplay() {
  const [state, setState]   = useState(MOCK_STATE);
  const [clock, setClock]   = useState('');
  const [dateStr, setDate]  = useState('');
  const [popMap, setPopMap] = useState({});
  const [error, setError]   = useState(null);

  // Clock tick
  useEffect(() => {
    function tick() {
      const now = new Date();
      const pad = n => String(n).padStart(2,'0');
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
      .catch(() => {}); // silently fall back to mock

    unsub = subscribeToQueue(
      (update) => {
        setState(prev => {
          // Detect ticket changes to trigger pop animation
          const pops = {};
          update.counters?.forEach(c => {
            const prev_c = prev.counters?.find(p => p.id === c.id);
            if (prev_c && prev_c.currentTicket !== c.currentTicket) pops[c.id] = Date.now();
          });
          if (Object.keys(pops).length) setPopMap(p => ({ ...p, ...pops }));
          return update;
        });
      },
      () => setError('Connection lost — retrying…')
    );

    return () => unsub?.();
  }, []);

  const { counters, queue, stats } = state;

  return (
    <>
      <style>{styles}</style>
      <div className="qd-root">
        {/* Header */}
        <header className="qd-header">
          <div className="qd-logo-row">
            <div className="qd-logo-badge">CIT-U</div>
            <div className="qd-brand">
              <span className="qd-brand-main">QueuePert</span>
              <span className="qd-brand-sub">Cebu Institute of Technology · University</span>
            </div>
          </div>
          <div className="qd-header-right">
            <div className="qd-live"><div className="qd-live-dot" />Live</div>
            <div>
              <div className="qd-clock">{clock}</div>
              <div className="qd-date">{dateStr}</div>
            </div>
          </div>
        </header>

        <div className="qd-body">
          {/* Now Serving */}
          <div>
            <div className="qd-label">Now serving</div>
            <div className="qd-counters">
              {counters.map(c => {
                const cfg = COUNTER_STATUS_CONFIG[c.status] || COUNTER_STATUS_CONFIG.closed;
                const isPopping = popMap[c.id] && (Date.now() - popMap[c.id] < 600);
                return (
                  <div key={c.id} className={`qd-counter${c.status === 'open' ? ' serving' : ''}`}>
                    <span className={`qd-badge badge-${c.status === 'open' ? 'serving' : c.status}`}>{cfg.label}</span>
                    <div className="qd-counter-id">{c.label}</div>
                    <div className={`qd-ticket${isPopping ? ' qd-pop' : ''}`}>
                      {c.currentTicket || '—'}
                    </div>
                    <div className="qd-service">{c.serviceLabel}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Queue list + stats */}
          <div className="qd-bottom">
            <div className="qd-panel">
              <div className="qd-label">Upcoming · Registrar (A)</div>
              <div className="qd-queue-list">
                {queue.map((t, i) => (
                  <div key={t.ticketNumber} className="qd-qi">
                    <div style={{ display:'flex', alignItems:'center' }}>
                      <div className="qd-qi-num">{t.ticketNumber}</div>
                      <span className="qd-qi-pos">{i === 0 ? 'Next' : `#${t.position}`}</span>
                    </div>
                    <div className="qd-qi-right">
                      <div className="qd-qi-type">{t.serviceLabel}</div>
                      <div className="qd-qi-wait">{formatWait(t.waitMinutes)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="qd-panel">
              <div className="qd-label">Today's summary</div>
              <div className="qd-stats">
                <div className="qd-stat hi">
                  <div>
                    <div className="qd-stat-lbl">In queue now</div>
                    <div className="qd-progress">
                      <div className="qd-progress-fill" style={{ width: `${Math.min(100,Math.round((stats.inQueue/50)*100))}%` }} />
                    </div>
                  </div>
                  <div className="qd-stat-val">{stats.inQueue}</div>
                </div>
                <div className="qd-stat">
                  <div className="qd-stat-lbl">Served today</div>
                  <div className="qd-stat-val">{stats.servedToday}</div>
                </div>
                <div className="qd-stat">
                  <div className="qd-stat-lbl">Avg wait time</div>
                  <div className="qd-stat-val">{stats.avgWait} min</div>
                </div>
                <div className="qd-stat">
                  <div className="qd-stat-lbl">Counters open</div>
                  <div className="qd-stat-val">{stats.openCounters} / {stats.totalCounters}</div>
                </div>
                <div className="qd-stat">
                  <div className="qd-stat-lbl">Est. clear time</div>
                  <div className="qd-stat-val">{stats.clearTime}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Ticker */}
          <div className="qd-ticker">
            <div className="qd-ticker-label">Notice</div>
            <div className="qd-ticker-text">
              Please have your Student ID and requirements ready before approaching the counter
              &nbsp;&nbsp;·&nbsp;&nbsp;
              Enrollment for 2nd semester is ongoing until April 18, 2026
              &nbsp;&nbsp;·&nbsp;&nbsp;
              Counter 05 (IT Support) is temporarily closed today
              &nbsp;&nbsp;·&nbsp;&nbsp;
              Scholarship applications for AY 2026–2027 are now open — inquire at OSAS (Counter 04)
            </div>
          </div>
        </div>

        <footer className="qd-footer">
          <div className="qd-footer-brand">Powered by <span>QueuePert</span> · CIT-U Queue Management System</div>
          <div className="qd-footer-hours">Office hours: Mon–Fri &nbsp; 7:30 AM – 5:00 PM</div>
        </footer>
      </div>
    </>
  );
}