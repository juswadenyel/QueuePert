import React, { useState } from 'react';
import '../../assets/styles.css';

// Cashier only — removed Registrar, Guidance, OSAS, IT
const TRANSACTION_TYPES = [
  { value: 'Tuition Payment', label: 'Tuition Payment' },
  { value: 'Clearance',       label: 'Clearance'       },
  { value: 'Enrollment',      label: 'Enrollment'      },
];

const SEMESTERS = [
  { value: 'First Term',    label: 'First Term'    },
  { value: 'Second Term',   label: 'Second Term'   },
  { value: 'Mid Year Term', label: 'Mid Year Term' },
];

export default function QueueRequest() {
  const [studentId, setStudentId]         = useState('');
  const [studentInfo, setStudentInfo]     = useState(null);
  const [idChecked, setIdChecked]         = useState(false);
  const [idLoading, setIdLoading]         = useState(false);
  const [idError, setIdError]             = useState(null);
  const [transactionType, setTransaction] = useState('');
  const [semester, setSemester]           = useState('');
  const [amount, setAmount]               = useState('');
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState(null);
  const [ticket, setTicket]               = useState(null);

  // STEP 1 — Check if student ID exists in the database
  async function handleCheckId() {
    if (!studentId.trim()) { setIdError('Please enter your Student ID.'); return; }
    setIdError(null);
    setIdLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/student/${studentId.trim()}`);
      if (!res.ok) {
        setIdError('Student not found. Please check your ID or contact the registrar.');
        setIdChecked(false);
        setStudentInfo(null);
        return;
      }
      const data = await res.json();
      setStudentInfo(data);
      setIdChecked(true);
    } catch (err) {
      setIdError('Cannot connect to server.');
    } finally {
      setIdLoading(false);
    }
  }

  // STEP 2 — Submit the queue ticket request
  async function handleSubmit() {
    if (!transactionType) { setError('Please select a transaction type.'); return; }
    if (!semester)        { setError('Please select a semester.'); return; }
    if (!amount)          { setError('Please enter the amount.'); return; }

    setError(null);
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/queue/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student:         { studentId: studentId.trim() },
          transactionType: transactionType,
          semester:        semester,
          amount:          parseFloat(amount),
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
    setStudentId('');
    setStudentInfo(null);
    setIdChecked(false);
    setIdError(null);
    setTransaction('');
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

          <div className="containerLogin">
            <h1>Get Your Number</h1>
            <p className="description">
              💳 Cashier — Enter your Student ID to get started.
            </p>

            {/* STEP 1 — Student ID + Check button */}
            <label className="input-label" htmlFor="studentId">Student ID</label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                id="studentId"
                name="studentId"
                type="text"
                placeholder="e.g. 21-2345-678"
                value={studentId}
                onChange={e => {
                  setStudentId(e.target.value);
                  setIdChecked(false);      // reset verification if they change the ID
                  setStudentInfo(null);
                }}
                style={{ flex: 1 }}
              />
              <button
                className="action-btn"
                onClick={handleCheckId}
                disabled={idLoading}
                style={{ whiteSpace: 'nowrap', padding: '8px 14px', fontSize: '13px' }}
              >
                {idLoading ? 'Checking...' : 'Check ID'}
              </button>
            </div>

            {/* ID not found error */}
            {idError && (
              <p style={{ color: '#7A1E2C', fontSize: '13px', marginTop: '6px' }}>⚠ {idError}</p>
            )}

            {/* Green box — student found */}
            {idChecked && studentInfo && (
              <div style={{
                background: '#E8F8ED', border: '1px solid #1E7A3A',
                borderRadius: '8px', padding: '10px 14px',
                marginTop: '8px', fontSize: '13px'
              }}>
                <p style={{ margin: 0, color: '#1E7A3A', fontWeight: 'bold' }}>✓ Student Found</p>
                <p style={{ margin: '4px 0 0', color: '#333' }}>
                  {studentInfo.lastName}, {studentInfo.firstName} {studentInfo.middleInitial}.
                </p>
                <p style={{ margin: '2px 0 0', color: '#555' }}>
                  {studentInfo.course} — Year {studentInfo.yearLevel}
                </p>
              </div>
            )}

            {/* STEP 2 — Rest of form only appears after ID is confirmed */}
            {idChecked && (
              <>
                <label className="input-label" htmlFor="semester" style={{ marginTop: '14px' }}>
                  Semester
                </label>
                <select
                  id="semester"
                  name="semester"
                  value={semester}
                  onChange={e => setSemester(e.target.value)}
                >
                  <option value="">-- Choose semester --</option>
                  {SEMESTERS.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>

                <label className="input-label" htmlFor="transactionType">
                  Type of Transaction
                </label>
                <select
                  id="transactionType"
                  name="transactionType"
                  value={transactionType}
                  onChange={e => setTransaction(e.target.value)}
                >
                  <option value="">-- Choose transaction --</option>
                  {TRANSACTION_TYPES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>

                <label className="input-label" htmlFor="amount">Amount (₱)</label>
                <input
                  id="amount"
                  name="amount"
                  type="number"
                  placeholder="e.g. 500"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                />

                {error && (
                  <p style={{ color: '#7A1E2C', fontSize: '13px', marginBottom: '8px' }}>⚠ {error}</p>
                )}

                <button className="action-btn" onClick={handleSubmit} disabled={loading}>
                  {loading ? 'Issuing ticket…' : 'Get Queue Ticket'}
                </button>
              </>
            )}
          </div>

        ) : (

          /* Ticket confirmation — same design, real data from database */
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
              💳 Cashier
            </p>

            <div className="serving-number">{ticket.priorityNumber}</div>

            {[
              { label: 'Student ID',  value: ticket.studentId },
              { label: 'Transaction', value: ticket.transactionType },
              { label: 'Semester',    value: ticket.semester },
              { label: 'Amount',      value: `₱${ticket.amount}` },
              { label: 'Status',      value: ticket.status },
              { label: 'Issued At',   value: new Date(ticket.timeCreated).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' }) },
            ].map(row => (
              <div key={row.label} style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '8px 0', borderBottom: '1px solid rgba(0,0,0,0.1)',
                fontSize: '13px',
              }}>
                <span style={{ color: '#555' }}>{row.label}</span>
                <span style={{ fontWeight: 'bold', color: '#000' }}>{row.value}</span>
              </div>
            ))}

            <p className="description" style={{ marginTop: '14px', fontSize: '11px' }}>
              Please stay within the premises and listen for your number to be called.
            </p>

            <button className="action-btn" onClick={handleReset}
              style={{ marginTop: '14px', background: 'transparent', color: '#7A1E2C', border: '2px solid #7A1E2C' }}>
              ← Request Another Ticket
            </button>
          </div>
        )}
      </main>
    </div>
  );
}