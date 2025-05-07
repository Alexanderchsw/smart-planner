import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
  Container,
  Paper,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  Drawer,
  ListItemButton,
  ListItemIcon,
  Divider,
  List as MUIList,
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import TodayIcon from '@mui/icons-material/Today';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';

import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useState } from 'react';
import TaskModal from '../components/TaskModal';

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('list');
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Подключить авторизацию', description: 'Важная задача', status: 'В приоритете' },
    { id: '2', title: 'Реализовать календарь', description: 'Нужно добавить все модули', status: 'Запланировано' },
    { id: '3', title: 'Сделать дизайн Dashboard', description: 'Сделать его красивым и понятным', status: 'Выполнено' },
  ]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleLogout = () => navigate('/');

  const handleAddOrEditTask = (newTask: Task) => {
    if (editingTask) {
      setTasks((prev) =>
        prev.map((task) => (task.id === newTask.id ? newTask : task))
      );
    } else {
      const newTaskWithId = { ...newTask, id: Date.now().toString() };
      setTasks([...tasks, newTaskWithId]);
    }
    setEditingTask(null);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setOpenModal(true);
  };

  return (
    <>
      <AppBar position="static" sx={{ mb: 4 }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            sx={{ mr: 2 }}
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Умный планировщик
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Выйти
          </Button>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 250 }} role="presentation" onClick={() => setDrawerOpen(false)}>
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

      {/* Контент */}
      <Container maxWidth="md">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5">Мои задачи</Typography>
          <Box>
            <IconButton onClick={() => setViewMode('list')}><ViewListIcon /></IconButton>
            <IconButton onClick={() => setViewMode('cards')}><ViewModuleIcon /></IconButton>
            <Button variant="contained" onClick={() => setOpenModal(true)} sx={{ ml: 2 }}>
              + Добавить задачу
            </Button>
          </Box>
        </Box>

        {viewMode === 'list' ? (
          <Paper elevation={3}>
            <List>
              {tasks.map((task) => (
                <ListItem
                  key={task.id}
                  divider
                  component="div"
                  onClick={() => handleEditTask(task)}
                  sx={{ cursor: 'pointer' }}
                >
                  <ListItemText primary={task.title} secondary={task.status} />
                </ListItem>
              ))}
            </List>
          </Paper>
        ) : (
          <Box display="flex" flexWrap="wrap" gap={2}>
            {tasks.map((task) => (
              <Box
                key={task.id}
                sx={{
                  flexBasis: { xs: '100%', sm: '48%' },
                  flexGrow: 1,
                }}
              >
                <Card
                  sx={{ cursor: 'pointer' }}
                  onClick={() => handleEditTask(task)}
                  variant="outlined"
                >
                  <CardContent>
                    <Typography variant="h6">{task.title}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {task.status}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        )}
      </Container>

      {/* Модальное окно */}
      <TaskModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleAddOrEditTask}
        initialData={editingTask}
      />
    </>
  );
};

export default Dashboard;
