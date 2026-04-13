let queue = [];
let servedTimes = []; // store wait times
let currentNumber = 1;

const generateQueueId = () => {
  const letterIndex = Math.floor((currentNumber - 1) / 1000);
  const letter = String.fromCharCode(65 + letterIndex);
  const number = String(currentNumber).padStart(3, "0");

  return `${letter}${number}`;
};

// ADD QUEUE WITH TIMESTAMP
export const addQueue = () => {
  if (queue.length >= 26000) return null;

  const newQueue = {
    id: generateQueueId(),
    timeCreated: Date.now()
  };

  queue.push(newQueue);
  currentNumber++;

  return newQueue;
};

// NEXT QUEUE (CALCULATE WAIT TIME HERE)
export const nextQueue = () => {
  if (queue.length === 0) return;

  const served = queue.shift();

  const waitTime = Date.now() - served.timeCreated; // milliseconds
  servedTimes.push(waitTime);
};

export const deleteQueue = () => {
  queue.pop();
};

// GETTERS
export const getCurrentQueue = () => queue[0]?.id || "---";
export const getNextInLine = () => queue[1]?.id || "---";
export const getWaitingCount = () => queue.length;

// FIX: only return IDs for UI
export const getQueueList = () => queue.map(q => q.id);

// AVERAGE WAIT TIME (in minutes)
export const getAverageWaitTime = () => {
  if (servedTimes.length === 0) return 0;

  const total = servedTimes.reduce((a, b) => a + b, 0);
  const avgMs = total / servedTimes.length;

  return Math.round(avgMs / 60000); // convert to minutes
};