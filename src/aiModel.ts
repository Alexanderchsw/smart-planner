// само-обучаемая длительность
export type Hist = { title: string; real: number };
const HKEY = 'history-smart-planner';

const read = (): Hist[] => JSON.parse(localStorage.getItem(HKEY) || '[]');
const write = (arr: Hist[]) => localStorage.setItem(HKEY, JSON.stringify(arr));

export const pushHistory = (rec: Hist) => write([...read(), rec]);

export const predictDuration = (title: string, fallback: number) => {
  const arr = read().filter(r => r.title === title).slice(-3);
  return arr.length
    ? Math.round(arr.reduce((s,r)=>s+r.real,0) / arr.length)
    : fallback;
};
