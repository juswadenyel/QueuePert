import React, { createContext, useState, useContext } from "react";

const QueueContext = createContext();

export const QueueProvider = ({ children }) => {
  const [queue, setQueue] = useState([]);
  const [servedTimes, setServedTimes] = useState([]);
  const [currentNumber, setCurrentNumber] = useState(1);
  const [counters, setCounters] = useState(Array(8).fill(null).map(() => []));

  const generateQueueId = (num) => {
    const letterIndex = Math.floor((num - 1) / 999);
    const letter = String.fromCharCode(65 + letterIndex);
    const number = ((num - 1) % 999) + 1;
    return `${letter}${String(number).padStart(3, "0")}`;
  };

  const addQueue = () => {
    if (currentNumber > 25974) return;
    setQueue((prevQueue) => {
      const nextId = generateQueueId(currentNumber);
      if (prevQueue.length > 0 && prevQueue[prevQueue.length - 1].id === nextId) {
        return prevQueue;
      }
      setCurrentNumber((prev) => prev + 1);
      return [...prevQueue, { id: nextId, timeCreated: Date.now() }];
    });
  };

  const nextQueue = (counterIndex = 0) => {
    setCounters((prevCounters) => {
      const newCounters = [...prevCounters];
      let currentCounterList = [...newCounters[counterIndex]];

      setQueue((prevQueue) => {
        if (prevQueue.length > 0) {
          const nextItem = prevQueue[0];
          setServedTimes((prev) => [...prev, Date.now() - nextItem.timeCreated]);

          if (currentCounterList.length >= 5) {
            currentCounterList.shift();
          }
          
          newCounters[counterIndex] = [...currentCounterList, nextItem.id];
          return prevQueue.slice(1);
        }
        else {
            if (currentCounterList.length > 0) {
              currentCounterList.shift();
            }
            newCounters[counterIndex] = [...currentCounterList];
            return prevQueue;
          }
        });

      return newCounters;
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
        newCounters[counterIndex] = [...newCounters[counterIndex], nextItem.id];
        return newCounters;
      });
      return remainingQueue;
    });
  };

  const deleteQueue = () => setQueue((prev) => prev.slice(0, -1));

  const value = {
    counters,
    queueList: queue.map(q => q.id),
    waitingCount: queue.length,
    nextInLine: queue[0]?.priorityNumber || "---",
    averageWaitTime: servedTimes.length > 0 
      ? Math.round((servedTimes.reduce((a, b) => a + b, 0) / servedTimes.length) / 60000) 
      : 0,
    addQueue,
    nextQueue,
    addToCounter,
    deleteQueue
  };

  return <QueueContext.Provider value={value}>{children}</QueueContext.Provider>;
};

export const useQueue = () => useContext(QueueContext);