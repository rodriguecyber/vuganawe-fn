'use client'
import axios from 'axios';
import { toast } from 'react-toastify';
import { Course, Module, Lesson, Resource } from '../types/course';

const API_URL = process.env.NEXT_PUBLIC_API_URL 
var token
// Axios instance for API requests
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token')
  }
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});

// Show toast notifications for success or error
const showToast = (message: string, type: "success" | "error") => {
  if (type === "success") {
    toast.success(message);
  } else {
    toast.error(message);
  }
};

export async function fetchCourses(): Promise<Course[]> {
  try {
    const response = await axios.get(`${API_URL}/api/courses`,{
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    showToast('Failed to fetch courses', 'error');
    throw error;

  }
}

export async function fetchCourseById(courseId: string): Promise<Course> {
  try {
    const response = await api.get(`${API_URL}/api/courses/${courseId}`,{
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    showToast('Failed to fetch course','error');
    throw error;

     
  }
}

export async function fetchModulesByCourseId(courseId: string): Promise<Module[]> {
  try {
    const response = await api.get(`${API_URL}/api/courses/${courseId}/modules`);
    return response.data;
  } catch (error) {
    showToast('Failed to fetch modules', 'error');
    throw error;

  }
}

export async function fetchLessonsByModuleId(moduleId: string): Promise<Lesson[]> {
  try {
    const response = await api.get(`${API_URL}/api/courses/modules/${moduleId}/lessons`,{
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    showToast('Failed to fetch lessons', 'error');
    throw error;

  }
}

export async function fetchResourcesByLessonId(lessonId: string): Promise<Resource[]> {
  try {
    const response = await api.get(`${API_URL}/api/lessons/${lessonId}/resources`,{
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    showToast('Failed to fetch resources', 'error');
    throw error;

  }
}

export async function createCourse(formData: FormData) {
  try {
    const response = await api.post(`${API_URL}/api/courses`, formData,{
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    showToast('Course created successfully', 'success');
    return response.data;
  } catch (error) {
    showToast('Failed to create course', 'error');
    throw error;

  }
}

export async function createModule(course_id: string, title: string, description: string, duration_hours: number) {
  try {
    const response = await api.post(`${API_URL}/api/courses/module`, {
      course_id,
      title,
      description,
      duration_hours,
    },{
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    showToast('Module created successfully', 'success');
    return response.data.module;
  } catch (error) {
    showToast('Failed to create module', 'error');
    throw error;
  }
}

export async function createLesson(module_id: string, title: string, content: string, content_type: string, duration_minutes: number, video: File | null) {
  try {
    const formData = new FormData();
    formData.append("module_id", module_id);
    formData.append("title", title);
    formData.append("content", content);
    formData.append("content_type", content_type);
    formData.append("duration_minutes", duration_minutes.toString());

    if (video) {
      formData.append("video", video);
    }

    const response = await api.post(`${API_URL}/api/courses/lesson`, formData,{
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    showToast('Lesson created successfully', 'success');
    return response.data;
  } catch (error) {
    showToast('Failed to create lesson', 'error');
    throw error;
  }
}
