import { Course, Module, Lesson, Resource } from '../types/course';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function fetchCourses(): Promise<Course[]> {
  const response = await fetch(`${API_URL}/api/courses`);
  if (!response.ok) throw new Error('Failed to fetch courses');
  return response.json();
}

export async function fetchCourseById(courseId: string): Promise<Course> {
  const response = await fetch(`${API_URL}/api/courses/${courseId}`);
  if (!response.ok) throw new Error('Failed to fetch course');
  return response.json();
}

export async function fetchModulesByCourseId(courseId: string): Promise<Module[]> {
  const response = await fetch(`${API_URL}/api/courses/${courseId}/modules`);
  if (!response.ok) throw new Error('Failed to fetch modules');
  return response.json();
}

export async function fetchLessonsByModuleId(moduleId: string): Promise<Lesson[]> {
  const response = await fetch(`${API_URL}/api/courses/modules/${moduleId}/lessons`);
  if (!response.ok) throw new Error('Failed to fetch lessons');
  return response.json();
}

export async function fetchResourcesByLessonId(lessonId: string): Promise<Resource[]> {
  const response = await fetch(`${API_URL}api/lessons/${lessonId}/resources`);
  if (!response.ok) throw new Error('Failed to fetch resources');
  return response.json();
}
// utils/api.ts (or the appropriate file for handling API requests)
export async function createModule(courseId: string, title: string, description: string) {
  const response = await fetch("/api/modules/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      courseId,
      title,
      description,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create module");
  }

  const newModule = await response.json();
  return newModule;
}
// utils/api.ts
export async function createLesson(moduleId: string, title: string, content: string, content_type: string, duration_minutes: number, order_index: number, is_free_preview: boolean) {
  const response = await fetch("/api/lessons/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      module_id: moduleId,
      title,
      content,
      content_type,
      duration_minutes,
      order_index,
      is_free_preview,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create lesson");
  }

  const newLesson = await response.json();
  return newLesson;
}
