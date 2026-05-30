import { createAuthToken, loginUser, registerUser } from "../services/authService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { authCookieName, getAuthCookieOptions, getClearAuthCookieOptions } from "../utils/cookies.js";
import { sanitizeUser } from "../utils/sanitizeUser.js";

export const register = asyncHandler(async (req, res) => {
  const user = await registerUser(req.body);
  const token = createAuthToken(user);

  res.cookie(authCookieName, token, getAuthCookieOptions());
  res.status(201).json({ user: sanitizeUser(user) });
});

export const login = asyncHandler(async (req, res) => {
  const user = await loginUser(req.body);
  const token = createAuthToken(user);

  res.cookie(authCookieName, token, getAuthCookieOptions());
  res.json({ user: sanitizeUser(user) });
});

export const logout = (req, res) => {
  res.clearCookie(authCookieName, getClearAuthCookieOptions());
  res.json({ message: "Logged out successfully." });
};

export const getMe = (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
};
