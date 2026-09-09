"use client";

import { useState, Fragment } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaBars, FaChevronDown, FaTimes } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

type NavItemChild = {
  name: string;
  href: string;
  children?: NavItemChild[];
};

type NavItem = {
  name: string;
  href: string;
  children?: NavItemChild[];
};

// Updated navigation items:
// - Testimonies moved under About
// - Events removed
// - Media only has Gallery
const navItems: NavItem[] = [
  { name: "Home", href: "/" },
  {
    name: "About",
    href: "/about",
    children: [
      { name: "History", href: "/about" },
      { name: "Vision & Mission", href: "/about/vision-mission" },
      { name: "Our Beliefs", href: "/about/beliefs" },
      { name: "Administration", href: "/about/leadership" },
      { name: "Pastor's Message", href: "/about/pastors-message" },
      { name: "Testimonies", href: "/testimonies" },
    ],
  },
  {
    name: "What We Do",
    href: "#",
    children: [
      {
        name: "Ministries",
        href: "/ministries",
        children: [
          { name: "Children", href: "/ministries/children" },
          { name: "Youth", href: "/ministries/youth" },
          { name: "Women", href: "/ministries/women" },
          { name: "Men", href: "/ministries/men" },
          { name: "Evangelism", href: "/ministries/evangelism" },
        ],
      },
      {
        name: "Bible College",
        href: "/bible-college",
        children: [
          { name: "School of the Spirit Bible College", href: "/bible-college" },
          { name: "Portal Login", href: "/bible-college/portal/login" },
        ],
      },
    ],
  },
  {
    name: "Media",
    href: "/media/gallery",
    children: [
      { name: "Gallery", href: "/media/gallery" },
    ],
  },
  { name: "Branches", href: "/branches" },
  { name: "Contact", href: "/contact" },
  { name: "Give", href: "/give" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-midnight text-white shadow-md">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo and church name */}
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-12 w-12 shrink-0">
            <Image
              src="/church-logo.jpeg" // replace with actual logo path
              alt="The Lord's Hour Ministries Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-lg font-heading font-bold tracking-tight">
              THE LORD&apos;S <span className="text-accent">HOUR</span> MINISTRIES
            </span>
            <span className="text-[0.7rem] uppercase tracking-wider text-gray-300">
              Liberation Centre
            </span>
          </div>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium">
          {navItems.map((item) => {
            // Regular dropdowns (About, Media) with children
            if (item.children && item.name !== "What We Do") {
              return (
                <DropdownMenu key={item.name}>
                  <DropdownMenuTrigger className="flex items-center gap-1 hover:text-accent transition-colors">
                    {item.name} <FaChevronDown size={14} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="bg-white text-gray-900">
                    {item.children.map((child) => (
                      <DropdownMenuItem key={child.href} asChild>
                        <Link href={child.href} className="w-full">
                          {child.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            }

            // Special "What We Do" dropdown with nested submenus
            if (item.name === "What We Do") {
              const subItems = item.children ?? [];
              return (
                <DropdownMenu key={item.name}>
                  <DropdownMenuTrigger className="flex items-center gap-1 hover:text-accent transition-colors">
                    {item.name} <FaChevronDown size={14} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="bg-white text-gray-900">
                    {subItems.map((subItem, index) => (
                      <Fragment key={subItem.name}>
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className="flex items-center justify-between">
                            {subItem.name}
                          </DropdownMenuSubTrigger>
                          <DropdownMenuSubContent className="bg-white text-gray-900">
                            {subItem.children?.map((child) => (
                              <DropdownMenuItem key={child.href} asChild>
                                <Link href={child.href} className="w-full">
                                  {child.name}
                                </Link>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuSubContent>
                        </DropdownMenuSub>
                        {index < subItems.length - 1 && (
                          <DropdownMenuSeparator />
                        )}
                      </Fragment>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            }

            // Regular link (no children)
            return (
              <Link
                key={item.name}
                href={item.href}
                className="hover:text-accent transition-colors"
              >
                {item.name}
              </Link>
            );
          })}
          <Button asChild variant="default" className="bg-accent text-primary hover:bg-accent-light">
            <Link href="/media/live">Watch Live</Link>
          </Button>
        </nav>

        {/* Mobile menu trigger */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon" className="text-white">
              <FaBars size={24} />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 bg-midnight text-white p-0">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex flex-col">
                <span className="font-heading text-xl font-bold">
                  THE LORD&apos;S <span className="text-accent">HOUR</span> MINISTRIES
                </span>
                <span className="text-xs uppercase tracking-wider text-gray-300">
                  Liberation Centre
                </span>
              </div>
              <SheetClose asChild>
                <Button variant="ghost" size="icon" className="text-white">
                  <FaTimes size={20} />
                </Button>
              </SheetClose>
            </div>
            <nav className="flex flex-col p-4 overflow-y-auto h-full">
              {navItems.map((item) => {
                if (item.children && item.name !== "What We Do") {
                  // Regular dropdown items rendered as a group
                  return (
                    <div key={item.name} className="mb-3">
                      <span className="font-bold text-accent block mb-1">
                        {item.name}
                      </span>
                      {item.children.map((child) => (
                        <SheetClose asChild key={child.href}>
                          <Link
                            href={child.href}
                            className="block py-1 pl-4 text-sm hover:text-accent transition-colors"
                          >
                            {child.name}
                          </Link>
                        </SheetClose>
                      ))}
                    </div>
                  );
                }

                if (item.name === "What We Do") {
                  return (
                    <div key={item.name} className="mb-3">
                      <span className="font-bold text-accent block mb-1">
                        {item.name}
                      </span>
                      {item.children?.map((subItem) => (
                        <div key={subItem.name} className="mb-2">
                          <span className="block font-semibold text-white pl-2">
                            {subItem.name}
                          </span>
                          {subItem.children?.map((child) => (
                            <SheetClose asChild key={child.href}>
                              <Link
                                href={child.href}
                                className="block py-1 pl-6 text-sm hover:text-accent transition-colors"
                              >
                                {child.name}
                              </Link>
                            </SheetClose>
                          ))}
                        </div>
                      ))}
                    </div>
                  );
                }

                // Regular link (no children)
                return (
                  <SheetClose asChild key={item.name}>
                    <Link
                      href={item.href}
                      className="block py-2 text-base hover:text-accent transition-colors"
                    >
                      {item.name}
                    </Link>
                  </SheetClose>
                );
              })}
              <SheetClose asChild>
                <Button asChild variant="default" className="bg-accent text-primary hover:bg-accent-light mt-4">
                  <Link href="/media/live">Watch Live</Link>
                </Button>
              </SheetClose>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}