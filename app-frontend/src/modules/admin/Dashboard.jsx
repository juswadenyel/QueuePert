import React, { useState } from "react";
import "../../assets/styles.css";
import { useQueue } from "../../context/QueueContext";
import Navbar from "../../components/Navbar";

import AdminPanel from "./ui/AdminPanel";
import StatBox from "./ui/StatBox";
import ServingDisplay from "./ui/ServingDisplay";
import UnqueuedGrid from "./ui/UnqueuedGrid";

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
      <Navbar role="admin" />

      <div className="dashboard-wrapper">
        <div className="dashboard-layout">
          
          <div className="left-column">
            <AdminPanel 
              target={target} 
              setTarget={setTarget} 
              counters={counters}
              onAdd={addQueue}
              onAddToCounter={addToCounter}
              onNext={nextQueue}
              onDelete={deleteQueue}
            />
            <StatBox label="NEXT IN LINE" value={nextInLine?.id || "---"} />
            <StatBox label="WAITING" value={waitingCount} />
            <StatBox label="AVG WAIT" value={averageWaitTime} unit="min" />
          </div>

          <ServingDisplay target={target} counters={counters} />

          <div className="right-column">
            <UnqueuedGrid queueList={queueList} />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;