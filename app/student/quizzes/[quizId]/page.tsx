import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { QuizStatus, Role } from "@prisma/client";
import { QuizRunner } from "@/components/student/QuizRunner";
import { z } from "zod";

const cuidSchema = z.string().cuid();

const DATE_TIME_FORMAT = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function StudentQuizPage({
  params,
}: {
  params: Promise<{ quizId: string }>;
}) {
  const { quizId } = await params;
  const parsedId = cuidSchema.safeParse(quizId);
  if (!parsedId.success) notFound();

  const session = await auth();
  if (!session?.user?.id || session.user.role !== Role.STUDENT) {
    redirect("/bible-college/portal/login");
  }
  const studentId = session.user.id;

  const quiz = await prisma.quiz.findUnique({
    where: { id: parsedId.data },
    include: {
      questions: { orderBy: { order: "asc" } },
    },
  });

  if (!quiz || quiz.status !== QuizStatus.PUBLISHED) notFound();

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      studentId_courseId: {
        studentId,
        courseId: quiz.courseId,
      },
    },
    select: { id: true },
  });
  if (!enrollment) notFound();

  const now = new Date();
  if (quiz.startDate && now < quiz.startDate) {
    return (
      <NoticeCard
        title="Quiz Not Yet Open"
        body={`This quiz opens on ${DATE_TIME_FORMAT.format(quiz.startDate)}.`}
      />
    );
  }
  if (quiz.endDate && now > quiz.endDate) {
    return (
      <NoticeCard
        title="Quiz Closed"
        body={`This quiz closed on ${DATE_TIME_FORMAT.format(quiz.endDate)}.`}
      />
    );
  }

  const attemptCount = await prisma.quizAttempt.count({
    where: { studentId, quizId: parsedId.data },
  });
  if (attemptCount >= quiz.maxAttempts) {
    return (
      <NoticeCard
        title="Attempt Limit Reached"
        body={`You have already used all ${quiz.maxAttempts} attempt(s) for this quiz.`}
      />
    );
  }

  if (quiz.questions.length === 0) {
    return (
      <NoticeCard
        title="Quiz Not Ready"
        body="This quiz has no questions yet. Please check back later."
      />
    );
  }

  return (
    <QuizRunner
      quiz={{
        id: quiz.id,
        title: quiz.title,
        durationMinutes: quiz.durationMinutes,
        passingScore: quiz.passingScore,
      }}
      questions={quiz.questions.map((q) => ({
        id: q.id,
        questionText: q.questionText,
        marks: q.marks,
        questionType: q.questionType,
        options: q.options,
      }))}
    />
  );
}

function NoticeCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-8 text-center">
      <h1 className="text-xl font-bold text-primary mb-2">{title}</h1>
      <p className="text-gray-600">{body}</p>
      <Link
        href="/student/quizzes"
        className="text-accent hover:underline inline-block mt-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
      >
        Back to Quizzes
      </Link>
    </div>
  );
}