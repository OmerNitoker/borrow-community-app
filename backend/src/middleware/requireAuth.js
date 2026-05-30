import { User } from "../models/User.js";
import { verifyAuthToken } from "../services/authService.js";
import { authCookieName } from "../utils/cookies.js";
import { createHttpError } from "../utils/createHttpError.js";

export async function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.[authCookieName];

    if (!token) {
      throw createHttpError(401, "Authentication required.");
    }

    const payload = verifyAuthToken(token);
    const user = await User.findById(payload.userId);

    if (!user) {
      throw createHttpError(401, "Authentication required.");
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(error.statusCode || 401);
    next(error);
  }
}
