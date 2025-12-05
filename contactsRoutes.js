import express from 'express';
import { validateBody } from './validateBody.js';
import { addContactSchema, updateContactSchema, favoriteSchema } from './contactsSchemas.js';
import { authenticate } from './authenticate.js';
import {
  listContacts, getContactById, addContact, removeContact, updateContact, updateStatusContact
} from './contactsController.js';

const router = express.Router();

router.use(authenticate);

router.get('/', listContacts);
router.get('/:contactId', getContactById);
router.post('/', validateBody(addContactSchema), addContact);
router.put('/:contactId', validateBody(updateContactSchema), updateContact);
router.patch('/:contactId/favorite', validateBody(favoriteSchema), updateStatusContact);
router.delete('/:contactId', removeContact);

export default router;
