import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export default async function TeacherProfilePage() {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: { id: session?.user.id },
    include: { teacherProfile: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary">My Profile</h2>
        <Link
          href="/teacher/profile/edit"
          className="text-accent hover:underline"
        >
          Edit Profile
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Username</p>
            <p className="text-gray-900">{user?.username}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Role</p>
            <p className="text-gray-900">{user?.role}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">First Name</p>
            <p className="text-gray-900">{user?.teacherProfile?.firstName || "Not set"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Last Name</p>
            <p className="text-gray-900">{user?.teacherProfile?.lastName || "Not set"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}