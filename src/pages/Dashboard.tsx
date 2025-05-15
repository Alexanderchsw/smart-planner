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
import DeleteIcon from '@mui/icons-material/Delete';
import DoneIcon from '@mui/icons-material/Done';

import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useState } from 'react';

import TaskModal from '../components/TaskModal';
import { useTasks, Task } from '../hooks/useTasks';
import { pushHistory } from '../aiModel';

const Dashboard = () => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('list');

  const { tasks, addTask, updateTask, deleteTask } = useTasks();
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  /* ---------------- handler-ы ---------------- */
  const handleSave = (data: Omit<Task, 'id'>, id?: string) => {
    id ? updateTask(id, data) : addTask({ ...data, status: 'todo' });
    setOpenModal(false);
    setEditingTask(null);
  };

  const markDone = (task: Task) => {
    const real = Number(prompt('Сколько минут заняло?'));
    if (!isNaN(real) && real > 0) {
      updateTask(task.id, { status: 'done', duration: real });
      pushHistory({ title: task.title, real });
    }
  };

  const openNew = () => { setEditingTask(null); setOpenModal(true); };
  const openEdit = (task: Task) => { setEditingTask(task); setOpenModal(true); };
  const handleLogout = () => navigate('/');

  /* показываем только незавершённые */
  const visible = tasks.filter(t => t.status !== 'done');

  return (
    <>
      {/* ---------- TOP BAR ---------- */}
      <AppBar position="static" sx={{ mb: 4 }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" sx={{ mr: 2 }} onClick={() => setDrawerOpen(true)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Умный планировщик</Typography>
          <Button color="inherit" onClick={handleLogout}>Выйти</Button>
        </Toolbar>
      </AppBar>

      {/* ---------- DRAWER ---------- */}
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 250 }} onClick={() => setDrawerOpen(false)}>
          <MUIList>
            <ListItemButton component={RouterLink} to="/dashboard">
              <ListItemIcon><TodayIcon /></ListItemIcon>
              <ListItemText primary="Сегодня" />
            </ListItemButton>
            <ListItemButton component={RouterLink} to="/calendar">
              <ListItemIcon><CalendarMonthIcon /></ListItemIcon>
              <ListItemText primary="Календарь" />
            </ListItemButton>
            <ListItemButton component={RouterLink} to="/settings">
              <ListItemIcon><SettingsIcon /></ListItemIcon>
              <ListItemText primary="Настройки" />
            </ListItemButton>
            <Divider />
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon><LogoutIcon /></ListItemIcon>
              <ListItemText primary="Выход" />
            </ListItemButton>
          </MUIList>
        </Box>
      </Drawer>

      {/* ---------- CONTENT ---------- */}
      <Container maxWidth="md">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5">Мои задачи</Typography>
          <Box>
            <IconButton onClick={() => setViewMode('list')}><ViewListIcon /></IconButton>
            <IconButton onClick={() => setViewMode('cards')}><ViewModuleIcon /></IconButton>
            <Button variant="contained" sx={{ ml: 2 }} onClick={openNew}>+ Добавить задачу</Button>
          </Box>
        </Box>

        {viewMode === 'list' ? (
          <Paper elevation={3}>
            <List>
              {visible.map(task => (
                <ListItem
                  key={task.id} divider sx={{ cursor: 'pointer' }}
                  onClick={() => openEdit(task)}
                  secondaryAction={
                    <>
                      <IconButton onClick={() => markDone(task)}><DoneIcon color="success" /></IconButton>
                      <IconButton onClick={() => deleteTask(task.id)}><DeleteIcon color="error" /></IconButton>
                    </>
                  }
                >
                  <ListItemText primary={task.title} secondary={task.status} />
                </ListItem>
              ))}
            </List>
          </Paper>
        ) : (
          <Box display="flex" flexWrap="wrap" gap={2}>
            {visible.map(task => (
              <Box key={task.id} sx={{ flexBasis:{xs:'100%',sm:'48%'}, flexGrow:1 }}>
                <Card variant="outlined" sx={{ cursor:'pointer' }} onClick={() => openEdit(task)}>
                  <CardContent sx={{ position:'relative' }}>
                    <IconButton size="small" onClick={(e)=>{e.stopPropagation(); markDone(task);}}
                                 sx={{ position:'absolute', top:4, right:36 }}><DoneIcon fontSize="small" color="success"/></IconButton>
                    <IconButton size="small" onClick={(e)=>{e.stopPropagation(); deleteTask(task.id);}}
                                 sx={{ position:'absolute', top:4, right:4 }}><DeleteIcon fontSize="small" color="error"/></IconButton>
                    <Typography variant="h6">{task.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{task.status}</Typography>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        )}
      </Container>

      {/* ---------- MODAL ---------- */}
      {openModal && (
        <TaskModal
          open={openModal}
          onClose={() => { setOpenModal(false); setEditingTask(null); }}
          onSave={handleSave}
          initial={editingTask || undefined}
        />
      )}
    </>
  );
};

export default Dashboard;
