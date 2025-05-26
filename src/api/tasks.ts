// src/api/tasks.ts
import axios from 'axios';

export const API_URL = 'http://localhost:8000';

export interface Task {
  id?: number;
  title: string;
  description?: string;
  status: string;
  priority?: 'high' | 'med' | 'low';
  duration?: number;
  deadline?: string;
  flexible?: boolean;
  repeat?: string;
  energy_level?: string;
  location?: string;
  buffer_after?: number;
  created_by_ai?: boolean;
  ai_estimate?: number;
  ai_confidence?: number;
  completed_at?: string;
  created_at?: string;
  updated_at?: string;
}

// API-запросы

export const fetchTasks = async (): Promise<Task[]> => {
  const response = await axios.get(`${API_URL}/tasks/`);
  return response.data;
};

export const createTask = async (task: Task): Promise<Task> => {
  const response = await axios.post(`${API_URL}/tasks/`, task);
  return response.data;
};

export const updateTask = async (task: Task): Promise<Task> => {
  const response = await axios.put(`${API_URL}/tasks/${task.id}`, task);
  return response.data;
};

export const deleteTask = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/tasks/${id}`);
};

export const completeTask = async (id: number): Promise<Task> => {
  const response = await axios.put(`${API_URL}/tasks/${id}`, { status: 'completed' });
  return response.data;
};
