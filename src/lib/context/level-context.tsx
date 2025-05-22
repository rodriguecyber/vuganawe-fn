"use client";

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Level, Module, Lesson, Resource } from '../types/level';
import { LevelProgress, UserProgress } from '../types/progress';
import * as levelApi from '../api/levels';
import * as progressApi from '../api/progress';
import { useAuth } from '@/lib/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

interface LevelState {
  levels: Level[];
  currentLevel: Level | null;
  modules: Module[];
  lessons: Record<string, Lesson[]>;
  resources: Record<string, Resource[]>;
  progress: Record<string, LevelProgress>;
  lessonProgress: Record<string, UserProgress>;
  isLoading: boolean;
  error: string | null;
}

interface LevelContextType extends LevelState {
  loadLevels: () => Promise<void>;
  createLevel: (formData:FormData) => Promise<void>;
  loadLevel: (levelId: string) => Promise<void>;
  loadModules: (levelId: string) => Promise<void>;
  createModule: (levelId: string,title:string,description:string,duration_hours:number) => Promise<void>;
  createLesson: (moduleId: string, title: string, content: string, duration_minutes: number, video: File | null) => Promise<void>;
  loadLessons: (moduleId: string) => Promise<void>;
  loadResources: (lessonId: string) => Promise<void>;
  updateProgress: (lessonId: string, data: Partial<UserProgress>) => Promise<void>;
}

const initialState: LevelState = {
  levels: [],
  currentLevel: null,
  modules: [],
  lessons: {},
  resources: {},
  progress: {},
  lessonProgress: {},
  isLoading: false,
  error: null,
};

type LevelAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'SET_LEVELS'; payload: Level[] }
  | { type: 'SET_CURRENT_LEVEL'; payload: Level }
  | { type: 'SET_MODULES'; payload: Module[] }
  | { type: 'SET_LESSONS'; payload: { moduleId: string; lessons: Lesson[] } }
  | { type: 'SET_RESOURCES'; payload: { lessonId: string; resources: Resource[] } }
  | { type: 'SET_LEVEL_PROGRESS'; payload: { levelId: string; progress: LevelProgress } }
  | { type: 'SET_LESSON_PROGRESS'; payload: { lessonId: string; progress: UserProgress } };

const levelReducer = (state: LevelState, action: LevelAction): LevelState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_LEVELS':
      return { ...state, levels: action.payload, isLoading: false };
    case 'SET_CURRENT_LEVEL':
      return { ...state, currentLevel: action.payload, isLoading: false };
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
    case 'SET_LEVEL_PROGRESS':
      return {
        ...state,
        progress: {
          ...state.progress,
          [action.payload.levelId]: action.payload.progress,
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

export const LevelContext = createContext<LevelContextType | undefined>(undefined);

export function LevelProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(levelReducer, initialState);
  
  const { user } = useAuth();
  const { toast } = useToast();

  const loadLevels = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const levels = await levelApi.fetchLevels();
      dispatch({ type: 'SET_LEVELS', payload: levels });
       
      // Load progress for each level
      // if (user) {
        await Promise.all(
          levels.map(async (level) => {
            const progress = await progressApi.fetchLevelProgress(level._id);
            dispatch({
              type: 'SET_LEVEL_PROGRESS',
              payload: { levelId: level._id, progress },
            });
          })
        );
      // }
    } catch (error) {
      console.log('kkk')
      const message = error instanceof Error ? error.message : 'Failed to load levels';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }
  };

  const loadLevel = async (levelId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const level = await levelApi.fetchLevelById(levelId);
      dispatch({ type: 'SET_CURRENT_LEVEL', payload: level });

      // if (user) {
        const progress = await progressApi.fetchLevelProgress(levelId);
        dispatch({
          type: 'SET_LEVEL_PROGRESS',
          payload: { levelId, progress },
        });
      // }
    } catch (error) {

      const message = error instanceof Error ? error.message : 'Failed to load level';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }
  };
  const createLevel = async (formData: FormData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response =await levelApi.createLevel(formData)
      if (!response.ok) {
        throw new Error('Failed to create level');
      }

      const newLevel = await response.json();
      dispatch({ type: 'SET_LEVELS', payload: [...state.levels, newLevel] });
      toast({
        title: "Success",
        description: "Level created successfully",
        variant: "default",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create level';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }
  };

  
  const createModule = async (levelId: string,title:string,description:string,duration_hours:number) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
       await levelApi.createModule(levelId,title,description,duration_hours);
       const modules = await levelApi.fetchModulesByLevelId(levelId)
      dispatch({ type: 'SET_MODULES', payload: modules });
      toast({
        title: "success",
        description: 'module added',
        variant: "default",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create module modules';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }
  };
  const createLesson = async (moduleId: string, title: string, content: string,  duration_minutes: number, video: File | null) => {
    try {
      // dispatch({ type: 'SET_LOADING', payload: true });
       await levelApi.createLesson(moduleId, title, content, duration_minutes, video);
       const lessons = await levelApi.fetchLessonsByModuleId(moduleId)
      dispatch({ type: 'SET_LESSONS', payload:{moduleId, lessons} });
      toast({
        title: "success",
        description: 'lesson added',
        variant: "default",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create module modules';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }
  };
  const loadModules = async (levelId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const modules = await levelApi.fetchModulesByLevelId(levelId);
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
      const lessons = await levelApi.fetchLessonsByModuleId(moduleId);
      dispatch({ type: 'SET_LESSONS', payload: { moduleId, lessons } });

      if (user) {
        await Promise.all(
          lessons.map(async (lesson) => {
            const progress = await progressApi.fetchUserProgress(user._id);
            //@ts-expect-error error
            const lessonProgress = progress.find(p => p.lesson_id._id === lesson._id);
                 
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
      const resources = await levelApi.fetchResourcesByLessonId(lessonId);
      dispatch({ type: 'SET_RESOURCES', payload: { lessonId, resources } });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load resources';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
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
      
      // Refresh level progress after updating lesson progress
      if (state.currentLevel) {
        const levelProgress = await progressApi.fetchLevelProgress(
          state.currentLevel._id
        );
        dispatch({
          type: 'SET_LEVEL_PROGRESS',
          payload: { levelId: state.currentLevel._id, progress: levelProgress },
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
    <LevelContext.Provider
      value={{
        ...state,
        loadLevels,
        loadLevel,
        loadModules,
        createLevel,
        createModule,
        createLesson,
        loadLessons,
        loadResources,
        updateProgress,
      }}
    >
      {children}
    </LevelContext.Provider>
  );
}
