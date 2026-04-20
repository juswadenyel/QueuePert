import React, { useState } from "react";
import "../../assets/styles.css";
import { useQueue } from "./ManageQueue";

const Dashboard = () => {
  const [target, setTarget] = useState(0);

  const { 
    counters, 
    queueList, 
    waitingCount, 
    nextInLine, 
    averageWaitTime,
    addQueue, 
    nextQueue, 
    addToCounter, 
    deleteQueue 
  } = useQueue();

  return (
    <div className="dashboard-page">
      <nav className="navbar">
        <div className="logo">QueuePert</div>
        <div className="nav-buttons">
          <button onClick={() => alert("Daily Report Generated")}>View Daily Report</button>
          <button onClick={() => (window.location.href = "/")}>Logout</button>
        </div>
      </nav>

      <div className="dashboard-wrapper">
        <div className="dashboard-layout">
          
          {/* LEFT COLUMN */}
          <div className="left-column">
            <div className="panel admin-panel">
              <h3 className="panel-header">ADMIN PANEL</h3>
              <button className="action-btn" onClick={addQueue}>Add Queue</button>
              <button className="action-btn" onClick={() => addToCounter(target)}>Add To Counter</button>
              <div className="target-box" style={{ background: '#7A1E2C', color: 'white', padding: '10px', borderRadius: '8px', marginTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
                <span>Target:</span>
                <select value={target} onChange={(e) => setTarget(parseInt(e.target.value))} style={{ width: 'auto', margin: 0 }}>
                  {counters.map((_, i) => <option key={i} value={i}>Counter {i + 1}</option>)}
                </select>
              </div>
              <button className="action-btn" onClick={() => nextQueue(target)}>Next Queue</button>
             <button className="action-btn" onClick={deleteQueue}>Delete Queue</button>
              <button className="action-btn">Set Queue Limit</button>
            </div>
            <div className="panel stat-box">NEXT IN LINE<div className="stat-val">{nextInLine}</div></div>
            <div className="panel stat-box">WAITING<div className="stat-val">{waitingCount}</div></div>
            <div className="panel stat-box">AVG WAIT<div className="stat-val">{averageWaitTime} min</div></div>
          </div>

          {/* CENTER COLUMN */}
          <div className="center-column">
            <div className="panel your-queue">
              <h3 className="panel-header">YOUR QUEUE (Counter {target + 1}):</h3>
              <div className="serving-number">
                {counters[target] && counters[target].length > 0 ? counters[target].join(", ") : "--"}
              </div>
            </div>
            <div className="panel serving-panel">
              <h2 className="serving-title">Now Serving</h2>
              <div className="serving-container">
                <div className="counter-list">
                  {counters.map((arr, i) => (
                    <div key={i} className={`counter-row ${target === i ? "active-target" : ""}`}>
                      Counter {i + 1}: {arr.length > 0 ? arr.join(", ") : ""}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="right-column">
            <div className="panel unqueued-panel">
              <h3 className="panel-header">UNQUEUED NO:</h3>
              <div className="unqueued-grid">
                {queueList.length > 0 
                  ? queueList.map((id, i) => <div key={i} className="grid-item" style={{ fontSize: '22px', fontWeight: 'bold' }}>{id}</div>)
                  : Array(21).fill("").map((d, i) => <div key={i} className="grid-item dash" style={{ opacity: 0.5 }}>{d}</div>)
                }
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;