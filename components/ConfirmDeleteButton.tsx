"use client";

import { useFormStatus } from "react-dom";

type ConfirmDeleteButtonProps = {
  formAction: (formData: FormData) => void | Promise<void>;
  hiddenFields?: Record<string, string>;
  confirmMessage?: string;
  className?: string;
  children: React.ReactNode;
};

function SubmitButton({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`${className} disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded`}
    >
      {pending ? "Working..." : children}
    </button>
  );
}

export function ConfirmDeleteButton({
  formAction,
  hiddenFields,
  confirmMessage = "Are you sure you want to delete this item? This action cannot be undone.",
  className = "text-red-600 hover:text-red-800",
  children,
}: ConfirmDeleteButtonProps) {
  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (!window.confirm(confirmMessage)) {
          e.preventDefault();
        }
      }}
    >
      {hiddenFields &&
        Object.entries(hiddenFields).map(([name, value]) => (
          <input key={name} type="hidden" name={name} value={value} />
        ))}
      <SubmitButton className={className}>{children}</SubmitButton>
    </form>
  );
}