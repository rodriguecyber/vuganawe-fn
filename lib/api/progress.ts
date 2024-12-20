import { UserProgress, CourseProgress } from '../types/progress';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchUserProgress(userId: string): Promise<UserProgress[]> {
  const response = await fetch(`${API_URL}/api/progress`,{
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${localStorage.getItem("token")}`, // Add token here
    },
  });
  if (!response.ok) throw new Error('Failed to fetch user progress');
  return response.json();
}

export async function fetchCourseProgress(courseId: string): Promise<CourseProgress> {
  const response = await fetch(`${API_URL}/api/enrollement/${courseId}`,{
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${localStorage.getItem("token")}`, // Add token here
    },
  });
  if (!response.ok) throw new Error('Failed to fetch course progress');
  return response.json();
}

export async function updateLessonProgress(
  userId: string,
  lessonId: string,
  data: Partial<UserProgress>
): Promise<UserProgress> {
  const response = await fetch(`${API_URL}/api/progress/lessons/${lessonId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${localStorage.getItem("token")}`, // Add token here
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update lesson progress');
  return response.json();
}