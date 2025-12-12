import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import sequelize from './db/sequelize.js';
import authRouter from './routes/api/auth.js';
import contactsRouter from './routes/api/contacts.js';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use('/avatars', express.static(path.join(__dirname, 'public', 'avatars')));

app.use('/api/auth', authRouter);
app.use('/api/contacts', contactsRouter);

app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ message: err.message });
});

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection successful');
    await sequelize.sync();
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Database connection error:', err.message);
    process.exit(1);
  }
};

start();
