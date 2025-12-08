import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import fs from "fs/promises";
import path from "path";

import User from "../models/user.js";

const avatarsPath = path.resolve("public/avatars");

export const register = async (req, res) => {
  const { email, password } = req.body;

  const oldUser = await User.findOne({ where: { email } });
  if (oldUser) return res.status(409).json({ message: "Email in use" });

  const hashPass = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email, { s: "250", d: "retro" }, true);

  const user = await User.create({
    email,
    password: hashPass,
    avatarURL,
  });

  res.status(201).json({ email: user.email, avatarURL: user.avatarURL });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(401).json({ message: "Email or password wrong" });

  const passCompare = await bcrypt.compare(password, user.password);
  if (!passCompare) return res.status(401).json({ message: "Email or password wrong" });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "23h",
  });

  await user.update({ token });

  res.json({ token });
};

export const getCurrent = async (req, res) => {
  res.json({ email: req.user.email, avatarURL: req.user.avatarURL });
};

export const logout = async (req, res) => {
  await req.user.update({ token: null });
  res.json({ message: "Logout success" });
};

export const updateAvatar = async (req, res) => {
  const { path: tempPath, originalname } = req.file;
  const filename = `${req.user.id}_${originalname}`;
  const finalPath = path.join(avatarsPath, filename);

  await fs.rename(tempPath, finalPath);

  const avatarURL = `/avatars/${filename}`;

  await req.user.update({ avatarURL });

  res.json({ avatarURL });
};