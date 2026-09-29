"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { toast } from "react-hot-toast";

type ActionFn = (formData: FormData) => Promise<unknown> | unknown;

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={disabled || pending}
      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
    >
      {pending ? "Deleting..." : "Delete permanently"}
    </button>
  );
}

export function TypeToConfirmDelete({
  action,
  hiddenFields,
  expectedText,
  title,
  description,
  triggerLabel,
  triggerClassName = "text-red-600 hover:text-red-800 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 rounded",
  successMessage = "Deleted successfully",
  successRedirect,
}: {
  action: ActionFn;
  hiddenFields: Record<string, string>;
  expectedText: string;
  title: string;
  description: string;
  triggerLabel: string;
  triggerClassName?: string;
  successMessage?: string;
  /**
   * If provided, the client navigates here after a successful delete.
   * Required when deleting from a detail page (the detail page itself
   * will 404 once the record is gone).
   */
  successRedirect?: string;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const matches = confirmText.trim() === expectedText;

  async function handleAction(formData: FormData) {
    try {
      await action(formData);
      toast.success(successMessage);
      setIsOpen(false);
      setConfirmText("");
      if (successRedirect) {
        router.push(successRedirect);
      } else {
        router.refresh();
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Delete failed";
      toast.error(message);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={triggerClassName}
      >
        {triggerLabel}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-delete-title"
        >
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3
              id="confirm-delete-title"
              className="text-lg font-semibold text-gray-900 mb-2"
            >
              {title}
            </h3>
            <p className="text-sm text-gray-600 mb-4">{description}</p>
            <label
              htmlFor="confirm-delete-input"
              className="block text-sm text-gray-800 mb-2"
            >
              Type{" "}
              <span className="font-mono font-semibold bg-gray-100 px-1 rounded">
                {expectedText}
              </span>{" "}
              to confirm:
            </label>
            <input
              id="confirm-delete-input"
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              autoComplete="off"
              autoFocus
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
            />
            <form
              action={handleAction}
              onSubmit={(e) => {
                if (!matches) {
                  e.preventDefault();
                  toast.error("Text does not match");
                }
              }}
            >
              {Object.entries(hiddenFields).map(([name, value]) => (
                <input key={name} type="hidden" name={name} value={value} />
              ))}
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    setConfirmText("");
                  }}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500"
                >
                  Cancel
                </button>
                <SubmitButton disabled={!matches} />
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}