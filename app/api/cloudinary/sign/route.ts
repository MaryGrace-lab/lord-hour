import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";

/**
 * Returns a short-lived signature allowing the browser to upload a file
 * directly to Cloudinary. Avoids Next.js server-action body-size limits.
 */
export async function POST() {
  const session = await auth();
  if (!session || session.user.role !== Role.TEACHER) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const timestamp = Math.round(Date.now() / 1000);
  const paramsToSign = {
    timestamp,
    folder: "course_materials",
    allowed_formats: "pdf,doc,docx,ppt,pptx,png,jpg,jpeg,txt",
  };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET!
  );

  return NextResponse.json({
    timestamp,
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    folder: paramsToSign.folder,
    allowedFormats: paramsToSign.allowed_formats,
  });
}