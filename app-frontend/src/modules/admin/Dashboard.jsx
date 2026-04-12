import { useState } from "react";
import "../../assets/styles.css";
import {
  addQueue,
  nextQueue,
  deleteQueue,
  getCurrentQueue,
  getNextInLine,
  getWaitingCount,
  getQueueList,
  getAverageWaitTime
} from "./ManageQueue";

const Dashboard = () => {
  const [current, setCurrent] = useState(getCurrentQueue());
  const [next, setNext] = useState(getNextInLine());
  const [waiting, setWaiting] = useState(getWaitingCount());
  const [queueList, setQueueList] = useState(getQueueList());
  const [avgWait, setAvgWait] = useState(getAverageWaitTime());

  const refresh = () => {
    setCurrent(getCurrentQueue());
    setNext(getNextInLine());
    setWaiting(getWaitingCount());
    setQueueList(getQueueList());
    setAvgWait(getAverageWaitTime());
  };

  const handleAdd = () => {
    const newQueue = addQueue();

    if (!newQueue) {
      alert("Queue limit reached");
      return;
    }

    refresh();
  };

  const handleNext = () => {
    nextQueue();
    refresh();
  };

  const handleDelete = () => {
    deleteQueue();
    refresh();
  };

  return (
    <div className="dashboard-page">

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo">QueuePert</div>
        <button onClick={() => (window.location.href = "/")}>
          Logout
        </button>
      </nav>

      <div className="dashboard-wrapper">

        <div className="main-row">

          {/* ADMIN PANEL */}
          <section className="panel admin-panel">
            <h3>ADMIN PANEL</h3>

            <button className="action-btn" onClick={handleAdd}>
              Add Queue
            </button>

            <button className="action-btn" onClick={handleNext}>
              Next Queue
            </button>

            <button className="action-btn delete-btn" onClick={handleDelete}>
              Delete Queue
            </button>
          </section>

          {/* NOW SERVING */}
          <section className="panel serving-panel">
            <h3>NOW SERVING</h3>
            <div className="serving-number">{current}</div>
          </section>

        </div>

        {/* STATS */}
        <div className="stats-row">

          <div className="stat-box">
            <p>NEXT IN LINE</p>
            <h2>{next}</h2>
          </div>

          <div className="stat-box">
            <p>WAITING</p>
            <h2>{waiting}</h2>
          </div>

          <div className="stat-box">
            <p>AVG WAIT</p>
            <h2>{avgWait} min</h2>
          </div>

        </div>

        {/* QUEUE PILLS */}
        <div className="pill-container">
          {queueList.slice(0, 5).map((item, index) => (
            <div key={index} className="pill">
              {item}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;