"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { BookOpen, GraduationCap, LayoutDashboard, BookMarked, Clock, Menu } from 'lucide-react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const navigation = [
  {
    name: "Dashboard",
    href: "/student",
    icon: LayoutDashboard,
  },
  {
    name: "My Courses",
    href: "/student/courses",
    icon: BookOpen,
  },
  {
    name: "In Progress",
    href: "/student/in-progress",
    icon: Clock,
  },
  {
    name: "Completed",
    href: "/student/completed",
    icon: BookMarked,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const NavItems = () => (
    <>
      {navigation.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )}
            onClick={() => setOpen(false)}
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </Link>
        );
      })}
    </>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" className="p-0 md:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Open sidebar</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-full flex-col bg-white">
            <div className="flex h-16 items-center gap-2 px-6 border-b">
              <GraduationCap className="h-6 w-6" />
              <span className="text-lg font-semibold">Student Portal</span>
            </div>
            <nav className="flex-1 space-y-1 px-4 py-4">
              <NavItems />
            </nav>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-full w-64 flex-col bg-white border-r">
        <div className="flex h-16 items-center gap-2 px-6 border-b">
          <GraduationCap className="h-6 w-6" />
          <span className="text-lg font-semibold">Student Portal</span>
        </div>
        <nav className="flex-1 space-y-1 px-4 py-4">
          <NavItems />
        </nav>
      </div>
    </>
  );
}

