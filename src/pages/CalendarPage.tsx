import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { EventClickArg, EventDropArg } from '@fullcalendar/core';
import ruLocale from '@fullcalendar/core/locales/ru';
import { Box, Button } from '@mui/material';
import TaskModal from '../components/TaskModal';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'med' | 'low';
  duration: number;
  deadline?: string;
  flexibleRange: boolean;
  deadlineFrom?: string;
  deadlineTo?: string;
  recurrence: 'single' | 'daily' | 'weekly' | 'cron';
  tags: string[];
  energyLevel?: string;
  location?: string;
  bufferAfter?: number;
  completed?: boolean;
}

const CalendarPage: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Task[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [currentTask, setCurrentTask] = useState<Partial<Task> | null>(null);

  // ➡️  Синхронизация с локальным хранилищем
  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setEvents(JSON.parse(storedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(events));
  }, [events]);

  const handleDateClick = (arg: DateClickArg) => {
    setCurrentTask({
      id: Date.now().toString(),
      title: '',
      description: '',
      priority: 'med',
      duration: 0,
      flexibleRange: false,
      recurrence: 'single',
      tags: [],
      completed: false,
      deadline: arg.dateStr,
    });
    setOpenModal(true);
  };

  const handleEventClick = (arg: EventClickArg) => {
    const task = events.find((e) => e.id === arg.event.id);
    if (task) {
      setCurrentTask(task);
      setOpenModal(true);
    }
  };

  const handleSaveTask = (updatedTask: Task) => {
    if (events.find((t) => t.id === updatedTask.id)) {
      setEvents((prev) =>
        prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      );
    } else {
      setEvents((prev) => [...prev, updatedTask]);
    }
    setOpenModal(false);
  };

  const handleEventDrop = (info: EventDropArg) => {
    setEvents((prev) =>
      prev.map((task) =>
        task.id === info.event.id
          ? { ...task, deadline: info.event.startStr }
          : task
      )
    );
  };

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
        initialView="dayGridMonth"
        locale={ruLocale}
        events={events.map((task) => ({
          id: task.id,
          title: task.title,
          start: task.deadline,
          color:
            task.priority === 'high'
              ? '#d32f2f'
              : task.priority === 'med'
              ? '#ffa726'
              : '#66bb6a',
        }))}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        editable
        eventDrop={handleEventDrop}
        height="auto"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
      />

      <TaskModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleSaveTask}
        initialData={currentTask}
      />
    </Box>
  );
};

export default CalendarPage;
