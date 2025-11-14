import express from "express";
import { getAll, getById, removeById, create, updateById } from "../controllers/contactsControllers.js";
import { validateBody } from "../helpers/validateBody.js";
import { addSchema, updateSchema } from "../schemas/contactsSchemas.js";

const router = express.Router();

router.get("/", getAll);
router.get("/:id", getById);
router.post("/", validateBody(addSchema), create);
router.put("/:id", validateBody(updateSchema), updateById);
router.delete("/:id", removeById);

export default router;
