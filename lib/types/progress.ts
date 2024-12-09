export interface UserProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  is_completed: boolean;
  time_spent: number;
  last_accessed: Date;
  notes: Record<string, any>;
}

export interface CourseProgress {
  courseId: string;
  totalLessons: number;
  completedLessons: number;
  progress: number;
  lastAccessed: Date;
}