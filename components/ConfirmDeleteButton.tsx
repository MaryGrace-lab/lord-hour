"use client";

import { useRef } from "react";

type ConfirmDeleteButtonProps = {
  formAction: (formData: FormData) => void;
  hiddenFields?: Record<string, string>;
  confirmMessage?: string;
  className?: string;
  children: React.ReactNode;
};

export function ConfirmDeleteButton({
  formAction,
  hiddenFields,
  confirmMessage = "Are you sure you want to delete this item? This action cannot be undone.",
  className = "text-red-600 hover:text-red-800",
  children,
}: ConfirmDeleteButtonProps) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
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
      <button type="submit" className={className}>
        {children}
      </button>
    </form>
  );
}