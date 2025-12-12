import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import gravatar from 'gravatar';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';
import User from '../models/user.js';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_EXPIRES = '1h';

function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) {
    throw new Error('SMTP credentials not set in env');
  }
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  });
}

export async function register(req, res, next) {
  try {
    const { email, password } = req.body;
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(409).json({ message: 'Email in use' });
    const hashed = await bcrypt.hash(password, 10);
    const avatar = gravatar.url(email, {s: '200', r: 'pg'}, true);
    const verificationToken = uuidv4();
    const user = await User.create({ email, password: hashed, avatarURL: avatar, verificationToken });
    // send verification email
    try {
      const transporter = createTransporter();
      const serverUrl = process.env.SERVER_URL || 'http://localhost:3000';
      const verifyLink = `${serverUrl}/auth/verify/${verificationToken}`;
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: 'Please verify your email',
        html: `<p>Please verify your email by clicking <a href="${verifyLink}">here</a></p>`
      });
    } catch (err) {
      console.error('Email send error', err.message);
    }
    return res.status(201).json({ user: { email: user.email, subscription: user.subscription } });
  } catch (err) { next(err); }
}

export async function verifyEmail(req, res, next) {
  try {
    const { verificationToken } = req.params;
    const user = await User.findOne({ where: { verificationToken } });
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.verify = true;
    user.verificationToken = null;
    await user.save();
    return res.status(200).json({ message: 'Verification successful' });
  } catch (err) { next(err); }
}

export async function resendVerify(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'missing required field email' });
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.verify) return res.status(400).json({ message: 'Verification has already been passed' });
    const transporter = createTransporter();
    const verifyLink = `${process.env.SERVER_URL || 'http://localhost:3000'}/auth/verify/${user.verificationToken}`;
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Please verify your email (resend)',
      html: `<p>Please verify your email by clicking <a href="${verifyLink}">here</a></p>`
    });
    return res.status(200).json({ message: 'Verification email sent' });
  } catch (err) { next(err); }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Email or password is wrong' });
    if (!user.verify) return res.status(401).json({ message: 'Email not verified' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Email or password is wrong' });
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    user.token = token;
    await user.save();
    return res.status(200).json({ token, user: { email: user.email, subscription: user.subscription } });
  } catch (err) { next(err); }
}

export async function logout(req, res, next) {
  try {
    const user = await User.findByPk(req.user.id);
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
