import express from "express";
import contactsRouter from "./routes/contactsRoutes.js";

const app = express();
app.use(express.json());

app.use("/api/contacts", contactsRouter);

// simple error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ message: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running. Use our API on port: ${PORT}`);
});
export default app;
