import React, { useEffect, useState } from 'react';
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
  } = useQueue();

  const [myTicket, setMyTicket] = useState(null);
  const [studentId, setStudentId] = useState(() => {
    const student = JSON.parse(localStorage.getItem("student") || "{}");
    return student.studentId || null;
  });

  useEffect(() => {
    if (!studentId) return;

    fetch(`http://localhost:8080/queue/student/${studentId}`)
      .then(res => res.json())
      .then(data => {
        const active = data
          .filter(t => t.status === "waiting" || t.status === "serving")
          .sort((a, b) => new Date(b.timeCreated) - new Date(a.timeCreated))[0];
        setMyTicket(active || null);
      })
      .catch(err => console.error("Failed to fetch student ticket:", err));

  }, [studentId]);

  useEffect(() => {
    const handleStorage = () => {
      const student = JSON.parse(localStorage.getItem("student") || "{}");
      setStudentId(student.studentId || null);
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const localTicket = myTicket?.priorityNumber || null;

  const handleCancel = () => {
    if (!localTicket) return;
    cancelQueue(localTicket);
    setMyTicket(null);
  };

  const currentServing =
    counters.find(counter => counter.length > 0)?.[0] || null;

  return (
    <div className="dashboard-page">
      <Navbar role="queue" />
      <div className="dashboard-wrapper-student">
        <div className="queue-status-layout">
          <QueueLeft
            localTicket={localTicket}
            myTicket={myTicket}
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