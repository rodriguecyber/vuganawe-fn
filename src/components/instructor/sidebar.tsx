"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  Plus,
  Menu,
  X,
  Bell,
  LogOut,
  Settings
} from 'lucide-react';
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Levels",
    href: "/admin/levels",
    icon: BookOpen,
  },
  {
    name: "Add Level",
    href: "/admin/levels/new",
    icon: Plus,
  },
  // {
  //   name: "Assignment",
  //   href: "/admin/assignments",
  //   icon: Plus,
  // },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const [notifications] = useState([
    { id: 1, text: "New student enrollment", unread: true },
    { id: 2, text: "Assignment submission", unread: true },
  ]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

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
                ? "bg-orange-100 text-orange-900"
                : "text-gray-600 hover:bg-orange-50 hover:text-orange-900"
            )}
            onClick={() => isMobile && setIsMobileOpen(false)}
          >
            <item.icon className={cn(
              "h-5 w-5 flex-shrink-0",
              isActive ? "text-orange-500" : "text-gray-400"
            )} />
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

  const SidebarFooter = ({ isMobile = false }) => (
    <div className={cn(
      "border-t p-4",
      isMobile ? "" : isDesktopCollapsed ? "px-2" : "px-4"
    )}>
      <div className="flex items-center justify-between mb-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-gray-500" />
              {notifications.some(n => n.unread) && (
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-orange-500">
                  {notifications.filter(n => n.unread).length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            {notifications.map((notification) => (
              <DropdownMenuItem key={notification.id} className="p-3">
                <div className="flex items-start gap-2">
                  {notification.unread && (
                    <div className="h-2 w-2 mt-1.5 rounded-full bg-orange-500" />
                  )}
                  <span className="text-sm">{notification.text}</span>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          size="icon"
          className="text-gray-500 hover:text-orange-500"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>

      {!isDesktopCollapsed && !isMobile && (
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
            <span className="text-sm font-medium text-orange-600">AI</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
            <p className="text-xs text-gray-500 truncate">admin@example.com</p>
          </div>
        </div>
      )}
    </div>
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
              <GraduationCap className="h-6 w-6 text-orange-500" />
              <span className="text-lg font-semibold">Admin Portal</span>
            </div>
            <nav className="flex-1 space-y-1 px-4 py-4">
              <NavItems isMobile />
            </nav>
            <SidebarFooter isMobile />
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
          isDesktopCollapsed && "justify-center px-0"
        )}>
          <GraduationCap className="h-6 w-6 text-orange-500 flex-shrink-0" />
          <span className={cn(
            "text-lg font-semibold transition-opacity duration-200",
            isDesktopCollapsed && "opacity-0 overflow-hidden w-0"
          )}>
            Admin Portal
          </span>
        </div>
        <nav className="flex-1 space-y-1 px-4 py-4">
          <NavItems />
        </nav>
        <SidebarFooter />
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

