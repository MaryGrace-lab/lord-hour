import Link from "next/link";
import { requireTeacher } from "@/lib/auth";
import { TeacherSidebar } from "@/components/teacher/TeacherSidebar";

export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireTeacher();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link
            href="/teacher"
            className="text-lg font-bold text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
          >
            Teacher Portal
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
        <TeacherSidebar />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}