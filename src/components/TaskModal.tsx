// src/components/TaskModal.tsx
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Button,
  } from '@mui/material';
  import { useState, useEffect } from 'react';
  
  interface TaskModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (title: string, status: string) => void;
    defaultTitle?: string;
    defaultStatus?: string;
  }
  
  const TaskModal = ({
    open,
    onClose,
    onSave,
    defaultTitle = '',
    defaultStatus = '',
  }: TaskModalProps) => {
    const [title, setTitle] = useState(defaultTitle);
    const [status, setStatus] = useState(defaultStatus);
  
    useEffect(() => {
      setTitle(defaultTitle);
      setStatus(defaultStatus);
    }, [defaultTitle, defaultStatus, open]);
  
    const handleSave = () => {
      if (!title.trim()) return;
      onSave(title, status);
      setTitle('');
      setStatus('');
      onClose();
    };
  
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>{defaultTitle ? 'Редактировать' : 'Новая задача'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Название задачи"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Статус"
            fullWidth
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Отмена</Button>
          <Button variant="contained" onClick={handleSave}>
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  export default TaskModal;
  