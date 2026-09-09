import { prisma } from "@/lib/prisma";
import { StudentForm } from "@/components/admin/StudentForm";

export default async function NewStudentPage() {
  const programmes = await prisma.programme.findMany();
  return <StudentForm programmes={programmes} />;
}