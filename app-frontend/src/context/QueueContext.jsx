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
      id: item.id,
      name: item.name,
      transaction: item.transaction,
      date: new Date().toLocaleString()
    }
  ];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

/* ---------------- CONTEXT ---------------- */
export const QueueProvider = ({ children }) => {
  const [queue, setQueue] = useState([]);
  const [counters, setCounters] = useState(Array(8).fill(null).map(() => []));
  const [servedTimes, setServedTimes] = useState([]);
  const [currentNumber, setCurrentNumber] = useState(1);

  /* ---------------- RESET LOGIC ---------------- */
  const isSystemEmpty = () =>
    queue.length === 0 && counters.every((c) => c.length === 0);

  const generateQueueId = (num) => {
    const letterIndex = Math.floor((num - 1) / 999);
    const letter = String.fromCharCode(65 + letterIndex);
    const number = ((num - 1) % 999) + 1;
    return `${letter}${String(number).padStart(3, "0")}`;
  };

  /* ---------------- ADD QUEUE ---------------- */
  const addQueue = (studentData) => {
    setCurrentNumber((prev) => {
      const reset = isSystemEmpty();
      const base = reset ? 1 : prev;

      const newItem = {
        id: generateQueueId(base),
        studentId: studentData.studentId,
        name: studentData.name,
        year: studentData.year,
        semester: studentData.semester,
        transaction: studentData.transaction,
        timeCreated: Date.now(),
        status: "waiting"
      };

      setQueue((q) => [...q, newItem]);

      return reset ? 2 : prev + 1;
    });
  };

  /* ---------------- ADD TO COUNTER ---------------- */
 const addToCounter = (counterIndex = 0) => {
    // 1. Check the limit FIRST
    if (counters[counterIndex].length >= 5) {
      alert("Counter Full!");
      return; // CRITICAL: This stops the function here so no one is added
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

  /* ---------------- NEXT QUEUE ---------------- */
  const nextQueue = (counterIndex = 0) => {
    setCounters((prev) => {
      const updated = [...prev];
      const current = [...updated[counterIndex]];

      if (current.length === 0) return prev;

      const servedItem = current.shift();
      updated[counterIndex] = current;

      if (servedItem) {
        saveToHistory(servedItem);

        setServedTimes((prevTimes) => [
          ...prevTimes,
          Date.now() - servedItem.timeCreated
        ]);
      }

      return updated;
    });
  };

  /* ---------------- DELETE LAST QUEUE ---------------- */
  const deleteQueue = () => {
    setQueue((prev) => prev.slice(0, -1));
  };

  /* ---------------- CANCEL SPECIFIC ITEM ---------------- */
  const cancelQueue = (id) => {
    setQueue((prev) => prev.filter((item) => item.id !== id));

    setCounters((prev) =>
      prev.map((counter) =>
        counter.filter((item) => item.id !== id)
      )
    );
  };

  /* ---------------- VALUES ---------------- */
  const value = {
    queueList: queue,
    counters,
    waitingCount: queue.length,
    nextInLine: queue[0]?.id || "---",

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
    deleteQueue,
    cancelQueue
  };

  return (
    <QueueContext.Provider value={value}>
      {children}
    </QueueContext.Provider>
  );
};

export const useQueue = () => useContext(QueueContext);