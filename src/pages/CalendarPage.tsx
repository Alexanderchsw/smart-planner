import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { EventClickArg, EventDropArg } from '@fullcalendar/core';
import ruLocale from '@fullcalendar/core/locales/ru';
import { Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

import TaskModal from '../components/TaskModal';
import {
  Task,
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  completeTask
} from '../api/tasks';

const CalendarPage: React.FC = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);

  useEffect(() => {
    fetchTasks()
      .then(setTasks)
      .catch((err) => console.error('Ошибка загрузки задач:', err));
  }, []);

  const handleSaveTask = async (task: Task) => {
    try {
      let saved: Task;
      if (task.id) {
        saved = await updateTask(task);
        setTasks((prev) => prev.map((t) => (t.id === task.id ? saved : t)));
      } else {
        saved = await createTask(task);
        setTasks((prev) => [...prev, saved]);
      }
      setOpenModal(false);
      setCurrentTask(null);
    } catch (err) {
      console.error('Ошибка при сохранении задачи:', err);
    }
  };

  const handleDateClick = (arg: DateClickArg) => {
    setCurrentTask({
      title: '',
      description: '',
      status: 'pending',
      priority: 'med',
      duration: 60,
      deadline: arg.dateStr,
      flexible: false,
      repeat: 'single',
      energy_level: '',
      location: '',
      buffer_after: 0,
      created_by_ai: false,
      ai_estimate: 0,
      ai_confidence: 0
    });
    setOpenModal(true);
  };

  const handleEventClick = (arg: EventClickArg) => {
    const task = tasks.find((t) => t.id?.toString() === arg.event.id);
    if (task) {
      setCurrentTask(task);
      setOpenModal(true);
    }
  };

  const handleEventDrop = async (info: EventDropArg) => {
    const id = parseInt(info.event.id);
    const task = tasks.find((t) => t.id === id);
    if (task) {
      const updatedTask = { ...task, deadline: info.event.startStr };
      try {
        const res = await updateTask(updatedTask);
        setTasks((prev) => prev.map((t) => (t.id === id ? res : t)));
      } catch (err) {
        console.error('Ошибка при изменении времени:', err);
      }
    }
  };

  const events = tasks
    .filter((t) => t.status !== 'completed')
    .map((task) => ({
      id: task.id?.toString() || '',
      title: task.title,
      start: task.deadline || '',
      color:
        task.priority === 'high'
          ? '#e53935'
          : task.priority === 'med'
          ? '#ffb300'
          : '#43a047'
    }));

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <h2>Календарь задач</h2>
        <Button variant="contained" onClick={() => navigate('/dashboard')}>
          НАЗАД К ЗАДАЧАМ
        </Button>
      </Box>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        locale={ruLocale}
        events={events}
        editable
        eventDrop={handleEventDrop}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        height="auto"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
      />

      {openModal && (
        <TaskModal
          open={openModal}
          onClose={() => {
            setOpenModal(false);
            setCurrentTask(null);
          }}
          onSubmit={handleSaveTask}
          initialData={currentTask}
        />
      )}
    </Box>
  );
};

export default CalendarPage;
