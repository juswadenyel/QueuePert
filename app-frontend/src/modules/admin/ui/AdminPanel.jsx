import React, { useState } from "react";

// Cashier only — removed registrar, guidance, osas, it
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

const AdminPanel = ({ target, setTarget, counters, onAddToCounter, onNext, onNoShow, onRefresh }) => {
  const [showWalkIn, setShowWalkIn]   = useState(false);
  const [walkInData, setWalkInData]   = useState({
    studentId: '', transactionType: '', semester: '', amount: ''
  });
  const [studentInfo, setStudentInfo] = useState(null);  // student from database
  const [idChecked, setIdChecked]     = useState(false); // true after successful ID check
  const [idLoading, setIdLoading]     = useState(false);
  const [idError, setIdError]         = useState(null);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);

  function handleChange(e) {
    setWalkInData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  // Check if student ID exists in the database
  async function handleCheckId() {
    if (!walkInData.studentId.trim()) { setIdError('Please enter a Student ID.'); return; }
    setIdError(null);
    setIdLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/student/${walkInData.studentId.trim()}`);
      if (!res.ok) {
        setIdError('Student not found in database.');
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

  async function handleWalkInSubmit() {
    if (!idChecked)                  { setError('Please verify Student ID first.'); return; }
    if (!walkInData.transactionType) { setError('Please select a transaction type.'); return; }
    if (!walkInData.semester)        { setError('Please select a semester.'); return; }
    if (!walkInData.amount)          { setError('Amount is required.'); return; }

    setError(null);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/queue/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student:         { studentId: walkInData.studentId.trim() },
          transactionType: walkInData.transactionType,
          semester:        walkInData.semester,
          amount:          parseFloat(walkInData.amount),
        })
      });

      if (!response.ok) {
        const err = await response.json();
        setError(err.error || "Failed to add walk-in.");
        return;
      }

      handleClose();
      onRefresh();

    } catch (err) {
      console.error(err);
      setError("Cannot connect to server.");
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setShowWalkIn(false);
    setWalkInData({ studentId: '', transactionType: '', semester: '', amount: '' });
    setStudentInfo(null);
    setIdChecked(false);
    setIdError(null);
    setError(null);
  }

  return (
    <div className="panel admin-panel">
      <h3 className="panel-header">ADMIN PANEL</h3>

      <button className="action-btn" onClick={() => setShowWalkIn(true)}>
        Add Walk-in
      </button>

      <button className="action-btn" onClick={onAddToCounter}>
        Add To Counter
      </button>

      <div className="target-box" style={{ margin: '15px 0' }}>
        <span>Target:</span>
        <select value={target} onChange={(e) => setTarget(parseInt(e.target.value))}>
          {counters.map((_, i) => (
            <option key={i} value={i}>Counter {i + 1}</option>
          ))}
        </select>
      </div>

      <button className="action-btn" onClick={onNext}>Next Queue</button>
      <button className="action-btn no-show-btn" onClick={onNoShow}>Mark No Show</button>
      {/* Walk-in Modal */}
      {showWalkIn && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        }}>
          <div style={{
            background: '#fff', borderRadius: '12px', padding: '30px',
            width: '380px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            maxHeight: '90vh', overflowY: 'auto',
          }}>
            <h3 style={{ color: '#7A1E2C', marginBottom: '16px' }}>
              Add Walk-in — Cashier
            </h3>

            {/* STEP 1 — Student ID + Check button */}
            <label style={labelStyle}>Student ID</label>
            <div style={{ display: 'flex', gap: '8px', flexDirection: 'column'}}>
              <input
                name="studentId"
                type="text"
                placeholder="e.g. 21-2345-678"
                value={walkInData.studentId}
                onChange={e => {
                  handleChange(e);
                  setIdChecked(false);   // reset if they change the ID
                  setStudentInfo(null);
                }}
                style={{ ...inputStyle, flex: 1 }}
              />
              <button
                className="action-btn"
                onClick={handleCheckId}
                disabled={idLoading}
                style={{ whiteSpace: 'nowrap', padding: '8px 12px', fontSize: '13px' }}
              >
                {idLoading ? '...' : 'Check'}
              </button>
            </div>

            {/* ID error */}
            {idError && (
              <p style={{ color: '#7A1E2C', fontSize: '13px', marginTop: '4px' }}>
                ⚠ {idError}
              </p>
            )}

            {/* Green box — student found */}
            {idChecked && studentInfo && (
              <div style={{
                background: '#E8F8ED', border: '1px solid #1E7A3A',
                borderRadius: '8px', padding: '10px', marginTop: '6px', fontSize: '13px'
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

            {/* STEP 2 — Rest of form only shows after ID is verified */}
            {idChecked && (
              <>
                <label style={labelStyle}>Semester</label>
                <select
                  name="semester"
                  value={walkInData.semester}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="">-- Choose semester --</option>
                  {SEMESTERS.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>

                <label style={labelStyle}>Type of Transaction</label>
                <select
                  name="transactionType"
                  value={walkInData.transactionType}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="">-- Choose transaction --</option>
                  {TRANSACTION_TYPES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>

                <label style={labelStyle}>Amount (₱)</label>
                <input
                  name="amount"
                  type="number"
                  placeholder="e.g. 500"
                  value={walkInData.amount}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </>
            )}

            {error && (
              <p style={{ color: '#7A1E2C', fontSize: '13px', marginTop: '8px' }}>
                ⚠ {error}
              </p>
            )}

            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              <button
                className="action-btn"
                onClick={handleWalkInSubmit}
                disabled={loading || !idChecked}
                style={{ flex: 1 }}
              >
                {loading ? 'Adding...' : 'Add to Queue'}
              </button>
              <button
                className="action-btn"
                onClick={handleClose}
                style={{ flex: 1, background: 'transparent', color: '#7A1E2C', border: '2px solid #7A1E2C' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const labelStyle = {
  display: 'block', fontSize: '13px', fontWeight: '600',
  color: '#333', marginBottom: '4px', marginTop: '10px',
};

const inputStyle = {
  width: '100%', padding: '8px 10px', borderRadius: '6px',
  border: '1px solid #ccc', fontSize: '14px', boxSizing: 'border-box',
};

export default AdminPanel;