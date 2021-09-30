import 'dotenv/config.js';
import express from 'express';

import authRoutes from './routes/authRoutes.js';
import { checkAuth } from './controllers/authControllers.js';
import { getUsers } from './utils/userModel.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1/', authRoutes);

app.get('/users', checkAuth, async (req, res) => {
  console.log('im called')

  const users = await getUsers();
  console.log('users:---',users)
  res.send(users);
});

app.listen(process.env.PORT, () => {
  console.log(`App listening on port ${process.env.PORT}`);
});
