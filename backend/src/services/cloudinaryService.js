import { Readable } from "stream";
import { cloudinary } from "../config/cloudinary.js";
import { env } from "../config/env.js";
import { createHttpError } from "../utils/createHttpError.js";

function ensureCloudinaryConfigured() {
  if (!env.cloudinary.cloudName || !env.cloudinary.apiKey || !env.cloudinary.apiSecret) {
    throw createHttpError(500, "Cloudinary is not configured.");
  }
}

export async function uploadImageBuffer(file) {
  ensureCloudinaryConfigured();

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: env.cloudinary.folder,
        resource_type: "image"
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id
        });
      }
    );

    Readable.from(file.buffer).pipe(uploadStream);
  });
}

export async function deleteCloudinaryImage(publicId) {
  if (!publicId || publicId.startsWith("demo/")) {
    return;
  }

  ensureCloudinaryConfigured();
  await cloudinary.uploader.destroy(publicId);
}
