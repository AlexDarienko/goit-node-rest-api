import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import sequelize from "./db/sequelize.js";
import contactsRouter from "./routes/api/contactsRouter.js";
import authRouter from "./routes/api/authRouter.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// static
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/avatars", express.static(path.join(__dirname, "public/avatars")));

app.use("/api/contacts", contactsRouter);
app.use("/auth", authRouter);

const PORT = process.env.PORT || 3000;

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection successful");

    sequelize.sync().then(() => {
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err.message);
    process.exit(1);
  });