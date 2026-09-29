import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Defense-in-depth: proxy.ts already gates /admin. Re-checking here
  // means a proxy.ts misconfiguration cannot silently expose admin pages.
  await requireAdmin();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link
            href="/admin"
            className="text-lg font-bold text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
          >
            Admin Portal
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
        <AdminSidebar />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}