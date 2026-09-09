import { requireAdmin } from "@/lib/auth";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-lg font-bold text-primary">Admin Portal</h1>
          <SignOutButton />
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
        <AdminSidebar />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}