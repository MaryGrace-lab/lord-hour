"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { FaCheckCircle, FaEye, FaEyeSlash } from "react-icons/fa";
import { activateStudentAccount } from "@/lib/activation-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ActivationState = { success: boolean; error?: string };

const initialState: ActivationState = { success: false };

export function ActivationForm({ token }: { token: string }) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    activateStudentAccount,
    initialState
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (state.success) {
      toast.success("Account activated. Redirecting to login...");
      router.replace("/bible-college/portal/login");
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state, router]);

  if (state.success) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
        <FaCheckCircle
          className="text-green-600 text-4xl mx-auto mb-4"
          aria-hidden
        />
        <h2 className="text-xl font-bold text-primary mb-2">
          Account Activated
        </h2>
        <p className="text-gray-600 mb-4">
          Your password has been set. Redirecting to login...
        </p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      noValidate
      className="bg-white rounded-lg shadow-md p-6 sm:p-8 max-w-md w-full space-y-5"
    >
      <div className="text-center mb-2">
        <h1 className="font-heading text-2xl font-bold text-primary">
          Set Your Password
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Choose a secure password to activate your account.
        </p>
      </div>

      <input type="hidden" name="token" value={token} />

      <div>
        <label
          htmlFor="activate-password"
          className="block text-sm font-medium mb-1"
        >
          Password
        </label>
        <div className="relative">
          <Input
            id="activate-password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            minLength={8}
            maxLength={100}
            autoComplete="new-password"
            placeholder="At least 8 characters"
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <FaEyeSlash size={18} aria-hidden />
            ) : (
              <FaEye size={18} aria-hidden />
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Must contain uppercase, lowercase, and a number.
        </p>
      </div>

      <div>
        <label
          htmlFor="activate-confirm"
          className="block text-sm font-medium mb-1"
        >
          Confirm Password
        </label>
        <div className="relative">
          <Input
            id="activate-confirm"
            name="confirm"
            type={showConfirm ? "text" : "password"}
            required
            minLength={8}
            maxLength={100}
            autoComplete="new-password"
            placeholder="Re-enter your password"
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
            aria-label={showConfirm ? "Hide password" : "Show password"}
          >
            {showConfirm ? (
              <FaEyeSlash size={18} aria-hidden />
            ) : (
              <FaEye size={18} aria-hidden />
            )}
          </button>
        </div>
      </div>

      {state.error && (
        <p
          role="alert"
          aria-live="assertive"
          className="text-sm text-red-600"
        >
          {state.error}
        </p>
      )}

      <Button
        type="submit"
        disabled={isPending}
        className="w-full bg-primary text-white hover:bg-primary-light focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {isPending ? "Activating..." : "Activate Account"}
      </Button>
    </form>
  );
}