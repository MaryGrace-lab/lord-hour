"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath, revalidateTag } from "next/cache";
import { Role, QuizStatus, AssignmentStatus, SubmissionStatus, EnrollmentStatus } from "@prisma/client";
import {
  addModuleSchema,
  createLessonSchema,
  updateLessonSchema,
  createAssignmentSchema,
  gradeSubmissionSchema,
  createQuizSchema,
  addQuizQuestionSchema,
  idOnlySchema,
  validationError,
} from "@/lib/validations";
import { logAudit } from "@/lib/audit";

// ─── Authorization helper ───
async function isTeacherOfCourse(
  courseId: string,
  teacherId: string
): Promise<boolean> {
  const course = await prisma.course.findFirst({
    where: {
      id: courseId,
      teachers: { some: { id: teacherId } },
    },
    select: { id: true },
  });
  return !!course;
}

async function requireTeacher() {
  const session = await auth();
  if (!session || session.user.role !== Role.TEACHER) {
    throw new Error("Unauthorized");
  }
  return session.user.id;
}

// ────────────────────────────────────────────────
// Modules
// ────────────────────────────────────────────────
export async function addModule(formData: FormData) {
  const teacherId = await requireTeacher();

  const parsed = addModuleSchema.safeParse({
    courseId: formData.get("courseId"),
    title: formData.get("title"),
  });
  if (!parsed.success) throw new Error("Invalid input");

  const { courseId, title } = parsed.data;
  if (!(await isTeacherOfCourse(courseId, teacherId))) {
    throw new Error("Not authorized");
  }

  const maxOrder = await prisma.module.findFirst({
    where: { courseId },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  await prisma.module.create({
    data: {
      title,
      courseId,
      order: (maxOrder?.order ?? 0) + 1,
    },
  });

  revalidatePath(`/teacher/courses/${courseId}/lessons`);
  revalidatePath(`/student/courses/${courseId}`);
}

export async function deleteModule(formData: FormData) {
  const teacherId = await requireTeacher();

  const parsed = idOnlySchema.safeParse({ id: formData.get("moduleId") });
  if (!parsed.success) throw new Error("Invalid module ID");

  const courseModule = await prisma.module.findUnique({
    where: { id: parsed.data.id },
    select: { id: true, courseId: true },
  });

  if (
    !courseModule ||
    !(await isTeacherOfCourse(courseModule.courseId, teacherId))
  ) {
    throw new Error("Not authorized");
  }

  await prisma.module.delete({ where: { id: courseModule.id } });
  revalidatePath(`/teacher/courses/${courseModule.courseId}/lessons`);
  revalidatePath(`/student/courses/${courseModule.courseId}`);
}

// ────────────────────────────────────────────────
// Lessons
// ────────────────────────────────────────────────
export async function createLesson(formData: FormData) {
  const teacherId = await requireTeacher();

  const parsed = createLessonSchema.safeParse({
    courseId: formData.get("courseId"),
    moduleId: formData.get("moduleId"),
    title: formData.get("title"),
    content: formData.get("content") || undefined,
  });
  if (!parsed.success) throw new Error("Invalid input");

  const { courseId, moduleId, title, content } = parsed.data;

  if (!(await isTeacherOfCourse(courseId, teacherId))) {
    throw new Error("Not authorized");
  }

  const courseModule = await prisma.module.findFirst({
    where: { id: moduleId, courseId },
    select: { id: true },
  });
  if (!courseModule) throw new Error("Module not found");

  const maxOrder = await prisma.lesson.findFirst({
    where: { moduleId },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  await prisma.lesson.create({
    data: {
      title,
      content: content ?? null,
      moduleId,
      order: (maxOrder?.order ?? 0) + 1,
    },
  });

  revalidatePath(`/teacher/courses/${courseId}/lessons`);
  revalidatePath(`/student/courses/${courseId}`);
}

export async function updateLesson(formData: FormData) {
  const teacherId = await requireTeacher();

  const parsed = updateLessonSchema.safeParse({
    lessonId: formData.get("lessonId"),
    title: formData.get("title"),
    content: formData.get("content") || undefined,
  });
  if (!parsed.success) throw new Error("Invalid input");

  const { lessonId, title, content } = parsed.data;

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: {
      id: true,
      module: { select: { courseId: true } },
    },
  });

  if (!lesson || !(await isTeacherOfCourse(lesson.module.courseId, teacherId))) {
    throw new Error("Not authorized");
  }

  await prisma.lesson.update({
    where: { id: lessonId },
    data: { title, content: content ?? null },
  });

  revalidatePath(`/teacher/courses/${lesson.module.courseId}/lessons`);
  revalidatePath(
    `/teacher/courses/${lesson.module.courseId}/lessons/${lessonId}`
  );
  revalidatePath(`/student/courses/${lesson.module.courseId}`);
}

export async function deleteLesson(formData: FormData) {
  const teacherId = await requireTeacher();

  const parsed = idOnlySchema.safeParse({ id: formData.get("lessonId") });
  if (!parsed.success) throw new Error("Invalid lesson ID");

  const lesson = await prisma.lesson.findUnique({
    where: { id: parsed.data.id },
    select: {
      id: true,
      module: { select: { courseId: true } },
    },
  });

  if (!lesson || !(await isTeacherOfCourse(lesson.module.courseId, teacherId))) {
    throw new Error("Not authorized");
  }

  await prisma.lesson.delete({ where: { id: lesson.id } });
  revalidatePath(`/teacher/courses/${lesson.module.courseId}/lessons`);
  revalidatePath(`/student/courses/${lesson.module.courseId}`);
}

// ────────────────────────────────────────────────
// Materials
// ────────────────────────────────────────────────
export async function deleteMaterial(formData: FormData) {
  const teacherId = await requireTeacher();

  const parsed = idOnlySchema.safeParse({ id: formData.get("materialId") });
  if (!parsed.success) throw new Error("Invalid material ID");

  const material = await prisma.material.findUnique({
    where: { id: parsed.data.id },
    select: {
      id: true,
      lesson: {
        select: {
          module: { select: { courseId: true } },
        },
      },
    },
  });

  if (
    !material ||
    !(await isTeacherOfCourse(material.lesson.module.courseId, teacherId))
  ) {
    throw new Error("Not authorized");
  }

  await prisma.material.delete({ where: { id: material.id } });
  revalidatePath(
    `/teacher/courses/${material.lesson.module.courseId}/materials`
  );
  revalidatePath(`/student/courses/${material.lesson.module.courseId}`);
}

// ────────────────────────────────────────────────
// Course completion
// ────────────────────────────────────────────────

/**
 * Returns the total number of lessons in a course (across all modules).
 */
async function getCourseLessonCount(courseId: string): Promise<number> {
  return prisma.lesson.count({
    where: { module: { courseId } },
  });
}

/**
 * Returns the number of distinct completed lessons for a student in a course.
 */
async function getCompletedLessonCount(
  studentId: string,
  courseId: string
): Promise<number> {
  const result = await prisma.lessonCompletion.findMany({
    where: {
      studentId,
      lesson: { module: { courseId } },
    },
    select: { lessonId: true },
    distinct: ["lessonId"],
  });
  return result.length;
}

export async function markEnrollmentComplete(formData: FormData) {
  const teacherId = await requireTeacher();

  const enrollmentId = formData.get("enrollmentId")?.toString();
  if (!enrollmentId) throw new Error("Invalid enrollment ID");

  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    select: {
      id: true,
      studentId: true,
      courseId: true,
      status: true,
      course: {
        select: {
          id: true,
          title: true,
          teachers: { select: { id: true, username: true, name: true } },
        },
      },
      student: {
        select: {
          id: true,
          username: true,
          name: true,
          studentProfile: { select: { email: true, firstName: true, lastName: true } },
        },
      },
    },
  });

  if (!enrollment) throw new Error("Enrollment not found");

  // Teacher must own this course.
  const teacherOwnsCourse = enrollment.course.teachers.some(
    (t) => t.id === teacherId
  );
  if (!teacherOwnsCourse) {
    throw new Error("Not authorized for this course");
  }

  if (enrollment.status === "COMPLETED") {
    throw new Error("This student is already marked complete for this course");
  }

  // Require 100% lesson completion.
  const [total, completed] = await Promise.all([
    getCourseLessonCount(enrollment.courseId),
    getCompletedLessonCount(enrollment.studentId, enrollment.courseId),
  ]);

  if (total === 0) {
    throw new Error("This course has no lessons yet");
  }
  if (completed < total) {
    throw new Error(
      `This student has only completed ${completed} of ${total} lessons. ` +
        `A course can only be marked complete when all lessons are done.`
    );
  }

  await prisma.enrollment.update({
    where: { id: enrollment.id },
    data: {
      status: "COMPLETED",
      completedAt: new Date(),
      completedById: teacherId,
    },
  });

  const teacher = enrollment.course.teachers.find((t) => t.id === teacherId);
  const teacherName =
    teacher?.name || teacher?.username || "Your instructor";

  const studentDisplayName =
    [
      enrollment.student.studentProfile?.firstName,
      enrollment.student.studentProfile?.lastName,
    ]
      .filter(Boolean)
      .join(" ") ||
    enrollment.student.name ||
    enrollment.student.username;

  await logAudit({
    userId: teacherId,
    action: "ENROLLMENT_COMPLETED",
    entity: "Enrollment",
    entityId: enrollment.id,
    metadata: {
      studentUsername: enrollment.student.username,
      courseTitle: enrollment.course.title,
    },
  });

  // Send notification email. Failure must not roll back the completion.
  const studentEmail = enrollment.student.studentProfile?.email;
  if (studentEmail) {
    try {
      const { sendCourseCompletionEmail } = await import("@/lib/email");
      await sendCourseCompletionEmail({
        studentName: studentDisplayName,
        studentEmail,
        courseTitle: enrollment.course.title,
        teacherName,
      });
    } catch (err) {
      console.error("Course completion email failed:", err);
    }
  }

  revalidatePath(`/teacher/courses/${enrollment.courseId}/students`);
  revalidatePath("/teacher/courses");
  revalidatePath("/student");
  revalidatePath("/student/courses");
  revalidateTag("admin-activity", "max");
}

export async function revertEnrollmentCompletion(formData: FormData) {
  const teacherId = await requireTeacher();

  const enrollmentId = formData.get("enrollmentId")?.toString();
  if (!enrollmentId) throw new Error("Invalid enrollment ID");

  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    select: {
      id: true,
      status: true,
      courseId: true,
      course: {
        select: {
          title: true,
          teachers: { select: { id: true } },
        },
      },
      student: { select: { username: true } },
    },
  });

  if (!enrollment) throw new Error("Enrollment not found");

  const teacherOwnsCourse = enrollment.course.teachers.some(
    (t) => t.id === teacherId
  );
  if (!teacherOwnsCourse) {
    throw new Error("Not authorized for this course");
  }

  if (enrollment.status !== "COMPLETED") {
    throw new Error("This enrollment is not marked complete");
  }

  await prisma.enrollment.update({
    where: { id: enrollment.id },
    data: {
      status: "ACTIVE",
      completedAt: null,
      completedById: null,
    },
  });

  await logAudit({
    userId: teacherId,
    action: "ENROLLMENT_COMPLETION_REVERTED",
    entity: "Enrollment",
    entityId: enrollment.id,
    metadata: {
      studentUsername: enrollment.student.username,
      courseTitle: enrollment.course.title,
    },
  });

  revalidatePath(`/teacher/courses/${enrollment.courseId}/students`);
  revalidatePath("/student");
  revalidatePath("/student/courses");
  revalidateTag("admin-activity", "max");
}

// ────────────────────────────────────────────────
// Assignments
// ────────────────────────────────────────────────
export async function createAssignment(formData: FormData) {
  const teacherId = await requireTeacher();

  const parsed = createAssignmentSchema.safeParse({
    courseId: formData.get("courseId"),
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    dueDate: formData.get("dueDate"),
    maxScore: formData.get("maxScore"),
  });
  if (!parsed.success) throw new Error("Invalid input");

  const { courseId, title, description, dueDate, maxScore } = parsed.data;

  if (!(await isTeacherOfCourse(courseId, teacherId))) {
    throw new Error("Not authorized");
  }

  const dueDateObj = new Date(dueDate);
  if (Number.isNaN(dueDateObj.getTime())) {
    throw new Error("Invalid due date");
  }

  await prisma.assignment.create({
    data: {
      title,
      description: description ?? null,
      dueDate: dueDateObj,
      maxScore,
      status: AssignmentStatus.DRAFT,
      courseId,
    },
  });

  revalidatePath(`/teacher/courses/${courseId}/assignments`);
  revalidatePath(`/student/assignments`);
}

export async function deleteAssignment(formData: FormData) {
  const teacherId = await requireTeacher();

  const parsed = idOnlySchema.safeParse({ id: formData.get("assignmentId") });
  if (!parsed.success) throw new Error("Invalid assignment ID");

  const assignment = await prisma.assignment.findUnique({
    where: { id: parsed.data.id },
    select: { id: true, courseId: true },
  });

  if (
    !assignment ||
    !(await isTeacherOfCourse(assignment.courseId, teacherId))
  ) {
    throw new Error("Not authorized");
  }

  await prisma.assignment.delete({ where: { id: assignment.id } });
  revalidatePath(`/teacher/courses/${assignment.courseId}/assignments`);
  revalidatePath(`/student/assignments`);
}

export async function publishAssignment(formData: FormData) {
  const teacherId = await requireTeacher();

  const parsed = idOnlySchema.safeParse({ id: formData.get("assignmentId") });
  if (!parsed.success) throw new Error("Invalid assignment ID");

  const assignment = await prisma.assignment.findUnique({
    where: { id: parsed.data.id },
    select: { id: true, courseId: true, status: true },
  });

  if (
    !assignment ||
    !(await isTeacherOfCourse(assignment.courseId, teacherId))
  ) {
    throw new Error("Not authorized");
  }

  const newStatus =
    assignment.status === AssignmentStatus.PUBLISHED
      ? AssignmentStatus.DRAFT
      : AssignmentStatus.PUBLISHED;

  await prisma.assignment.update({
    where: { id: assignment.id },
    data: { status: newStatus },
  });

  revalidatePath(`/teacher/courses/${assignment.courseId}/assignments`);
  revalidatePath(`/student/assignments`);
}

export async function gradeSubmission(formData: FormData) {
  const teacherId = await requireTeacher();

  const parsed = gradeSubmissionSchema.safeParse({
    submissionId: formData.get("submissionId"),
    score: formData.get("score"),
    feedback: formData.get("feedback") || undefined,
  });
  if (!parsed.success) throw new Error("Invalid input");

  const { submissionId, score, feedback } = parsed.data;

  const submission = await prisma.assignmentSubmission.findUnique({
    where: { id: submissionId },
    select: {
      id: true,
      assignmentId: true,
      assignment: {
        select: {
          courseId: true,
          maxScore: true,
        },
      },
    },
  });

  if (
    !submission ||
    !(await isTeacherOfCourse(submission.assignment.courseId, teacherId))
  ) {
    throw new Error("Not authorized");
  }

  // Business rule: score cannot exceed the assignment's max
  if (score > submission.assignment.maxScore) {
    throw new Error(
      `Score cannot exceed the maximum of ${submission.assignment.maxScore}`
    );
  }

  await prisma.assignmentSubmission.update({
    where: { id: submissionId },
    data: {
      score,
      feedback: feedback ?? null,
      status: SubmissionStatus.GRADED,
      gradedAt: new Date(),
    },
  });

  revalidatePath(
    `/teacher/courses/${submission.assignment.courseId}/assignments/${submission.assignmentId}`
  );
  revalidatePath(`/student/assignments/${submission.assignmentId}`);
  revalidatePath(`/student/results`);
}

// ────────────────────────────────────────────────
// Quizzes
// ────────────────────────────────────────────────
export async function createQuiz(formData: FormData) {
  const teacherId = await requireTeacher();

  const parsed = createQuizSchema.safeParse({
    courseId: formData.get("courseId"),
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    durationMinutes: formData.get("durationMinutes"),
    passingScore: formData.get("passingScore"),
  });
  if (!parsed.success) throw new Error("Invalid input");

  const { courseId, title, description, durationMinutes, passingScore } =
    parsed.data;

  if (!(await isTeacherOfCourse(courseId, teacherId))) {
    throw new Error("Not authorized");
  }

  await prisma.quiz.create({
    data: {
      title,
      description: description ?? null,
      durationMinutes,
      passingScore,
      maxAttempts: 1,
      status: QuizStatus.DRAFT,
      courseId,
    },
  });

  revalidatePath(`/teacher/courses/${courseId}/quizzes`);
  revalidatePath(`/student/quizzes`);
}

export async function deleteQuiz(formData: FormData) {
  const teacherId = await requireTeacher();

  const parsed = idOnlySchema.safeParse({ id: formData.get("quizId") });
  if (!parsed.success) throw new Error("Invalid quiz ID");

  const quiz = await prisma.quiz.findUnique({
    where: { id: parsed.data.id },
    select: { id: true, courseId: true },
  });

  if (!quiz || !(await isTeacherOfCourse(quiz.courseId, teacherId))) {
    throw new Error("Not authorized");
  }

  await prisma.quiz.delete({ where: { id: quiz.id } });
  revalidatePath(`/teacher/courses/${quiz.courseId}/quizzes`);
  revalidatePath(`/student/quizzes`);
}

export async function publishQuiz(formData: FormData) {
  const teacherId = await requireTeacher();

  const parsed = idOnlySchema.safeParse({ id: formData.get("quizId") });
  if (!parsed.success) throw new Error("Invalid quiz ID");

  const quiz = await prisma.quiz.findUnique({
    where: { id: parsed.data.id },
    select: {
      id: true,
      courseId: true,
      status: true,
      _count: { select: { questions: true } },
    },
  });

  if (!quiz || !(await isTeacherOfCourse(quiz.courseId, teacherId))) {
    throw new Error("Not authorized");
  }

  // Refuse to publish a quiz with no questions.
  if (
    quiz.status !== QuizStatus.PUBLISHED &&
    quiz._count.questions === 0
  ) {
    throw new Error("Cannot publish a quiz with no questions. Add questions first.");
  }

  const newStatus =
    quiz.status === QuizStatus.PUBLISHED
      ? QuizStatus.DRAFT
      : QuizStatus.PUBLISHED;

  await prisma.quiz.update({
    where: { id: quiz.id },
    data: { status: newStatus },
  });

  revalidatePath(`/teacher/courses/${quiz.courseId}/quizzes`);
  revalidatePath(`/student/quizzes`);
}

export async function addQuizQuestion(formData: FormData) {
  const teacherId = await requireTeacher();

  const parsed = addQuizQuestionSchema.safeParse({
    quizId: formData.get("quizId"),
    questionText: formData.get("questionText"),
    questionType: formData.get("questionType") || "multiple_choice",
    marks: formData.get("marks"),
    options: formData.get("options") || undefined,
    correctAnswer: formData.get("correctAnswer"),
  });
  if (!parsed.success) throw new Error("Invalid input");

  const {
    quizId,
    questionText,
    questionType,
    marks,
    options,
    correctAnswer,
  } = parsed.data;

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    select: { id: true, courseId: true },
  });
  if (!quiz || !(await isTeacherOfCourse(quiz.courseId, teacherId))) {
    throw new Error("Not authorized");
  }

  // Validate options for MCQ
  let normalizedOptions: string | null = options ?? null;
  if (questionType === "multiple_choice") {
    if (!options) {
      throw new Error("Multiple-choice questions require options");
    }
    let parsedOptions: unknown;
    try {
      parsedOptions = JSON.parse(options);
    } catch {
      throw new Error(
        "Options must be a JSON array, e.g. [\"A\",\"B\",\"C\"]"
      );
    }
    if (!Array.isArray(parsedOptions) || parsedOptions.length < 2) {
      throw new Error("Provide at least two options");
    }
    const asStrings = parsedOptions.map((v) => String(v));
    if (!asStrings.includes(correctAnswer)) {
      throw new Error(
        "Correct answer must exactly match one of the options"
      );
    }
    normalizedOptions = JSON.stringify(asStrings);
  } else if (questionType === "true_false") {
    const lower = correctAnswer.toLowerCase();
    if (lower !== "true" && lower !== "false") {
      throw new Error("True/False answer must be \"true\" or \"false\"");
    }
    normalizedOptions = null;
  }

  const lastQuestion = await prisma.quizQuestion.findFirst({
    where: { quizId },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  await prisma.quizQuestion.create({
    data: {
      quizId,
      questionText,
      questionType,
      marks,
      options: normalizedOptions,
      correctAnswer,
      order: (lastQuestion?.order ?? 0) + 1,
    },
  });

  revalidatePath(`/teacher/courses/${quiz.courseId}/quizzes/${quizId}`);
}

export async function deleteQuizQuestion(formData: FormData) {
  const teacherId = await requireTeacher();

  const parsed = idOnlySchema.safeParse({ id: formData.get("questionId") });
  if (!parsed.success) throw new Error("Invalid question ID");

  const question = await prisma.quizQuestion.findUnique({
    where: { id: parsed.data.id },
    select: {
      id: true,
      quizId: true,
      quiz: { select: { courseId: true } },
    },
  });

  if (
    !question ||
    !(await isTeacherOfCourse(question.quiz.courseId, teacherId))
  ) {
    throw new Error("Not authorized");
  }

  await prisma.quizQuestion.delete({ where: { id: question.id } });
  revalidatePath(
    `/teacher/courses/${question.quiz.courseId}/quizzes/${question.quizId}`
  );
}