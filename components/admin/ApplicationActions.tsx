"use client";

import { useFormStatus } from "react-dom";
import { useState } from "react";
import {
  approveApplication,
  rejectApplication,
  markApplicationContacted,
  revertApplicationToPending,
} from "@/lib/application-admin-actions";

function PendingButton({
  children,
  pendingLabel,
  className,
}: {
  children: React.ReactNode;
  pendingLabel: string;
  className: string;
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

export function ApplicationActions({
  applicationId,
  status,
  hasCreatedStudent,
}: {
  applicationId: string;
  status: "PENDING" | "CONTACTED" | "APPROVED" | "REJECTED";
  hasCreatedStudent: boolean;
}) {
  const [rejectReason, setRejectReason] = useState("");
  const [showReject, setShowReject] = useState(false);

  return (
    <div className="space-y-3">
      {(status === "PENDING" || status === "CONTACTED") && (
        <>
          {status === "PENDING" && (
            <form action={markApplicationContacted}>
              <input
                type="hidden"
                name="applicationId"
                value={applicationId}
              />
              <PendingButton
                pendingLabel="Updating..."
                className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm focus-visible:ring-blue-600"
              >
                Mark as Contacted
              </PendingButton>
            </form>
          )}

          <form
            action={approveApplication}
            onSubmit={(e) => {
              if (
                !window.confirm(
                  "Approve this application? The applicant will receive an email notification."
                )
              ) {
                e.preventDefault();
              }
            }}
          >
            <input
              type="hidden"
              name="applicationId"
              value={applicationId}
            />
            <PendingButton
              pendingLabel="Approving..."
              className="w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm focus-visible:ring-green-600"
            >
              Approve Application
            </PendingButton>
          </form>

          {!showReject ? (
            <button
              type="button"
              onClick={() => setShowReject(true)}
              className="w-full sm:w-auto bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-600"
            >
              Reject Application
            </button>
          ) : (
            <form
              action={rejectApplication}
              onSubmit={(e) => {
                if (
                  !window.confirm(
                    "Reject this application? The applicant will receive an email with the reason."
                  )
                ) {
                  e.preventDefault();
                }
              }}
              className="space-y-2 border border-red-200 bg-red-50 rounded-md p-3"
            >
              <input
                type="hidden"
                name="applicationId"
                value={applicationId}
              />
              <label
                htmlFor="reject-reason"
                className="block text-sm font-medium text-gray-800"
              >
                Rejection reason (optional)
              </label>
              <textarea
                id="reject-reason"
                name="reason"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
                maxLength={1000}
                placeholder="Explain why the application is being rejected..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
              />
              <div className="flex flex-col sm:flex-row gap-2">
                <PendingButton
                  pendingLabel="Rejecting..."
                  className="w-full sm:w-auto bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm focus-visible:ring-red-600"
                >
                  Confirm Rejection
                </PendingButton>
                <button
                  type="button"
                  onClick={() => {
                    setShowReject(false);
                    setRejectReason("");
                  }}
                  className="w-full sm:w-auto bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </>
      )}

      {status === "APPROVED" && !hasCreatedStudent && (
        <a
          href={`/admin/students/new?fromApplication=${applicationId}`}
          className="inline-block w-full sm:w-auto bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-light text-sm text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
        >
          + Create Student Account
        </a>
      )}

      {(status === "REJECTED" || status === "APPROVED") && (
        <form
          action={revertApplicationToPending}
          onSubmit={(e) => {
            if (
              !window.confirm(
                "Revert this application to Pending? The status change will be logged."
              )
            ) {
              e.preventDefault();
            }
          }}
        >
          <input
            type="hidden"
            name="applicationId"
            value={applicationId}
          />
          <PendingButton
            pendingLabel="Reverting..."
            className="w-full sm:w-auto bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 text-sm focus-visible:ring-gray-600"
          >
            Revert to Pending
          </PendingButton>
        </form>
      )}
    </div>
  );
}