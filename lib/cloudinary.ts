import { v2 as cloudinary } from "cloudinary";

// Use the single CLOUDINARY_URL environment variable
cloudinary.config({
  url: process.env.CLOUDINARY_URL,
});

export default cloudinary;