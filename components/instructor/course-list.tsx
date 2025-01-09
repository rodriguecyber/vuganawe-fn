"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Plus } from "lucide-react";
import Link from "next/link";
import { useCourses } from "@/lib/hooks/use-courses";
import { Card } from "@/components/ui/card";

export function CourseList() {
  const { courses, loadCourses, isLoading } = useCourses();

  useEffect(()=>{
    loadCourses();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between ">
          <h1 className="text-3xl font-bold">My Courses</h1>
          <div className="w-32 h-10 bg-gray-200 animate-pulse rounded-md" />
        </div>
        <Card className="p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-full h-12 bg-gray-100 animate-pulse rounded-md" />
            ))}
          </div>
        </Card>
      </div>
    );
  }

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
              <TableHead>Students</TableHead>
              {/* <TableHead>Modules</TableHead> */}
              <TableHead>Price</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course._id}>
                <TableCell className="font-medium">{course.title}</TableCell>
                {/* <TableCell>
                </TableCell> */}
                <TableCell>{course.students||0}</TableCell>
                {/* <TableCell></TableCell> */}
                <TableCell>{course.price}</TableCell>
                <TableCell>
                  <Link href={`/instructor/courses/${course._id}`}>
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