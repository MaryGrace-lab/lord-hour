"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FaBars, FaChevronDown, FaTimes } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LanguageToggle } from "@/components/layout/LanguageToggle";

type NavChild = {
  name: string;
  href: string;
};

type NavItem = {
  name: string;
  href: string;
  children?: NavChild[];
};

const navItems: NavItem[] = [
  { name: "Home", href: "/" },
  {
    name: "About",
    href: "/about",
    children: [
      { name: "Our Story", href: "/about" },
      { name: "Vision & Mission", href: "/about/vision-mission" },
      { name: "Our Beliefs", href: "/about/beliefs" },
      { name: "Administration", href: "/about/leadership" },
      { name: "Pastor's Message", href: "/about/pastors-message" },
    ],
  },
  { name: "Bible College", href: "/bible-college" },
  { name: "Gallery", href: "/media/gallery" },
  { name: "Branches", href: "/branches" },
  { name: "Contact", href: "/contact" },
  { name: "Give", href: "/give" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMobileSection, setOpenMobileSection] = useState<string | null>(
    null
  );
  const [scrolled, setScrolled] = useState(false);
  const lastScrollState = useRef(false);

  useEffect(() => {
    const handler = () => {
      const next = window.scrollY > 8;
      if (next !== lastScrollState.current) {
        lastScrollState.current = next;
        setScrolled(next);
      }
    };
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
    setOpenMobileSection(null);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  const isParentActive = (item: NavItem) => {
    if (isActive(item.href)) return true;
    if (!item.children) return false;
    return item.children.some((child) => isActive(child.href));
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-midnight text-white transition-all duration-300 ${
        scrolled
          ? "shadow-[0_1px_0_0_rgba(255,255,255,0.06),0_8px_24px_-12px_rgba(0,0,0,0.5)]"
          : "border-b border-white/5"
      }`}
    >
      <div className="container mx-auto flex h-[68px] md:h-[80px] items-center justify-between gap-2 sm:gap-3 px-3 sm:px-6 lg:px-10">
        {/* Logo + church name — always visible, shrinks on mobile */}
        <Link
          href="/"
          className="flex items-center gap-2 md:gap-3 min-w-0 shrink group focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-midnight rounded"
          aria-label="The Lord's Hour Ministries — Home"
        >
          <div className="relative h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 shrink-0 transition-transform duration-300 group-hover:scale-[1.03]">
            <Image
              src="/church-logo.jpg"
              alt="The Lord's Hour Ministries Logo"
              fill
              sizes="48px"
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col leading-[1.05] min-w-0">
            <span className="font-heading text-[11px] sm:text-[13px] md:text-base font-bold tracking-tight whitespace-nowrap">
              THE LORD&apos;S <span className="text-accent">HOUR</span>
              <span className="hidden sm:inline"> MINISTRIES</span>
            </span>
            <span className="text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-[0.18em] text-gray-400/90 mt-0.5 whitespace-nowrap">
              Liberation Centre
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav
          className="hidden lg:flex items-center gap-1 xl:gap-2"
          aria-label="Main navigation"
        >
          {navItems.map((item) => {
            if (!item.children) {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative px-3 py-2 text-[13px] font-medium tracking-wide transition-colors duration-200 group rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-midnight ${
                    active ? "text-accent" : "text-white/90 hover:text-accent"
                  }`}
                >
                  {item.name}
                  <span
                    className={`absolute left-3 right-3 -bottom-0.5 h-px bg-accent origin-left transition-transform duration-300 ${
                      active
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              );
            }

            const active = isParentActive(item);
            return (
              <DropdownMenu key={item.name}>
                <DropdownMenuTrigger
                  className={`relative flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium tracking-wide transition-colors duration-200 group rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-midnight ${
                    active ? "text-accent" : "text-white/90 hover:text-accent"
                  }`}
                >
                  {item.name}
                  <FaChevronDown
                    size={9}
                    className="mt-[1px] transition-transform duration-200 group-data-[state=open]:rotate-180"
                    aria-hidden
                  />
                  <span
                    className={`absolute left-3 right-3 -bottom-0.5 h-px bg-accent origin-left transition-transform duration-300 ${
                      active
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="start"
                  sideOffset={12}
                  className="min-w-[220px] rounded-lg border border-gray-100 bg-white p-1.5 text-gray-900 shadow-xl shadow-black/10 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
                >
                  {item.children.map((child) => (
                    <DropdownMenuItem
                      key={child.href}
                      asChild
                      className="cursor-pointer rounded-md px-3 py-2 text-[13px] text-gray-700 outline-none focus:bg-accent/10 focus:text-midnight"
                    >
                      <Link href={child.href}>{child.name}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            );
          })}
        </nav>

        {/* Right side: language toggle + mobile menu button */}
        <div className="flex items-center gap-2 shrink-0">
          <LanguageToggle />

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden flex items-center justify-center w-10 h-10 text-white hover:text-accent transition-colors rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            {mobileOpen ? (
              <FaTimes size={20} aria-hidden />
            ) : (
              <FaBars size={20} aria-hidden />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`lg:hidden overflow-hidden bg-midnight border-t border-white/5 transition-[max-height,opacity] duration-300 ease-out ${
          mobileOpen
            ? "max-h-[calc(100dvh-68px)] opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        <nav
          className="px-4 py-4 max-h-[calc(100dvh-68px)] overflow-y-auto"
          aria-label="Mobile navigation"
        >
          <ul className="space-y-0.5">
            {navItems.map((item) => {
              if (!item.children) {
                const active = isActive(item.href);
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`block px-3 py-3 rounded-md text-[15px] font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                        active
                          ? "text-accent bg-white/5"
                          : "text-white/90 hover:text-accent hover:bg-white/5"
                      }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                );
              }

              const isSectionOpen = openMobileSection === item.name;
              const active = isParentActive(item);

              return (
                <li key={item.name}>
                  <button
                    type="button"
                    onClick={() =>
                      setOpenMobileSection((prev) =>
                        prev === item.name ? null : item.name
                      )
                    }
                    className={`w-full flex items-center justify-between px-3 py-3 rounded-md text-[15px] font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                      active
                        ? "text-accent"
                        : "text-white/90 hover:text-accent hover:bg-white/5"
                    }`}
                    aria-expanded={isSectionOpen}
                  >
                    {item.name}
                    <FaChevronDown
                      size={12}
                      className={`transition-transform duration-200 ${
                        isSectionOpen ? "rotate-180" : ""
                      }`}
                      aria-hidden
                    />
                  </button>

                  <div
                    className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-out ${
                      isSectionOpen
                        ? "max-h-[600px] opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <ul className="pl-3 py-1 space-y-0.5 border-l border-white/10 ml-3">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className="block px-3 py-2.5 rounded-md text-sm text-white/80 hover:text-accent hover:bg-white/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                          >
                            {child.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}