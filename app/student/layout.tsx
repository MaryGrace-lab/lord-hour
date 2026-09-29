import Link from "next/link";
import { requireStudent } from "@/lib/auth";
import { StudentSidebar } from "@/components/student/StudentSidebar";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Defense-in-depth: proxy.ts already gates /student.
  await requireStudent();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link
            href="/student"
            className="text-lg font-bold text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
          >
            Student Portal
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
        <StudentSidebar />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}