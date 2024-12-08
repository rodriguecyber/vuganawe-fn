"use client";

import { CourseDetails } from "@/components/instructor/course-details";
import { useParams } from "next/navigation";

export default function CoursePage() {
  const params = useParams();
  const courseId = params.courseId as string;
  
  return <CourseDetails courseId={courseId} />;
}