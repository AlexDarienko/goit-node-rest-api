import express from 'express';
import { registerSchema, loginSchema, subscriptionSchema } from './authSchemas.js';
import { validateBody } from './validateBody.js';
import { register, login, logout, current, updateSubscription, updateAvatar } from './authController.js';
import { authenticate } from './authenticate.js';
import multer from 'multer';
const upload = multer({ dest: 'temp/' });

const router = express.Router();

router.post('/register', validateBody(registerSchema), register);
router.post('/login', validateBody(loginSchema), login);
router.post('/logout', authenticate, logout);
router.get('/current', authenticate, current);
router.patch('/subscription', authenticate, validateBody(subscriptionSchema), updateSubscription);
router.patch('/avatars', authenticate, upload.single('avatar'), updateAvatar);

export default router;
