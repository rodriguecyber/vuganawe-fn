"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";
import Link from "next/link";

const courses = [
  {
    id: "1",
    title: "Web Development Fundamentals",
    progress: 65,
    totalModules: 8,
    completedModules: 5,
    thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500&h=300&fit=crop",
  },
  {
    id: "2",
    title: "Advanced JavaScript",
    progress: 40,
    totalModules: 10,
    completedModules: 4,
    thumbnail: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=500&h=300&fit=crop",
  },
];

export function CourseList() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Courses</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Card key={course.id} className="overflow-hidden">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="h-48 w-full object-cover"
            />
            <CardHeader>
              <CardTitle>{course.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{course.progress}%</span>
                </div>
                <Progress value={course.progress} />
              </div>
              <div className="text-sm text-muted-foreground">
                {course.completedModules} of {course.totalModules} modules completed
              </div>
              <Link href={`/student/courses/${course.id}`}>
                <Button className="w-full">
                  <PlayCircle className="mr-2 h-4 w-4" />
                  Continue Learning
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}