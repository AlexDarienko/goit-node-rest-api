const express = require('express');
import { validateBody } from '../middlewares/validateBody.js';
import { addContactSchema, updateContactSchema, favoriteSchema } from '../schemas/contactsSchemas.js';
import { authenticate } from '../middlewares/authenticate.js';
import {
  listContacts, getContactById, addContact, removeContact, updateContact, updateStatusContact
} from '../controllers/contactsController.js';

const router = express.Router();

router.use(authenticate);

router.get('/', listContacts);
router.get('/:contactId', getContactById);
router.post('/', validateBody(addContactSchema), addContact);
router.put('/:contactId', validateBody(updateContactSchema), updateContact);
router.patch('/:contactId/favorite', validateBody(favoriteSchema), updateStatusContact);
router.delete('/:contactId', removeContact);

export default router;