import { env } from "../config/env.js";

export const authCookieName = "borrow_token";

export function getAuthCookieOptions() {
  return {
    httpOnly: true,
    secure: env.cookie.secure,
    sameSite: env.cookie.sameSite,
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000
  };
}

export function getClearAuthCookieOptions() {
  return {
    httpOnly: true,
    secure: env.cookie.secure,
    sameSite: env.cookie.sameSite,
    path: "/"
  };
}
