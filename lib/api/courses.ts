import { Course, Module, Lesson, Resource } from '../types/course';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function fetchCourses(): Promise<Course[]> {
  const response = await fetch(`${API_URL}/api/courses`);
  if (!response.ok) throw new Error('Failed to fetch courses');
  return response.json();
}

export async function fetchCourseById(courseId: string): Promise<Course> {
  const response = await fetch(`${API_URL}/courses/${courseId}`);
  if (!response.ok) throw new Error('Failed to fetch course');
  return response.json();
}

export async function fetchModulesByCourseId(courseId: string): Promise<Module[]> {
  const response = await fetch(`${API_URL}/courses/${courseId}/modules`);
  if (!response.ok) throw new Error('Failed to fetch modules');
  return response.json();
}

export async function fetchLessonsByModuleId(moduleId: string): Promise<Lesson[]> {
  const response = await fetch(`${API_URL}/modules/${moduleId}/lessons`);
  if (!response.ok) throw new Error('Failed to fetch lessons');
  return response.json();
}

export async function fetchResourcesByLessonId(lessonId: string): Promise<Resource[]> {
  const response = await fetch(`${API_URL}/lessons/${lessonId}/resources`);
  if (!response.ok) throw new Error('Failed to fetch resources');
  return response.json();
}