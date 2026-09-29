"use client";

import { useFormStatus } from "react-dom";
import { toast } from "react-hot-toast";
import { ReactNode, useRef } from "react";

type ActionFn = (formData: FormData) => Promise<unknown> | unknown;

function PendingButton({
  children,
  pendingLabel,
  className,
}: {
  children: ReactNode;
  pendingLabel: string;
  className: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`${className} disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-primary`}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}

export function ServerActionForm({
  action,
  hiddenFields,
  confirmMessage,
  successMessage,
  pendingLabel = "Working...",
  buttonLabel,
  buttonClassName,
  children,
  className,
  resetOnSuccess = false,
}: {
  action: ActionFn;
  hiddenFields?: Record<string, string>;
  confirmMessage?: string;
  successMessage?: string;
  pendingLabel?: string;
  buttonLabel: string;
  buttonClassName: string;
  children?: ReactNode;
  className?: string;
  resetOnSuccess?: boolean;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  async function handleAction(formData: FormData) {
    try {
      await action(formData);
      if (successMessage) toast.success(successMessage);
      if (resetOnSuccess) formRef.current?.reset();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
      throw err;
    }
  }

  return (
    <form
      ref={formRef}
      action={handleAction}
      onSubmit={(e) => {
        if (confirmMessage && !window.confirm(confirmMessage)) {
          e.preventDefault();
        }
      }}
      className={className}
    >
      {hiddenFields &&
        Object.entries(hiddenFields).map(([name, value]) => (
          <input key={name} type="hidden" name={name} value={value} />
        ))}
      {children}
      <PendingButton pendingLabel={pendingLabel} className={buttonClassName}>
        {buttonLabel}
      </PendingButton>
    </form>
  );
}