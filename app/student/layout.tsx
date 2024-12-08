"use client";

import { Sidebar } from "@/components/student/sidebar";
import { useAuth } from "@/lib/hooks/use-auth";
import { redirect } from "next/navigation";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();

  if (!isLoading && (!user || user.role !== "student")) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-gray-50 p-8">
        {children}
      </main>
    </div>
  );
}