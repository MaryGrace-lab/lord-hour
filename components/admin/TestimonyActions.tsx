"use client";

import { useFormStatus } from "react-dom";
import { toast } from "react-hot-toast";
import {
  approveTestimony,
  rejectTestimony,
  revertTestimonyToPending,
  deleteTestimony,
} from "@/lib/testimony-admin-actions";
import { TestimonyStatus } from "@prisma/client";

function PendingButton({
  pendingLabel,
  className,
  children,
}: {
  pendingLabel: string;
  className: string;
  children: React.ReactNode;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`${className} disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2`}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}

function ActionForm({
  action,
  hiddenId,
  confirmMessage,
  children,
}: {
  action: (formData: FormData) => Promise<void>;
  hiddenId: string;
  confirmMessage?: string;
  children: React.ReactNode;
}) {
  async function handleAction(formData: FormData) {
    try {
      await action(formData);
      toast.success("Testimony updated");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to update testimony";
      toast.error(message);
      throw err;
    }
  }

  return (
    <form
      action={handleAction}
      onSubmit={(e) => {
        if (confirmMessage && !window.confirm(confirmMessage)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={hiddenId} />
      {children}
    </form>
  );
}

export function TestimonyActions({
  testimonyId,
  status,
}: {
  testimonyId: string;
  status: TestimonyStatus;
}) {
  if (status === TestimonyStatus.PENDING) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <ActionForm
          action={approveTestimony}
          hiddenId={testimonyId}
          confirmMessage="Approve this testimony? It will appear on the public site."
        >
          <PendingButton
            pendingLabel="Approving..."
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm font-medium transition-colors focus-visible:ring-green-600"
          >
            Approve
          </PendingButton>
        </ActionForm>

        <ActionForm
          action={rejectTestimony}
          hiddenId={testimonyId}
          confirmMessage="Reject this testimony?"
        >
          <PendingButton
            pendingLabel="Rejecting..."
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm font-medium transition-colors focus-visible:ring-red-600"
          >
            Reject
          </PendingButton>
        </ActionForm>
      </div>
    );
  }

  if (status === TestimonyStatus.APPROVED) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <ActionForm
          action={rejectTestimony}
          hiddenId={testimonyId}
          confirmMessage="Unpublish this testimony? It will be hidden from the public site."
        >
          <PendingButton
            pendingLabel="Unpublishing..."
            className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 text-sm font-medium transition-colors focus-visible:ring-amber-600"
          >
            Unpublish
          </PendingButton>
        </ActionForm>

        <ActionForm
          action={deleteTestimony}
          hiddenId={testimonyId}
          confirmMessage="Permanently delete this testimony? This cannot be undone."
        >
          <PendingButton
            pendingLabel="Deleting..."
            className="bg-white text-red-600 border border-red-300 px-4 py-2 rounded-md hover:bg-red-50 text-sm font-medium transition-colors focus-visible:ring-red-600"
          >
            Delete
          </PendingButton>
        </ActionForm>
      </div>
    );
  }

  // REJECTED
  return (
    <div className="flex flex-wrap items-center gap-2">
      <ActionForm
        action={revertTestimonyToPending}
        hiddenId={testimonyId}
        confirmMessage="Revert this testimony to pending for re-review?"
      >
        <PendingButton
          pendingLabel="Reverting..."
          className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 text-sm font-medium transition-colors focus-visible:ring-gray-600"
        >
          Revert to Pending
        </PendingButton>
      </ActionForm>

      <ActionForm
        action={deleteTestimony}
        hiddenId={testimonyId}
        confirmMessage="Permanently delete this testimony? This cannot be undone."
      >
        <PendingButton
          pendingLabel="Deleting..."
          className="bg-white text-red-600 border border-red-300 px-4 py-2 rounded-md hover:bg-red-50 text-sm font-medium transition-colors focus-visible:ring-red-600"
        >
          Delete
        </PendingButton>
      </ActionForm>
    </div>
  );
}