"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Plus } from "lucide-react";
import Link from "next/link";

const courses = [
  {
    id: "1",
    title: "Introduction to Web Development",
    status: "published",
    students: 156,
    modules: 8,
    price: 99.99,
  },
  // Add more sample courses as needed
];

export function CourseList() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Courses</h1>
        <Link href="/instructor/courses/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Course
          </Button>
        </Link>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Students</TableHead>
              <TableHead>Modules</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course.id}>
                <TableCell className="font-medium">{course.title}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      course.status === "published" ? "default" : "secondary"
                    }
                  >
                    {course.status}
                  </Badge>
                </TableCell>
                <TableCell>{course.students}</TableCell>
                <TableCell>{course.modules}</TableCell>
                <TableCell>${course.price}</TableCell>
                <TableCell>
                  <Link href={`/instructor/courses/${course.id}`}>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}