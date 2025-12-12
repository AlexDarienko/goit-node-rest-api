import Contact from '../models/contact.js';

export async function listContacts(req, res, next) {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20, favorite } = req.query;
    const pageNum = parseInt(page) || 1;
    const lim = parseInt(limit) || 20;
    const offset = (pageNum - 1) * lim;

    const where = { owner: userId };
    if (favorite !== undefined) where.favorite = favorite === 'true';

    const { rows, count } = await Contact.findAndCountAll({
      where, limit: lim, offset, order: [['id', 'ASC']]
    });

    return res.status(200).json({ contacts: rows, total: count, page: pageNum, limit: lim });
  } catch (err) { next(err); }
}

export async function getContactById(req, res, next) {
  try {
    const userId = req.user.id;
    const { contactId } = req.params;
    const contact = await Contact.findOne({ where: { id: contactId, owner: userId } });
    if (!contact) return res.status(404).json({ message: 'Not found' });
    return res.status(200).json(contact);
  } catch (err) { next(err); }
}

export async function addContact(req, res, next) {
  try {
    const userId = req.user.id;
    const { name, email, phone, favorite=false } = req.body;
    const newContact = await Contact.create({ name, email, phone, favorite, owner: userId });
    return res.status(201).json(newContact);
  } catch (err) { next(err); }
}

export async function removeContact(req, res, next) {
  try {
    const userId = req.user.id;
    const { contactId } = req.params;
    const contact = await Contact.findOne({ where: { id: contactId, owner: userId } });
    if (!contact) return res.status(404).json({ message: 'Not found' });
    await contact.destroy();
    return res.status(200).json(contact);
  } catch (err) { next(err); }
}

export async function updateContact(req, res, next) {
  try {
    const userId = req.user.id;
    const { contactId } = req.params;
    const body = req.body;
    const contact = await Contact.findOne({ where: { id: contactId, owner: userId } });
    if (!contact) return res.status(404).json({ message: 'Not found' });
    await contact.update(body);
    return res.status(200).json(contact);
  } catch (err) { next(err); }
}

export async function updateStatusContact(req, res, next) {
  try {
    const userId = req.user.id;
    const { contactId } = req.params;
    const { favorite } = req.body;
    const contact = await Contact.findOne({ where: { id: contactId, owner: userId } });
    if (!contact) return res.status(404).json({ message: 'Not found' });
    contact.favorite = favorite;
    await contact.save();
    return res.status(200).json(contact);
  } catch (err) { next(err); }
}
