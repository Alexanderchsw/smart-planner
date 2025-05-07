import { Card, CardContent, Typography, TextField, Button, Stack } from '@mui/material';

const Register = () => (
  <Card sx={{ maxWidth: 400, width: '100%', p: 2 }}>
    <CardContent>
      <Typography variant="h5" sx={{ mb: 2, textAlign: 'center' }}>
        Регистрация
      </Typography>
      <Stack spacing={2}>
        <TextField fullWidth label="Email" />
        <TextField fullWidth type="password" label="Пароль" />
        <TextField fullWidth type="password" label="Подтверждение пароля" />
        <Button fullWidth variant="contained">Создать аккаунт</Button>
        <Button fullWidth variant="text" href="/">Уже есть аккаунт? Войти</Button>
      </Stack>
    </CardContent>
  </Card>
);

export default Register;
