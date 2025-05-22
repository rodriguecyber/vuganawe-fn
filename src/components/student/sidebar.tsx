"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  Menu,
  Bell,
  LogOut,
  TimerIcon,
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
import { useAuth } from "@/lib/context/auth-context";



export const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const [notifications] = useState([
    { id: 1, text: "New assignment due tomorrow", unread: true },
    { id: 2, text: "Your submission was graded", unread: true },
    { id: 3, text: "New Level material available", unread: false },
  ]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };  
  const navigation = [
    {
      name: "Dashboard",
      href: "/student",
      icon: LayoutDashboard,
      visible:true
    },
    {
      name: " Levels",
      href: "/student/levels",
      icon: BookOpen,
      visible:true
    },
    {
      name: "Schedule Call",
      href: "/student/schedule",
      icon: TimerIcon,
      visible:user?.current_plan==='premium'
    }
  ];
  const NavItems = () => (
    <>
      {navigation.filter(nav=>nav.visible===true).map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-sky-100 text-sky-900"
                : "text-gray-600 hover:bg-sky-50 hover:text-sky-900"
            )}
            onClick={() => setOpen(false)}
          >
            <item.icon className={cn(
              "h-5 w-5",
              isActive ? "text-sky-500" : "text-gray-400"
            )} />
            {item.name}
          </Link>
        );
      })}
    </>
  );

  const SidebarFooter = () => (
    <div className="border-t p-4">
      <div className="flex items-center justify-between mb-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-gray-500" />
              {notifications.some(n => n.unread) && (
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-sky-500">
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
                    <div className="h-2 w-2 mt-1.5 rounded-full bg-sky-500" />
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
          className="text-gray-500 hover:text-sky-500"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex items-center gap-3 px-3 py-2">
        <div className="h-8 w-8 rounded-full bg-sky-100 flex items-center justify-center">
          <span className="text-sm font-medium text-sky-600">
            {user?.full_name?.charAt(0).toUpperCase() || 'U'}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{user?.full_name || 'User'}</p>
          <p className="text-xs text-gray-500 truncate">{user?.email || 'No email'}</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden fixed top-4 left-4 z-40">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Open sidebar</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-full flex-col bg-white">
            <div className="flex h-16 items-center gap-2 px-6 border-b">
              <GraduationCap className="h-6 w-6 text-sky-500" />
              <span className="text-lg font-semibold">Student Portal</span>
            </div>
            <nav className="flex-1 space-y-1 px-4 py-4">
              <NavItems />
            </nav>
            <SidebarFooter />
          </div>
        </SheetContent>
      </Sheet>

      <div className="hidden md:flex h-full w-64 flex-col bg-white border-r">
        <div className="flex h-16 items-center gap-2 px-6 border-b">
          <GraduationCap className="h-6 w-6 text-sky-500" />
          <span className="text-lg font-semibold">Student Portal</span>
        </div>
        <nav className="flex-1 space-y-1 px-4 py-4">
          <NavItems />
        </nav>
        <SidebarFooter />
      </div>
    </>
  );
};

