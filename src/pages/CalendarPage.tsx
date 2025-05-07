import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, {
  DateClickArg,
} from '@fullcalendar/interaction';
import { EventClickArg, EventDropArg } from '@fullcalendar/core';
import ruLocale from '@fullcalendar/core/locales/ru';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface TaskEvent {
  id: string;
  title: string;
  date: string;
  completed?: boolean;
}

const CalendarPage: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<TaskEvent[]>([
    {
      id: '1',
      title: 'Продумать ИИ-планировщик',
      date: '2025-05-03',
    },
    {
      id: '2',
      title: 'Создать календарь',
      date: '2025-05-02',
    },
  ]);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  const handleDateClick = (arg: DateClickArg) => {
    setSelectedDate(arg.dateStr);
    setNewTitle('');
    setEditingEventId(null);
  };

  const handleEventClick = (arg: EventClickArg) => {
    const event = events.find(e => e.id === arg.event.id);
    if (event) {
      setSelectedDate(event.date);
      setNewTitle(event.title);
      setEditingEventId(event.id);
    }
  };

  const handleEventDrop = (arg: EventDropArg) => {
    setEvents(prev =>
      prev.map(e =>
        e.id === arg.event.id
          ? { ...e, date: arg.event.startStr }
          : e
      )
    );
  };

  const handleSave = () => {
    if (!selectedDate) return;

    if (editingEventId) {
      setEvents(prev =>
        prev.map(e =>
          e.id === editingEventId ? { ...e, title: newTitle } : e
        )
      );
    } else {
      const newEvent: TaskEvent = {
        id: Date.now().toString(),
        title: newTitle,
        date: selectedDate,
      };
      setEvents(prev => [...prev, newEvent]);
    }

    setSelectedDate(null);
    setNewTitle('');
    setEditingEventId(null);
  };

  const handleDelete = () => {
    if (!editingEventId) return;
    setEvents(prev => prev.filter(e => e.id !== editingEventId));
    setSelectedDate(null);
    setEditingEventId(null);
    setNewTitle('');
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
        events={events}
        editable={true}
        droppable={true}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        eventDrop={handleEventDrop}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        height="auto"
      />

      <Dialog open={!!selectedDate} onClose={() => setSelectedDate(null)}>
        <DialogTitle>{editingEventId ? 'Редактировать задачу' : 'Добавить задачу'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Название задачи"
            type="text"
            fullWidth
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          {editingEventId && (
            <Button color="error" onClick={handleDelete}>
              Удалить
            </Button>
          )}
          <Button onClick={() => setSelectedDate(null)}>Отмена</Button>
          <Button onClick={handleSave} disabled={!newTitle.trim()}>
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CalendarPage;
