import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

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
    const user = await User.create({ email, password: hashed });
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