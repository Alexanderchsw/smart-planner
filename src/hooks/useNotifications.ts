// src/hooks/useNotifications.ts
import { useEffect, useRef } from 'react';
import { Task } from './useTasks';

export const useNotifications = (tasks: Task[]) => {
  const scheduled = useRef<Record<string, number>>({});

  useEffect(() => {
    // Запрашиваем разрешение один раз
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const now = Date.now();

    tasks.forEach(task => {
      // Только для запланированных (inprogress) и не выполненных
      if (task.status !== 'done' && task.dueDate) {
        const due = new Date(task.dueDate).getTime();
        // Уведомление за 5 минут до дедлайна
        const notifyAt = due - 5 * 60 * 1000;
        // Если время ещё не наступило и мы не ставили таймер
        if (notifyAt > now && !scheduled.current[task.id]) {
          scheduled.current[task.id] = window.setTimeout(() => {
            if (Notification.permission === 'granted') {
              new Notification('Напоминание: задача скоро начнётся', {
                body: `${task.title} — через 5 минут`,
                tag: task.id,
              });
            } else {
              alert(`Напоминание: "${task.title}" через 5 минут`);
            }
          }, notifyAt - now);
        }
      }
    });

    // Очистка таймеров при размонтировании
    return () => {
      Object.values(scheduled.current).forEach(clearTimeout);
      scheduled.current = {};
    };
  }, [tasks]);
};
