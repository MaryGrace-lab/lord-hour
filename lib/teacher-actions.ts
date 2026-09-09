"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { Role, QuizStatus, AssignmentStatus, SubmissionStatus } from "@prisma/client";

// ─── Authorization helper ───
async function isTeacherOfCourse(courseId: string, teacherId: string) {
  const course = await prisma.course.findFirst({
    where: {
      id: courseId,
      teachers: { some: { id: teacherId } },
    },
  });
  return !!course;
}

// ─── Lessons & Modules ───

export async function createLesson(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== Role.TEACHER) throw new Error("Unauthorized");
  const teacherId = session.user.id;

  const courseId = formData.get("courseId")?.toString();
  const moduleId = formData.get("moduleId")?.toString();
  const title = formData.get("title")?.toString();
  const content = formData.get("content")?.toString() || null;

  if (!courseId || !moduleId || !title) throw new Error("Missing required fields");
  if (!(await isTeacherOfCourse(courseId, teacherId))) throw new Error("Not authorized");

  const courseModule = await prisma.module.findFirst({
    where: { id: moduleId, courseId },
  });
  if (!courseModule) throw new Error("Module not found");

  const maxOrder = await prisma.lesson.findFirst({
    where: { moduleId },
    orderBy: { order: "desc" },
  });

  await prisma.lesson.create({
    data: {
      title,
      content,
      moduleId,
      order: (maxOrder?.order ?? 0) + 1,
    },
  });

  revalidatePath(`/teacher/courses/${courseId}/lessons`);
}

export async function updateLesson(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== Role.TEACHER) throw new Error("Unauthorized");
  const teacherId = session.user.id;

  const lessonId = formData.get("lessonId")?.toString();
  const title = formData.get("title")?.toString();
  const content = formData.get("content")?.toString() || null;

  if (!lessonId || !title) throw new Error("Missing required fields");

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { module: { include: { course: true } } },
  });

  if (!lesson || !(await isTeacherOfCourse(lesson.module.courseId, teacherId))) {
    throw new Error("Not authorized");
  }

  await prisma.lesson.update({
    where: { id: lessonId },
    data: { title, content },
  });

  revalidatePath(`/teacher/courses/${lesson.module.courseId}/lessons`);
}

export async function deleteLesson(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== Role.TEACHER) throw new Error("Unauthorized");
  const teacherId = session.user.id;

  const lessonId = formData.get("lessonId")?.toString();
  if (!lessonId) throw new Error("Lesson ID required");

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { module: { include: { course: true } } },
  });

  if (!lesson || !(await isTeacherOfCourse(lesson.module.courseId, teacherId))) {
    throw new Error("Not authorized");
  }

  await prisma.lesson.delete({ where: { id: lessonId } });
  revalidatePath(`/teacher/courses/${lesson.module.courseId}/lessons`);
}

// ─── Materials ───

export async function deleteMaterial(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== Role.TEACHER) throw new Error("Unauthorized");
  const teacherId = session.user.id;

  const materialId = formData.get("materialId")?.toString();
  if (!materialId) throw new Error("Material ID required");

  const material = await prisma.material.findUnique({
    where: { id: materialId },
    include: { lesson: { include: { module: { include: { course: true } } } } },
  });

  if (!material || !(await isTeacherOfCourse(material.lesson.module.courseId, teacherId))) {
    throw new Error("Not authorized");
  }

  await prisma.material.delete({ where: { id: materialId } });
  revalidatePath(`/teacher/courses/${material.lesson.module.courseId}/materials`);
}

// ─── Assignments ───

export async function createAssignment(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== Role.TEACHER) throw new Error("Unauthorized");
  const teacherId = session.user.id;

  const courseId = formData.get("courseId")?.toString();
  const title = formData.get("title")?.toString();
  const description = formData.get("description")?.toString() || null;
  const dueDate = formData.get("dueDate")?.toString();
  const maxScore = parseInt(formData.get("maxScore")?.toString() || "20");

  if (!courseId || !title || !dueDate) throw new Error("Missing required fields");
  if (!(await isTeacherOfCourse(courseId, teacherId))) throw new Error("Not authorized");

  await prisma.assignment.create({
    data: {
      title,
      description,
      dueDate: new Date(dueDate),
      maxScore,
      status: AssignmentStatus.DRAFT,
      courseId,
    },
  });

  revalidatePath(`/teacher/courses/${courseId}/assignments`);
}

export async function deleteAssignment(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== Role.TEACHER) throw new Error("Unauthorized");
  const teacherId = session.user.id;

  const assignmentId = formData.get("assignmentId")?.toString();
  if (!assignmentId) throw new Error("Assignment ID required");

  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
    include: { course: true },
  });

  if (!assignment || !(await isTeacherOfCourse(assignment.courseId, teacherId))) {
    throw new Error("Not authorized");
  }

  await prisma.assignment.delete({ where: { id: assignmentId } });
  revalidatePath(`/teacher/courses/${assignment.courseId}/assignments`);
}

export async function publishAssignment(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== Role.TEACHER) throw new Error("Unauthorized");
  const teacherId = session.user.id;

  const assignmentId = formData.get("assignmentId")?.toString();
  if (!assignmentId) throw new Error("Assignment ID required");

  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
    include: { course: true },
  });

  if (!assignment || !(await isTeacherOfCourse(assignment.courseId, teacherId))) {
    throw new Error("Not authorized");
  }

  const newStatus = assignment.status === AssignmentStatus.PUBLISHED ? AssignmentStatus.DRAFT : AssignmentStatus.PUBLISHED;
  await prisma.assignment.update({
    where: { id: assignmentId },
    data: { status: newStatus },
  });

  revalidatePath(`/teacher/courses/${assignment.courseId}/assignments`);
}

export async function gradeSubmission(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== Role.TEACHER) throw new Error("Unauthorized");
  const teacherId = session.user.id;

  const submissionId = formData.get("submissionId")?.toString();
  const score = parseInt(formData.get("score")?.toString() || "0");
  const feedback = formData.get("feedback")?.toString() || null;

  if (!submissionId) throw new Error("Submission ID required");

  const submission = await prisma.assignmentSubmission.findUnique({
    where: { id: submissionId },
    include: { assignment: { include: { course: true } } },
  });

  if (!submission || !(await isTeacherOfCourse(submission.assignment.courseId, teacherId))) {
    throw new Error("Not authorized");
  }

  await prisma.assignmentSubmission.update({
    where: { id: submissionId },
    data: {
      score,
      feedback,
      status: SubmissionStatus.GRADED,
      gradedAt: new Date(),
    },
  });

  revalidatePath(`/teacher/courses/${submission.assignment.courseId}/assignments/${submission.assignmentId}`);
}

// ─── Quizzes ───

export async function createQuiz(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== Role.TEACHER) throw new Error("Unauthorized");
  const teacherId = session.user.id;

  const courseId = formData.get("courseId")?.toString();
  const title = formData.get("title")?.toString();
  const description = formData.get("description")?.toString() || null;
  const durationMinutes = parseInt(formData.get("durationMinutes")?.toString() || "30");
  const passingScore = parseInt(formData.get("passingScore")?.toString() || "50");

  if (!courseId || !title) throw new Error("Course and title required");
  if (!(await isTeacherOfCourse(courseId, teacherId))) throw new Error("Not authorized");

  await prisma.quiz.create({
    data: {
      title,
      description,
      durationMinutes,
      passingScore,
      maxAttempts: 1,
      status: QuizStatus.DRAFT,
      courseId,
    },
  });

  revalidatePath(`/teacher/courses/${courseId}/quizzes`);
}

export async function deleteQuiz(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== Role.TEACHER) throw new Error("Unauthorized");
  const teacherId = session.user.id;

  const quizId = formData.get("quizId")?.toString();
  if (!quizId) throw new Error("Quiz ID required");

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: { course: true },
  });

  if (!quiz || !(await isTeacherOfCourse(quiz.courseId, teacherId))) {
    throw new Error("Not authorized");
  }

  await prisma.quiz.delete({ where: { id: quizId } });
  revalidatePath(`/teacher/courses/${quiz.courseId}/quizzes`);
}

export async function publishQuiz(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== Role.TEACHER) throw new Error("Unauthorized");
  const teacherId = session.user.id;

  const quizId = formData.get("quizId")?.toString();
  if (!quizId) throw new Error("Quiz ID required");

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: { course: true },
  });

  if (!quiz || !(await isTeacherOfCourse(quiz.courseId, teacherId))) {
    throw new Error("Not authorized");
  }

  const newStatus = quiz.status === QuizStatus.PUBLISHED ? QuizStatus.DRAFT : QuizStatus.PUBLISHED;
  await prisma.quiz.update({
    where: { id: quizId },
    data: { status: newStatus },
  });

  revalidatePath(`/teacher/courses/${quiz.courseId}/quizzes`);
}

export async function addQuizQuestion(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== Role.TEACHER) throw new Error("Unauthorized");
  const teacherId = session.user.id;

  const quizId = formData.get("quizId")?.toString();
  const questionText = formData.get("questionText")?.toString();
  const questionType = formData.get("questionType")?.toString() || "multiple_choice";
  const marks = parseInt(formData.get("marks")?.toString() || "1");
  const options = formData.get("options")?.toString() || null;
  const correctAnswer = formData.get("correctAnswer")?.toString();

  if (!quizId || !questionText || !correctAnswer) throw new Error("Missing required fields");

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: { course: true },
  });

  if (!quiz || !(await isTeacherOfCourse(quiz.courseId, teacherId))) {
    throw new Error("Not authorized");
  }

  const lastQuestion = await prisma.quizQuestion.findFirst({
    where: { quizId },
    orderBy: { order: "desc" },
  });

  await prisma.quizQuestion.create({
    data: {
      quizId,
      questionText,
      questionType,
      marks,
      options,
      correctAnswer,
      order: (lastQuestion?.order ?? 0) + 1,
    },
  });

  revalidatePath(`/teacher/courses/${quiz.courseId}/quizzes/${quizId}`);
}

export async function deleteQuizQuestion(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== Role.TEACHER) throw new Error("Unauthorized");
  const teacherId = session.user.id;

  const questionId = formData.get("questionId")?.toString();
  if (!questionId) throw new Error("Question ID required");

  const question = await prisma.quizQuestion.findUnique({
    where: { id: questionId },
    include: { quiz: { include: { course: true } } },
  });

  if (!question || !(await isTeacherOfCourse(question.quiz.courseId, teacherId))) {
    throw new Error("Not authorized");
  }

  await prisma.quizQuestion.delete({ where: { id: questionId } });
  revalidatePath(`/teacher/courses/${question.quiz.courseId}/quizzes/${question.quizId}`);
}

export async function updateTeacherProfileAction(
  prevState: { success: boolean; error?: string },
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session || session.user.role !== Role.TEACHER) {
    return { success: false, error: "Unauthorized" };
  }

  const firstName = formData.get("firstName")?.toString() || null;
  const lastName = formData.get("lastName")?.toString() || null;

  try {
    const teacher = await prisma.teacher.findUnique({
      where: { userId: session.user.id },
    });

    if (teacher) {
      await prisma.teacher.update({
        where: { userId: session.user.id },
        data: { firstName, lastName },
      });
    } else {
      await prisma.teacher.create({
        data: {
          userId: session.user.id,
          firstName,
          lastName,
        },
      });
    }

    revalidatePath("/teacher/profile");
    return { success: true };
  } catch (error) {
    console.error("Profile update error:", error);
    return { success: false, error: "Unable to save changes." };
  }
}