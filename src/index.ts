import express from 'express';
import AuthController from './controllers/Admin.controller';

const app = express();
app.use(express.json());

app.post('/register', AuthController.register);
app.post('/login', AuthController.login);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
