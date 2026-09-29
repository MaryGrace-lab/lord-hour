"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { logAudit } from "@/lib/audit";
import { activationSchema, validationError } from "@/lib/validations";

const BCRYPT_COST = 12;

export async function activateStudentAccount(
  _prevState: { success: boolean; error?: string },
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  // ─── 1. Validate ───
  const parsed = activationSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
    confirm: formData.get("confirm"),
  });

  if (!parsed.success) return validationError(parsed.error);

  const { token, password } = parsed.data;

  try {
    // ─── 2. Look up by token ───
    const user = await prisma.user.findUnique({
      where: { activationToken: token },
      select: {
        id: true,
        username: true,
        activationTokenExpiry: true,
      },
    });

    if (!user) {
      return {
        success: false,
        error:
          "This activation link is invalid or has already been used.",
      };
    }

    // ─── 3. Expiry check ───
    if (
      !user.activationTokenExpiry ||
      user.activationTokenExpiry < new Date()
    ) {
      return {
        success: false,
        error:
          "This activation link has expired. Please contact the school office for a new one.",
      };
    }

    // ─── 4. Hash and save ───
    const passwordHash = await bcrypt.hash(password, BCRYPT_COST);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        activationToken: null,
        activationTokenExpiry: null,
        activationCompletedAt: new Date(),
        isActive: true,
      },
    });

    // ─── 5. Audit ───
    await logAudit({
      userId: user.id,
      action: "ADMIN_PROFILE_UPDATED", // see note below
      entity: "User",
      entityId: user.id,
      metadata: { event: "ACCOUNT_ACTIVATED", username: user.username },
    });

    return { success: true };
  } catch (error) {
    console.error("Activation error:", error);
    return {
      success: false,
      error: "Unable to activate your account. Please try again.",
    };
  }
}