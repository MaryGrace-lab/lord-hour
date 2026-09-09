import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import { FaBook, FaUpload, FaClipboardList, FaQuestionCircle, FaUsers, FaLayerGroup } from "react-icons/fa";

export default async function CourseOverviewPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const session = await auth();
  const teacherId = session?.user.id;

  const course = await prisma.course.findFirst({
    where: {
      id: courseId,
      teachers: { some: { id: teacherId } },
    },
    include: {
      programme: true,
      semester: true,
      session: true,
      _count: {
        select: {
          enrollments: true,
          modules: true,
          assignments: true,
          quizzes: true,
        },
      },
    },
  });

  if (!course) notFound();

  const tabs = [
    { name: "Overview", href: `/teacher/courses/${course.id}`, icon: FaBook },
    { name: "Lessons", href: `/teacher/courses/${course.id}/lessons`, icon: FaLayerGroup },
    { name: "Materials", href: `/teacher/courses/${course.id}/materials`, icon: FaUpload },
    { name: "Assignments", href: `/teacher/courses/${course.id}/assignments`, icon: FaClipboardList },
    { name: "Quizzes", href: `/teacher/courses/${course.id}/quizzes`, icon: FaQuestionCircle },
    { name: "Students", href: `/teacher/courses/${course.id}/students`, icon: FaUsers },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-primary">{course.title}</h2>
          <p className="text-gray-600">{course.code}</p>
        </div>
        <Link
          href="/teacher/courses"
          className="text-sm text-accent hover:underline"
        >
          ← Back to My Courses
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
        {tabs.map((tab) => (
          <Link
            key={tab.name}
            href={tab.href}
            className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100"
          >
            <tab.icon size={14} />
            {tab.name}
          </Link>
        ))}
      </div>

      {/* Overview content */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="font-semibold text-lg mb-2">Course Details</h3>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">Title</dt>
            <dd className="text-gray-900">{course.title}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Code</dt>
            <dd className="text-gray-900">{course.code}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Programme</dt>
            <dd className="text-gray-900">{course.programme?.name || "Not assigned"}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Semester</dt>
            <dd className="text-gray-900">{course.semester ? `${course.semester.name} (${course.session?.name})` : "Not assigned"}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Description</dt>
            <dd className="text-gray-900">{course.description || "No description"}</dd>
          </div>
        </dl>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div>
            <p className="text-2xl font-bold">{course._count.enrollments}</p>
            <p className="text-sm text-gray-600">Students</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{course._count.modules}</p>
            <p className="text-sm text-gray-600">Modules</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{course._count.assignments}</p>
            <p className="text-sm text-gray-600">Assignments</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{course._count.quizzes}</p>
            <p className="text-sm text-gray-600">Quizzes</p>
          </div>
        </div>
      </div>
    </div>
  );
}