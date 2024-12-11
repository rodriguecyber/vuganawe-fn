"use client";

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Course, Module, Lesson, Resource } from '../types/course';
import { CourseProgress, UserProgress } from '../types/progress';
import * as courseApi from '../api/courses';
import * as progressApi from '../api/progress';
import { useAuth } from '@/lib/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

interface CourseState {
  courses: Course[];
  currentCourse: Course | null;
  modules: Module[];
  lessons: Record<string, Lesson[]>;
  resources: Record<string, Resource[]>;
  progress: Record<string, CourseProgress>;
  lessonProgress: Record<string, UserProgress>;
  isLoading: boolean;
  error: string | null;
}

interface CourseContextType extends CourseState {
  loadCourses: () => Promise<void>;
  loadCourse: (courseId: string) => Promise<void>;
  loadModules: (courseId: string) => Promise<void>;
  loadLessons: (moduleId: string) => Promise<void>;
  loadResources: (lessonId: string) => Promise<void>;
  updateProgress: (lessonId: string, data: Partial<UserProgress>) => Promise<void>;
}

const initialState: CourseState = {
  courses: [],
  currentCourse: null,
  modules: [],
  lessons: {},
  resources: {},
  progress: {},
  lessonProgress: {},
  isLoading: false,
  error: null,
};

type CourseAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'SET_COURSES'; payload: Course[] }
  | { type: 'SET_CURRENT_COURSE'; payload: Course }
  | { type: 'SET_MODULES'; payload: Module[] }
  | { type: 'SET_LESSONS'; payload: { moduleId: string; lessons: Lesson[] } }
  | { type: 'SET_RESOURCES'; payload: { lessonId: string; resources: Resource[] } }
  | { type: 'SET_COURSE_PROGRESS'; payload: { courseId: string; progress: CourseProgress } }
  | { type: 'SET_LESSON_PROGRESS'; payload: { lessonId: string; progress: UserProgress } };

const courseReducer = (state: CourseState, action: CourseAction): CourseState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_COURSES':
      return { ...state, courses: action.payload, isLoading: false };
    case 'SET_CURRENT_COURSE':
      return { ...state, currentCourse: action.payload, isLoading: false };
    case 'SET_MODULES':
      return { ...state, modules: action.payload, isLoading: false };
    case 'SET_LESSONS':
      return {
        ...state,
        lessons: {
          ...state.lessons,
          [action.payload.moduleId]: action.payload.lessons,
        },
        isLoading: false,
      };
    case 'SET_RESOURCES':
      return {
        ...state,
        resources: {
          ...state.resources,
          [action.payload.lessonId]: action.payload.resources,
        },
        isLoading: false,
      };
    case 'SET_COURSE_PROGRESS':
      return {
        ...state,
        progress: {
          ...state.progress,
          [action.payload.courseId]: action.payload.progress,
        },
      };
    case 'SET_LESSON_PROGRESS':
      return {
        ...state,
        lessonProgress: {
          ...state.lessonProgress,
          [action.payload.lessonId]: action.payload.progress,
        },
      };
    default:
      return state;
  }
};

export const CourseContext = createContext<CourseContextType | undefined>(undefined);

export function CourseProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(courseReducer, initialState);
  
  const { user } = useAuth();
  const { toast } = useToast();

  const loadCourses = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const courses = await courseApi.fetchCourses();
      dispatch({ type: 'SET_COURSES', payload: courses });

      // Load progress for each course
      if (user) {
        await Promise.all(
          courses.map(async (course) => {
            const progress = await progressApi.fetchCourseProgress(user._id, course._id);
            dispatch({
              type: 'SET_COURSE_PROGRESS',
              payload: { courseId: course._id, progress },
            });
          })
        );
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load courses';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }
  };

  const loadCourse = async (courseId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const course = await courseApi.fetchCourseById(courseId);
      dispatch({ type: 'SET_CURRENT_COURSE', payload: course });

      if (user) {
        const progress = await progressApi.fetchCourseProgress(user._id, courseId);
        dispatch({
          type: 'SET_COURSE_PROGRESS',
          payload: { courseId, progress },
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load course';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }
  };

  const loadModules = async (courseId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const modules = await courseApi.fetchModulesByCourseId(courseId);
      dispatch({ type: 'SET_MODULES', payload: modules });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load modules';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }
  };

  const loadLessons = async (moduleId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const lessons = await courseApi.fetchLessonsByModuleId(moduleId);
      dispatch({ type: 'SET_LESSONS', payload: { moduleId, lessons } });

      if (user) {
        await Promise.all(
          lessons.map(async (lesson) => {
            const progress = await progressApi.fetchUserProgress(user._id);
            const lessonProgress = progress.find(p => p.lesson_id === lesson._id);
            if (lessonProgress) {
              dispatch({
                type: 'SET_LESSON_PROGRESS',
                payload: { lessonId: lesson._id, progress: lessonProgress },
              });
            }
          })
        );
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load lessons';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }
  };

  const loadResources = async (lessonId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const resources = await courseApi.fetchResourcesByLessonId(lessonId);
      dispatch({ type: 'SET_RESOURCES', payload: { lessonId, resources } });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load resources';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }
  };

  const updateProgress = async (lessonId: string, data: Partial<UserProgress>) => {
    try {
      if (!user) throw new Error('User not authenticated');
      const progress = await progressApi.updateLessonProgress(user._id, lessonId, data);
      dispatch({
        type: 'SET_LESSON_PROGRESS',
        payload: { lessonId, progress },
      });
      
      // Refresh course progress after updating lesson progress
      if (state.currentCourse) {
        const courseProgress = await progressApi.fetchCourseProgress(
          user._id,
          state.currentCourse._id
        );
        dispatch({
          type: 'SET_COURSE_PROGRESS',
          payload: { courseId: state.currentCourse._id, progress: courseProgress },
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update progress';
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }
  };

  return (
    <CourseContext.Provider
      value={{
        ...state,
        loadCourses,
        loadCourse,
        loadModules,
        loadLessons,
        loadResources,
        updateProgress,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
}