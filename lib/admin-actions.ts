"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import { Prisma, Role } from "@prisma/client";
import { sendStudentActivationEmail } from "@/lib/email";
import { logAudit } from "@/lib/audit";
import {
  createStudentSchema,
  updateStudentSchema,
  createTeacherSchema,
  updateTeacherSchema,
  createCourseSchema,
  assignTeacherSchema,
  removeTeacherSchema,
  enrollStudentSchema,
  removeEnrollmentSchema,
  updateAdminProfileSchema,
  idOnlySchema,
  userIdSchema,
  validationError,
} from "@/lib/validations";

const BCRYPT_COST = 12;
const ACTIVATION_TOKEN_BYTES = 32;
const ACTIVATION_EXPIRY_DAYS = 7;

// ────────────────────────────────────────────────
// Courses
// ────────────────────────────────────────────────

export async function createCourse(
  _prevState: { success: boolean; error?: string },
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session || session.user.role !== Role.ADMIN) {
    return { success: false, error: "Unauthorized" };
  }

  const parsed = createCourseSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || undefined,
  });
  if (!parsed.success) return validationError(parsed.error);

  const { title, description } = parsed.data;

  try {
    const course = await prisma.course.create({
      data: {
        title,
        description: description ?? null,
        isPublished: true,
      },
    });

    await logAudit({
      userId: session.user.id,
      action: "COURSE_CREATED",
      entity: "Course",
      entityId: course.id,
      metadata: { title },
    });

    revalidatePath("/admin/courses");
    revalidateTag("admin-activity", "max");
    return { success: true };
  } catch (error) {
    console.error("Create course error:", error);
    return { success: false, error: "Unable to create course" };
  }
}

/**
 * Archive a course instead of hard-deleting it.
 * Hard-deleting cascades across Enrollment, Assignment, Quiz, Submission,
 * LessonCompletion, Material and Announcement.
 */
export async function toggleCourseVisibility(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== Role.ADMIN) {
    throw new Error("Unauthorized");
  }

  const parsed = idOnlySchema.safeParse({ id: formData.get("id") });
  if (!parsed.success) throw new Error("Invalid course ID");

  const course = await prisma.course.findUnique({
    where: { id: parsed.data.id },
    select: { id: true, title: true, isPublished: true },
  });
  if (!course) throw new Error("Course not found");

  const next = !course.isPublished;

  await prisma.course.update({
    where: { id: course.id },
    data: { isPublished: next },
  });

  await logAudit({
    userId: session.user.id,
    action: "COURSE_VISIBILITY_TOGGLED",
    entity: "Course",
    entityId: course.id,
    metadata: { title: course.title, isPublished: next },
  });

  revalidatePath("/admin/courses");
  revalidatePath("/student/courses");
  revalidateTag("admin-activity", "max");
}

export async function deleteCourse(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== Role.ADMIN) {
    throw new Error("Unauthorized");
  }

  const parsed = idOnlySchema.safeParse({ id: formData.get("id") });
  if (!parsed.success) throw new Error("Invalid course ID");

  const course = await prisma.course.findUnique({
    where: { id: parsed.data.id },
    select: { id: true, title: true },
  });
  if (!course) throw new Error("Course not found");

  await prisma.course.delete({ where: { id: course.id } });

  await logAudit({
    userId: session.user.id,
    action: "COURSE_DELETED",
    entity: "Course",
    entityId: course.id,
    metadata: { title: course.title },
  });

  revalidatePath("/admin/courses");
  revalidatePath("/admin/enrollments");
  revalidatePath("/teacher/courses");
  revalidatePath("/student/courses");
  revalidateTag("admin-activity", "max");
}

export async function assignTeacher(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== Role.ADMIN) {
    throw new Error("Unauthorized");
  }

  const parsed = assignTeacherSchema.safeParse({
    courseId: formData.get("courseId"),
    teacherId: formData.get("teacherId"),
  });
  if (!parsed.success) throw new Error("Invalid input");

  const { courseId, teacherId } = parsed.data;

  const target = await prisma.user.findUnique({
    where: { id: teacherId },
    select: { role: true },
  });
  if (!target || target.role !== Role.TEACHER) {
    throw new Error("Selected user is not a teacher");
  }

  await prisma.course.update({
    where: { id: courseId },
    data: { teachers: { connect: { id: teacherId } } },
  });

  await logAudit({
    userId: session.user.id,
    action: "TEACHER_ASSIGNED",
    entity: "Course",
    entityId: courseId,
    metadata: { teacherId },
  });

  revalidatePath("/admin/courses");
  revalidatePath("/admin/assignments");
  revalidatePath("/teacher/courses");
  revalidateTag("admin-activity", "max");
}

export async function removeTeacher(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== Role.ADMIN) {
    throw new Error("Unauthorized");
  }

  const parsed = removeTeacherSchema.safeParse({
    courseId: formData.get("courseId"),
    teacherId: formData.get("teacherId"),
  });
  if (!parsed.success) throw new Error("Invalid input");

  const { courseId, teacherId } = parsed.data;

  await prisma.course.update({
    where: { id: courseId },
    data: { teachers: { disconnect: { id: teacherId } } },
  });

  await logAudit({
    userId: session.user.id,
    action: "TEACHER_REMOVED",
    entity: "Course",
    entityId: courseId,
    metadata: { teacherId },
  });

  revalidatePath("/admin/courses");
  revalidatePath("/admin/assignments");
  revalidatePath("/teacher/courses");
}

// ────────────────────────────────────────────────
// Enrollment
// ────────────────────────────────────────────────

export async function enrollStudent(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== Role.ADMIN) {
    throw new Error("Unauthorized");
  }

  const parsed = enrollStudentSchema.safeParse({
    studentId: formData.get("studentId"),
    courseId: formData.get("courseId"),
  });
  if (!parsed.success) throw new Error("Invalid input");

  const { studentId, courseId } = parsed.data;

  const target = await prisma.user.findUnique({
    where: { id: studentId },
    select: { role: true },
  });
  if (!target || target.role !== Role.STUDENT) {
    throw new Error("Selected user is not a student");
  }

  const exists = await prisma.enrollment.findUnique({
    where: { studentId_courseId: { studentId, courseId } },
  });

  if (!exists) {
    const enrollment = await prisma.enrollment.create({
      data: { studentId, courseId },
    });

    await logAudit({
      userId: session.user.id,
      action: "STUDENT_ENROLLED",
      entity: "Enrollment",
      entityId: enrollment.id,
      metadata: { studentId, courseId },
    });
  }

  revalidatePath("/admin/enrollments");
  revalidateTag("admin-activity", "max");
}

export async function removeEnrollment(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== Role.ADMIN) {
    throw new Error("Unauthorized");
  }

  const parsed = removeEnrollmentSchema.safeParse({
    enrollmentId: formData.get("enrollmentId"),
  });
  if (!parsed.success) throw new Error("Invalid enrollment ID");

  const enrollment = await prisma.enrollment.findUnique({
    where: { id: parsed.data.enrollmentId },
  });
  if (!enrollment) throw new Error("Enrollment not found");

  await prisma.enrollment.delete({ where: { id: enrollment.id } });

  await logAudit({
    userId: session.user.id,
    action: "STUDENT_UNENROLLED",
    entity: "Enrollment",
    entityId: enrollment.id,
    metadata: {
      studentId: enrollment.studentId,
      courseId: enrollment.courseId,
    },
  });

  revalidatePath("/admin/enrollments");
}

// ────────────────────────────────────────────────
// Students
// ────────────────────────────────────────────────

export async function createStudent(
  _prevState: { success: boolean; error?: string },
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session || session.user.role !== Role.ADMIN) {
    return { success: false, error: "Unauthorized" };
  }

  const parsed = createStudentSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password") || undefined,
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName") || undefined,
    studentId: formData.get("studentId"),
    email: formData.get("email") || undefined,
    phone: formData.get("phone") || undefined,
    applicationId: formData.get("applicationId") || undefined,
    sendActivation: formData.get("sendActivation") === "on",
  });
  if (!parsed.success) return validationError(parsed.error);

  const {
    username,
    password,
    firstName,
    lastName,
    studentId,
    email,
    phone,
    applicationId,
    sendActivation,
  } = parsed.data;

  if (sendActivation && !email) {
    return {
      success: false,
      error: "Email is required to send an activation link",
    };
  }
  if (!sendActivation && (!password || password.length < 8)) {
    return {
      success: false,
      error: "Password must be at least 8 characters (or enable activation email)",
    };
  }

  try {
    let passwordHash: string;
    let activationToken: string | null = null;
    let activationTokenExpiry: Date | null = null;

    if (sendActivation) {
      const tempPassword = crypto
        .randomBytes(ACTIVATION_TOKEN_BYTES)
        .toString("hex");
      passwordHash = await bcrypt.hash(tempPassword, BCRYPT_COST);
      activationToken = crypto
        .randomBytes(ACTIVATION_TOKEN_BYTES)
        .toString("hex");
      activationTokenExpiry = new Date(
        Date.now() + ACTIVATION_EXPIRY_DAYS * 24 * 60 * 60 * 1000
      );
    } else {
      passwordHash = await bcrypt.hash(password as string, BCRYPT_COST);
    }

    const createdUser = await prisma.$transaction(async (tx) => {
      const existingUser = await tx.user.findUnique({ where: { username } });
      if (existingUser) throw new Error("USERNAME_TAKEN");

      const existingStudent = await tx.student.findUnique({
        where: { studentId },
      });
      if (existingStudent) throw new Error("STUDENT_ID_TAKEN");

      if (applicationId) {
        const app = await tx.application.findUnique({
          where: { id: applicationId },
          select: { id: true, createdStudentId: true },
        });
        if (!app) throw new Error("APPLICATION_NOT_FOUND");
        if (app.createdStudentId) throw new Error("APPLICATION_ALREADY_LINKED");
      }

      const user = await tx.user.create({
        data: {
          username,
          passwordHash,
          role: Role.STUDENT,
          isActive: true,
          name: [firstName, lastName].filter(Boolean).join(" ") || null,
          activationToken,
          activationTokenExpiry,
        },
      });

      await tx.student.create({
        data: {
          userId: user.id,
          studentId,
          firstName,
          lastName,
          email: email ?? null,
          phone: phone ?? null,
        },
      });

      if (applicationId) {
        await tx.application.update({
          where: { id: applicationId },
          data: { createdStudentId: user.id },
        });
      }

      return user;
    });

    await logAudit({
      userId: session.user.id,
      action: "STUDENT_CREATED",
      entity: "User",
      entityId: createdUser.id,
      metadata: { username, studentId, fromApplication: !!applicationId },
    });

    revalidatePath("/admin/students");
    revalidatePath("/admin/applications");
    if (applicationId) {
      revalidatePath(`/admin/applications/${applicationId}`);
    }
    revalidateTag("admin-activity", "max");

    if (sendActivation && activationToken && email) {
      try {
        await sendStudentActivationEmail({
          studentName:
            [firstName, lastName].filter(Boolean).join(" ") || username,
          studentEmail: email,
          studentUsername: username,
          activationToken,
          expiresInDays: ACTIVATION_EXPIRY_DAYS,
        });
      } catch (emailError) {
        console.error("Activation email failed:", emailError);
      }
    }

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      switch (error.message) {
        case "USERNAME_TAKEN":
          return {
            success: false,
            error: "A user with this username already exists",
          };
        case "STUDENT_ID_TAKEN":
          return {
            success: false,
            error: "A student with this Student ID already exists",
          };
        case "APPLICATION_NOT_FOUND":
          return { success: false, error: "Linked application was not found" };
        case "APPLICATION_ALREADY_LINKED":
          return {
            success: false,
            error: "This application already has a student account linked",
          };
      }
    }
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        error: "A user with those details already exists",
      };
    }
    console.error("Create student error:", error);
    return { success: false, error: "Unable to create student" };
  }
}

export async function updateStudent(
  _prevState: { success: boolean; error?: string },
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session || session.user.role !== Role.ADMIN) {
    return { success: false, error: "Unauthorized" };
  }

  const parsed = updateStudentSchema.safeParse({
    userId: formData.get("userId"),
    firstName: formData.get("firstName") || undefined,
    lastName: formData.get("lastName") || undefined,
    studentId: formData.get("studentId"),
    email: formData.get("email") || undefined,
    phone: formData.get("phone") || undefined,
  });
  if (!parsed.success) return validationError(parsed.error);

  const { userId, firstName, lastName, studentId, email, phone } = parsed.data;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });
    if (!user || user.role !== Role.STUDENT) {
      return { success: false, error: "User is not a student" };
    }

    await prisma.student.update({
      where: { userId },
      data: {
        firstName: firstName ?? null,
        lastName: lastName ?? null,
        studentId,
        email: email ?? null,
        phone: phone ?? null,
      },
    });

    await logAudit({
      userId: session.user.id,
      action: "STUDENT_UPDATED",
      entity: "User",
      entityId: userId,
    });

    revalidatePath("/admin/students");
    revalidatePath(`/admin/students/${userId}`);
    return { success: true };
  } catch (error) {
    console.error("Update student error:", error);
    return { success: false, error: "Unable to update student" };
  }
}

export async function toggleStudentActive(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== Role.ADMIN) {
    return { success: false, error: "Unauthorized" };
  }

  const parsed = userIdSchema.safeParse({ userId: formData.get("userId") });
  if (!parsed.success) return { success: false, error: "Invalid user ID" };

  if (parsed.data.userId === session.user.id) {
    return { success: false, error: "You cannot deactivate your own account" };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: parsed.data.userId },
      select: { id: true, role: true, isActive: true, username: true },
    });
    if (!user) return { success: false, error: "User not found" };
    if (user.role !== Role.STUDENT) {
      return { success: false, error: "User is not a student" };
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { isActive: !user.isActive },
    });

    await logAudit({
      userId: session.user.id,
      action: "STUDENT_TOGGLED",
      entity: "User",
      entityId: user.id,
      metadata: { isActive: !user.isActive, username: user.username },
    });

    revalidatePath("/admin/students");
    return { success: true };
  } catch (error) {
    console.error("Toggle student active error:", error);
    return { success: false, error: "Unable to update student status" };
  }
}

// ────────────────────────────────────────────────
// Teachers
// ────────────────────────────────────────────────

export async function createTeacher(
  _prevState: { success: boolean; error?: string },
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session || session.user.role !== Role.ADMIN) {
    return { success: false, error: "Unauthorized" };
  }

  const parsed = createTeacherSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
    firstName: formData.get("firstName") || undefined,
    lastName: formData.get("lastName") || undefined,
    staffId: formData.get("staffId") || undefined,
  });
  if (!parsed.success) return validationError(parsed.error);

  const { username, password, firstName, lastName, staffId } = parsed.data;

  try {
    const passwordHash = await bcrypt.hash(password, BCRYPT_COST);

    const user = await prisma.$transaction(async (tx) => {
      const existingUser = await tx.user.findUnique({ where: { username } });
      if (existingUser) throw new Error("USERNAME_TAKEN");

      const created = await tx.user.create({
        data: {
          username,
          passwordHash,
          role: Role.TEACHER,
          isActive: true,
          name: [firstName, lastName].filter(Boolean).join(" ") || null,
        },
      });

      await tx.teacher.create({
        data: {
          userId: created.id,
          firstName: firstName ?? null,
          lastName: lastName ?? null,
          staffId: staffId ?? null,
        },
      });

      return created;
    });

    await logAudit({
      userId: session.user.id,
      action: "TEACHER_CREATED",
      entity: "User",
      entityId: user.id,
      metadata: { username, staffId },
    });

    revalidatePath("/admin/teachers");
    revalidateTag("admin-activity", "max");
    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message === "USERNAME_TAKEN") {
      return {
        success: false,
        error: "A user with this username already exists",
      };
    }
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        error: "A user with those details already exists",
      };
    }
    console.error("Create teacher error:", error);
    return { success: false, error: "Unable to create teacher" };
  }
}

export async function updateTeacher(
  _prevState: { success: boolean; error?: string },
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session || session.user.role !== Role.ADMIN) {
    return { success: false, error: "Unauthorized" };
  }

  const parsed = updateTeacherSchema.safeParse({
    userId: formData.get("userId"),
    firstName: formData.get("firstName") || undefined,
    lastName: formData.get("lastName") || undefined,
    staffId: formData.get("staffId") || undefined,
  });
  if (!parsed.success) return validationError(parsed.error);

  const { userId, firstName, lastName, staffId } = parsed.data;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });
    if (!user || user.role !== Role.TEACHER) {
      return { success: false, error: "User is not a teacher" };
    }

    await prisma.teacher.update({
      where: { userId },
      data: {
        firstName: firstName ?? null,
        lastName: lastName ?? null,
        staffId: staffId ?? null,
      },
    });

    await logAudit({
      userId: session.user.id,
      action: "TEACHER_UPDATED",
      entity: "User",
      entityId: userId,
    });

    revalidatePath("/admin/teachers");
    return { success: true };
  } catch (error) {
    console.error("Update teacher error:", error);
    return { success: false, error: "Unable to update teacher" };
  }
}

export async function toggleTeacherActive(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== Role.ADMIN) {
    return { success: false, error: "Unauthorized" };
  }

  const parsed = userIdSchema.safeParse({ userId: formData.get("userId") });
  if (!parsed.success) return { success: false, error: "Invalid user ID" };

  if (parsed.data.userId === session.user.id) {
    return { success: false, error: "You cannot deactivate your own account" };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: parsed.data.userId },
      select: { id: true, role: true, isActive: true, username: true },
    });
    if (!user) return { success: false, error: "User not found" };
    if (user.role !== Role.TEACHER) {
      return { success: false, error: "User is not a teacher" };
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { isActive: !user.isActive },
    });

    await logAudit({
      userId: session.user.id,
      action: "TEACHER_TOGGLED",
      entity: "User",
      entityId: user.id,
      metadata: { isActive: !user.isActive, username: user.username },
    });

    revalidatePath("/admin/teachers");
    return { success: true };
  } catch (error) {
    console.error("Toggle teacher active error:", error);
    return { success: false, error: "Unable to update teacher status" };
  }
}

// ────────────────────────────────────────────────
// Delete accounts (permanent)
// ────────────────────────────────────────────────

/**
 * Permanently delete a student account.
 *
 * Cascades via Prisma schema:
 *   - Student profile
 *   - Enrollment rows (student disappears from all courses)
 *   - AssignmentSubmission rows (all answers, scores, feedback)
 *   - QuizAttempt rows (all scores, pass/fail)
 *   - LessonCompletion rows (progress reset)
 *   - Announcements authored by this user (rare for students)
 *
 * Audit log rows are preserved with userId set to null, plus we store the
 * username in the metadata so attribution isn't fully lost.
 */
export async function deleteStudent(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== Role.ADMIN) {
    throw new Error("Unauthorized");
  }

  const parsed = userIdSchema.safeParse({ userId: formData.get("userId") });
  if (!parsed.success) throw new Error("Invalid user ID");

  if (parsed.data.userId === session.user.id) {
    throw new Error("You cannot delete your own account");
  }

  const user = await prisma.user.findUnique({
    where: { id: parsed.data.userId },
    select: { id: true, username: true, role: true },
  });
  if (!user) throw new Error("User not found");
  if (user.role !== Role.STUDENT) {
    throw new Error("This user is not a student");
  }

  await prisma.user.delete({ where: { id: user.id } });

  await logAudit({
    userId: session.user.id,
    action: "STUDENT_DELETED",
    entity: "User",
    entityId: user.id,
    metadata: { username: user.username },
  });

  revalidatePath("/admin/students");
  revalidatePath("/admin/enrollments");
  revalidatePath("/admin/applications");
  revalidatePath("/teacher/students");
  revalidateTag("admin-activity", "max");
}

/**
 * Permanently delete a teacher account.
 *
 * Cascades via Prisma schema:
 *   - Teacher profile
 *   - Announcements authored by this user (all courses)
 *   - Course teacher-assignments (course survives, loses this teacher)
 *   - Audit log attribution set to null (username preserved in metadata)
 *   - Application.reviewedById set to null on applications they reviewed
 */
export async function deleteTeacher(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== Role.ADMIN) {
    throw new Error("Unauthorized");
  }

  const parsed = userIdSchema.safeParse({ userId: formData.get("userId") });
  if (!parsed.success) throw new Error("Invalid user ID");

  if (parsed.data.userId === session.user.id) {
    throw new Error("You cannot delete your own account");
  }

  const user = await prisma.user.findUnique({
    where: { id: parsed.data.userId },
    select: { id: true, username: true, role: true },
  });
  if (!user) throw new Error("User not found");
  if (user.role !== Role.TEACHER) {
    throw new Error("This user is not a teacher");
  }

  await prisma.user.delete({ where: { id: user.id } });

  await logAudit({
    userId: session.user.id,
    action: "TEACHER_DELETED",
    entity: "User",
    entityId: user.id,
    metadata: { username: user.username },
  });

  revalidatePath("/admin/teachers");
  revalidatePath("/admin/courses");
  revalidatePath("/admin/assignments");
  revalidateTag("admin-activity", "max");
}

// ────────────────────────────────────────────────
// Admin profile
// ────────────────────────────────────────────────

export async function updateAdminProfile(
  _prevState: { success: boolean; error?: string },
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session || session.user.role !== Role.ADMIN) {
    return { success: false, error: "Unauthorized" };
  }

  const parsed = updateAdminProfileSchema.safeParse({
    firstName: formData.get("firstName") || undefined,
    lastName: formData.get("lastName") || undefined,
  });
  if (!parsed.success) return validationError(parsed.error);

  const { firstName, lastName } = parsed.data;
  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { name: fullName || null },
    });

    await logAudit({
      userId: session.user.id,
      action: "ADMIN_PROFILE_UPDATED",
      entity: "User",
      entityId: session.user.id,
    });

    revalidatePath("/admin/profile");
    return { success: true };
  } catch (error) {
    console.error("Admin profile update error:", error);
    return { success: false, error: "Unable to update profile" };
  }
}