import { MeetingSchedule, MeetingAvailability, WeeklySchedule, MeetingPlatform, MeetingStatus, AdminScheduleView } from '@/lib/types/schedule';

class ScheduleService {
    private API_URL = process.env.NEXT_PUBLIC_API_URL;

    // Student methods
    async requestMeeting(data: {
        requested_date: Date;
        requested_time: string;
        duration: number;
        platform: MeetingPlatform;
        notes?: string;
    }): Promise<MeetingSchedule> {
        const token = localStorage.getItem('token');
        const response = await fetch(`${this.API_URL}/api/schedule/request`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Failed to request meeting');
        }

        return response.json();
    }

    async getStudentSchedule(): Promise<MeetingSchedule[]> {
        const token = localStorage.getItem('token');
        const response = await fetch(
            `${this.API_URL}/api/schedule/student`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch schedule');
        }

        return response.json();
    }

    async cancelMeeting(meetingId: string): Promise<void> {
        const token = localStorage.getItem('token');
        const response = await fetch(`${this.API_URL}/api/schedule/${meetingId}/cancel`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to cancel meeting');
        }
    }

    // Admin methods
    async getAdminSchedule(weekStart: Date): Promise<{ total: number; schedules: MeetingSchedule[] }> {
        const token = localStorage.getItem('token');
        const response = await fetch(
            `${this.API_URL}/api/schedule/admin?weekStart=${weekStart.toISOString()}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch admin schedule');
        }

        const data = await response.json();
        return {
            total: data.total || 0,
            schedules: data.schedules || []
        };
    }

    async updateMeetingStatus(
        meetingId: string,
        data: {
            status: MeetingStatus;
            meeting_link?: string;
            admin_notes?: string;
            rescheduled_date?: Date;
            rescheduled_time?: string;
        }
    ): Promise<MeetingSchedule> {
        const token = localStorage.getItem('token');
        const response = await fetch(`${this.API_URL}/api/schedule/${meetingId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Failed to update meeting status');
        }

        return response.json();
    }

    async setAvailability(availability: MeetingAvailability[]): Promise<void> {
        const token = localStorage.getItem('token');
        const response = await fetch(`${this.API_URL}/api/schedule/availability`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(availability),
        });

        if (!response.ok) {
            throw new Error('Failed to update availability');
        }
    }

    async getAvailability(): Promise<MeetingAvailability[]> {
        const token = localStorage.getItem('token');
        const response = await fetch(`${this.API_URL}/api/schedule/availability`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch availability');
        }

        return response.json();
    }

    // Helper methods
    async checkAvailability(date: Date, time: string): Promise<boolean> {
        const token = localStorage.getItem('token');
        const response = await fetch(
            `${this.API_URL}/api/schedule/check-availability?date=${date.toISOString()}&time=${time}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error('Failed to check availability');
        }

        const { available } = await response.json();
        return available;
    }
}

export const scheduleService = new ScheduleService(); 