'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { scheduleService } from '@/lib/services/schedule.service';
import { MeetingPlatform } from '@/lib/types/schedule';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';

const meetingSchema = z.object({
    requested_date: z.date(),
    requested_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    duration: z.number().min(15).max(120),
    platform: z.enum(['google_meet', 'zoom', 'ms_teams'] as const),
    notes: z.string().optional(),
});

type MeetingFormData = z.infer<typeof meetingSchema>;

interface RequestMeetingFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

export function RequestMeetingForm({ onSuccess, onCancel }: RequestMeetingFormProps) {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<MeetingFormData>({
        resolver: zodResolver(meetingSchema),
        defaultValues: {

            duration: 30,
            platform: 'google_meet',
        },
    });

    const onSubmit = async (data: MeetingFormData) => {
        try {
            setIsSubmitting(true);

            await scheduleService.requestMeeting(data);
            toast({
                title: 'Meeting requested',
                description: 'Your meeting request has been sent for admin approval.',
            });
            onSuccess();
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to request meeting. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDateSelect = (date: Date | undefined) => {
        setSelectedDate(date);
        if (date) {
            setValue('requested_date', date);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Request a Meeting</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Date</label>
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={handleDateSelect}
                                disabled={(date) => date < new Date()}
                                className="rounded-md border"
                            />
                            {errors.requested_date && (
                                <p className="text-sm text-red-500">{errors.requested_date.message}</p>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium">Time</label>
                                <Input
                                    type="time"
                                    {...register('requested_time')}
                                    className={errors.requested_time ? 'border-red-500' : ''}
                                />
                                {errors.requested_time && (
                                    <p className="text-sm text-red-500">{errors.requested_time.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="text-sm font-medium">Duration (minutes)</label>
                                <Select
                                    onValueChange={(value) => setValue('duration', parseInt(value))}
                                    defaultValue="30"
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select duration" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="15">15 minutes</SelectItem>
                                        <SelectItem value="30">30 minutes</SelectItem>
                                        <SelectItem value="45">45 minutes</SelectItem>
                                        <SelectItem value="60">1 hour</SelectItem>
                                        <SelectItem value="90">1.5 hours</SelectItem>
                                        <SelectItem value="120">2 hours</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.duration && (
                                    <p className="text-sm text-red-500">{errors.duration.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="text-sm font-medium">Platform</label>
                                <Select
                                    onValueChange={(value: MeetingPlatform) => setValue('platform', value)}
                                    defaultValue="google_meet"
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select platform" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="google_meet">Google Meet</SelectItem>
                                        <SelectItem value="zoom">Zoom</SelectItem>
                                        <SelectItem value="ms_teams">Microsoft Teams</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.platform && (
                                    <p className="text-sm text-red-500">{errors.platform.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium">Notes (optional)</label>
                        <Textarea
                            {...register('notes')}
                            placeholder="Add any additional information for the teacher"
                            className="mt-1"
                        />
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Requesting...
                                </>
                            ) : (
                                'Request Meeting'
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
} 