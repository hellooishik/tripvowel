import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";

const signToken = (id, role) => jwt.sign({ id, role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

export const register = asyncHandler(async (req, res) => {
  const user = await User.create(req.body);
  const token = signToken(user._id, user.role);
  res.status(201).json({ user: { ...user.toObject(), password: undefined }, token });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) return res.status(400).json({ message: "Invalid credentials" });
  const token = signToken(user._id, user.role);
  res.json({ user: { ...user.toObject(), password: undefined }, token });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});
