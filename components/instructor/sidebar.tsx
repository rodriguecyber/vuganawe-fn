"use client";

import { cn } from "@/lib/utils";
import {
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

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
  {
    name: "Assignment",
    href: "/instructor/courses/new",
    icon: Plus,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar is collapsed initially

  // Toggle sidebar visibility
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="relative">
      {/* Button to toggle the sidebar */}
      <button
        className="fixed top-4 left-4 z-50 sm:hidden p-2 text-gray-900 bg-gray-200 rounded-md"
        onClick={toggleSidebar}
      >
        <span className="text-xl">☰</span>
      </button>

      {/* Sidebar */}
      <div
        className={cn(
          "flex h-full flex-col bg-white border-r transition-all duration-300",
          isSidebarOpen
            ? "w-64" // Full width when expanded
            : "w-16", // Collapsed width (only icons) when hidden
          "sm:w-64" // Sidebar is always full width on medium and larger devices
        )}
      >
        {/* Sidebar Header */}
        <div
          className={cn(
            "flex items-center gap-2 px-6 border-b h-16 transition-all duration-300",
            !isSidebarOpen && "justify-center" // Hide text if collapsed
          )}
        >
          <GraduationCap className="h-6 w-6" />
          {isSidebarOpen && <span className="text-lg font-semibold">Instructor Portal</span>}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-4 py-4">
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
              >
                <item.icon className="h-5 w-5" />
                {/* Show name only when expanded, but on medium screens and up, it's always visible */}
                <span className={isSidebarOpen ? "" : "hidden sm:inline"}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
