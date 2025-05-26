import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, RadioGroup, FormControlLabel, Radio,
  Checkbox, Select, MenuItem, Accordion, AccordionSummary,
  AccordionDetails, InputLabel, FormControl, Box, Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DateTimePicker } from '@mui/x-date-pickers';
import axios from 'axios';
import { Task } from '../api/tasks';
import dayjs, { Dayjs } from 'dayjs';

const TaskModal = ({
  open,
  onClose,
  onSubmit,
  initialData,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (task: Task) => void;
  initialData: Task | null;
}) => {
  const [task, setTask] = useState<Task>({
    title: '',
    description: '',
    status: 'pending',
    priority: 'med',
    duration: 0,
    flexible: false,
    repeat: 'single',
    energy_level: '',
    location: '',
    buffer_after: 0,
    deadline: undefined,
    created_by_ai: false,
    ai_estimate: 0,
    ai_confidence: 0,
  });

  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setTask(initialData);
    }
  }, [initialData]);

  useEffect(() => {
    if (task.title.length >= 3) {
      setAiLoading(true);
      axios
        .get(`http://127.0.0.1:8000/ai/predict-duration`, {
          params: { title: task.title },
        })
        .then((res) => {
          const { predicted_duration, confidence } = res.data;
          setTask((prev) => ({
            ...prev,
            duration: predicted_duration,
            created_by_ai: true,
            ai_estimate: predicted_duration,
            ai_confidence: confidence,
          }));
          setAiError(null);
        })
        .catch(() => setAiError('Ошибка предсказания AI'))
        .finally(() => setAiLoading(false));
    }
  }, [task.title]);

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
        {aiLoading && <Typography color="textSecondary">AI предсказание...</Typography>}
        {task.created_by_ai && !aiLoading && (
          <Typography color="success.main" variant="body2">
            AI: {task.ai_estimate} мин. (доверие: {task.ai_confidence})
          </Typography>
        )}
        {aiError && <Typography color="error">{aiError}</Typography>}

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
            value={task.deadline ? dayjs(task.deadline) : null}
            onChange={(value) => handleChange('deadline', value?.toISOString())}
            sx={{ width: '100%' }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={task.flexible}
                onChange={(e) => handleChange('flexible', e.target.checked)}
              />
            }
            label="Гибкий"
          />
        </Box>

        <FormControl fullWidth margin="dense">
          <InputLabel id="repeat-label">Повторяемость</InputLabel>
          <Select
            labelId="repeat-label"
            label="Повторяемость"
            value={task.repeat || 'single'}
            onChange={(e) => handleChange('repeat', e.target.value)}
          >
            <MenuItem value="single">Однократно</MenuItem>
            <MenuItem value="daily">Ежедневно</MenuItem>
            <MenuItem value="weekly">Еженедельно</MenuItem>
            <MenuItem value="cron">Cron (гибкий)</MenuItem>
          </Select>
        </FormControl>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>Дополнительные</AccordionSummary>
          <AccordionDetails>
            <FormControl fullWidth margin="dense">
              <InputLabel id="energy-label">Уровень энергии</InputLabel>
              <Select
                labelId="energy-label"
                value={task.energy_level || ''}
                onChange={(e) => handleChange('energy_level', e.target.value)}
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
              value={task.buffer_after}
              onChange={(e) => handleChange('buffer_after', Number(e.target.value))}
              margin="dense"
            />
          </AccordionDetails>
        </Accordion>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button onClick={handleSave} variant="contained">Сохранить</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskModal;
