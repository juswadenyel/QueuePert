import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
import "../../assets/styles.css";
import { useQueue } from "../../context/QueueContext";
import QueueLeft from "./ui/QueueLeft";
import QueueRight from "./ui/QueueRight";
import Navbar from "../../components/Navbar";

function QueueStatus({ queueData }) {
 // const navigate = useNavigate();

  const {
    nextInLine,
    waitingCount,
    averageWaitTime,
    counters,
    cancelQueue
  } = useQueue();

  const [localTicket, setLocalTicket] = useState(
    queueData?.priorityNumber || null
  );

  const currentServing =
  counters
    .find(counter => counter.length > 0)?.[0] || null;

  const handleCancel = () => {
    cancelQueue(localTicket);
    setLocalTicket(null);
  };

  return (
    <div className="dashboard-page">

      <Navbar role="student" />

      <div className="dashboard-wrapper-student">
        <div className="queue-status-layout">

          <QueueLeft
            localTicket={localTicket}
            onCancel={handleCancel}
            nextInLine={nextInLine}
            waitingCount={waitingCount}
            averageWaitTime={averageWaitTime}
          />

          <QueueRight
            currentServing={currentServing?.id}
            counters={counters}
          />

        </div>
      </div>

    </div>
  );
}

export default QueueStatus;