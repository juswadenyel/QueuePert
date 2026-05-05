import React, { createContext, useState, useContext } from "react";

const QueueContext = createContext();

export const QueueProvider = ({ children }) => {
  const [queue, setQueue] = useState([]);
  const [servedTimes, setServedTimes] = useState([]);
  const [currentNumber, setCurrentNumber] = useState(1);
  const [counters, setCounters] = useState(
    Array(8).fill(null).map(() => [])
  );

  // 🔹 Generate A001 → B001 format
  const generateQueueId = (num) => {
    const letterIndex = Math.floor((num - 1) / 999);
    const letter = String.fromCharCode(65 + letterIndex);
    const number = ((num - 1) % 999) + 1;
    return `${letter}${String(number).padStart(3, "0")}`;
  };

  // 🔹 Add Queue
  const addQueue = () => {
    const nextId = generateQueueId(currentNumber);

    setCurrentNumber((prev) => prev + 1);

    setQueue((prevQueue) => [
      ...prevQueue,
      { id: nextId, timeCreated: Date.now() }
    ]);

    return nextId;
  };

  // 🔹 Move to counter
  const nextQueue = (counterIndex = 0) => {
    setCounters((prevCounters) => {
      const newCounters = [...prevCounters];
      let currentCounterList = [...newCounters[counterIndex]];

      // 1. ALWAYS try to remove the oldest if there's someone in the container
      if (currentCounterList.length > 0) {
        currentCounterList.shift();
      }

      setQueue((prevQueue) => {
        // 2. If someone is waiting in the unqueued line
        if (prevQueue.length > 0) {
          const nextItem = prevQueue[0];
          setServedTimes((prev) => [...prev, Date.now() - nextItem.timeCreated]);

          // Append the new student to the already shifted list
          newCounters[counterIndex] = [...currentCounterList, nextItem.id];
          
          // Remove from unqueued line
          return prevQueue.slice(1);
        } else {
          // 3. If line is empty, just update counter with the shifted (shorter) list
          newCounters[counterIndex] = [...currentCounterList];
          return prevQueue;
        }
      });

      return newCounters;
    });
  };

  // 🔹 Add directly to counter
  const addToCounter = (counterIndex = 0) => {
    if (counters[counterIndex].length >= 5) {
      alert("Counter Full!");
      return;
    }

    setQueue((prevQueue) => {
      if (prevQueue.length === 0) return prevQueue;

      const nextItem = prevQueue[0];

      setServedTimes((prev) => [...prev, 2 * 60000]);

      setCounters((prevCounters) => {
        const updated = [...prevCounters];
        updated[counterIndex] = [
          ...updated[counterIndex],
          nextItem.id
        ];
        return updated;
      });

      return prevQueue.slice(1);
    });
  };

  // 🔹 Delete last queue
  const deleteQueue = () => {
    setQueue((prev) => prev.slice(0, -1));
  };

  // 🔥 NEW: CANCEL QUEUE (FIX FOR YOUR ERROR)
  const cancelQueue = (ticketId) => {
    if (!ticketId) return;

    // remove from queue list
    setQueue((prev) =>
      prev.filter((item) => item.id !== ticketId)
    );

    // remove from counters
    setCounters((prev) =>
      prev.map((counter) =>
        counter.filter((id) => id !== ticketId)
      )
    );
  };

  // 🔹 Computed values (AUTO SYNC)
  const value = {
    counters,
    queueList: queue.map((q) => q.id),
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
    nextQueue,
    addToCounter,
    deleteQueue,
    cancelQueue // ✅ IMPORTANT FIX
  };

  return (
    <QueueContext.Provider value={value}>
      {children}
    </QueueContext.Provider>
  );
};

// 🔹 Custom hook
export const useQueue = () => useContext(QueueContext);