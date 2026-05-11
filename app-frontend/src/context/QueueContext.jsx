import React, { createContext, useState, useContext } from "react";

const QueueContext = createContext();
const STORAGE_KEY = "transactions";

/* ---------------- HISTORY ---------------- */
const saveToHistory = (item) => {
  if (!item) return;
  const existing = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  const updated = [
    ...existing,
    {
      priorityNumber: item.priorityNumber,
      name: item.name,
      transaction: item.transaction,
      date: new Date().toLocaleString()
    }
  ];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

/* ---------------- CONTEXT PROVIDER ---------------- */
export const QueueProvider = ({ children }) => {
  const [queue, setQueue] = useState([]);
  const [counters, setCounters] = useState(Array(8).fill(null).map(() => []));
  const [servedTimes, setServedTimes] = useState([]);
  const [currentNumber, setCurrentNumber] = useState(1);
  const [noShowCount, setNoShowCount] = useState(0); // Added for stats

  const isSystemEmpty = () => queue.length === 0 && counters.every((c) => c.length === 0);

  const generateQueueId = (num) => {
    const letterIndex = Math.floor((num - 1) / 999);
    const letter = String.fromCharCode(65 + letterIndex);
    const number = ((num - 1) % 999) + 1;
    return `${letter}${String(number).padStart(3, "0")}`;
  };

  const addQueue = (ticketData) => {
  setCurrentNumber((prev) => {
    const reset = isSystemEmpty();
    const base = reset ? 1 : prev;

    const newItem = {
      priorityNumber: generateQueueId(base),

      // student info
      studentId: ticketData.studentId,
      fullName: ticketData.fullName,
      yearLevel: ticketData.yearLevel,
      course: ticketData.course,

      // queue ticket info
      semester: ticketData.semester,
      transactionType: ticketData.transactionType,
      amount: ticketData.amount,

      timeCreated: Date.now(),
      status: "waiting"
    };

    setQueue((q) => [...q, newItem]);

    return reset ? 2 : prev + 1;
  });
};

  const addToCounter = (counterIndex = 0) => {
    if (counters[counterIndex].length >= 5) {
      alert("Counter Full!");
      return;
    }
    setQueue((prevQueue) => {
      if (prevQueue.length === 0) return prevQueue;
      const nextItem = prevQueue[0];
      const remainingQueue = prevQueue.slice(1);
      setServedTimes((prev) => [...prev, Date.now() - nextItem.timeCreated]);
      setCounters((prevCounters) => {
        const newCounters = [...prevCounters];
        newCounters[counterIndex] = [...newCounters[counterIndex], nextItem];
        return newCounters;
      });
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
      if (servedItem) {
        saveToHistory(servedItem);
      }
      return updated;
    });
  };

  /* ---------------- DELETE LAST QUEUE ---------------- */
  const deleteQueue = () => {
    setQueue((prev) => prev.slice(0, -1));
  };

  /* ---------------- CANCEL SPECIFIC ITEM ---------------- */
  const cancelQueue = (priorityNumber) => {
    setQueue((prev) => prev.filter((item) => item.priorityNumber !== priorityNumber));

    setCounters((prev) =>
      prev.map((counter) =>
        counter.filter((item) => item.priorityNumber !== priorityNumber)
      )
    );
  };

  const markNoShow = (counterIndex = 0) => {
    setCounters((prev) => {
      const updated = [...prev];
      const current = [...updated[counterIndex]];
      if (current.length === 0) return prev;
      const skippedItem = current.shift();
      updated[counterIndex] = current;
      if (skippedItem) {
        saveToHistory({ ...skippedItem, transaction: "No Show" });
      }
      return updated;
    });
    setNoShowCount((prev) => prev + 1);
  };

  function updateStudent(counterIndex, priorityNumber, updatedData) {
  setCounters(prevCounters => {
    const newCounters = [...prevCounters];

    newCounters[counterIndex] =
      newCounters[counterIndex].map(student =>
        student.priorityNumber === priorityNumber
          ? { ...student, ...updatedData }
          : student
      );

    return newCounters;
  });
}
  /* ---------------- VALUES ---------------- */
  const value = {
    queueList: queue,
    latestTicket: queue[queue.length - 1] || null,
    counters,
    waitingCount: queue.length,
    nextInLine: queue[0]?.priorityNumber || "---",

    averageWaitTime:
      servedTimes.length > 0
        ? Math.round(
            servedTimes.reduce((a, b) => a + b, 0) /
              servedTimes.length /
              60000
          )
        : 0,
    addQueue,
    addToCounter,
    nextQueue,
    cancelQueue,
    markNoShow,
    updateStudent
  };

  return <QueueContext.Provider value={value}>{children}</QueueContext.Provider>;
};

export const useQueue = () => useContext(QueueContext);