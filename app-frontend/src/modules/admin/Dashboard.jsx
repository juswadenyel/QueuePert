import React, { useState } from "react";
import "../../assets/styles.css";
import { useQueue } from "../../context/QueueContext";
import Navbar from "../../components/Navbar";

import AdminPanel from "./ui/AdminPanel";
import StatBox from "./ui/StatBox";
import ServingDisplay from "./ui/ServingDisplay";
import UnqueuedGrid from "./ui/UnqueuedGrid";
import TransactionInfo from "./ui/TransactionInfo";

const Dashboard = () => {
  const [target, setTarget] = useState(0);
  const { 
    counters, queueList, waitingCount, nextInLine, averageWaitTime, noShowCount,
    addQueue, nextQueue, addToCounter, markNoShow 
  } = useQueue();

  const activeStudentsAtCounter = counters?.[target] || [];
  
  return (
    <div className="dashboard-page">
      <Navbar role="admin" />

      <div className="dashboard-wrapper">
        <div className="dashboard-layout">
          
          {/* COLUMN 1: SIDEBAR STATS */}
          <div className="left-column">
            <AdminPanel 
              target={target} setTarget={setTarget} counters={counters}
              onAdd={() => addQueue({ name: "Walk-in", transaction: "General" })}
              onAddToCounter={() => addToCounter(target)}
              onNext={() => nextQueue(target)}
              onNoShow={() => markNoShow(target)}
            />

            <StatBox label="NEXT IN LINE" value={nextInLine} />
            <StatBox label="waiting" value={waitingCount} />
            <StatBox label="avg. wait" value={`${averageWaitTime} min`} />
            <StatBox label="no shows" value={noShowCount || 0} />
          </div>

          {/* COLUMN 2: MAIN CENTER AREA */}
          <div className="center-column">
            {/* LARGE NOW SERVING HEADER */}
            <div className="panel target-header" style={{ padding: '20px', textAlign: 'center' }}>
              <h2 style={{ margin: 0, fontSize: '24px' }}>Now Serving:</h2>
              <p style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '10px' }}>
                Counter {target + 1}: {activeStudentsAtCounter[0]?.id || "none"}
              </p>
            </div>
            
            <div className="workspace-row">
              {/* TRANSACTION INFO */}
              <TransactionInfo students={activeStudentsAtCounter} target={target} />
              
              {/* RIGHT-CENTER SUB-PANELS */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="panel" style={{ padding: '15px' }}>
                  <h4 style={{ fontSize: '18px', marginBottom: '15px' }}>YOUR QUEUE (Counter {target + 1}):</h4>
                    <p style={{ fontWeight: 'bold', fontSize: '25px', color: '#000' }}>
                      {activeStudentsAtCounter.length > 0 ? activeStudentsAtCounter.map(s => s.id).join(", ") : "--"}
                    </p>
                  </div>

                <ServingDisplay target={target} counters={counters} />
              </div>
            </div>
          </div>

          {/* COLUMN 3: LOBBY */}
          <div className="right-column">
            <UnqueuedGrid queueList={queueList} />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;