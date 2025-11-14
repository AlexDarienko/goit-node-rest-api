import { listContacts, getContactById, removeContact, addContact, updateContact } from "../services/contactsServices.js";

async function getAll(req, res, next) {
  try {
    const contacts = await listContacts();
    return res.status(200).json(contacts);
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const { id } = req.params;
    const contact = await getContactById(id);
    if (!contact) {
      return res.status(404).json({ message: "Not found" });
    }
    return res.status(200).json(contact);
  } catch (err) {
    next(err);
  }
}

async function removeById(req, res, next) {
  try {
    const { id } = req.params;
    const removed = await removeContact(id);
    if (!removed) {
      return res.status(404).json({ message: "Not found" });
    }
    return res.status(200).json(removed);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const { name, email, phone } = req.body;
    const newContact = await addContact(name, email, phone);
    return res.status(201).json(newContact);
  } catch (err) {
    next(err);
  }
}

async function updateById(req, res, next) {
  try {
    const { id } = req.params;
    const body = req.body;
    const updated = await updateContact(id, body);
    if (!updated) {
      return res.status(404).json({ message: "Not found" });
    }
    return res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
}

export { getAll, getById, removeById, create, updateById };
