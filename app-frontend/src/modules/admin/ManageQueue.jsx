let queue = [];
let servedTimes = [];
let currentNumber = 1;
let counters = Array(8).fill(null).map(() => []);

const generateQueueId = () => {
  const letterIndex = Math.floor((currentNumber - 1) / 999);
  const letter = String.fromCharCode(65 + letterIndex);
  const number = ((currentNumber - 1) % 999) + 1;
  return `${letter}${String(number).padStart(3, "0")}`;
};

export const addQueue = () => {
  if (currentNumber > 25974) return null;
  const newQueue = { id: generateQueueId(), timeCreated: Date.now() };
  queue.push(newQueue);
  currentNumber++;
  return newQueue.id;
};

export const nextQueue = (counterIndex = 0) => {
  if (counters[counterIndex].length > 0) counters[counterIndex].shift();
  if (queue.length > 0) {
    const next = queue.shift();
    servedTimes.push(Date.now() - next.timeCreated);
    counters[counterIndex].push(next.id);
  }
};

export const addToCounter = (counterIndex = 0) => {
  if (counters[counterIndex].length >= 5) return alert("Counter Full!");
  if (queue.length > 0) {
    const next = queue.shift();
    servedTimes.push(Date.now() - next.timeCreated);
    counters[counterIndex].push(next.id);
  }
};

export const deleteQueue = () => queue.pop();
export const getNextInLine = () => queue[0]?.id || "---";
export const getWaitingCount = () => queue.length;
export const getQueueList = () => queue.map(q => q.id);
export const getCounters = () => counters;
export const getAverageWaitTime = () => {
  if (servedTimes.length === 0) return 0;
  const total = servedTimes.reduce((a, b) => a + b, 0);
  return Math.round((total / servedTimes.length) / 60000);
};