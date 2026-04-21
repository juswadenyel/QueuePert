import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/styles.css";
import { useQueue } from "../../context/QueueContext";

function QueueStatus({ queueData }) {
  const navigate = useNavigate();

  const {
    nextInLine,
    waitingCount,
    averageWaitTime,
    counters,
    cancelQueue
  } = useQueue();

  // 🔥 Student personal ticket view
  const [localTicket, setLocalTicket] = useState(
    queueData?.priorityNumber || null
  );

  // 🔥 Current serving number
  const currentServing =
    counters.flat().length > 0
      ? counters.flat()[0]
      : "--";

  /* ================= NAVBAR ================= */

  const Navbar = () => (
    <div className="navbar">
      <div className="logo">QueuePert</div>

      <div className="nav-buttons">
        <button onClick={() => navigate("/student/dashboard")}>
          Home
        </button>
        <button onClick={() => navigate("/student/queue")}>
          View Queue
        </button>
        <button onClick={() => navigate("/")}>
          Logout
        </button>
      </div>
    </div>
  );

  /* ================= PRIORITY CARD ================= */

  const PriorityCard = () => (
    <div className="queue-card priority-card">
      <p>Priority Number</p>

      <div className="priority-number">
        {localTicket || "--"}
      </div>

      <button
        className="cancel-queue-btn"
        onClick={() => {
          const confirmCancel = window.confirm(
            "Are you sure you want to cancel your transaction?"
          );

          if (confirmCancel) {
            // 🔥 remove from global queue
            cancelQueue(localTicket);

            // 🔥 remove from UI
            setLocalTicket(null);
          }
        }}
      >
        Cancel Transaction
      </button>
    </div>
  );

  /* ================= INFO CARD ================= */

  const InfoCard = ({ label, value }) => (
    <div className="queue-card">
      <p>{label}</p>
      <h3>{value || "--"}</h3>
    </div>
  );

  /* ================= LEFT PANEL ================= */

  const QueueLeft = () => (
    <div className="queue-left">

      <PriorityCard />

      <InfoCard 
        label="Next in line" 
        value={nextInLine} 
      />

      <InfoCard 
        label="Waiting" 
        value={waitingCount} 
      />

      <InfoCard 
        label="Avg waiting time" 
        value={`${averageWaitTime} min`} 
      />

    </div>
  );

  /* ================= RIGHT PANEL ================= */

  const ServingHighlight = () => (
    <div className="serving-highlight">
      <div className="serving-label">NOW SERVING</div>
      <div className="serving-big">{currentServing}</div>
    </div>
  );

  const CounterList = () => (
    <div className="queue-counter-list">
      {counters.map((arr, i) => (
        <div key={i} className="queue-counter-row">
          <span>Counter {i + 1}</span>
          <span>{arr.length ? arr.join(", ") : "--"}</span>
        </div>
      ))}
    </div>
  );

  const QueueRight = () => (
    <div className="queue-right-panel">
      <ServingHighlight />
      <CounterList />
    </div>
  );

  /* ================= MAIN UI ================= */

  return (
    <div className="dashboard-page">

      <Navbar />

      <div className="dashboard-wrapper-student">
        <div className="queue-status-layout">

          <QueueLeft />
          <QueueRight />

        </div>
      </div>

    </div>
  );
}

/* ✅ IMPORTANT FIX: DEFAULT EXPORT */
export default QueueStatus;