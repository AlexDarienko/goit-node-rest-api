import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import gravatar from 'gravatar';
import fs from 'fs';
import path from 'path';
import User from './user.js';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_EXPIRES = '1h';

export async function register(req, res, next) {
  try {
    const { email, password } = req.body;
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'Email in use' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const avatar = gravatar.url(email, {s: '200', r: 'pg'}, true);
    const user = await User.create({ email, password: hashed, avatarURL: avatar });
    return res.status(201).json({ user: { email: user.email, subscription: user.subscription } });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Email or password is wrong' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Email or password is wrong' });
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    user.token = token;
    await user.save();
    return res.status(200).json({ token, user: { email: user.email, subscription: user.subscription } });
  } catch (err) {
    next(err);
  }
}

export async function logout(req, res, next) {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);
    if (!user) return res.status(401).json({ message: 'Not authorized' });
    user.token = null;
    await user.save();
    return res.status(204).send();
  } catch (err) { next(err); }
}

export async function current(req, res, next) {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(401).json({ message: 'Not authorized' });
    return res.status(200).json({ email: user.email, subscription: user.subscription });
  } catch (err) { next(err); }
}

export async function updateSubscription(req, res, next) {
  try {
    const { subscription } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(401).json({ message: 'Not authorized' });
    user.subscription = subscription;
    await user.save();
    return res.status(200).json({ email: user.email, subscription: user.subscription });
  } catch (err) { next(err); }
}

// Avatar upload handler
export async function updateAvatar(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ message: 'File is required' });
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(401).json({ message: 'Not authorized' });

    const tempPath = req.file.path;
    const ext = path.extname(req.file.originalname);
    const fileName = `${user.id}_${Date.now()}${ext}`;
    const avatarsDir = path.join(process.cwd(), 'public', 'avatars');
    const targetPath = path.join(avatarsDir, fileName);

    // move file from temp to public/avatars
    await fs.promises.rename(tempPath, targetPath);

    const avatarURL = `/avatars/${fileName}`;
    user.avatarURL = avatarURL;
    await user.save();

    return res.status(200).json({ avatarURL });
  } catch (err) { next(err); }
}
