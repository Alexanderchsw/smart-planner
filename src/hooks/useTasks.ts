// src/hooks/useTasks.ts
import { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';

/* ------------ типы ------------ */
export type Priority = 'high' | 'med' | 'low';
export type Status = 'todo' | 'inprogress' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  duration: number;      // минут
  dueDate: string;       // ISO-строка
}

/* ------------ localStorage helpers ------------ */
const KEY = 'tasks-smart-planner';

const readLS = (): Task[] =>
  JSON.parse(localStorage.getItem(KEY) || '[]');

const writeLS = (arr: Task[]) =>
  localStorage.setItem(KEY, JSON.stringify(arr));

/* ------------ React-хук ------------ */
export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>(readLS);

  /* при изменении массива — сохраняем в LS */
  useEffect(() => writeLS(tasks), [tasks]);

  /* CRUD */
  const addTask = (t: Omit<Task, 'id'>) =>
    setTasks([...tasks, { ...t, id: uuid() }]);

  const updateTask = (id: string, t: Partial<Task>) =>
    setTasks(tasks.map(task => (task.id === id ? { ...task, ...t } : task)));

  const deleteTask = (id: string) =>
    setTasks(tasks.filter(t => t.id !== id));

  return { tasks, addTask, updateTask, deleteTask };
};
