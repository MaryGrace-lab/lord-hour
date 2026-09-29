import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { FaBook } from "react-icons/fa";
import { toggleCourseVisibility, deleteCourse } from "@/lib/admin-actions";
import { ServerActionForm } from "@/components/forms/ServerActionForm";
import { TypeToConfirmDelete } from "@/components/admin/TypeToConfirmDelete";

export const revalidate = 30;

export default async function AdminCoursesPage() {
  const courses = await prisma.course.findMany({
    include: {
      teachers: { select: { username: true } },
      _count: {
        select: {
          enrollments: true,
          modules: true,
          quizzes: true,
          assignments: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
          <FaBook className="text-accent" aria-hidden />
          Courses
        </h1>
        <Link
          href="/admin/courses/new"
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-light text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          + Create Course
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
          <FaBook
            className="text-gray-300 mx-auto mb-3"
            size={32}
            aria-hidden
          />
          <p>No courses created yet.</p>
          <Link
            href="/admin/courses/new"
            className="text-accent hover:underline text-sm mt-2 inline-block font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
          >
            Create your first course →
          </Link>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <caption className="sr-only">
                Courses list. {courses.length} course
                {courses.length === 1 ? "" : "s"}.
              </caption>
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    Course
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell"
                  >
                    Teacher(s)
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden xl:table-cell"
                  >
                    Content
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    Visibility
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {courses.map((course) => (
                  <tr key={course.id}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-sm">{course.title}</p>
                      {course.description && (
                        <p className="text-xs text-gray-500 line-clamp-1">
                          {course.description}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-sm text-gray-700">
                      {course.teachers.map((t) => t.username).join(", ") ||
                        "—"}
                    </td>
                    <td className="px-4 py-3 hidden xl:table-cell text-sm text-gray-600">
                      {course._count.modules} module
                      {course._count.modules === 1 ? "" : "s"} ·{" "}
                      {course._count.assignments} assignment
                      {course._count.assignments === 1 ? "" : "s"} ·{" "}
                      {course._count.quizzes} quiz
                      {course._count.quizzes === 1 ? "" : "zes"} ·{" "}
                      {course._count.enrollments} student
                      {course._count.enrollments === 1 ? "" : "s"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium ${
                          course.isPublished
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {course.isPublished ? "Published" : "Hidden"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-3 items-center">
                        <Link
                          href="/admin/assignments"
                          className="text-accent hover:underline text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                        >
                          Manage
                        </Link>
                        <ServerActionForm
                          action={toggleCourseVisibility}
                          hiddenFields={{ id: course.id }}
                          confirmMessage={
                            course.isPublished
                              ? "Hide this course? Students will no longer see it."
                              : "Publish this course? Students will be able to see it."
                          }
                          successMessage={
                            course.isPublished
                              ? "Course hidden"
                              : "Course published"
                          }
                          pendingLabel="Updating..."
                          buttonLabel={course.isPublished ? "Hide" : "Unhide"}
                          buttonClassName="text-sm font-medium text-amber-600 hover:text-amber-800"
                        />
                        <TypeToConfirmDelete
                          action={deleteCourse}
                          hiddenFields={{ id: course.id }}
                          expectedText={course.title}
                          title="Delete this course?"
                          description={`This permanently deletes "${course.title}", including its modules, lessons, materials, assignments, submissions, quizzes, and enrollment records. This cannot be undone.`}
                          triggerLabel="Delete"
                          successMessage="Course deleted"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-lg shadow-sm p-4"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <p className="font-semibold text-gray-900">
                    {course.title}
                  </p>
                  <span
                    className={`shrink-0 px-2 py-1 text-xs rounded-full font-medium ${
                      course.isPublished
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {course.isPublished ? "Published" : "Hidden"}
                  </span>
                </div>
                {course.description && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                    {course.description}
                  </p>
                )}
                {course.teachers.length > 0 && (
                  <p className="text-xs text-gray-500 mb-1">
                    Teachers:{" "}
                    {course.teachers.map((t) => t.username).join(", ")}
                  </p>
                )}
                <p className="text-xs text-gray-500 mb-3">
                  {course._count.modules} modules ·{" "}
                  {course._count.assignments} assignments ·{" "}
                  {course._count.quizzes} quizzes ·{" "}
                  {course._count.enrollments} students
                </p>
                <div className="flex flex-wrap gap-3 items-center">
                  <Link
                    href="/admin/assignments"
                    className="text-accent hover:underline text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                  >
                    Manage
                  </Link>
                  <ServerActionForm
                    action={toggleCourseVisibility}
                    hiddenFields={{ id: course.id }}
                    confirmMessage={
                      course.isPublished
                        ? "Hide this course?"
                        : "Publish this course?"
                    }
                    successMessage={
                      course.isPublished
                        ? "Course hidden"
                        : "Course published"
                    }
                    pendingLabel="Updating..."
                    buttonLabel={course.isPublished ? "Hide" : "Unhide"}
                    buttonClassName="text-sm font-medium text-amber-600 hover:text-amber-800"
                  />
                  <TypeToConfirmDelete
                    action={deleteCourse}
                    hiddenFields={{ id: course.id }}
                    expectedText={course.title}
                    title="Delete this course?"
                    description={`This permanently deletes "${course.title}" and all its content. This cannot be undone.`}
                    triggerLabel="Delete"
                    successMessage="Course deleted"
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}