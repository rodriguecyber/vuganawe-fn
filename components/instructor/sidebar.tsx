"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { BookOpen, GraduationCap, LayoutDashboard, Plus, Menu, X } from 'lucide-react';
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
    href: "/instructor",
    icon: LayoutDashboard,
  },
  {
    name: "My Courses",
    href: "/instructor/courses",
    icon: BookOpen,
  },
  {
    name: "Add Course",
    href: "/instructor/courses/new",
    icon: Plus,
  },
  // {
  //   name: "Assignment",
  //   href: "/instructor/assignments",
  //   icon: Plus,
  // },
];

export const Sidebar=()=> {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);

  const NavItems = ({ isMobile = false }) => (
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
            onClick={() => isMobile && setIsMobileOpen(false)}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            <span className={cn(
              isMobile ? "" : "transition-opacity duration-200",
              (!isMobile && isDesktopCollapsed) && "opacity-0 overflow-hidden w-0"
            )}>
              {item.name}
            </span>
          </Link>
        );
      })}
    </>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden fixed top-4 left-4 z-40">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Open sidebar</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-full flex-col bg-white">
            <div className="flex h-16 items-center gap-2 px-6 border-b">
              <GraduationCap className="h-6 w-6" />
              <span className="text-lg font-semibold">Instructor Portal</span>
            </div>
            <nav className="flex-1 space-y-1 px-4 py-4">
              <NavItems isMobile />
            </nav>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className={cn(
        "hidden md:flex h-screen flex-col bg-white border-r transition-all duration-300",
        isDesktopCollapsed ? "w-16" : "w-64"
      )}>
        <div className={cn(
          "flex h-16 items-center gap-2 px-6 border-b",
          isDesktopCollapsed && "justify-center"
        )}>
          <GraduationCap className="h-6 w-6 flex-shrink-0" />
          <span className={cn(
            "text-lg font-semibold transition-opacity duration-200",
            isDesktopCollapsed && "opacity-0 overflow-hidden w-0"
          )}>
            Instructor Portal
          </span>
        </div>
        <nav className="flex-1 space-y-1 px-4 py-4">
          <NavItems />
        </nav>
        <Button
          variant="ghost"
          size="icon"
          className="self-end m-4"
          onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
        >
          {isDesktopCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>
    </>
  );
}

