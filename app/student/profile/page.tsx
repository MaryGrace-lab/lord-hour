import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { FaIdCard, FaEnvelope, FaPhone, FaBook } from "react-icons/fa";

export default async function StudentProfilePage() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== Role.STUDENT) {
    redirect("/bible-college/portal/login");
  }
  const studentId = session.user.id;

  const [user, enrollmentCount] = await Promise.all([
    prisma.user.findUnique({
      where: { id: studentId },
      include: { studentProfile: true },
    }),
    prisma.enrollment.count({ where: { studentId } }),
  ]);

  if (!user) notFound();

  const profile = user.studentProfile;
  const displayName =
    [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") ||
    user.name ||
    user.username;

  const initials =
    [profile?.firstName?.[0], profile?.lastName?.[0]]
      .filter(Boolean)
      .join("")
      .toUpperCase() || user.username.slice(0, 2).toUpperCase();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-primary">My Profile</h1>

      {/* Identity card */}
      <section className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div
            className="shrink-0 w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold"
            aria-hidden
          >
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-semibold text-gray-900 truncate">
              {displayName}
            </h2>
            <p className="text-sm text-gray-500">@{user.username}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span
                className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${
                  user.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {user.isActive ? "Active" : "Inactive"}
              </span>
              {profile?.studentId && (
                <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                  ID: {profile.studentId}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Personal information */}
      <section
        className="bg-white rounded-lg shadow-sm p-6"
        aria-labelledby="personal-info-heading"
      >
        <h2
          id="personal-info-heading"
          className="font-semibold text-primary mb-4"
        >
          Personal Information
        </h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-gray-500 mb-0.5">First Name</dt>
            <dd className="text-gray-900">
              {profile?.firstName || "Not set"}
            </dd>
          </div>
          <div>
            <dt className="text-gray-500 mb-0.5">Last Name</dt>
            <dd className="text-gray-900">
              {profile?.lastName || "Not set"}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-gray-500 mb-0.5 flex items-center gap-1">
              <FaIdCard aria-hidden /> Student ID
            </dt>
            <dd className="text-gray-900">
              {profile?.studentId || "Not assigned"}
            </dd>
          </div>
        </dl>
      </section>

      {/* Contact information */}
      <section
        className="bg-white rounded-lg shadow-sm p-6"
        aria-labelledby="contact-info-heading"
      >
        <h2
          id="contact-info-heading"
          className="font-semibold text-primary mb-4"
        >
          Contact Information
        </h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-gray-500 mb-0.5 flex items-center gap-1">
              <FaEnvelope aria-hidden /> Email
            </dt>
            <dd className="text-gray-900 break-all">
              {profile?.email || "Not set"}
            </dd>
          </div>
          <div>
            <dt className="text-gray-500 mb-0.5 flex items-center gap-1">
              <FaPhone aria-hidden /> Phone
            </dt>
            <dd className="text-gray-900">
              {profile?.phone || "Not set"}
            </dd>
          </div>
        </dl>
      </section>

      {/* Academic summary */}
      <section
        className="bg-white rounded-lg shadow-sm p-6"
        aria-labelledby="academic-summary-heading"
      >
        <h2
          id="academic-summary-heading"
          className="font-semibold text-primary mb-4"
        >
          Academic Summary
        </h2>
        <div className="flex items-center gap-3">
          <FaBook className="text-accent text-2xl" aria-hidden />
          <div>
            <p className="text-2xl font-bold">{enrollmentCount}</p>
            <p className="text-sm text-gray-600">
              Course{enrollmentCount === 1 ? "" : "s"} Enrolled
            </p>
          </div>
        </div>
      </section>

      <p className="text-sm text-gray-500 text-center">
        To update your information, please contact the school office.
      </p>
    </div>
  );
}