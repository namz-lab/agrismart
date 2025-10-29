import type { DetectionResult } from '@/types';

const HISTORY_KEY = 'AGRISMART-detectionHistory';

export const getHistory = (): DetectionResult[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const historyJson = localStorage.getItem(HISTORY_KEY);
    return historyJson ? JSON.parse(historyJson) : [];
  } catch (error) {
    console.error('Error reading from localStorage', error);
    return [];
  }
};

export const saveHistory = (history: DetectionResult[]) => {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    const historyJson = JSON.stringify(history);
    localStorage.setItem(HISTORY_KEY, historyJson);
  } catch (error) {
    console.error('Error writing to localStorage', error);
  }
};

export const addToHistory = (result: DetectionResult) => {
  const currentHistory = getHistory();
  const newHistory = [result, ...currentHistory];
  saveHistory(newHistory);
};


export const getHistoryItem = (id: string): DetectionResult | undefined => {
  const history = getHistory();
  return history.find(item => item.id === id);
};


export const clearHistory = () => {
    if (typeof window === 'undefined') {
        return;
    }
    try {
        localStorage.removeItem(HISTORY_KEY);
    } catch (error) {
        console.error('Error clearing localStorage', error);
    }
}
