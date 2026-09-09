import { requireStudent } from "@/lib/auth";
import Link from "next/link";
import { SignOutButton } from "@/components/auth/SignOutButton";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireStudent();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-primary">Student Portal</h1>
          <SignOutButton />
        </div>
      </header>
      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
        <aside className="w-full md:w-64 bg-white rounded-lg shadow-md p-4">
          <nav className="flex flex-wrap md:flex-col gap-2">
            <Link href="/student">Dashboard</Link>
            <Link href="/student/courses">My Courses</Link>
            <Link href="/student/quizzes">Quizzes</Link>
            <Link href="/student/assignments">Assignments</Link>
            <Link href="/student/results">Results</Link>
            <Link href="/student/profile">Profile</Link>
          </nav>
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}