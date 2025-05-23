import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { EventClickArg, EventDropArg } from '@fullcalendar/core';
import ruLocale from '@fullcalendar/core/locales/ru';
import { Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import TaskModal from '../components/TaskModal';
import { useTasks, Task } from '../hooks/useTasks';
import { createSchedule } from '../utils/createSchedule';

export default function CalendarPage() {
  const navigate = useNavigate();
  const { tasks, addTask, updateTask } = useTasks();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Task | undefined>();

  const events = createSchedule(tasks);

  const handleSave = (data: Omit<Task,'id'>, id?: string) => {
    id ? updateTask(id,data) : addTask({ ...data, status:'todo' });
    setOpen(false);
    setEditing(undefined);
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <h2>Календарь задач</h2>
        <Button variant="contained" onClick={()=>navigate('/dashboard')}>НАЗАД К ЗАДАЧАМ</Button>
      </Box>

      <FullCalendar
        plugins={[dayGridPlugin,timeGridPlugin,interactionPlugin]}
        initialView="timeGridWeek"
        locale={ruLocale}
        height="auto"
        headerToolbar={{ left:'prev,next today', center:'title', right:'dayGridMonth,timeGridWeek,timeGridDay' }}
        events={events}
        dateClick={(arg: DateClickArg)=>{ setEditing(undefined); setOpen(true); }}
        eventClick={(arg: EventClickArg)=>{ const t=tasks.find(x=>x.id===arg.event.id); if(t){setEditing(t); setOpen(true);} }}
        editable
        eventDrop={(info: EventDropArg)=>updateTask(info.event.id,{dueDate:info.event.startStr})}
      />

      {open && (
        <TaskModal
          open={open}
          onClose={()=>{ setOpen(false); setEditing(undefined); }}
          onSave={handleSave}
          initial={editing}
        />
      )}
    </Box>
  );
}
