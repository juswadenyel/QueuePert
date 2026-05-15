import React, { useState } from "react";

const TRANSACTION_TYPES = [
  "registrar",
  "cashier", 
  "guidance",
  "osas",
  "it"
];

const AdminPanel = ({ target, setTarget, counters, onAddToCounter, onNext, onNoShow, onRefresh }) => {
  const [showWalkIn, setShowWalkIn] = useState(false);
  const [walkInData, setWalkInData] = useState({
    studentId:       "",
    transactionType: "registrar",
    semester:        "",
    amount:          "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  function handleChange(e) {
    setWalkInData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleWalkInSubmit() {
    if (!walkInData.studentId.trim()) { setError("Student ID is required."); return; }
    if (!walkInData.semester.trim())  { setError("Semester is required."); return; }
    if (!walkInData.amount)           { setError("Amount is required."); return; }

    setError(null);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/queue/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student:         { studentId: walkInData.studentId.trim() },
          transactionType: walkInData.transactionType,
          semester:        walkInData.semester.trim(),
          amount:          parseFloat(walkInData.amount),
        })
      });

      if (!response.ok) {
        const err = await response.json();
        setError(err.error || "Failed to add walk-in.");
        return;
      }

      // Success — close modal, reset form, refresh queue
      setShowWalkIn(false);
      setWalkInData({ studentId: "", transactionType: "registrar", semester: "", amount: "" });
      onRefresh(); // reload waiting tickets from database

    } catch (err) {
      console.error(err);
      setError("Cannot connect to server.");
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setShowWalkIn(false);
    setError(null);
    setWalkInData({ studentId: "", transactionType: "registrar", semester: "", amount: "" });
  }

  return (
    <div className="panel admin-panel">
      <h3 className="panel-header">ADMIN PANEL</h3>

      {/* Walk-in button */}
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

      <button className="action-btn no-show-btn" onClick={onNoShow}>
        Mark No Show
      </button>

      <button
        className="action-btn"
        onClick={onRefresh}
      >
        ↻ Refresh Queue
      </button>

      {/* ── Walk-in Modal ── */}
      {showWalkIn && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        }}>
          <div style={{
            background: '#fff', borderRadius: '12px',
            padding: '30px', width: '360px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          }}>
            <h3 style={{ color: '#7A1E2C', marginBottom: '16px' }}>Add Walk-in Student</h3>

            {/* Student ID */}
            <label style={labelStyle} htmlFor="walkInStudentId">Student ID</label>
            <input
              id="walkInStudentId"
              name="studentId"
              type="text"
              placeholder="e.g. 21-2345-678"
              value={walkInData.studentId}
              onChange={handleChange}
              style={inputStyle}
            />

            {/* Transaction Type */}
            <label style={labelStyle} htmlFor="walkInTransaction">Transaction Type</label>
            <select
              id="walkInTransaction"
              name="transactionType"
              value={walkInData.transactionType}
              onChange={handleChange}
              style={inputStyle}
            >
              {TRANSACTION_TYPES.map(t => (
                <option key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </option>
              ))}
            </select>

            {/* Semester */}
            <label style={labelStyle} htmlFor="walkInSemester">Semester</label>
            <input
              id="walkInSemester"
              name="semester"
              type="text"
              placeholder="e.g. 1st Semester 2025-2026"
              value={walkInData.semester}
              onChange={handleChange}
              style={inputStyle}
            />

            {/* Amount */}
            <label style={labelStyle} htmlFor="walkInAmount">Amount (₱)</label>
            <input
              id="walkInAmount"
              name="amount"
              type="number"
              placeholder="e.g. 500"
              value={walkInData.amount}
              onChange={handleChange}
              style={inputStyle}
            />

            {/* Error */}
            {error && (
              <p style={{ color: '#7A1E2C', fontSize: '13px', marginBottom: '8px' }}>
                ⚠ {error}
              </p>
            )}

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              <button
                className="action-btn"
                onClick={handleWalkInSubmit}
                disabled={loading}
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

// ── Styles ────────────────────────────────────────────────────────────────────
const labelStyle = {
  display: 'block',
  fontSize: '13px',
  fontWeight: '600',
  color: '#333',
  marginBottom: '4px',
  marginTop: '10px',
};

const inputStyle = {
  width: '100%',
  padding: '8px 10px',
  borderRadius: '6px',
  border: '1px solid #ccc',
  fontSize: '14px',
  boxSizing: 'border-box',
};

export default AdminPanel;