import React, { useState } from 'react';
import { SERVICE_LABELS } from './queueService';
import '../../assets/styles.css';

const SERVICES = [
  { key: 'registrar', icon: '📋', label: 'Registrar',   sub: 'Enrollment / OTR', queue: 12 },
  { key: 'cashier',   icon: '💳', label: 'Cashier',     sub: 'Tuition & Fees',   queue: 8  },
  { key: 'guidance',  icon: '💬', label: 'Guidance',    sub: 'Counseling',       queue: 4  },
  { key: 'osas',      icon: '🎓', label: 'OSAS',        sub: 'Scholarships',     queue: 6  },
  { key: 'it',        icon: '💻', label: 'IT Support',  sub: 'Tech Assistance',  queue: 0  },
];

export default function QueueRequest() {
  const [selectedService, setSelectedService] = useState(null);
  const [studentId, setStudentId]             = useState('');
  const [semester, setSemester]               = useState('');
  const [amount, setAmount]                   = useState('');
  const [loading, setLoading]                 = useState(false);
  const [error, setError]                     = useState(null);
  const [ticket, setTicket]                   = useState(null);

  async function handleSubmit() {
    if (!selectedService)    { setError('Please select a service counter.'); return; }
    if (!studentId.trim())   { setError('Please enter your Student ID.'); return; }
    if (!semester.trim())    { setError('Please enter the semester.'); return; }
    if (!amount)             { setError('Please enter the amount.'); return; }

    setError(null);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/queue/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student: { studentId: studentId.trim() },
          transactionType: selectedService,
          semester: semester.trim(),
          amount: parseFloat(amount),
        })
      });

      if (!response.ok) {
        const err = await response.json();
        setError(err.error || 'Failed to get ticket. Try again.');
        return;
      }

      const data = await response.json();
      setTicket(data);

    } catch (err) {
      console.error(err);
      setError('Cannot connect to server. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setTicket(null);
    setSelectedService(null);
    setStudentId('');
    setSemester('');
    setAmount('');
    setError(null);
  }

  return (
    <div className="login-page">

      {/* Navbar */}
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

          /* Request Form */
          <div className="containerLogin">
            <h1>Get Your Number</h1>
            <p className="description">
              Select a service counter, fill in your details, and receive your queue ticket.
            </p>

            {/* Student ID */}
            <label className="input-label" htmlFor="studentId">Student ID</label>
            <input
              id="studentId"
              name="studentId"
              type="text"
              placeholder="e.g. 21-2345-678"
              value={studentId}
              onChange={e => setStudentId(e.target.value)}
            />

            {/* Semester */}
            <label className="input-label" htmlFor="semester">Semester</label>
            <input
              id="semester"
              name="semester"
              type="text"
              placeholder="e.g. 1st Semester 2025-2026"
              value={semester}
              onChange={e => setSemester(e.target.value)}
            />

            {/* Amount */}
            <label className="input-label" htmlFor="amount">Amount (₱)</label>
            <input
              id="amount"
              name="amount"
              type="number"
              placeholder="e.g. 500"
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />

            {/* Service Selection */}
            <p className="description" style={{ marginTop: '10px', marginBottom: '6px', fontSize: '12px' }}>
              — Select a service counter —
            </p>

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

          /* Ticket Confirmation — shows real data from database */
          <div className="container" style={{ maxWidth: '380px' }}>

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

            <p className="description" style={{ textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '4px' }}>
              {SERVICE_LABELS[ticket.transactionType] || ticket.transactionType}
            </p>

            <div className="serving-number">{ticket.priorityNumber}</div>

            {[
              { label: 'Student ID',       value: ticket.studentId },
              { label: 'Transaction',      value: ticket.transactionType },
              { label: 'Semester',         value: ticket.semester },
              { label: 'Amount',           value: `₱${ticket.amount}` },
              { label: 'Status',           value: ticket.status },
              { label: 'Issued At',        value: new Date(ticket.timeCreated).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' }) },
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

            <button
              className="action-btn"
              onClick={handleReset}
              style={{ marginTop: '14px', background: 'transparent', color: '#7A1E2C', border: '2px solid #7A1E2C' }}
            >
              ← Request Another Ticket
            </button>
          </div>
        )}
      </main>
    </div>
  );
}