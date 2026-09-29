"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import {
  Role,
  SubmissionStatus,
  AssignmentStatus,
  QuizStatus,
} from "@prisma/client";
import {
  submitAssignmentSchema,
  submitQuizSchema,
  idOnlySchema,
  validationError,
} from "@/lib/validations";

// ────────────────────────────────────────────────
// Helper: get the current student or null
// ────────────────────────────────────────────────
async function requireStudent() {
  const session = await auth();
  if (!session || session.user.role !== Role.STUDENT) {
    return null;
  }
  return session.user.id;
}

// ────────────────────────────────────────────────
// Mark lesson complete
// ────────────────────────────────────────────────
export async function markLessonComplete(formData: FormData) {
  const studentId = await requireStudent();
  if (!studentId) throw new Error("Unauthorized");

  const parsed = idOnlySchema.safeParse({ id: formData.get("lessonId") });
  if (!parsed.success) throw new Error("Invalid lesson ID");

  const lesson = await prisma.lesson.findUnique({
    where: { id: parsed.data.id },
    include: { module: { select: { courseId: true } } },
  });
  if (!lesson) throw new Error("Lesson not found");

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      studentId_courseId: {
        studentId,
        courseId: lesson.module.courseId,
      },
    },
  });
  if (!enrollment) throw new Error("You are not enrolled in this course");

  await prisma.lessonCompletion.upsert({
    where: { studentId_lessonId: { studentId, lessonId: lesson.id } },
    update: {},
    create: { studentId, lessonId: lesson.id },
  });

  revalidatePath(`/student/courses/${lesson.module.courseId}`);
  revalidatePath(
    `/student/courses/${lesson.module.courseId}/lessons/${lesson.id}`
  );
}

// ────────────────────────────────────────────────
// Submit assignment
//
// Once a student has submitted, no resubmission is allowed. To change a
// submission, the student must contact the instructor.
// ────────────────────────────────────────────────
export async function submitAssignment(
  _prevState: { success: boolean; error?: string; isLate?: boolean },
  formData: FormData
): Promise<{ success: boolean; error?: string; isLate?: boolean }> {
  const studentId = await requireStudent();
  if (!studentId) return { success: false, error: "Unauthorized" };

  const parsed = submitAssignmentSchema.safeParse({
    assignmentId: formData.get("assignmentId"),
    content: formData.get("content") || undefined,
    fileUrl: formData.get("fileUrl") || undefined,
  });
  if (!parsed.success) return validationError(parsed.error);

  const { assignmentId, content, fileUrl } = parsed.data;

  if (!content && !fileUrl) {
    return {
      success: false,
      error: "Please provide either text content or a file link",
    };
  }

  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
    select: {
      id: true,
      courseId: true,
      status: true,
      dueDate: true,
    },
  });
  if (!assignment) return { success: false, error: "Assignment not found" };
  if (assignment.status !== AssignmentStatus.PUBLISHED) {
    return {
      success: false,
      error: "This assignment is not open for submissions",
    };
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      studentId_courseId: { studentId, courseId: assignment.courseId },
    },
  });
  if (!enrollment) {
    return { success: false, error: "You are not enrolled in this course" };
  }

  const existing = await prisma.assignmentSubmission.findUnique({
    where: { studentId_assignmentId: { studentId, assignmentId } },
    select: { id: true },
  });

  if (existing) {
    return {
      success: false,
      error:
        "You have already submitted this assignment. Contact your instructor if you need to make a change.",
    };
  }

  const now = new Date();
  const isLate = now > assignment.dueDate;
  const newStatus = isLate
    ? SubmissionStatus.LATE
    : SubmissionStatus.SUBMITTED;

  try {
    await prisma.assignmentSubmission.create({
      data: {
        studentId,
        assignmentId,
        content: content ?? null,
        fileUrl: fileUrl ?? null,
        submittedAt: now,
        status: newStatus,
      },
    });

    revalidatePath("/student/assignments");
    revalidatePath(`/student/assignments/${assignmentId}`);
    revalidatePath("/student");

    return { success: true, isLate };
  } catch (error) {
    console.error("Submit assignment error:", error);
    return { success: false, error: "Unable to submit assignment" };
  }
}

// ────────────────────────────────────────────────
// Submit quiz
// ────────────────────────────────────────────────
type QuizSubmitResult = {
  success: boolean;
  error?: string;
  attemptId?: string;
  score?: number;
  totalMarks?: number;
  percentage?: number;
  passed?: boolean;
};

function normalizeAnswer(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

export async function submitQuiz(
  _prevState: QuizSubmitResult,
  formData: FormData
): Promise<QuizSubmitResult> {
  const studentId = await requireStudent();
  if (!studentId) return { success: false, error: "Unauthorized" };

  const parsed = submitQuizSchema.safeParse({ quizId: formData.get("quizId") });
  if (!parsed.success) return validationError(parsed.error);

  const { quizId } = parsed.data;

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: {
      questions: { orderBy: { order: "asc" } },
    },
  });
  if (!quiz) return { success: false, error: "Quiz not found" };
  if (quiz.status !== QuizStatus.PUBLISHED) {
    return { success: false, error: "This quiz is not available" };
  }

  const now = new Date();
  if (quiz.startDate && now < quiz.startDate) {
    return { success: false, error: "This quiz has not opened yet" };
  }
  if (quiz.endDate && now > quiz.endDate) {
    return { success: false, error: "This quiz has closed" };
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      studentId_courseId: { studentId, courseId: quiz.courseId },
    },
  });
  if (!enrollment) {
    return { success: false, error: "You are not enrolled in this course" };
  }

  const attemptCount = await prisma.quizAttempt.count({
    where: { studentId, quizId },
  });
  if (attemptCount >= quiz.maxAttempts) {
    return {
      success: false,
      error: "You have reached the maximum number of attempts",
    };
  }

  if (quiz.questions.length === 0) {
    return { success: false, error: "This quiz has no questions" };
  }

  let totalMarks = 0;
  let earnedMarks = 0;

  for (const question of quiz.questions) {
    totalMarks += question.marks;
    const rawAnswer =
      formData.get(`question_${question.id}`)?.toString() || "";
    const correct = normalizeAnswer(question.correctAnswer || "");
    const submitted = normalizeAnswer(rawAnswer);

    if (correct && submitted === correct) {
      earnedMarks += question.marks;
    }
  }

  const percentage =
    totalMarks === 0 ? 0 : Math.round((earnedMarks / totalMarks) * 100);
  const passed = percentage >= quiz.passingScore;

  try {
    const attempt = await prisma.quizAttempt.create({
      data: { quizId, studentId, score: earnedMarks, passed },
    });

    revalidatePath("/student/quizzes");
    revalidatePath("/student/results");
    revalidatePath("/student");

    return {
      success: true,
      attemptId: attempt.id,
      score: earnedMarks,
      totalMarks,
      percentage,
      passed,
    };
  } catch (error) {
    console.error("Submit quiz error:", error);
    return { success: false, error: "Unable to submit quiz" };
  }
}