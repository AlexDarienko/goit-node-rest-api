import jwt from 'jsonwebtoken';
import User from './user.js';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const authenticate = async (req, res, next) => {
  try {
    const header = req.get('Authorization') || '';
    const token = header.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    const user = await User.findByPk(payload.id);
    if (!user || user.token !== token) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    req.user = { id: user.id, email: user.email, subscription: user.subscription };
    req.token = token;
    next();
  } catch (err) {
    next(err);
  }
};
