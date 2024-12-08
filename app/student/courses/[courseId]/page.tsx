"use client";

import { CourseView } from "@/components/student/course-view";
import { useParams } from "next/navigation";

export default function CoursePage() {
  const params = useParams();
  const courseId = params.courseId as string;
  
  return <CourseView courseId={courseId} />;
}