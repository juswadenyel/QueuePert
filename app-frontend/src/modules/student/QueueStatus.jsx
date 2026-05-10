import React, { useState } from 'react';
import { useQueue } from "../../context/QueueContext";
import QueueLeft from "./ui/QueueLeft";
import QueueRight from "./ui/QueueRight";
import Navbar from "../../components/Navbar";

function QueueStatus({ queueData }) {

  const {
    nextInLine,
    waitingCount,
    averageWaitTime,
    counters,
    cancelQueue,
    latestTicket
  } = useQueue();

  const localTicket = latestTicket?.priorityNumber || null;

  const currentServing =
    counters.find(counter => counter.length > 0)?.[0] || null;

  const handleCancel = () => {
  cancelQueue(localTicket);
};

  return (
    <div className="dashboard-page">

      <Navbar role="queue" />

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
            currentServing={currentServing}
            counters={counters}
          />

        </div>
      </div>

    </div>
  );
}

export default QueueStatus;