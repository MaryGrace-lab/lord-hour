import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function StudentDashboardPage() {
  const session = await auth();
  const enrollments = await prisma.enrollment.findMany({
    where: { studentId: session?.user.id },
    include: { course: true },
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary">Welcome, {session?.user.name}</h2>
      <p className="text-gray-600">You are enrolled in {enrollments.length} course(s).</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {enrollments.map((enrollment) => (
          <div key={enrollment.id} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold text-lg">{enrollment.course.title}</h3>
            <p className="text-sm text-gray-500">{enrollment.course.code}</p>
          </div>
        ))}
      </div>
    </div>
  );
}