import React, { useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, MenuItem, RadioGroup,
  FormControlLabel, Radio, Stack
} from '@mui/material';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { Task } from '../hooks/useTasks';
import { predictDuration } from '../aiModel';

interface Props {
  open: boolean;
  initial?: Task;
  onClose: () => void;
  onSave: (data: Omit<Task, 'id'>, id?: string) => void;
}

type Form = Omit<Task, 'id'>;

export default function TaskModal({ open, initial, onClose, onSave }: Props) {
  const { register, handleSubmit, control, setValue } = useForm<Form>({
    defaultValues: initial ?? {
      title: '',
      description: '',
      priority: 'med',
      status: 'todo',
      duration: predictDuration('', 60),
      dueDate: '',
    },
  });

  // следим за вводом названия
  const title = useWatch({ control, name: 'title' });

  // при смене title у новой задачи (initial === undefined)
  useEffect(() => {
    if (!initial && title) {
      const rec = predictDuration(title, 60);
      setValue('duration', rec, { shouldDirty: false });
    }
  }, [initial, title, setValue]);

  // отправка формы
  const onSubmit = (data: Form) => {
    onSave(data, initial?.id);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initial ? 'Редактировать' : 'Новая задача'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Название"
            {...register('title', { required: true })}
            autoFocus
          />

          <TextField
            label="Описание"
            multiline
            rows={3}
            {...register('description')}
          />

          <RadioGroup row {...register('priority')}>
            <FormControlLabel value="high" control={<Radio />} label="High" />
            <FormControlLabel value="med" control={<Radio />} label="Med" />
            <FormControlLabel value="low" control={<Radio />} label="Low" />
          </RadioGroup>

          <TextField select label="Статус" {...register('status')}>
            <MenuItem value="todo">В приоритете</MenuItem>
            <MenuItem value="inprogress">Запланировано</MenuItem>
            <MenuItem value="done">Выполнено</MenuItem>
          </TextField>

          <TextField
            label="Длительность, мин"
            type="number"
            helperText={`Рекомендовано ИИ: ${useWatch({ control, name: 'duration' })} мин`}
            {...register('duration', { valueAsNumber: true, min: 1 })}
          />

          <Controller
            control={control}
            name="dueDate"
            rules={{ required: true }}
            render={({ field, fieldState }) => (
              <TextField
                label="Дедлайн"
                type="datetime-local"
                InputLabelProps={{ shrink: true }}
                {...field}
                error={!!fieldState.error}
              />
            )}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button variant="contained" onClick={handleSubmit(onSubmit)}>
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
}
