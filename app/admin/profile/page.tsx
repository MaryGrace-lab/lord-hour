import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminProfileForm } from "@/components/admin/AdminProfileForm";

export default async function AdminProfilePage() {
  const session = await auth();
  const admin = await prisma.user.findUnique({
    where: { id: session?.user.id },
  });

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-primary mb-4">Admin Profile</h2>
      <AdminProfileForm adminName={admin?.name || null} />
    </div>
  );
}