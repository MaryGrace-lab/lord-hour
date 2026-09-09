"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { Role } from "@prisma/client";

// ─── User Management ───

export async function addUser(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== Role.ADMIN) throw new Error("Unauthorized");

  const username = formData.get("username")?.toString().toLowerCase();
  const password = formData.get("password")?.toString();
  const role = formData.get("role")?.toString() as Role;

  if (!username || !password || !role) throw new Error("Missing fields");

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      username,
      passwordHash,
      role,
    },
  });

  revalidatePath("/admin/users");
}

export async function deleteUser(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== Role.ADMIN) throw new Error("Unauthorized");

  const id = formData.get("id")?.toString();
  if (!id) throw new Error("User ID required");

  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin/users");
}

export async function updateUserRole(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== Role.ADMIN) throw new Error("Unauthorized");

  const id = formData.get("id")?.toString();
  const role = formData.get("role")?.toString() as Role;
  if (!id || !role) throw new Error("Missing fields");

  await prisma.user.update({
    where: { id },
    data: { role },
  });
  revalidatePath("/admin/users");
}

export async function toggleUserActive(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== Role.ADMIN) throw new Error("Unauthorized");

  const id = formData.get("id")?.toString();
  if (!id) throw new Error("User ID required");

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new Error("User not found");

  await prisma.user.update({
    where: { id },
    data: { isActive: !user.isActive },
  });
  revalidatePath("/admin/users");
}

// ─── Programme Management ───

export async function addProgramme(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== Role.ADMIN) throw new Error("Unauthorized");

  const name = formData.get("name")?.toString();
  const code = formData.get("code")?.toString();
  const description = formData.get("description")?.toString() || null;

  if (!name || !code) throw new Error("Name and code required");

  await prisma.programme.create({
    data: { name, code, description },
  });
  revalidatePath("/admin/programmes");
}

export async function deleteProgramme(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== Role.ADMIN) throw new Error("Unauthorized");

  const id = formData.get("id")?.toString();
  if (!id) throw new Error("Programme ID required");

  await prisma.programme.delete({ where: { id } });
  revalidatePath("/admin/programmes");
}

export async function updateProgramme(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== Role.ADMIN) throw new Error("Unauthorized");

  const id = formData.get("id")?.toString();
  const name = formData.get("name")?.toString();
  const code = formData.get("code")?.toString();
  const description = formData.get("description")?.toString() || null;

  if (!id || !name || !code) throw new Error("Missing fields");

  await prisma.programme.update({
    where: { id },
    data: { name, code, description },
  });
  revalidatePath("/admin/programmes");
}

// ─── Academic Session & Semester ───

export async function addAcademicSession(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== Role.ADMIN) throw new Error("Unauthorized");

  const name = formData.get("name")?.toString();
  const startDate = formData.get("startDate")?.toString();
  const endDate = formData.get("endDate")?.toString();

  if (!name || !startDate || !endDate) throw new Error("All fields required");

  await prisma.academicSession.create({
    data: {
      name,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      isActive: false,
    },
  });
  revalidatePath("/admin/sessions");
}

export async function deleteAcademicSession(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== Role.ADMIN) throw new Error("Unauthorized");

  const id = formData.get("id")?.toString();
  if (!id) throw new Error("Session ID required");

  await prisma.academicSession.delete({ where: { id } });
  revalidatePath("/admin/sessions");
}

export async function setActiveSession(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== Role.ADMIN) throw new Error("Unauthorized");

  const id = formData.get("id")?.toString();
  if (!id) throw new Error("Session ID required");

  await prisma.academicSession.updateMany({
    data: { isActive: false },
  });

  await prisma.academicSession.update({
    where: { id },
    data: { isActive: true },
  });
  revalidatePath("/admin/sessions");
}

export async function addSemester(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== Role.ADMIN) throw new Error("Unauthorized");

  const name = formData.get("name")?.toString();
  const sessionId = formData.get("sessionId")?.toString();

  if (!name || !sessionId) throw new Error("Name and session required");

  await prisma.semester.create({
    data: { name, sessionId },
  });
  revalidatePath("/admin/sessions");
}

// ─── Course Management ───

export async function createCourse(
  prevState: { success: boolean; error?: string },
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session || session.user.role !== Role.ADMIN) {
    return { success: false, error: "Unauthorized" };
  }

  const code = formData.get("code")?.toString();
  const title = formData.get("title")?.toString();
  const description = formData.get("description")?.toString() || null;
  const creditUnits = parseInt(formData.get("creditUnits")?.toString() || "2");
  const programmeId = formData.get("programmeId")?.toString() || null;
  const sessionId = formData.get("sessionId")?.toString() || null;
  const semesterId = formData.get("semesterId")?.toString() || null;
  const status = formData.get("status")?.toString() || "DRAFT";

  if (!code || !title) {
    return { success: false, error: "Code and title are required" };
  }

  try {
    await prisma.course.create({
      data: {
        code,
        title,
        description,
        creditUnits,
        programmeId,
        sessionId,
        semesterId,
        status,
      },
    });
    revalidatePath("/admin/courses");
    return { success: true };
  } catch (error) {
    console.error("Create course error:", error);
    return { success: false, error: "Unable to create course" };
  }
}

export async function deleteCourse(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== Role.ADMIN) throw new Error("Unauthorized");

  const id = formData.get("id")?.toString();
  if (!id) throw new Error("Course ID required");

  await prisma.course.delete({ where: { id } });
  revalidatePath("/admin/courses");
}

export async function assignTeacher(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== Role.ADMIN) throw new Error("Unauthorized");

  const courseId = formData.get("courseId")?.toString();
  const teacherId = formData.get("teacherId")?.toString();

  if (!courseId || !teacherId) throw new Error("Missing fields");

  await prisma.course.update({
    where: { id: courseId },
    data: {
      teachers: {
        connect: { id: teacherId },
      },
    },
  });
  revalidatePath("/admin/courses");
  revalidatePath("/admin/assignments");
  revalidatePath("/teacher/courses");
}

export async function removeTeacher(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== Role.ADMIN) throw new Error("Unauthorized");

  const courseId = formData.get("courseId")?.toString();
  const teacherId = formData.get("teacherId")?.toString();

  if (!courseId || !teacherId) throw new Error("Missing fields");

  await prisma.course.update({
    where: { id: courseId },
    data: {
      teachers: {
        disconnect: { id: teacherId },
      },
    },
  });
  revalidatePath("/admin/courses");
  revalidatePath("/admin/assignments");
  revalidatePath("/teacher/courses");
}

// ─── Enrollment Management ───

export async function enrollStudent(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== Role.ADMIN) throw new Error("Unauthorized");

  const studentId = formData.get("studentId")?.toString();
  const courseId = formData.get("courseId")?.toString();

  if (!studentId || !courseId) throw new Error("Missing fields");

  const exists = await prisma.enrollment.findUnique({
    where: {
      studentId_courseId: {
        studentId,
        courseId,
      },
    },
  });

  if (!exists) {
    await prisma.enrollment.create({
      data: {
        studentId,
        courseId,
      },
    });
  }
  revalidatePath("/admin/enrollments");
}

export async function removeEnrollment(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== Role.ADMIN) throw new Error("Unauthorized");

  const enrollmentId = formData.get("enrollmentId")?.toString();
  if (!enrollmentId) throw new Error("Enrollment ID required");

  await prisma.enrollment.delete({ where: { id: enrollmentId } });
  revalidatePath("/admin/enrollments");
}

// ─── Student & Teacher Specific Actions ───

export async function createStudent(
  prevState: { success: boolean; error?: string },
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session || session.user.role !== Role.ADMIN) {
    return { success: false, error: "Unauthorized" };
  }

  const username = formData.get("username")?.toString().toLowerCase();
  const password = formData.get("password")?.toString();
  const firstName = formData.get("firstName")?.toString() || null;
  const lastName = formData.get("lastName")?.toString() || null;
  const studentId = formData.get("studentId")?.toString();
  const programmeId = formData.get("programmeId")?.toString() || null;

  if (!username || !password || !studentId) {
    return { success: false, error: "Missing required fields" };
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        passwordHash,
        role: Role.STUDENT,
        isActive: true,
      },
    });

    await prisma.student.create({
      data: {
        userId: user.id,
        studentId,
        firstName,
        lastName,
        programmeId,
      },
    });

    revalidatePath("/admin/students");
    return { success: true };
  } catch (error) {
    console.error("Create student error:", error);
    return { success: false, error: "Unable to create student" };
  }
}

export async function createTeacher(
  prevState: { success: boolean; error?: string },
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session || session.user.role !== Role.ADMIN) {
    return { success: false, error: "Unauthorized" };
  }

  const username = formData.get("username")?.toString().toLowerCase();
  const password = formData.get("password")?.toString();
  const firstName = formData.get("firstName")?.toString() || null;
  const lastName = formData.get("lastName")?.toString() || null;
  const staffId = formData.get("staffId")?.toString() || null;

  if (!username || !password) {
    return { success: false, error: "Missing required fields" };
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        passwordHash,
        role: Role.TEACHER,
        isActive: true,
      },
    });

    await prisma.teacher.create({
      data: {
        userId: user.id,
        firstName,
        lastName,
        staffId,
      },
    });

    revalidatePath("/admin/teachers");
    return { success: true };
  } catch (error) {
    console.error("Create teacher error:", error);
    return { success: false, error: "Unable to create teacher" };
  }
}

export async function updateStudent(
  prevState: { success: boolean; error?: string },
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session || session.user.role !== Role.ADMIN) {
    return { success: false, error: "Unauthorized" };
  }

  const userId = formData.get("userId")?.toString();
  const firstName = formData.get("firstName")?.toString() || null;
  const lastName = formData.get("lastName")?.toString() || null;
  const studentId = formData.get("studentId")?.toString();
  const programmeId = formData.get("programmeId")?.toString() || null;

  if (!userId || !studentId) {
    return { success: false, error: "Missing required fields" };
  }

  try {
    await prisma.student.update({
      where: { userId },
      data: { firstName, lastName, studentId, programmeId },
    });
    revalidatePath("/admin/students");
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

  const userId = formData.get("userId")?.toString();
  if (!userId) return { success: false, error: "User ID required" };

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return { success: false, error: "User not found" };

    await prisma.user.update({
      where: { id: userId },
      data: { isActive: !user.isActive },
    });

    revalidatePath("/admin/students");
    return { success: true };
  } catch (error) {
    console.error("Toggle student active error:", error);
    return { success: false, error: "Unable to update student status" };
  }
}

export async function updateTeacher(
  prevState: { success: boolean; error?: string },
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session || session.user.role !== Role.ADMIN) {
    return { success: false, error: "Unauthorized" };
  }

  const userId = formData.get("userId")?.toString();
  const firstName = formData.get("firstName")?.toString() || null;
  const lastName = formData.get("lastName")?.toString() || null;
  const staffId = formData.get("staffId")?.toString() || null;

  if (!userId) {
    return { success: false, error: "User ID required" };
  }

  try {
    await prisma.teacher.update({
      where: { userId },
      data: { firstName, lastName, staffId },
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

  const userId = formData.get("userId")?.toString();
  if (!userId) return { success: false, error: "User ID required" };

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return { success: false, error: "User not found" };

    await prisma.user.update({
      where: { id: userId },
      data: { isActive: !user.isActive },
    });

    revalidatePath("/admin/teachers");
    return { success: true };
  } catch (error) {
    console.error("Toggle teacher active error:", error);
    return { success: false, error: "Unable to update teacher status" };
  }
}

export async function updateAdminProfile(
  prevState: { success: boolean; error?: string },
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session || session.user.role !== Role.ADMIN) {
    return { success: false, error: "Unauthorized" };
  }

  const firstName = formData.get("firstName")?.toString() || "";
  const lastName = formData.get("lastName")?.toString() || "";
  const fullName = `${firstName} ${lastName}`.trim();

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { name: fullName },
    });

    revalidatePath("/admin/profile");
    return { success: true };
  } catch (error) {
    console.error("Admin profile update error:", error);
    return { success: false, error: "Unable to update profile" };
  }
}