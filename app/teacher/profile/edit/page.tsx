import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EditTeacherProfileForm } from "@/components/teacher/EditTeacherProfileForm";

export default async function EditTeacherProfilePage() {
  const session = await auth();
  const teacher = await prisma.teacher.findUnique({
    where: { userId: session?.user.id },
  });

  return <EditTeacherProfileForm teacher={teacher} />;
}