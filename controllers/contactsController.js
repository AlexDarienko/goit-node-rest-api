const { Contact } = require('../models/contactModel');

async function listContacts(req, res, next) {
  try {
    const contacts = await Contact.findAll();
    return res.status(200).json(contacts);
  } catch (err) {
    next(err);
  }
}

async function getContactById(req, res, next) {
  try {
    const { contactId } = req.params;
    const contact = await Contact.findByPk(contactId);
    if (!contact) return res.status(404).json({ message: "Not found" });
    return res.status(200).json(contact);
  } catch (err) {
    next(err);
  }
}

async function addContact(req, res, next) {
  try {
    const { name, email, phone } = req.body;
    const newContact = await Contact.create({ name, email, phone });
    return res.status(201).json(newContact);
  } catch (err) {
    next(err);
  }
}

async function removeContact(req, res, next) {
  try {
    const { contactId } = req.params;
    const contact = await Contact.findByPk(contactId);
    if (!contact) return res.status(404).json({ message: "Not found" });
    await contact.destroy();
    return res.status(200).json(contact);
  } catch (err) {
    next(err);
  }
}

async function updateContact(req, res, next) {
  try {
    const { contactId } = req.params;
    const body = req.body;
    const contact = await Contact.findByPk(contactId);
    if (!contact) return res.status(404).json({ message: "Not found" });
    await contact.update(body);
    return res.status(200).json(contact);
  } catch (err) {
    next(err);
  }
}

async function updateStatusContact(req, res, next) {
  try {
    const { contactId } = req.params;
    const { favorite } = req.body;
    const contact = await Contact.findByPk(contactId);
    if (!contact) return res.status(404).json({ message: "Not found" });
    contact.favorite = favorite;
    await contact.save();
    return res.status(200).json(contact);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact
};
