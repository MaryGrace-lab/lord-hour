import 'dotenv/config';
import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";

async function main() {
  if (process.env.NODE_ENV === "production") {
    console.log("Skipping seed in production.");
    return;
  }

  await prisma.user.deleteMany();

  const adminHash = await bcrypt.hash("admin123", 10);
  await prisma.user.create({
    data: { username: "admin", passwordHash: adminHash, role: Role.ADMIN, isActive: true },
  });

  const teacherHash = await bcrypt.hash("teacher123", 10);
  await prisma.user.create({
    data: { username: "teacher", passwordHash: teacherHash, role: Role.TEACHER, isActive: true },
  });

  const studentHash = await bcrypt.hash("student123", 10);
  await prisma.user.create({
    data: { username: "student", passwordHash: studentHash, role: Role.STUDENT, isActive: true },
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());