
// src/pages/Dashboard.tsx

import {
  AppBar, Toolbar, Typography, IconButton, Box, Button, Container,
  Paper, List, ListItem, ListItemText, Card, CardContent, Drawer,
  ListItemButton, ListItemIcon, Divider, List as MUIList
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import TodayIcon from '@mui/icons-material/Today';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import DoneIcon from '@mui/icons-material/Done';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import TaskModal from '../components/TaskModal';
import axios from 'axios';
import { Task } from '../api/tasks';

const Dashboard = () => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('list');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = () => {
    axios.get('http://127.0.0.1:8000/tasks/')
      .then(res => setTasks(res.data))
      .catch(err => console.error('Ошибка загрузки задач:', err));
  };

  const handleLogout = () => navigate('/');

  const handleAddOrEditTask = async (task: Task) => {
    try {
      if (task.id) {
        const res = await axios.put(`http://127.0.0.1:8000/tasks/${task.id}`, task);
        setTasks(prev => prev.map(t => t.id === task.id ? res.data : t));
      } else {
        const res = await axios.post('http://127.0.0.1:8000/tasks/', { ...task, status: 'pending' });
        setTasks(prev => [...prev, res.data]);
      }
    } catch (error) {
      console.error('Ошибка при сохранении задачи:', error);
    }
    setEditingTask(null);
  };

  const handleCompleteTask = async (id?: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!id) return;

    const existing = tasks.find((t) => t.id === id);
    if (!existing) return;

    const updatedTask = {
      ...existing,
      status: 'completed',
    };

    delete (updatedTask as any).id;
    delete (updatedTask as any).created_at;
    delete (updatedTask as any).updated_at;
    delete (updatedTask as any).completed_at;

    try {
      const res = await axios.put(`http://127.0.0.1:8000/tasks/${id}`, updatedTask);
      setTasks(prev => prev.map(t => t.id === id ? res.data : t));
    } catch (error) {
      console.error('Ошибка при выполнении задачи:', error);
    }
  };

  const handleDeleteTask = async (id?: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!id) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/tasks/${id}`);
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error('Ошибка при удалении задачи:', error);
    }
  };

  const handleEditTask = (task: Task) => {
    if (task.status !== 'completed') {
      setEditingTask(task);
      setOpenModal(true);
    }
  };

  const translateStatus = (status: string) => {
    switch (status) {
      case 'pending': return 'Запланировано';
      case 'in_progress': return 'В работе';
      case 'completed': return 'Выполнено';
      default: return status;
    }
  };

  const visibleTasks = tasks.filter(task => task.status !== 'completed');

  return (
    <>
      <AppBar position="static" sx={{ mb: 4 }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" sx={{ mr: 2 }} onClick={() => setDrawerOpen(true)}><MenuIcon /></IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Умный планировщик</Typography>
          <Button color="inherit" onClick={handleLogout}>Выйти</Button>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 250 }} role="presentation" onClick={() => setDrawerOpen(false)}>
          <MUIList>
            <ListItemButton component={RouterLink} to="/dashboard"><ListItemIcon><TodayIcon /></ListItemIcon><ListItemText primary="Сегодня" /></ListItemButton>
            <ListItemButton component={RouterLink} to="/calendar"><ListItemIcon><CalendarMonthIcon /></ListItemIcon><ListItemText primary="Календарь" /></ListItemButton>
            <ListItemButton component={RouterLink} to="/settings"><ListItemIcon><SettingsIcon /></ListItemIcon><ListItemText primary="Настройки" /></ListItemButton>
            <Divider />
            <ListItemButton onClick={handleLogout}><ListItemIcon><LogoutIcon /></ListItemIcon><ListItemText primary="Выход" /></ListItemButton>
          </MUIList>
        </Box>
      </Drawer>

      <Container maxWidth="md">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5">Мои задачи</Typography>
          <Box>
            <IconButton onClick={() => setViewMode('list')}><ViewListIcon /></IconButton>
            <IconButton onClick={() => setViewMode('cards')}><ViewModuleIcon /></IconButton>
            <Button variant="contained" onClick={() => setOpenModal(true)} sx={{ ml: 2 }}>+ Добавить задачу</Button>
          </Box>
        </Box>

        {viewMode === 'list' ? (
          <Paper elevation={3}>
            <List>
              {visibleTasks.map((task) => (
                <ListItem key={task.id} divider sx={{ cursor: 'pointer' }} onClick={() => handleEditTask(task)}>
                  <ListItemText primary={task.title} secondary={translateStatus(task.status)} />
                  <IconButton edge="end" onClick={(e) => handleCompleteTask(task.id, e)}><DoneIcon /></IconButton>
                  <IconButton edge="end" onClick={(e) => handleDeleteTask(task.id, e)}><DeleteIcon /></IconButton>
                </ListItem>
              ))}
            </List>
          </Paper>
        ) : (
          <Box display="flex" flexWrap="wrap" gap={2}>
            {visibleTasks.map((task) => (
              <Box key={task.id} sx={{ flexBasis: { xs: '100%', sm: '48%' }, flexGrow: 1 }}>
                <Card sx={{ cursor: 'pointer', position: 'relative' }} onClick={() => handleEditTask(task)}>
                  <CardContent>
                    <Typography variant="h6">{task.title}</Typography>
                    <Typography variant="body2" color="textSecondary">{translateStatus(task.status)}</Typography>
                    <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                      <IconButton onClick={(e) => handleCompleteTask(task.id, e)}><DoneIcon /></IconButton>
                      <IconButton onClick={(e) => handleDeleteTask(task.id, e)}><DeleteIcon /></IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        )}
      </Container>

      <TaskModal
        open={openModal}
        onClose={() => { setOpenModal(false); setEditingTask(null); }}
        onSubmit={handleAddOrEditTask}
        initialData={editingTask}
      />
    </>
  );
};

export default Dashboard;
