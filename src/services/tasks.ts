import api from './api';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
}

const mockTasks: Task[] = [
  { id: '1', title: 'Подключить авторизацию', description: 'Важная задача', status: 'В приоритете' },
  { id: '2', title: 'Реализовать календарь', description: 'Добавить модули', status: 'Запланировано' },
  { id: '3', title: 'Сделать дизайн Dashboard', description: 'Профессиональный вид', status: 'Выполнено' },
];

export const fetchTasks = async (): Promise<Task[]> => {
  console.log('Получение задач...');
  return mockTasks;
};

export const addTask = async (task: Omit<Task, 'id'>): Promise<Task> => {
  const newTask = { ...task, id: Date.now().toString() };
  mockTasks.push(newTask);
  console.log('Добавлена новая задача:', newTask);
  return newTask;
};

export const updateTask = async (id: string, updatedTask: Task): Promise<Task> => {
  const index = mockTasks.findIndex((task) => task.id === id);
  if (index !== -1) {
    mockTasks[index] = { ...mockTasks[index], ...updatedTask };
    console.log(`Задача ${id} обновлена:`, updatedTask);
    return mockTasks[index];
  }
  throw new Error(`Задача с ID ${id} не найдена`);
};
