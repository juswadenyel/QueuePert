// QueueRequest.jsx
// QueuePert – CIT-U Queue Management System
// Student-facing page: select a service and get a queue ticket

import React, { useState } from 'react';
import { requestTicket, SERVICE_LABELS } from './queueService';

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .qr-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    background: #1a0a00;
    background-image:
      radial-gradient(ellipse at 15% 60%, rgba(180,120,0,0.16) 0%, transparent 55%),
      radial-gradient(ellipse at 85% 25%, rgba(139,0,20,0.2) 0%, transparent 50%);
    color: #f5e6c8;
    display: flex;
    flex-direction: column;
  }

  /* Navbar */
  .qr-nav {
    background: rgba(10,4,0,0.75); border-bottom: 1.5px solid #8B6914;
    padding: 0 32px; height: 56px;
    display: flex; align-items: center; justify-content: space-between;
    backdrop-filter: blur(8px);
  }
  .qr-nav-logo { display: flex; align-items: center; gap: 12px; }
  .qr-nav-badge {
    width: 36px; height: 36px;
    background: linear-gradient(135deg,#9B0020,#6B0015); border: 1px solid #C8102E;
    border-radius: 7px; display: flex; align-items: center; justify-content: center;
    font-size: 10px; font-weight: 600; color: #fff;
  }
  .qr-nav-name { font-size: 16px; font-weight: 600; color: #f5e6c8; }
  .qr-nav-right { font-size: 11px; color: rgba(200,168,75,0.6); }

  /* Main layout */
  .qr-main {
    flex: 1; display: flex; align-items: flex-start; justify-content: center;
    padding: 40px 24px;
  }

  .qr-card {
    width: 100%; max-width: 560px;
    background: rgba(20,8,0,0.7); border: 1.5px solid rgba(200,168,75,0.3);
    border-radius: 16px; overflow: hidden;
    box-shadow: 0 24px 60px rgba(0,0,0,0.5);
  }

  /* Card header */
  .qr-card-header {
    background: linear-gradient(135deg, rgba(155,0,32,0.6), rgba(100,50,0,0.5));
    border-bottom: 1px solid rgba(200,168,75,0.25);
    padding: 28px 32px;
  }
  .qr-card-kicker {
    font-size: 10px; text-transform: uppercase; letter-spacing: 2px;
    color: #C8A84B; margin-bottom: 8px;
  }
  .qr-card-title {
    font-family: 'Playfair Display', serif;
    font-size: 28px; color: #f5e6c8; font-weight: 600; margin-bottom: 6px;
  }
  .qr-card-desc { font-size: 13px; color: rgba(245,230,200,0.6); line-height: 1.5; }

  /* Card body */
  .qr-card-body { padding: 28px 32px; display: flex; flex-direction: column; gap: 22px; }

  /* Field */
  .qr-field { display: flex; flex-direction: column; gap: 8px; }
  .qr-label {
    font-size: 10px; font-weight: 600; text-transform: uppercase;
    letter-spacing: 1.2px; color: #C8A84B;
  }
  .qr-input {
    height: 46px; background: rgba(10,4,0,0.6);
    border: 1.5px solid rgba(200,168,75,0.25); border-radius: 8px;
    padding: 0 14px; font-size: 14px; font-family: 'DM Sans', sans-serif;
    color: #f5e6c8; outline: none; transition: border-color 0.2s, box-shadow 0.2s;
    appearance: none;
  }
  .qr-input::placeholder { color: rgba(200,168,75,0.3); }
  .qr-input:focus { border-color: #C8A84B; box-shadow: 0 0 0 3px rgba(200,168,75,0.1); }

  /* Service grid */
  .qr-services {
    display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
  }

  .qr-service-btn {
    background: rgba(10,4,0,0.5); border: 1.5px solid rgba(200,168,75,0.18);
    border-radius: 10px; padding: 16px 14px; cursor: pointer;
    display: flex; flex-direction: column; gap: 6px;
    transition: all 0.2s; text-align: left;
  }
  .qr-service-btn:hover {
    border-color: rgba(200,168,75,0.5); background: rgba(200,168,75,0.07);
  }
  .qr-service-btn.selected {
    border-color: #C8102E; background: rgba(155,0,32,0.2);
    box-shadow: 0 0 0 3px rgba(200,16,46,0.1);
  }

  .qr-service-icon {
    width: 32px; height: 32px; border-radius: 8px;
    background: rgba(200,168,75,0.12); border: 1px solid rgba(200,168,75,0.2);
    display: flex; align-items: center; justify-content: center;
    font-size: 14px;
  }
  .qr-service-btn.selected .qr-service-icon {
    background: rgba(155,0,32,0.3); border-color: rgba(200,16,46,0.4);
  }

  .qr-service-name  { font-size: 13px; font-weight: 500; color: #f5e6c8; }
  .qr-service-queue { font-size: 11px; color: rgba(200,168,75,0.6); }

  /* Submit button */
  .qr-btn {
    width: 100%; height: 50px;
    background: linear-gradient(135deg, #9B0020, #7A0018);
    border: 1.5px solid #C8102E; border-radius: 10px;
    font-size: 15px; font-weight: 600; font-family: 'DM Sans', sans-serif;
    color: #fff; cursor: pointer; letter-spacing: 0.3px;
    display: flex; align-items: center; justify-content: center; gap: 10px;
    transition: all 0.2s; position: relative; overflow: hidden;
  }
  .qr-btn:hover:not(:disabled) { background: linear-gradient(135deg,#B5001F,#8A0018); transform: translateY(-1px); }
  .qr-btn:active:not(:disabled) { transform: scale(0.99); }
  .qr-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .qr-spinner {
    width: 18px; height: 18px;
    border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff;
    border-radius: 50%; animation: qrSpin 0.7s linear infinite;
  }
  @keyframes qrSpin { to { transform: rotate(360deg); } }

  /* Divider */
  .qr-divider { display: flex; align-items: center; gap: 12px; }
  .qr-divider::before, .qr-divider::after { content:''; flex:1; height:1px; background: rgba(200,168,75,0.15); }
  .qr-divider-text { font-size: 11px; color: rgba(200,168,75,0.4); letter-spacing: 0.5px; }

  /* Error */
  .qr-error {
    background: rgba(155,0,32,0.15); border: 1px solid rgba(200,16,46,0.3);
    border-radius: 8px; padding: 12px 16px;
    font-size: 13px; color: #e87a8a; display: flex; align-items: center; gap: 8px;
  }

  /* ── Ticket confirmation ──────────────────────────────────────── */
  .qr-ticket-wrap {
    display: flex; flex-direction: column; align-items: center; gap: 0;
    animation: qrFadeIn 0.5s ease;
  }
  @keyframes qrFadeIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }

  .qr-ticket {
    width: 100%; max-width: 380px;
    background: rgba(20,8,0,0.8); border: 1.5px solid rgba(200,168,75,0.4);
    border-radius: 16px; overflow: hidden;
    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
  }

  .qr-ticket-header {
    background: linear-gradient(135deg, #9B0020, #6B0015);
    padding: 20px 28px; text-align: center;
    border-bottom: 1px solid rgba(200,168,75,0.3);
  }
  .qr-ticket-header-label { font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: rgba(255,255,255,0.6); margin-bottom: 4px; }
  .qr-ticket-header-title { font-size: 14px; font-weight: 600; color: #fff; }

  .qr-ticket-body { padding: 28px; text-align: center; }

  .qr-ticket-service { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #C8A84B; margin-bottom: 8px; }

  .qr-ticket-num {
    font-family: 'Playfair Display', serif;
    font-size: 72px; color: #f5e6c8; line-height: 1;
    letter-spacing: -2px; margin-bottom: 16px;
    animation: qrPop 0.5s ease;
  }
  @keyframes qrPop { 0%{transform:scale(0.7);opacity:0} 70%{transform:scale(1.08)} 100%{transform:scale(1);opacity:1} }

  .qr-ticket-row {
    display: flex; justify-content: space-between;
    padding: 10px 0; border-bottom: 1px solid rgba(200,168,75,0.1);
    font-size: 13px;
  }
  .qr-ticket-row:last-child { border-bottom: none; }
  .qr-ticket-row-label { color: rgba(200,168,75,0.6); }
  .qr-ticket-row-val   { color: #f5e6c8; font-weight: 500; }

  .qr-ticket-footer {
    background: rgba(200,168,75,0.06); border-top: 1px solid rgba(200,168,75,0.15);
    padding: 14px 28px; text-align: center;
    font-size: 11px; color: rgba(200,168,75,0.5); line-height: 1.6;
  }

  .qr-new-btn {
    margin-top: 20px; height: 44px; padding: 0 32px;
    background: transparent; border: 1.5px solid rgba(200,168,75,0.35);
    border-radius: 8px; font-size: 13px; font-weight: 500;
    font-family: 'DM Sans', sans-serif; color: #C8A84B; cursor: pointer;
    transition: all 0.2s;
  }
  .qr-new-btn:hover { border-color: #C8A84B; background: rgba(200,168,75,0.08); }
`;

// ─── Service options ──────────────────────────────────────────────────────────
const SERVICES = [
  { key:'registrar', icon:'📋', label:'Registrar',       sub:'Enrollment / OTR',    queue: 12 },
  { key:'cashier',   icon:'💳', label:'Cashier',         sub:'Tuition & Fees',       queue: 8  },
  { key:'guidance',  icon:'💬', label:'Guidance',        sub:'Counseling',           queue: 4  },
  { key:'osas',      icon:'🎓', label:'OSAS',            sub:'Scholarships',         queue: 6  },
  { key:'it',        icon:'💻', label:'IT Support',      sub:'Tech Assistance',      queue: 0  },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function QueueRequest() {
  const [selectedService, setSelectedService] = useState(null);
  const [studentId, setStudentId]   = useState('');
  const [name, setName]             = useState('');
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState(null);
  const [ticket, setTicket]         = useState(null);

  async function handleSubmit() {
    if (!selectedService) { setError('Please select a service counter.'); return; }
    if (!studentId.trim()) { setError('Please enter your Student ID.'); return; }
    if (!name.trim())      { setError('Please enter your name.'); return; }

    setError(null);
    setLoading(true);
    try {
      const result = await requestTicket(selectedService, {
        studentId: studentId.trim(),
        name: name.trim(),
      });
      setTicket(result);
    } catch (err) {
      // Demo fallback
      const svc = SERVICES.find(s => s.key === selectedService);
      const prefix = { registrar:'A', cashier:'B', guidance:'C', osas:'D', it:'E' }[selectedService];
      setTicket({
        ticketNumber: `${prefix}-${String(Math.floor(Math.random()*50)+50).padStart(3,'0')}`,
        position: svc.queue + 1,
        estimatedWait: (svc.queue + 1) * 4,
        counterLabel: `Counter · ${svc.label}`,
        studentId: studentId.trim(),
        name: name.trim(),
        issuedAt: new Date().toLocaleTimeString('en-PH', { hour:'2-digit', minute:'2-digit' }),
      });
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setTicket(null);
    setSelectedService(null);
    setStudentId('');
    setName('');
    setError(null);
  }

  return (
    <>
      <style>{styles}</style>
      <div className="qr-root">
        {/* Navbar */}
        <nav className="qr-nav">
          <div className="qr-nav-logo">
            <div className="qr-nav-badge">CIT-U</div>
            <span className="qr-nav-name">QueuePert</span>
          </div>
          <div className="qr-nav-right">Cebu Institute of Technology – University</div>
        </nav>

        <main className="qr-main">
          {!ticket ? (
            /* ── Request Form ── */
            <div className="qr-card">
              <div className="qr-card-header">
                <div className="qr-card-kicker">Queue Management System</div>
                <div className="qr-card-title">Get Your Number</div>
                <div className="qr-card-desc">
                  Select a service counter below, fill in your details, and receive your queue ticket.
                </div>
              </div>

              <div className="qr-card-body">
                {/* Student info */}
                <div className="qr-field">
                  <label className="qr-label">Student ID</label>
                  <input
                    className="qr-input" type="text"
                    placeholder="e.g. 21-2345-678"
                    value={studentId}
                    onChange={e => setStudentId(e.target.value)}
                  />
                </div>

                <div className="qr-field">
                  <label className="qr-label">Full Name</label>
                  <input
                    className="qr-input" type="text"
                    placeholder="Last name, First name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>

                <div className="qr-divider"><span className="qr-divider-text">Select service counter</span></div>

                {/* Service selection */}
                <div className="qr-services">
                  {SERVICES.map(svc => (
                    <button
                      key={svc.key}
                      className={`qr-service-btn${selectedService === svc.key ? ' selected' : ''}`}
                      onClick={() => setSelectedService(svc.key)}
                      disabled={svc.queue === 0 && svc.key === 'it'}
                    >
                      <div className="qr-service-icon">{svc.icon}</div>
                      <div className="qr-service-name">{svc.label}</div>
                      <div className="qr-service-queue">
                        {svc.queue === 0 ? 'Closed today' : `${svc.queue} in queue`}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Error */}
                {error && (
                  <div className="qr-error">
                    <span>⚠</span> {error}
                  </div>
                )}

                {/* Submit */}
                <button className="qr-btn" onClick={handleSubmit} disabled={loading}>
                  {loading
                    ? <><div className="qr-spinner" /> Issuing ticket…</>
                    : 'Get Queue Ticket'
                  }
                </button>
              </div>
            </div>

          ) : (
            /* ── Ticket Confirmation ── */
            <div className="qr-ticket-wrap">
              <div className="qr-ticket">
                <div className="qr-ticket-header">
                  <div className="qr-ticket-header-label">QueuePert · CIT-U</div>
                  <div className="qr-ticket-header-title">Your Queue Ticket</div>
                </div>

                <div className="qr-ticket-body">
                  <div className="qr-ticket-service">{SERVICE_LABELS[selectedService]}</div>
                  <div className="qr-ticket-num">{ticket.ticketNumber}</div>

                  <div className="qr-ticket-row">
                    <span className="qr-ticket-row-label">Name</span>
                    <span className="qr-ticket-row-val">{ticket.name}</span>
                  </div>
                  <div className="qr-ticket-row">
                    <span className="qr-ticket-row-label">Student ID</span>
                    <span className="qr-ticket-row-val">{ticket.studentId}</span>
                  </div>
                  <div className="qr-ticket-row">
                    <span className="qr-ticket-row-label">Counter</span>
                    <span className="qr-ticket-row-val">{ticket.counterLabel}</span>
                  </div>
                  <div className="qr-ticket-row">
                    <span className="qr-ticket-row-label">Position in queue</span>
                    <span className="qr-ticket-row-val">#{ticket.position}</span>
                  </div>
                  <div className="qr-ticket-row">
                    <span className="qr-ticket-row-label">Estimated wait</span>
                    <span className="qr-ticket-row-val">~{ticket.estimatedWait} min</span>
                  </div>
                  <div className="qr-ticket-row">
                    <span className="qr-ticket-row-label">Issued at</span>
                    <span className="qr-ticket-row-val">{ticket.issuedAt}</span>
                  </div>
                </div>

                <div className="qr-ticket-footer">
                  Please stay within the premises and listen for your number to be called.
                  You may also track your position in real time.
                </div>
              </div>

              <button className="qr-new-btn" onClick={handleReset}>
                ← Request another ticket
              </button>
            </div>
          )}
        </main>
      </div>
    </>
  );
}