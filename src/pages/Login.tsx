import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <Container maxWidth="xs">
      <Box display="flex" flexDirection="column" gap={2} mt={5}>
        <Typography variant="h5">Вход в систему</Typography>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Пароль"
          type="password"
          variant="outlined"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Войти
        </Button>
      </Box>
    </Container>
  );
};

export default Login;
