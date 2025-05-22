export type MeetingPlatform = 'google_meet' | 'zoom' | 'ms_teams';

export type MeetingStatus = 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';

export interface MeetingSchedule {
    _id: string;
    student_id: string;
    student_name?: string;
    requested_date: Date;
    requested_time: string;
    duration: number; // in minutes
    platform: MeetingPlatform;
    meeting_link?: string;
    status: MeetingStatus;
    notes?: string;
    created_at: string;
    updated_at: string;
    admin_notes?: string;
    rescheduled_date?: string;
    rescheduled_time?: string;
}

export interface MeetingAvailability {
    _id: string;

    day_of_week: number; // 0-6 (Sunday-Saturday)
    start_time: string; // HH:mm format
    end_time: string; // HH:mm format
    is_available: boolean;
    created_at: string;
    updated_at: string;
}

export interface WeeklySchedule {
    student_id: string;
    student_name?: string;
    week_start: Date;
    week_end: Date;
    meetings: MeetingSchedule[];
}

export interface AdminScheduleView {
    week_start: Date;
    week_end: Date;
    meetings: MeetingSchedule[];
    total_pending: number;
    total_approved: number;
    total_rejected: number;
    total_completed: number;
    total_cancelled: number;
} 