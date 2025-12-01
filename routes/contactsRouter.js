const express = require('express');
const router = express.Router();
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact
} = require('../controllers/contactsController');

const { validateAdd, validateUpdate, validateFavorite } = require('../schemas/contactsSchemas');

router.get('/', listContacts);
router.get('/:contactId', getContactById);
router.post('/', validateAdd, addContact);
router.put('/:contactId', validateUpdate, updateContact);
router.patch('/:contactId/favorite', validateFavorite, updateStatusContact);
router.delete('/:contactId', removeContact);

module.exports = router;
