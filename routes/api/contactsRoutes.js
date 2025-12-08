import express from "express";
import {
  getAllContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact
} from "../../controllers/contactsController.js";

const router = express.Router();

router.get("/", getAllContacts);
router.get("/:contactId", getContactById);
router.post("/", addContact);
router.delete("/:contactId", removeContact);
router.put("/:contactId", updateContact);
router.patch("/:contactId/favorite", updateStatusContact);

export default router;