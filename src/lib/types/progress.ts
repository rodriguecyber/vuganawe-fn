export interface UserProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  is_completed: boolean;
  time_spent: number;
  last_accessed: Date;
  notes: Record<string, any>;
}

export interface LevelProgress {
  totalLessons: number;
  user_id:string;
  level_id:string;
  totalLesson: number;
  completedLessons: number;
  lastAccessed: Date;
  enrolled_at: Date;
  status: string
  completion_date?: Date;
  progress_percentage: number |0;
}