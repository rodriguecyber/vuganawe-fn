import { Course, Module, Lesson, Resource } from '../types/course';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function fetchCourses(): Promise<Course[]> {
const response = await fetch(`${API_URL}/api/courses`,{
  headers: {
    "Authorization": `Bearer ${localStorage.getItem("token")}`,

         },
});
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
  const response = await fetch(`${API_URL}/api/lessons/${lessonId}/resources`);
  if (!response.ok) throw new Error('Failed to fetch resources');
  return response.json();
}
// utils/api.ts (or the appropriate file for handling API requests)
export async function createCourse(formData: FormData) {

  

  const response = await fetch(`${API_URL}/api/courses`, {
    method: "POST",
    headers: {
      // "Content-Type": "multipart/form-data",
      "Authorization": `Bearer ${localStorage.getItem("token")}`, // Add token here
    },
    body:formData,
  });

  if (!response.ok) {
    throw new Error("Failed to create module");
  }

  const newModule = await response.json();
  return newModule;
}
export async function createModule(course_id: string, title: string, description: string, duration_hours:number) {
  const response = await fetch(`${API_URL}/api/courses/module`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`, // Add token here

    },
    body: JSON.stringify({
      course_id,
      title,
      description,
      duration_hours
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create module");
  }

  const newModule = await response.json();
  return newModule.module;
}

// utils/api.ts
export async function createLesson(module_id: string, title: string, content: string, content_type: string, duration_minutes: number, video: File | null) {
  const formData = new FormData(); 
  formData.append("module_id", module_id);
  formData.append("title", title);
  formData.append("content", content);
  formData.append("content_type", content_type);
  formData.append("duration_minutes", duration_minutes.toString());
  
  // If there's a video file, append it to the FormData
  if (video) {
    formData.append("video", video);
  }

  const response = await fetch(`${API_URL}/api/courses/lesson`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`, // Add token here

    },
    body: formData, // Send form data including the video file
  });

  if (!response.ok) {
    throw new Error("Failed to create lesson");
  }

  const newLesson = await response.json();
  return newLesson;
}

