import "server-only";
import { v2 as cloudinary } from "cloudinary";
import { env } from "@/lib/env";

/**
 * Configure Cloudinary from whichever env shape is present.
 * Supports both CLOUDINARY_URL (single URL) and the three separate vars.
 */
if (
  env?.CLOUDINARY_CLOUD_NAME &&
  env.CLOUDINARY_API_KEY &&
  env.CLOUDINARY_API_SECRET
) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
  });
} else if (env?.CLOUDINARY_URL) {
  cloudinary.config({ url: env.CLOUDINARY_URL, secure: true });
} else {
  throw new Error(
    "Cloudinary is not configured. Set CLOUDINARY_URL or all three of " +
      "CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET."
  );
}

export default cloudinary;