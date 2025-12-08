import Contact from "../models/contact.js";

export const getAllContacts = async (req, res) => {
  const contacts = await Contact.findAll();
  res.json(contacts);
};

export const getContactById = async (req, res) => {
  const contact = await Contact.findByPk(req.params.contactId);
  if (!contact) return res.status(404).json({ message: "Not found" });
  res.json(contact);
};

export const addContact = async (req, res) => {
  const contact = await Contact.create(req.body);
  res.status(201).json(contact);
};

export const removeContact = async (req, res) => {
  const contact = await Contact.findByPk(req.params.contactId);
  if (!contact) return res.status(404).json({ message: "Not found" });
  await contact.destroy();
  res.json({ message: "Contact deleted" });
};

export const updateContact = async (req, res) => {
  const contact = await Contact.findByPk(req.params.contactId);
  if (!contact) return res.status(404).json({ message: "Not found" });
  await contact.update(req.body);
  res.json(contact);
};

export const updateStatusContact = async (req, res) => {
  const contact = await Contact.findByPk(req.params.contactId);
  if (!contact) return res.status(404).json({ message: "Not found" });
  await contact.update(req.body);
  res.json(contact);
};