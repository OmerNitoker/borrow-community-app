import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { createHttpError } from "../utils/createHttpError.js";

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

export async function registerUser({ name, email, password, phone }) {
  const normalizedEmail = normalizeEmail(email);

  if (!name || !normalizedEmail || !password || !phone) {
    throw createHttpError(400, "Name, email, password and phone are required.");
  }

  if (password.length < 6) {
    throw createHttpError(400, "Password must be at least 6 characters.");
  }

  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    throw createHttpError(409, "A user with this email already exists.");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  return User.create({
    name,
    email: normalizedEmail,
    passwordHash,
    phone
  });
}

export async function loginUser({ email, password }) {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail || !password) {
    throw createHttpError(400, "Email and password are required.");
  }

  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    throw createHttpError(401, "Invalid email or password.");
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    throw createHttpError(401, "Invalid email or password.");
  }

  return user;
}

export function createAuthToken(user) {
  return jwt.sign({ userId: user._id.toString() }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn
  });
}

export function verifyAuthToken(token) {
  return jwt.verify(token, env.jwtSecret);
}
