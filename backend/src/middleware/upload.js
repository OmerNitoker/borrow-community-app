import multer from "multer";
import { createHttpError } from "../utils/createHttpError.js";

const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

export const uploadItemImages = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 3
  },
  fileFilter(req, file, callback) {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      callback(createHttpError(400, "Only JPEG, PNG and WEBP images are allowed."));
      return;
    }

    callback(null, true);
  }
});
