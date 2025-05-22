import axios from 'axios';
import { FreeLesson } from '../types/free-course';

const API_URL = 'http://localhost:5000/api/free-courses';


export interface FreeCourseResponse {
    courses:FreeLesson[]
   currentPage: number,
    totalPages: string,
    totalCourses: string
}

export interface SearchWordCardsParams {
    query?: string;
    category?: string;
    difficultyLevel?: string;
}

export interface CreateFreeCourseData {
    title: string;
    description: string;
    type: 'word_card' | 'video';
    english_word?: string;
    kinyarwanda_meaning?: string;
    video_url?: string;
    thumbnail_url?: string;
    category: string;
    difficulty_level: 'beginner' | 'intermediate' | 'advanced';
    order: number;
    isActive: boolean;
}

class FreeCourseService {
    // Public routes
    async getFreeCourses(): Promise<FreeCourseResponse> {
        const response = await axios.get(`${API_URL}/courses`);
        return response.data;
    }

    async getFreeCourseById(id: string): Promise<FreeCourseResponse> {
        const response = await axios.get(`${API_URL}/courses/${id}`);
        return response.data;
    }

    async searchWordCards(params: SearchWordCardsParams): Promise<FreeCourseResponse> {
        const response = await axios.get(`${API_URL}/word-cards/search`, { params });
        return response.data;
    }

    async getFreeVideos(): Promise<FreeCourseResponse> {
        const response = await axios.get(`${API_URL}/videos`);
        return response.data;
    }

    async createCardFreeCourse(data:any): Promise<FreeCourseResponse> {
        const response = await axios.post(`${API_URL}`, data, {
            headers: {
               "Authorization":`Bearer ${localStorage.getItem('token')}`
            },
        });
        return response.data;
    }
    async createVideoFreeCourse(data: FormData): Promise<FreeCourseResponse> {
        const response = await axios.post(`${API_URL}/video`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
                "Authorization":`Bearer ${localStorage.getItem('token')}`
            },
        });
        return response.data;
    }

    async updateFreeCourse(id: string, data: Partial<CreateFreeCourseData>): Promise<FreeCourseResponse> {
        const response = await axios.put(`${API_URL}/${id}`, data);
        return response.data;
    }

    async deleteFreeCourse(id: string): Promise<void> {
        await axios.delete(`${API_URL}/admin/courses/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
    }

    async getAllFreeCourses(): Promise<FreeCourseResponse> {
        const response = await axios.get(`${API_URL}/admin/courses`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    }

    async toggleCourseStatus(id: string): Promise<FreeCourseResponse> {
        const response = await axios.patch(`${API_URL}//admin/courses/${id}/toggle-status`, {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    }
}

export const freeCourseService = new FreeCourseService(); 