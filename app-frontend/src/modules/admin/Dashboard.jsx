import React, { useState } from "react";
import "../../assets/styles.css";
import { 
  addQueue, nextQueue, deleteQueue, getNextInLine, 
  getWaitingCount, getQueueList, getAverageWaitTime, getCounters, addToCounter 
} from "./ManageQueue";

const Dashboard = () => {
  const [target, setTarget] = useState(0);
  const [next, setNext] = useState(getNextInLine());
  const [waiting, setWaiting] = useState(getWaitingCount());
  const [queueList, setQueueList] = useState(getQueueList());
  const [avgWait, setAvgWait] = useState(getAverageWaitTime());
  const [counters, setCounters] = useState(getCounters());

  const refresh = () => {
    setNext(getNextInLine());
    setWaiting(getWaitingCount());
    setQueueList(getQueueList());
    setAvgWait(getAverageWaitTime());
    setCounters([...getCounters()]);
  };

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
          
          {/* LEFT: ADMIN & STATS */}
          <div className="left-column">
            <div className="panel">
              <h3 className="panel-header">ADMIN PANEL</h3>
              <button className="action-btn" onClick={() => { addQueue(); refresh(); }}>Add Queue</button>
              <div className="target-box">
                <span>Counter:</span>
                <select value={target} onChange={(e) => setTarget(parseInt(e.target.value))}>
                  {counters.map((_, i) => <option key={i} value={i}>Counter {i + 1}</option>)}
                </select>
              </div>
              <button className="action-btn" onClick={() => { nextQueue(target); refresh(); }}>Next Queue</button>
              <button className="action-btn" onClick={() => { deleteQueue(); refresh(); }}>Delete Queue</button>
              <button className="action-btn">Set Queue Limit</button>
              <button className="action-btn" onClick={() => { addToCounter(target); refresh(); }}>Add To Counter</button>
            </div>

            <div className="stat-box">
              <span className="stat-label">NEXT IN LINE</span>
              <div className="stat-val">{next}</div>
            </div>
            <div className="stat-box">
              <span className="stat-label">WAITING</span>
              <div className="stat-val">{waiting}</div>
            </div>
            <div className="stat-box">
              <span className="stat-label">AVG WAIT</span>
              <div className="stat-val">{avgWait} min</div>
            </div>
          </div>

          {/* CENTER: SERVING AREA */}
          <div className="center-column">
            <div className="panel" style={{height: '110px', justifyContent: 'center'}}>
              <h3 className="panel-header">YOUR QUEUE:</h3>
              <div style={{fontSize: '40px', fontWeight: 'bold', color: '#7A1E2C', textAlign: 'center'}}>--</div>
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

          {/* RIGHT: UNQUEUED GRID */}
          <div className="right-column">
            <div className="panel" style={{height: '100%'}}>
              <h3 className="panel-header">UNQUEUED NO:</h3>
              <div className="unqueued-grid">
                {queueList.length > 0 
                  ? queueList.map((id, i) => <div key={i} className="grid-item">{id}</div>)
                  : Array(21).fill("").map((d, i) => <div key={i} className="grid-item dash">{d}</div>)
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