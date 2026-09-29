import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AssignmentStatus, EnrollmentStatus, QuizStatus, Role } from "@prisma/client";
import {
  FaBook,
  FaClipboardList,
  FaQuestionCircle,
  FaChartBar,
  FaCheckCircle,
} from "react-icons/fa";

export const revalidate = 30;

export default async function StudentDashboardPage() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== Role.STUDENT) {
    redirect("/bible-college/portal/login");
  }
  const studentId = session.user.id;

  const [
    enrollments,
    completedEnrollments,
    pendingAssignments,
    availableQuizzes,
    gradedSubmissions,
    quizAttempts,
    completions,
  ] = await Promise.all([
    prisma.enrollment.findMany({
      where: { studentId },
      include: {
        course: {
          include: {
            modules: {
              include: { lessons: { select: { id: true } } },
            },
            _count: {
              select: { quizzes: true, assignments: true },
            },
          },
        },
      },
      orderBy: { enrolledAt: "desc" },
    }),
    prisma.enrollment.findMany({
      where: {
        studentId,
        status: EnrollmentStatus.COMPLETED,
      },
      select: {
        id: true,
        completedAt: true,
        course: { select: { id: true, title: true } },
      },
      orderBy: { completedAt: "desc" },
    }),
    prisma.assignment.count({
      where: {
        course: {
          enrollments: { some: { studentId } },
        },
        status: AssignmentStatus.PUBLISHED,
        submissions: { none: { studentId } },
      },
    }),
    prisma.quiz.count({
      where: {
        course: { enrollments: { some: { studentId } } },
        status: QuizStatus.PUBLISHED,
      },
    }),
    prisma.assignmentSubmission.count({
      where: { studentId, status: "GRADED" },
    }),
    prisma.quizAttempt.count({ where: { studentId } }),
    prisma.lessonCompletion.findMany({
      where: { studentId },
      select: { lessonId: true },
    }),
  ]);

  const completedLessonIds = new Set(completions.map((c) => c.lessonId));
  const totalResults = gradedSubmissions + quizAttempts;

  const coursesWithProgress = enrollments.map((enrollment) => {
    const allLessonIds = enrollment.course.modules.flatMap((m) =>
      m.lessons.map((l) => l.id)
    );
    const totalLessons = allLessonIds.length;
    const completed = allLessonIds.filter((id) =>
      completedLessonIds.has(id)
    ).length;
    const progress =
      totalLessons === 0 ? 0 : Math.round((completed / totalLessons) * 100);

    return {
      course: enrollment.course,
      enrollmentStatus: enrollment.status,
      totalLessons,
      completedLessons: completed,
      progress,
    };
  });

  const displayName = session.user.name || "Student";

  // WhatsApp contact link for certificate requests.
  const waNumber = (process.env.WHATSAPP_CONTACT_NUMBER ?? "").replace(
    /[^\d]/g,
    ""
  );
  const waLink = waNumber ? `https://wa.me/${waNumber}` : null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-primary">
          Welcome, {displayName}
        </h1>
        <p className="text-gray-600">Continue your learning.</p>
      </div>

      {/* Course completion banner */}
      {completedEnrollments.length > 0 && (
        <section
          className="bg-green-50 border border-green-200 rounded-lg p-6"
          aria-labelledby="completion-banner-heading"
        >
          <div className="flex items-start gap-3">
            <FaCheckCircle
              className="text-green-600 text-2xl shrink-0 mt-0.5"
              aria-hidden
            />
            <div className="min-w-0">
              <h2
                id="completion-banner-heading"
                className="font-semibold text-lg text-green-800"
              >
                {completedEnrollments.length === 1
                  ? "You completed a course!"
                  : `You completed ${completedEnrollments.length} courses!`}
              </h2>
              <ul className="mt-2 space-y-1">
                {completedEnrollments.map((e) => (
                  <li
                    key={e.id}
                    className="text-sm text-green-900 font-medium"
                  >
                    {e.course.title}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-sm text-green-800">
                To receive your certificate, please contact the school office
                on WhatsApp.
              </p>
              {waLink && (
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 bg-[#25D366] text-white px-4 py-2 rounded-md hover:bg-[#1da851] text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
                >
                  Message us on WhatsApp
                  <span className="sr-only"> (opens in new tab)</span>
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          href="/student/courses"
          icon={<FaBook className="text-accent text-2xl mb-2" aria-hidden />}
          value={enrollments.length}
          label="My Courses"
        />
        <StatCard
          href="/student/assignments"
          icon={
            <FaClipboardList
              className="text-accent text-2xl mb-2"
              aria-hidden
            />
          }
          value={pendingAssignments}
          label="Pending Assignments"
        />
        <StatCard
          href="/student/quizzes"
          icon={
            <FaQuestionCircle
              className="text-accent text-2xl mb-2"
              aria-hidden
            />
          }
          value={availableQuizzes}
          label="Available Quizzes"
        />
        <StatCard
          href="/student/results"
          icon={<FaChartBar className="text-accent text-2xl mb-2" aria-hidden />}
          value={totalResults}
          label="Results"
        />
      </div>

      <section aria-labelledby="continue-learning-heading">
        <h2
          id="continue-learning-heading"
          className="text-lg font-semibold text-primary mb-4"
        >
          Continue Learning
        </h2>

        {coursesWithProgress.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
            You are not enrolled in any courses yet. Contact the school office
            if you believe this is an error.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {coursesWithProgress.map(
              ({
                course,
                enrollmentStatus,
                progress,
                totalLessons,
                completedLessons,
              }) => {
                const isComplete =
                  enrollmentStatus === EnrollmentStatus.COMPLETED;
                return (
                  <div
                    key={course.id}
                    className="bg-white rounded-lg shadow-sm p-6 flex flex-col"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-lg">
                        {course.title}
                      </h3>
                      {isComplete && (
                        <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700">
                          <FaCheckCircle aria-hidden size={10} />
                          Completed
                        </span>
                      )}
                    </div>

                    <div
                      className="w-full bg-gray-200 rounded-full h-2 mb-2 mt-3"
                      role="progressbar"
                      aria-valuenow={progress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`Progress for ${course.title}`}
                    >
                      <div
                        className={`h-2 rounded-full transition-all ${
                          isComplete ? "bg-green-500" : "bg-accent"
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 mb-4">
                      {completedLessons}/{totalLessons} lessons · {progress}%
                    </p>

                    <Link
                      href={`/student/courses/${course.id}`}
                      className="mt-auto text-accent hover:underline text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                    >
                      {isComplete
                        ? "Review Course →"
                        : progress === 0
                        ? "Start Learning →"
                        : "Continue Learning →"}
                    </Link>
                  </div>
                );
              }
            )}
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({
  href,
  icon,
  value,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  value: number;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {icon}
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-gray-600">{label}</p>
    </Link>
  );
}