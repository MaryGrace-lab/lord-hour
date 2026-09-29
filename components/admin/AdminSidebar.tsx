"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaBars,
  FaTimes,
  FaTachometerAlt,
  FaFileAlt,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBook,
  FaHandshake,
  FaUser,
  FaHistory,
  FaQuoteLeft,
} from "react-icons/fa";
import { SignOutButton } from "@/components/auth/SignOutButton";

type NavItem = {
  name: string;
  href: string;
  icon: typeof FaBars;
  /** When true, only match the href exactly (no prefix matching). */
  exact?: boolean;
};

const navItems: NavItem[] = [
  { name: "Dashboard", href: "/admin", icon: FaTachometerAlt, exact: true },
  { name: "Applications", href: "/admin/applications", icon: FaFileAlt },
  { name: "Students", href: "/admin/students", icon: FaUserGraduate },
  { name: "Teachers", href: "/admin/teachers", icon: FaChalkboardTeacher },
  { name: "Courses", href: "/admin/courses", icon: FaBook },
  { name: "Course Assignments", href: "/admin/assignments", icon: FaHandshake },
  { name: "Testimonies", href: "/admin/testimonies", icon: FaQuoteLeft },
  { name: "Profile", href: "/admin/profile", icon: FaUser },
  { name: "Audit Logs", href: "/admin/audit-logs", icon: FaHistory },
];

export function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile sidebar with Escape key.
  useEffect(() => {
    if (!isOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  // Lock body scroll while the mobile sidebar is open.
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  function isItemActive(item: NavItem): boolean {
    if (item.exact) return pathname === item.href;
    return pathname === item.href || pathname.startsWith(item.href + "/");
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed bottom-4 right-4 z-40 bg-primary text-white p-3 rounded-full shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
        aria-label="Open navigation menu"
        aria-expanded={isOpen}
        aria-controls="admin-sidebar"
      >
        <FaBars size={20} aria-hidden />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        id="admin-sidebar"
        aria-label="Admin navigation"
        className={`fixed md:static inset-y-0 left-0 w-64 bg-white shadow-lg md:shadow-none transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform md:translate-x-0 z-50 md:z-auto md:w-64 shrink-0 flex flex-col`}
      >
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <span className="font-bold text-primary">The Lord&apos;s Hour</span>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="md:hidden text-gray-600 p-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Close navigation menu"
          >
            <FaTimes size={20} aria-hidden />
          </button>
        </div>

        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = isItemActive(item);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon size={16} aria-hidden />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <SignOutButton />
        </div>
      </aside>
    </>
  );
}