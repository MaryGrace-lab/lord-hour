import "server-only";
import { z } from "zod";

/**
 * Server-side environment variable validation.
 *
 * - Validated once at module load (imported by root layout).
 * - Fails fast with a clear error if required vars are missing or malformed.
 * - `server-only` prevents this module from being imported by client code.
 */

const isProd = process.env.NODE_ENV === "production";

// ─── Custom refinements ───

/**
 * Returns true if the URL points to a local development host.
 * Those are allowed to use HTTP even in production builds.
 */
function isLocalhostUrl(value: string): boolean {
  try {
    const url = new URL(value);
    const host = url.hostname;
    return (
      host === "localhost" ||
      host === "127.0.0.1" ||
      host === "::1" ||
      host.endsWith(".localhost")
    );
  } catch {
    return false;
  }
}

const serverSchema = z
  .object({
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),

    // ─── Database (required) ───
    DATABASE_URL: z
      .string()
      .min(1, "DATABASE_URL is required")
      .refine(
        (v) => v.startsWith("postgresql://") || v.startsWith("postgres://"),
        "DATABASE_URL must be a valid PostgreSQL connection string"
      ),

    // ─── NextAuth (required) ───
    NEXTAUTH_SECRET: z
      .string()
      .min(32, "NEXTAUTH_SECRET must be at least 32 characters"),

    /**
     * NEXTAUTH_URL is optional. `lib/auth.ts` uses `trustHost: true`, so
     * Auth.js derives the URL from the incoming request. Setting it is
     * recommended for production stability but not required.
     *
     * If set, it must be a valid URL. In production, non-localhost hosts
     * must use HTTPS.
     */
    NEXTAUTH_URL: z
      .string()
      .url("NEXTAUTH_URL must be a valid URL")
      .optional()
      .refine(
        (v) => {
          if (!v) return true; // optional — skip
          if (isLocalhostUrl(v)) return true; // localhost may use HTTP
          if (!isProd) return true; // dev may use HTTP
          return v.startsWith("https://");
        },
        {
          message:
            "NEXTAUTH_URL must use HTTPS in production (except for localhost)",
        }
      ),

    // ─── Resend (email) ───
    RESEND_API_KEY: z
      .string()
      .min(1, "RESEND_API_KEY is required")
      .refine(
        (v) => v.startsWith("re_"),
        "RESEND_API_KEY must start with 're_'"
      ),

    RESEND_FROM_EMAIL: z.string().min(1, "RESEND_FROM_EMAIL is required"),

    WHATSAPP_CONTACT_NUMBER: z
      .string()
      .min(1, "WHATSAPP_CONTACT_NUMBER is required")
      .regex(
        /^\+\d{8,15}$/,
        "WHATSAPP_CONTACT_NUMBER must be in format +<country code><number>"
      ),

    ADMIN_NOTIFICATION_EMAIL: z
      .string()
      .email("ADMIN_NOTIFICATION_EMAIL must be a valid email"),

    // ─── Public app URL (used in emails) ───
    NEXT_PUBLIC_APP_URL: z
      .string()
      .url("NEXT_PUBLIC_APP_URL must be a valid URL"),

    // ─── Cloudinary (either CLOUDINARY_URL or the three separate vars) ───
    CLOUDINARY_URL: z.string().optional(),
    CLOUDINARY_CLOUD_NAME: z.string().optional(),
    CLOUDINARY_API_KEY: z.string().optional(),
    CLOUDINARY_API_SECRET: z.string().optional(),

    // ─── Development seed (optional) ───
    // Only used by prisma/seed.ts. Optional at runtime — if missing, the
    // seed will refuse to create an admin and exit with a clear error.
    ADMIN_SEED_USERNAME: z
      .string()
      .min(3, "ADMIN_SEED_USERNAME must be at least 3 characters")
      .max(50)
      .optional(),
    ADMIN_SEED_PASSWORD: z
      .string()
      .min(8, "ADMIN_SEED_PASSWORD must be at least 8 characters")
      .max(100)
      .optional(),
  })
  .refine(
    (env) =>
      !!env.CLOUDINARY_URL ||
      (!!env.CLOUDINARY_CLOUD_NAME &&
        !!env.CLOUDINARY_API_KEY &&
        !!env.CLOUDINARY_API_SECRET),
    {
      message:
        "Cloudinary is not configured. Set either CLOUDINARY_URL or all three of CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.",
      path: ["CLOUDINARY_URL"],
    }
  );

function validateEnv() {
  const parsed = serverSchema.safeParse(process.env);

  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `  • ${i.path.join(".")}: ${i.message}`)
      .join("\n");

    console.error(
      "\n❌ Invalid or missing environment variables:\n\n" +
        issues +
        "\n\nCheck your .env file and restart the server.\n"
    );

    if (isProd) {
      throw new Error("Invalid environment variables");
    }
  }

  return parsed.success ? parsed.data : null;
}

export const env = validateEnv();