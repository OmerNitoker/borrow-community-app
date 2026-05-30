import dotenv from "dotenv";

dotenv.config();

function parseClientUrls() {
  const configuredUrls = process.env.CLIENT_URLS || process.env.CLIENT_URL;

  if (configuredUrls) {
    return configuredUrls
      .split(",")
      .map((url) => url.trim())
      .filter(Boolean);
  }

  return ["http://localhost:5173", "http://127.0.0.1:5173"];
}

export const env = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  clientUrls: parseClientUrls(),
  mongodbUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/borrow",
  jwtSecret: process.env.JWT_SECRET || "dev-secret-change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  images: {
    maxWidth: Number(process.env.IMAGE_MAX_WIDTH) || 1400,
    quality: Number(process.env.IMAGE_QUALITY) || 80
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
    apiKey: process.env.CLOUDINARY_API_KEY || "",
    apiSecret: process.env.CLOUDINARY_API_SECRET || "",
    folder: process.env.CLOUDINARY_FOLDER || "borrow"
  }
};
