import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ActivationForm } from "@/components/forms/ActivationForm";

export const metadata: Metadata = {
  title: "Activate Your Account",
  description:
    "Set your password to activate your Theology School account.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

// Activation tokens are per-user and short-lived — never cache.
export const dynamic = "force-dynamic";

export default async function ActivatePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  let user: {
    id: string;
    username: string;
    activationTokenExpiry: Date | null;
  } | null = null;

  try {
    user = await prisma.user.findUnique({
      where: { activationToken: token },
      select: {
        id: true,
        username: true,
        activationTokenExpiry: true,
      },
    });
  } catch (err) {
    console.error("Activation lookup failed:", err);
  }

  const isValid =
    user &&
    user.activationTokenExpiry &&
    user.activationTokenExpiry > new Date();

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4 py-12">
      {isValid ? (
        <ActivationForm token={token} />
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <h1 className="text-xl font-bold text-primary mb-2">
            Invalid or Expired Link
          </h1>
          <p className="text-gray-600 mb-4">
            This activation link is invalid or has expired. Please contact
            the school office for a new one.
          </p>
          <a
            href="/bible-college"
            className="text-accent hover:underline text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
          >
            ← Back to Bible College
          </a>
        </div>
      )}
    </div>
  );
}