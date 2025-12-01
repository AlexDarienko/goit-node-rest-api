const express = require('express');
const contactsRouter = require('./routes/contactsRouter');
const { sequelize } = require('./models/contactModel');

const app = express();
app.use(express.json());
app.use('/api/contacts', contactsRouter);

// DB init
(async function initDb() {
  try {
    await sequelize.authenticate();
    console.log("Database connection successful");
    await sequelize.sync(); // ensures table exists
  } catch (err) {
    console.error("Database connection error:", err.message);
    process.exit(1);
  }
})();

module.exports = app;
