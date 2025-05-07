import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  InputLabel,
  FormControl,
  Box,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DateTimePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';

interface Task {
  id?: string;
  title: string;
  description: string;
  priority: 'high' | 'med' | 'low';
  duration: number;
  deadline?: Dayjs | null;
  flexibleRange: boolean;
  deadlineFrom?: Dayjs | null;
  deadlineTo?: Dayjs | null;
  recurrence: 'single' | 'daily' | 'weekly' | 'cron';
  tags: string[];
  energyLevel?: string;
  location?: string;
  bufferAfter?: number;
  completed?: boolean;
}

const TaskModal = ({ open, onClose, onSubmit, initialData }: any) => {
  const [task, setTask] = useState<Task>(
    initialData || {
      title: '',
      description: '',
      priority: 'med',
      duration: 0,
      flexibleRange: false,
      recurrence: 'single',
      tags: [],
      energyLevel: '',
      location: '',
      bufferAfter: 0,
      completed: false,
      deadline: null,
      deadlineFrom: null,
      deadlineTo: null,
    }
  );

  const handleChange = (field: keyof Task, value: any) => {
    setTask((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSubmit(task);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Задача</DialogTitle>
      <DialogContent>
        <TextField
          label="Название"
          fullWidth
          value={task.title}
          onChange={(e) => handleChange('title', e.target.value)}
          margin="dense"
        />
        <TextField
          label="Описание"
          multiline
          fullWidth
          value={task.description}
          onChange={(e) => handleChange('description', e.target.value)}
          margin="dense"
        />

        <RadioGroup
          row
          value={task.priority}
          onChange={(e) => handleChange('priority', e.target.value)}
        >
          <FormControlLabel value="high" control={<Radio />} label="Высокий" />
          <FormControlLabel value="med" control={<Radio />} label="Средний" />
          <FormControlLabel value="low" control={<Radio />} label="Низкий" />
        </RadioGroup>

        <TextField
          label="Длительность, мин"
          type="number"
          fullWidth
          value={task.duration}
          onChange={(e) => handleChange('duration', Number(e.target.value))}
          margin="dense"
        />

        <Box display="flex" alignItems="center" gap={2} mt={2}>
          <DateTimePicker
            label="Дедлайн"
            value={task.deadline}
            onChange={(value) => handleChange('deadline', value)}
            sx={{ width: '100%' }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={task.flexibleRange}
                onChange={(e) => handleChange('flexibleRange', e.target.checked)}
              />
            }
            label="Гибкий диапазон"
          />
        </Box>

        {task.flexibleRange && (
          <Box display="flex" gap={2} mt={2}>
            <DateTimePicker
              label="Не раньше"
              value={task.deadlineFrom}
              onChange={(value) => handleChange('deadlineFrom', value)}
              sx={{ width: '50%' }}
            />
            <DateTimePicker
              label="Не позже"
              value={task.deadlineTo}
              onChange={(value) => handleChange('deadlineTo', value)}
              sx={{ width: '50%' }}
            />
          </Box>
        )}

        <FormControl fullWidth margin="dense">
          <InputLabel id="recurrence-label">Повторяемость</InputLabel>
          <Select
            labelId="recurrence-label"
             label="Повторяемость"
            value={task.recurrence}
            onChange={(e) => handleChange('recurrence', e.target.value)}
          >
            <MenuItem value="single">Однократно</MenuItem>
            <MenuItem value="daily">Ежедневно</MenuItem>
            <MenuItem value="weekly">Еженедельно</MenuItem>
            <MenuItem value="cron">Cron (гибкий)</MenuItem>
          </Select>
        </FormControl>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            Дополнительные
          </AccordionSummary>
          <AccordionDetails>
            <FormControl fullWidth margin="dense">
              <InputLabel id="energy-label">Уровень энергии</InputLabel>
              <Select
                labelId="energy-label"
                value={task.energyLevel}
                onChange={(e) => handleChange('energyLevel', e.target.value)}
              >
                <MenuItem value="low">Низкий</MenuItem>
                <MenuItem value="medium">Средний</MenuItem>
                <MenuItem value="high">Высокий</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Локация"
              fullWidth
              value={task.location}
              onChange={(e) => handleChange('location', e.target.value)}
              margin="dense"
            />
            <TextField
              label="Буфер после задачи, мин"
              type="number"
              fullWidth
              value={task.bufferAfter}
              onChange={(e) => handleChange('bufferAfter', Number(e.target.value))}
              margin="dense"
            />
          </AccordionDetails>
        </Accordion>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button onClick={handleSave} variant="contained">
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskModal;
