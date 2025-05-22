export interface FreeWord {
    id: string;
    english: string;
    kinyarwanda: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface FreeVideo {
    id: string;
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

export type FreeLessonContent = {
    title: string;
    type: 'word_card' | 'video';
    englishWord?: string;
    kinyarwandaMeaning?: string;
    description?: string;
    videoUrl?: string;
    thumbnailUrl?: string;
    category: string;
    difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
};

export type FreeLesson = {
    _id: string;
    title: string;
    type: 'word_card' | 'video';
    english_word?: string;
    kinyarwanda_meaning?: string;
    description?: string;
    video_url?: string;
    thumbnail_url?: string;
    category: string;
    difficulty_level: 'beginner' | 'intermediate' | 'advanced';
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
};

export interface CreateFreeWordData {
    english: string;
    kinyarwanda: string;
    description: string;
}

export interface CreateFreeVideoData {
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl?: string;
}

export interface CreateFreeLessonData {
    title: string;
    description: string;
    words: CreateFreeWordData[];
    videos: CreateFreeVideoData[];
    order: number;
} 