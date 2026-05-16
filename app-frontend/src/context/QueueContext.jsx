import React, { createContext, useState, useContext, useEffect } from "react";

const QueueContext = createContext();

export const QueueProvider = ({ children }) => {
  const [queue, setQueue] = useState([]);
  const [servedTimes, setServedTimes] = useState([]);
  const [counters, setCounters] = useState(Array(8).fill(null).map(() => []));
  const [noShowCount, setNoShowCount] = useState(0);
  const [latestTicket, setLatestTicket] = useState(null);

  useEffect(() => {
    fetchWaitingTickets();
    fetchServingTickets();
    const interval = setInterval(() => {
      fetchWaitingTickets();
      fetchServingTickets();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  async function fetchWaitingTickets() {
    try {
      const res = await fetch("http://localhost:8080/queue/waiting");
      if (!res.ok) return;
      const data = await res.json();
      setQueue(prevQueue => data.map(ticket => {
        const existing = prevQueue.find(q => q.queueId === ticket.queueId);
        return {
          queueId:          ticket.queueId,
          priorityNumber:   ticket.priorityNumber,
          studentId:        ticket.studentId,
          fullName:         ticket.studentFullName,
          course:           ticket.course,
          yearLevel:        ticket.yearLevel,
          transactionType:  ticket.transactionType,
          semester:         ticket.semester,
          amount:           ticket.amount,
          status:           ticket.status,
          timeCreated:      new Date(ticket.timeCreated).getTime(),
          timeAddedToQueue: existing ? existing.timeAddedToQueue : Date.now(),
        };
      }));
    } catch (err) {
      console.error("Failed to load queue:", err);
    }
  }

  async function fetchServingTickets() {
    try {
      const res = await fetch("http://localhost:8080/queue/serving");
      if (!res.ok) return;
      const data = await res.json();
      const newCounters = Array(8).fill(null).map(() => []);
      data.forEach(ticket => {
        if (!ticket.counterNumber || !ticket.priorityNumber) return;
        const idx = parseInt(ticket.counterNumber) - 1;
        if (idx >= 0 && idx < 8) {
          newCounters[idx].push({
            queueId:         ticket.queueId,
            priorityNumber:  ticket.priorityNumber,
            studentId:       ticket.studentId,
            fullName:        ticket.studentFullName,
            course:          ticket.course,
            yearLevel:       ticket.yearLevel,
            transactionType: ticket.transactionType,
            semester:        ticket.semester,
            amount:          ticket.amount,
          });
        }
      });
      setCounters(newCounters);
    } catch (err) {
      console.error("Failed to load serving tickets:", err);
    }
  }

  function getAdminId() {
    const admin = JSON.parse(localStorage.getItem("admin") || "{}");
    return admin.adminId || null;
  }

  const addToCounter = (counterIndex = 0) => {
    if (counters[counterIndex].length >= 5) {
      alert("Counter Full!");
      return;
    }
    setQueue((prevQueue) => {
      if (prevQueue.length === 0) return prevQueue;
      const nextItem = prevQueue[0];
      const remainingQueue = prevQueue.slice(1);

      const waitMs = nextItem.timeAddedToQueue
        ? Date.now() - nextItem.timeAddedToQueue
        : 0;

      if (waitMs > 0) {
        setServedTimes((prev) => [...prev, waitMs]);
      }

      fetch(`http://localhost:8080/queue/${nextItem.queueId}/status?status=serving&counterNumber=${counterIndex + 1}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Id": getAdminId(),
        },
      })
      .then(() => {
        fetchWaitingTickets();
        fetchServingTickets();
      })
      .catch(err => console.error("Failed to update status:", err));

      return remainingQueue;
    });
  };

  const nextQueue = (counterIndex = 0) => {
    setCounters((prev) => {
      const updated = [...prev];
      const current = [...updated[counterIndex]];
      if (current.length === 0) return prev;
      const servedItem = current.shift();
      updated[counterIndex] = current;

      if (servedItem?.queueId) {
        fetch(`http://localhost:8080/queue/${servedItem.queueId}/status?status=done`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "X-Admin-Id": getAdminId(),
          },
        })
        .then(() => {
          fetchWaitingTickets();
          fetchServingTickets();
        })
        .catch(err => console.error("Failed to update status:", err));
      }
      return updated;
    });
  };

  const markNoShow = (counterIndex = 0) => {
    setCounters((prev) => {
      const updated = [...prev];
      const current = [...updated[counterIndex]];
      if (current.length === 0) return prev;
      const skippedItem = current.shift();
      updated[counterIndex] = current;

      if (skippedItem?.queueId) {
        fetch(`http://localhost:8080/queue/${skippedItem.queueId}/status?status=noshow`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "X-Admin-Id": getAdminId(),
          },
        })
        .then(() => {
          fetchWaitingTickets();
          fetchServingTickets();
        })
        .catch(err => console.error("Failed to update status:", err));
      }
      return updated;
    });
    setNoShowCount((prev) => prev + 1);
  };

  const cancelQueue = (priorityNumber) => {
    if (!priorityNumber) return;

    const ticketInQueue = queue.find(q => q.priorityNumber === priorityNumber);
    const ticketInCounter = counters.flat().find(t => t.priorityNumber === priorityNumber);
    const ticket = ticketInQueue || ticketInCounter;

    setQueue((prev) => prev.filter((item) => item.priorityNumber !== priorityNumber));
    setCounters((prev) =>
      prev.map((counter) =>
        counter.filter((item) => item.priorityNumber !== priorityNumber)
      )
    );

    if (ticket?.queueId) {
      fetch(`http://localhost:8080/queue/${ticket.queueId}`, {
        method: "DELETE",
        headers: { "X-Admin-Id": getAdminId() },
      })
      .then(() => {
        fetchWaitingTickets();
        fetchServingTickets();
      })
      .catch(err => console.error("Failed to cancel ticket:", err));
    }
  };

  const updateStudent = (counterIndex, priorityNumber, updatedData) => {
    setCounters(prev => {
      const updated = [...prev];
      updated[counterIndex] = updated[counterIndex].map(item =>
        item.priorityNumber === priorityNumber ? { ...item, ...updatedData } : item
      );
      return updated;
    });
  };

  const value = {
    counters,
    queueList:       queue,
    waitingCount:    queue.length,
    nextInLine:      queue[0]?.priorityNumber || "---",
    noShowCount,
    averageWaitTime: servedTimes.length > 0
      ? Math.round(servedTimes.reduce((a, b) => a + b, 0) / servedTimes.length / 60000)
      : 0,
    addToCounter,
    nextQueue,
    markNoShow,
    cancelQueue,
    fetchWaitingTickets,
    fetchServingTickets,
    updateStudent,
    latestTicket,
    setLatestTicket,
  };

  return <QueueContext.Provider value={value}>{children}</QueueContext.Provider>;
};

export const useQueue = () => useContext(QueueContext);