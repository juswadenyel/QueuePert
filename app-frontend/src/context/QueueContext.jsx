import React, { createContext, useState, useContext, useEffect, useRef } from "react";
// CHANGED: added useRef import — needed for pendingReorderRef

const QueueContext = createContext();

export const QueueProvider = ({ children }) => {
  const [queue, setQueue] = useState([]);
  const [servedTimes, setServedTimes] = useState([]);
  const [counters, setCounters] = useState(Array(8).fill(null).map(() => []));
  const [noShowCount, setNoShowCount] = useState(0);
  const [latestTicket, setLatestTicket] = useState(null);

  // ADDED: tracks a pending drag reorder so the next poll cycle doesn't
  // overwrite it with the server's original order before the backend persists it.
  // Shape: { counterIndex: number, order: array } | null
  const pendingReorderRef = useRef(null);

  useEffect(() => {
    fetchWaitingTickets();
    fetchServingTickets();
    fetchNoShowCount();
    const interval = setInterval(() => {
      fetchWaitingTickets();
      fetchServingTickets();
      fetchNoShowCount();
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

  // CHANGED: fetchServingTickets now checks pendingReorderRef before calling
  // setCounters. If a drag reorder is pending, it injects the local order for
  // that counter instead of the server's order, then clears the ref so
  // subsequent polls use the server order normally (by then the backend has
  // persisted the new order from the PATCH in reorderCounter).
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

      // ADDED: if a drag reorder happened since the last poll, preserve it for
      // this cycle so the UI doesn't visibly snap back to the old server order.
      if (pendingReorderRef.current !== null) {
        const { counterIndex, order } = pendingReorderRef.current;
        newCounters[counterIndex] = order;
        pendingReorderRef.current = null; // clear — next poll uses server order
      }

      setCounters(newCounters);
    } catch (err) {
      console.error("Failed to load serving tickets:", err);
    }
  }

  async function fetchNoShowCount() {
    try {
      const res = await fetch("http://localhost:8080/queue/noshow/count");
      if (!res.ok) return;
      const count = await res.json();
      setNoShowCount(count);
    } catch (err) {
      console.error("Failed to fetch noshow count:", err);
    }
  }

  function getAdminId() {
    const admin = JSON.parse(localStorage.getItem("admin") || "{}");
    return admin.adminId || null;
  }

  const addToCounter = (counterIndex = 0, specificTicket = null) => {
    if (counters[counterIndex].length >= 5) {
      alert("Counter Full!");
      return;
    }
    setQueue((prevQueue) => {
      if (prevQueue.length === 0) return prevQueue;

      const nextItem = specificTicket
        ? prevQueue.find(q => q.queueId === specificTicket.queueId) || prevQueue[0]
        : prevQueue[0];

      const remainingQueue = prevQueue.filter(q => q.queueId !== nextItem.queueId);

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

    const ticketInQueue   = queue.find(q => q.priorityNumber === priorityNumber);
    const ticketInCounter = counters.flat().find(t => t.priorityNumber === priorityNumber);
    const ticket          = ticketInQueue || ticketInCounter;

    setQueue((prev) => prev.filter((item) => item.priorityNumber !== priorityNumber));
    setCounters((prev) =>
      prev.map((counter) =>
        counter.filter((item) => item.priorityNumber !== priorityNumber)
      )
    );

    if (ticket?.queueId) {
      fetch(`http://localhost:8080/queue/${ticket.queueId}/cancel`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
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

  // CHANGED: reorderCounter now does three things instead of one:
  //   1. Optimistically updates local counters state immediately (same as before)
  //      so the UI (Now Serving, YOUR QUEUE, TransactionInfo) reflects the drag
  //      without waiting for a round-trip.
  //   2. Sets pendingReorderRef so the very next fetchServingTickets() call
  //      injects the local order instead of the server's stale order.
  //   3. PATCHes the new order to the backend so it persists and future polls
  //      return the correct order automatically.
  //      Endpoint expected: PATCH /queue/counter/{counterNumber}/reorder
  //      Body: { queueIds: string[] }  — ordered array of queueId values.
  const reorderCounter = (counterIndex, newOrder) => {
    // Step 1: update local context state so all panels rerender immediately
    setCounters(prev => {
      const updated = [...prev];
      updated[counterIndex] = newOrder;
      return updated;
    });

    // Step 2: protect against the next poll overwriting this reorder
    pendingReorderRef.current = { counterIndex, order: newOrder };

    // Step 3: persist the new order to the backend
    const queueIds = newOrder.map(s => s.queueId);
    fetch(`http://localhost:8080/queue/counter/${counterIndex + 1}/reorder`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-Admin-Id": getAdminId(),
      },
      body: JSON.stringify({ queueIds }),
    }).catch(err => console.error("Failed to persist reorder:", err));
    // Note: no .then() refresh here — the optimistic update already reflects
    // the change, and pendingReorderRef shields the next poll. A failed PATCH
    // will self-correct on the poll after pendingReorderRef clears.
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
    reorderCounter,
    latestTicket,
    setLatestTicket,
  };

  return <QueueContext.Provider value={value}>{children}</QueueContext.Provider>;
};

export const useQueue = () => useContext(QueueContext);