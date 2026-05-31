import { asyncHandler } from "../utils/asyncHandler.js";
import { createHttpError } from "../utils/createHttpError.js";
import { sanitizeUser } from "../utils/sanitizeUser.js";

export const updateMe = asyncHandler(async (req, res) => {
  const name = String(req.body.name || "").trim();
  const phone = String(req.body.phone || "").trim();

  if (!name || !phone) {
    throw createHttpError(400, "Name and phone are required.");
  }

  req.user.name = name;
  req.user.phone = phone;
  await req.user.save();

  res.json({ user: sanitizeUser(req.user) });
});
