import { UserProgress, CourseProgress } from '../types/progress';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export async function fetchUserProgress(userId: string): Promise<UserProgress[]> {
  const response = await fetch(`${API_URL}/users/${userId}/progress`);
  if (!response.ok) throw new Error('Failed to fetch user progress');
  return response.json();
}

export async function fetchCourseProgress(userId: string, courseId: string): Promise<CourseProgress> {
  const response = await fetch(`${API_URL}/users/${userId}/courses/${courseId}/progress`);
  if (!response.ok) throw new Error('Failed to fetch course progress');
  return response.json();
}

export async function updateLessonProgress(
  userId: string,
  lessonId: string,
  data: Partial<UserProgress>
): Promise<UserProgress> {
  const response = await fetch(`${API_URL}/users/${userId}/lessons/${lessonId}/progress`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update lesson progress');
  return response.json();
}