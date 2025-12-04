import express from 'express';
import { registerSchema, loginSchema, subscriptionSchema } from '../schemas/authSchemas.js';
import { validateBody } from '../middlewares/validateBody.js';
import { register, login, logout, current, updateSubscription } from '../controllers/authController.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = express.Router();

router.post('/register', validateBody(registerSchema), register);
router.post('/login', validateBody(loginSchema), login);
router.post('/logout', authenticate, logout);
router.get('/current', authenticate, current);
router.patch('/subscription', authenticate, validateBody(subscriptionSchema), updateSubscription);

export default router;