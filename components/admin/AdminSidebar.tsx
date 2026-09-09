"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaBars, FaTimes, FaTachometerAlt, FaUserGraduate, FaChalkboardTeacher, FaBook, FaHandshake, FaUser } from "react-icons/fa";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: FaTachometerAlt },
  {
    name: "Students",
    href: "/admin/students",
    icon: FaUserGraduate,
  },
  {
    name: "Teachers",
    href: "/admin/teachers",
    icon: FaChalkboardTeacher,
  },
  {
    name: "Courses",
    href: "/admin/courses",
    icon: FaBook,
  },
  {
    name: "Course Assignments",
    href: "/admin/assignments",
    icon: FaHandshake,
  },
  {
    name: "Profile",
    href: "/admin/profile",
    icon: FaUser,
  },
];

export function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed bottom-4 right-4 z-40 bg-primary text-white p-3 rounded-full shadow-lg"
        aria-label="Open navigation"
      >
        <FaBars size={20} />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 w-64 bg-white shadow-lg md:shadow-none transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform md:translate-x-0 z-50 md:z-auto md:w-64 shrink-0`}
      >
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <span className="font-bold text-primary">The Lord&apos;s Hour</span>
          <button onClick={() => setIsOpen(false)} className="md:hidden text-gray-600">
            <FaTimes size={20} />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium ${
                  isActive ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <item.icon size={16} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}