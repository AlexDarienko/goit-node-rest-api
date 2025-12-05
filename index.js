import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
dotenv.config();

import sequelize from './sequelize.js';
import authRoutes from './authRoutes.js';
import contactsRoutes from './contactsRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// serve avatars statically at /avatars
app.use('/avatars', express.static(path.join(__dirname, 'public', 'avatars')));

app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactsRoutes);

// global error handler
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
