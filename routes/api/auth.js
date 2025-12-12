import express from 'express';
import { registerSchema, loginSchema, resendSchema } from '../../schemas/authSchemas.js';
import { validateBody } from '../../middlewares/validateBody.js';
import {
  register, login, logout, current, verifyEmail, resendVerify
} from '../../controllers/authController.js';
import { authenticate } from '../../middlewares/authenticate.js';
import { upload } from '../../middlewares/upload.js';

const router = express.Router();

router.post('/register', validateBody(registerSchema), register);
router.get('/verify/:verificationToken', verifyEmail); // public verification link
router.post('/verify', validateBody(resendSchema), resendVerify); // resend verification
router.post('/login', validateBody(loginSchema), login);
router.post('/logout', authenticate, logout);
router.get('/current', authenticate, current);
router.patch('/avatars', authenticate, upload.single('avatar'), (req, res) => res.status(200).json({message:'use dedicated avatars endpoint'}));

export default router;
