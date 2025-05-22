'use client'
import axios from 'axios';
import { toast } from 'react-toastify';
import { Level, Module, Lesson, Resource } from '../types/level';

export const API_URL = process.env.NEXT_PUBLIC_API_URL


// Show toast notifications for success or error
const showToast = (message: string, type: "success" | "error") => {
  if (type === "success") {
    toast.success(message);
  } else {
    toast.error(message);
  }
};

export async function fetchLevels(): Promise<Level[]> {
  try {
    const response = await axios.get(`${API_URL}/api/levels`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    showToast('Failed to fetch levels', 'error');
    throw error;

  }
}

export async function fetchLevelById(levelId: string): Promise<Level> {
  try {
    const response = await axios.get(`${API_URL}/api/levels/${levelId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    showToast('Failed to fetch level', 'error');
    throw error;


  }
}

export async function fetchModulesByLevelId(levelId: string): Promise<Module[]> {
  try {
    const response = await axios.get(`${API_URL}/api/levels/${levelId}/modules`);
    return response.data;
  } catch (error) {
    showToast('Failed to fetch modules', 'error');
    throw error;

  }
}

export async function fetchLessonsByModuleId(moduleId: string): Promise<Lesson[]> {
  try {
    const response = await axios.get(`${API_URL}/api/levels/modules/${moduleId}/lessons`, {
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
    const response = await axios.get(`${API_URL}/api/resources/${lessonId}`, {
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

export async function createLevel(formData: FormData) {
  try {
    const response = await axios.post(`${API_URL}/api/levels`, formData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    showToast('level created successfully', 'success');
    return response.data;
  } catch (error) {
    showToast('Failed to create level', 'error');
    throw error;

  }
}

export async function createModule(level_id: string, title: string, description: string, duration_hours: number) {
  try {
    const response = await axios.post(`${API_URL}/api/levels/module`, {
      level_id,
      title,
      description,
      duration_hours,
    }, {
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

export async function createLesson(module_id: string, title: string, content: string,  duration_minutes: number, video: File | null) {
  try {
    const formData = new FormData();
    formData.append("module_id", module_id);
    formData.append("title", title);
    formData.append("content", content);
    formData.append("duration_minutes", duration_minutes.toString());

    if (video) {
      formData.append("video", video);
    }

    const response = await axios.post(`${API_URL}/api/levels/lesson`, formData, {
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

export async function downloadResource(resourceId: string): Promise<{ url: string, filename: string }> {
  try {
    const response = await axios.get(`${API_URL}/api/resources/${resourceId}/download`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      responseType: 'blob',
    });

    // Get filename from Content-Disposition header or fallback to default
    const contentDisposition = response.headers['content-disposition'];
    let filename = 'download';
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }

    // Create a URL for the blob
    const url = window.URL.createObjectURL(new Blob([response.data]));
    return { url, filename };
  } catch (error) {
    showToast('Failed to download resource', 'error');
    throw error;
  }
}
