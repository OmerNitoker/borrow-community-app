import { Readable } from "stream";
import sharp from "sharp";
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
  const optimizedBuffer = await optimizeImage(file.buffer);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: env.cloudinary.folder,
        resource_type: "image",
        format: "webp"
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload failed:", getCloudinaryErrorMessage(error));
          reject(createHttpError(502, "Image upload failed. Please check the Cloudinary configuration."));
          return;
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id
        });
      }
    );

    Readable.from(optimizedBuffer).pipe(uploadStream);
  });
}

export async function deleteCloudinaryImage(publicId) {
  if (!publicId || publicId.startsWith("demo/")) {
    return;
  }

  ensureCloudinaryConfigured();
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary delete failed:", getCloudinaryErrorMessage(error));
    throw createHttpError(502, "Image delete failed. Please check the Cloudinary configuration.");
  }
}

async function optimizeImage(buffer) {
  return sharp(buffer)
    .rotate()
    .resize({
      width: env.images.maxWidth,
      withoutEnlargement: true
    })
    .webp({
      quality: env.images.quality
    })
    .toBuffer();
}

function getCloudinaryErrorMessage(error) {
  return error?.error?.message || error?.message || "Unknown Cloudinary error";
}
