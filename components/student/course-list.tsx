"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";
import Link from "next/link";
import { useCourses } from "@/lib/hooks/use-courses";

export function CourseList() {
  const { courses, progress, loadCourses, isLoading } = useCourses();

  useEffect(() => {
    loadCourses();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">My Courses</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="h-48 bg-gray-200 animate-pulse" />
              <CardHeader>
                <div className="h-6 w-3/4 bg-gray-100 animate-pulse rounded" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-100 animate-pulse rounded" />
                  <div className="h-2 w-full bg-gray-200 animate-pulse rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Courses</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => {
          const courseProgress = progress[course._id] || { progress: 0, completedLessons: 0, totalLessons: 0 };
          
          return (
            <Card key={course._id} className="overflow-hidden">
              <img
                src={course.thumbnail || "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500&h=300&fit=crop"}
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
                    <span>{courseProgress.progress}%</span>
                  </div>
                  <Progress value={courseProgress.progress} />
                </div>
                <div className="text-sm text-muted-foreground">
                  {courseProgress.completedLessons} of {courseProgress.totalLessons} modules completed
                </div>
                <Link href={`/student/courses/${course._id}`}>
                  <Button className="w-full">
                    <PlayCircle className="mr-2 h-4 w-4" />
                    Continue Learning
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}