import dotenv from "dotenv";

dotenv.config();

const nodeEnv = process.env.NODE_ENV || "development";

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

function parseCookieSameSite() {
  const value = String(process.env.COOKIE_SAME_SITE || (nodeEnv === "production" ? "none" : "lax")).toLowerCase();
  const allowedValues = ["lax", "strict", "none"];

  return allowedValues.includes(value) ? value : "lax";
}

function parseCookieSecure() {
  if (process.env.COOKIE_SECURE === undefined) {
    return nodeEnv === "production";
  }

  return process.env.COOKIE_SECURE === "true";
}

export const env = {
  port: process.env.PORT || 5000,
  nodeEnv,
  clientUrls: parseClientUrls(),
  mongodbUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/borrow",
  jwtSecret: process.env.JWT_SECRET || "dev-secret-change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  cookie: {
    sameSite: parseCookieSameSite(),
    secure: parseCookieSecure()
  },
  images: {
    maxWidth: Number(process.env.IMAGE_MAX_WIDTH) || 1600,
    quality: Number(process.env.IMAGE_QUALITY) || 86
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
    apiKey: process.env.CLOUDINARY_API_KEY || "",
    apiSecret: process.env.CLOUDINARY_API_SECRET || "",
    folder: process.env.CLOUDINARY_FOLDER || "borrow"
  }
};
