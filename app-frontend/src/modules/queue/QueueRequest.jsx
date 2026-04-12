// QueueRequest.jsx
// QueuePert – CIT-U Queue Management System
// Student-facing page: select a service and get a queue ticket

import React, { useState } from 'react';
import { requestTicket, SERVICE_LABELS } from './queueService';
import '../assets/styles.css';

// ─── Service options ──────────────────────────────────────────────────────────
const SERVICES = [
  { key:'registrar', icon:'📋', label:'Registrar',  sub:'Enrollment / OTR', queue: 12 },
  { key:'cashier',   icon:'💳', label:'Cashier',    sub:'Tuition & Fees',   queue: 8  },
  { key:'guidance',  icon:'💬', label:'Guidance',   sub:'Counseling',       queue: 4  },
  { key:'osas',      icon:'🎓', label:'OSAS',       sub:'Scholarships',     queue: 6  },
  { key:'it',        icon:'💻', label:'IT Support', sub:'Tech Assistance',  queue: 0  },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function QueueRequest() {
  const [selectedService, setSelectedService] = useState(null);
  const [studentId, setStudentId] = useState('');
  const [name, setName]           = useState('');
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);
  const [ticket, setTicket]       = useState(null);

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
    } catch {
      // Demo fallback
      const svc    = SERVICES.find(s => s.key === selectedService);
      const prefix = { registrar:'A', cashier:'B', guidance:'C', osas:'D', it:'E' }[selectedService];
      setTicket({
        ticketNumber: `${prefix}-${String(Math.floor(Math.random() * 50) + 50).padStart(3, '0')}`,
        position:      svc.queue + 1,
        estimatedWait: (svc.queue + 1) * 4,
        counterLabel:  `Counter · ${svc.label}`,
        studentId:     studentId.trim(),
        name:          name.trim(),
        issuedAt:      new Date().toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' }),
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
    <div className="login-page">

      {/* ── Navbar ── */}
      <div className="navbar">
        <div className="logo">QueuePert</div>
        <div className="nav-buttons">
          <span style={{ fontSize: '13px', color: '#3a1800', fontWeight: '600' }}>
            Cebu Institute of Technology – University
          </span>
        </div>
      </div>

      <main style={{ display: 'flex', justifyContent: 'center', padding: '40px 24px', width: '100%' }}>

        {!ticket ? (

          /* ── Request Form ── */
          <div className="containerLogin">
            <h1>Get Your Number</h1>
            <p className="description">
              Select a service counter, fill in your details, and receive your queue ticket.
            </p>

            {/* Student ID */}
            <label className="input-label">Student ID</label>
            <input
              type="text"
              placeholder="e.g. 21-2345-678"
              value={studentId}
              onChange={e => setStudentId(e.target.value)}
            />

            {/* Full Name */}
            <label className="input-label">Full Name</label>
            <input
              type="text"
              placeholder="Last name, First name"
              value={name}
              onChange={e => setName(e.target.value)}
            />

            {/* Divider */}
            <p className="description" style={{ marginTop: '10px', marginBottom: '6px', fontSize: '12px' }}>
              — Select a service counter —
            </p>

            {/* Service grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
              {SERVICES.map(svc => {
                const isClosed   = svc.key === 'it' && svc.queue === 0;
                const isSelected = selectedService === svc.key;
                return (
                  <button
                    key={svc.key}
                    onClick={() => !isClosed && setSelectedService(svc.key)}
                    disabled={isClosed}
                    style={{
                      background:   isSelected ? '#7A1E2C' : '#fff',
                      border:       `2px solid ${isSelected ? '#7A1E2C' : '#ccc'}`,
                      borderRadius: '8px',
                      padding:      '10px',
                      cursor:       isClosed ? 'not-allowed' : 'pointer',
                      opacity:      isClosed ? 0.5 : 1,
                      textAlign:    'left',
                      transition:   'all 0.2s',
                    }}
                  >
                    <div style={{ fontSize: '16px', marginBottom: '4px' }}>{svc.icon}</div>
                    <div style={{ fontSize: '13px', fontWeight: 'bold', color: isSelected ? '#fff' : '#000' }}>
                      {svc.label}
                    </div>
                    <div style={{ fontSize: '11px', color: isSelected ? 'rgba(255,255,255,0.7)' : '#666' }}>
                      {svc.queue === 0 ? 'Closed today' : `${svc.queue} in queue`}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Error */}
            {error && (
              <p style={{ color: '#7A1E2C', fontSize: '13px', marginBottom: '8px' }}>⚠ {error}</p>
            )}

            {/* Submit */}
            <button className="action-btn" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Issuing ticket…' : 'Get Queue Ticket'}
            </button>
          </div>

        ) : (

          /* ── Ticket Confirmation ── */
          <div className="container" style={{ maxWidth: '380px' }}>
            {/* Ticket header */}
            <div style={{
              background: '#C9A227', margin: '-35px -35px 20px -35px',
              padding: '20px', borderRadius: '15px 15px 0 0', textAlign: 'center',
            }}>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', color: '#3a1800', marginBottom: '4px' }}>
                QueuePert · CIT-U
              </div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#000' }}>
                Your Queue Ticket
              </div>
            </div>

            {/* Service + big number */}
            <p className="description" style={{ textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '4px' }}>
              {SERVICE_LABELS[selectedService]}
            </p>
            <div className="serving-number">{ticket.ticketNumber}</div>

            {/* Detail rows */}
            {[
              { label: 'Name',             value: ticket.name },
              { label: 'Student ID',       value: ticket.studentId },
              { label: 'Counter',          value: ticket.counterLabel },
              { label: 'Position',         value: `#${ticket.position}` },
              { label: 'Estimated Wait',   value: `~${ticket.estimatedWait} min` },
              { label: 'Issued At',        value: ticket.issuedAt },
            ].map(row => (
              <div
                key={row.label}
                style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: '8px 0', borderBottom: '1px solid rgba(0,0,0,0.1)',
                  fontSize: '13px',
                }}
              >
                <span style={{ color: '#555' }}>{row.label}</span>
                <span style={{ fontWeight: 'bold', color: '#000' }}>{row.value}</span>
              </div>
            ))}

            <p className="description" style={{ marginTop: '14px', fontSize: '11px' }}>
              Please stay within the premises and listen for your number to be called.
            </p>

            <button className="action-btn" onClick={handleReset} style={{ marginTop: '14px', background: 'transparent', color: '#7A1E2C', border: '2px solid #7A1E2C' }}>
              ← Request Another Ticket
            </button>
          </div>
        )}
      </main>
    </div>
  );
}