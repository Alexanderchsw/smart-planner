import { Task } from '../hooks/useTasks';

export interface CalEvent { id:string; title:string; start:string; end:string; backgroundColor:string }
const weight = (p: Task['priority']) => (p==='high'?1:p==='med'?2:3);

export const createSchedule = (tasks: Task[]): CalEvent[] => {
  const events: CalEvent[] = [];
  const sorted = [...tasks]
    .filter(t => t.status !== 'done')
    .sort((a,b)=>{
      const dA = +new Date(a.dueDate); const dB = +new Date(b.dueDate);
      return dA !== dB ? dA-dB : weight(a.priority)-weight(b.priority);
    });

  let cursor = new Date(); cursor.setHours(9,0,0,0);

  sorted.forEach(t=>{
    const start = new Date(cursor);
    const end   = new Date(start); end.setMinutes(end.getMinutes()+t.duration);
    cursor = new Date(end); cursor.setMinutes(cursor.getMinutes()+15);

    events.push({
      id: t.id, title: t.title,
      start: start.toISOString(),
      end:   end.toISOString(),
      backgroundColor:
        t.priority==='high' ? '#d32f2f' :
        t.priority==='med'  ? '#ffa726' : '#66bb6a',
    });
  });
  return events;
};
