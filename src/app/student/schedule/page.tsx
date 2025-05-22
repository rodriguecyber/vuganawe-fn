'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { scheduleService } from '@/lib/services/schedule.service';
import { MeetingSchedule, MeetingPlatform, MeetingStatus } from '@/lib/types/schedule';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Calendar, Clock, Video, Loader2, Search, Filter, X, Plus, Crown } from 'lucide-react';
import { useAuth } from '@/lib/context/auth-context';
import { useDebounce } from '@/lib/hooks/use-debounce';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { RequestMeetingForm } from '@/components/schedule/RequestMeetingForm';
import { useRouter } from 'next/navigation';
import Link from "next/link";

export default function StudentSchedulePage() {
    const { toast } = useToast();
    const { user, isLoading: authLoading, checkAuthStatus } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [meetings, setMeetings] = useState<MeetingSchedule[]>([]);
    const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);

    // Filter state
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatusFilter, setSelectedStatusFilter] = useState<MeetingStatus | "All">("All");
    const [selectedPlatform, setSelectedPlatform] = useState<MeetingPlatform | "All">("All");
    const [showFilters, setShowFilters] = useState(false);

    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    const fetchSchedule = async () => {
        if (!user) return; // Don't fetch if no user

        try {
            setIsLoading(true);
            setError(null);
            const response = await scheduleService.getStudentSchedule();
            setMeetings(response);
        } catch (err) {
            setError('Failed to fetch schedule');
            toast({
                title: 'Error',
                description: 'Failed to load schedule. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Handle initial auth check and data fetching
    useEffect(() => {
        const initializePage = async () => {
            await checkAuthStatus();
        };
        initializePage();
    }, []);

    // Fetch schedule when user is authenticated
    useEffect(() => {
        if (!authLoading && user) {
            fetchSchedule();
        }
    }, [authLoading]);

    // Handle auth and premium plan check
    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push('/login');
                return;
            }
        }
    }, [authLoading, router]);

    // Filter meetings based on search query and filters
    const filteredMeetings = useMemo(() => {
        return meetings.filter((meeting) => {
            // Filter by status
            const matchesStatus = selectedStatusFilter === "All" || meeting.status === selectedStatusFilter;

            // Filter by platform
            const matchesPlatform = selectedPlatform === "All" || meeting.platform === selectedPlatform;

            // Filter by search query
            const searchLower = debouncedSearchQuery.toLowerCase();
            const matchesSearch =
                !debouncedSearchQuery ||
                format(new Date(meeting.requested_date), 'MMMM d, yyyy').toLowerCase().includes(searchLower) ||
                format(new Date(`2000-01-01T${meeting.requested_time}`), 'h:mm a').toLowerCase().includes(searchLower) ||
                meeting.notes?.toLowerCase().includes(searchLower) ||
                meeting.admin_notes?.toLowerCase().includes(searchLower);

            return matchesStatus && matchesPlatform && matchesSearch;
        });
    }, [meetings, selectedStatusFilter, selectedPlatform, debouncedSearchQuery]);

    const resetFilters = () => {
        setSearchQuery("");
        setSelectedStatusFilter("All");
        setSelectedPlatform("All");
    };

    const handleCancelMeeting = async (meetingId: string) => {
        if (!confirm('Are you sure you want to cancel this meeting?')) return;

        try {
            await scheduleService.cancelMeeting(meetingId);
            toast({
                title: 'Meeting cancelled',
                description: 'Your meeting has been cancelled successfully.',
            });
            fetchSchedule();
        } catch (err) {
            toast({
                title: 'Error',
                description: 'Failed to cancel meeting. Please try again.',
                variant: 'destructive',
            });
        }
    };

    const getStatusBadge = (status: MeetingStatus) => {
        const statusConfig = {
            pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800' },
            approved: { label: 'Approved', className: 'bg-green-100 text-green-800' },
            rejected: { label: 'Rejected', className: 'bg-red-100 text-red-800' },
            completed: { label: 'Completed', className: 'bg-blue-100 text-blue-800' },
            cancelled: { label: 'Cancelled', className: 'bg-gray-100 text-gray-800' },
        };

        const config = statusConfig[status];
        return (
            <Badge className={config.className}>
                {config.label}
            </Badge>
        );
    };

    const getPlatformIcon = (platform: MeetingPlatform) => {
        switch (platform) {
            case 'google_meet':
                return '🎥';
            case 'zoom':
                return '📹';
            case 'ms_teams':
                return '💻';
            default:
                return '🎥';
        }
    };

    // Show loading state while checking auth
    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-sky-600" />
                    <p className="text-sky-600">Loading...</p>
                </div>
            </div>
        );
    }

    // Show premium required message for non-premium users
    if (user && user.current_plan !== 'premium') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <Card className="w-full max-w-md p-8 text-center">
                    <div className="space-y-6">
                        <div className="mx-auto w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
                            <Crown className="h-10 w-10 text-orange-500" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-semibold text-gray-800">Premium Feature</h2>
                            <p className="text-gray-600">
                                Schedule management is a premium feature. Upgrade your plan to access this feature and more.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/pricing" className="w-full sm:w-auto">
                                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                                    <Crown className="h-4 w-4 mr-2" />
                                    Upgrade to Premium
                                </Button>
                            </Link>
                            <Link href="/student/dashboard" className="w-full sm:w-auto">
                                <Button variant="outline" className="w-full">
                                    Return to Dashboard
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-4 text-center">
                <p className="text-red-600">{error}</p>
                <Button onClick={fetchSchedule} className="mt-4">
                    Try Again
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-sky-900">My Schedule</h1>
                    <p className="text-sky-700 mt-1">View and manage your meeting requests</p>
                </div>
                <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                        >
                            <Plus className="h-5 w-5" />
                            Request Meeting
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Request a New Meeting</DialogTitle>
                        </DialogHeader>
                        <RequestMeetingForm
                            onSuccess={() => {
                                setIsRequestDialogOpen(false);
                                fetchSchedule();
                            }}
                            onCancel={() => setIsRequestDialogOpen(false)}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            {/* Search and Filters */}
            <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-sky-500" />
                        <Input
                            placeholder="Search meetings..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 border-sky-200 focus:border-sky-400 focus:ring-sky-400"
                            disabled={isLoading}
                        />
                    </div>
                    <Button
                        variant="outline"
                        className="md:w-auto w-full border-sky-200 text-sky-700"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <Filter className="mr-2 h-4 w-4" />
                        Filters {showFilters ? "(Hide)" : "(Show)"}
                    </Button>
                </div>

                {showFilters && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-sky-50 rounded-lg">
                        <div>
                            <label className="text-sm font-medium">Status</label>
                            <Select
                                value={selectedStatusFilter}
                                onValueChange={(value: MeetingStatus | "All") => setSelectedStatusFilter(value)}
                                disabled={isLoading}
                            >
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">All Statuses</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="approved">Approved</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="text-sm font-medium">Platform</label>
                            <Select
                                value={selectedPlatform}
                                onValueChange={(value: MeetingPlatform | "All") => setSelectedPlatform(value)}
                                disabled={isLoading}
                            >
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Select platform" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">All Platforms</SelectItem>
                                    <SelectItem value="google_meet">Google Meet</SelectItem>
                                    <SelectItem value="zoom">Zoom</SelectItem>
                                    <SelectItem value="ms_teams">Microsoft Teams</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="md:col-span-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={resetFilters}
                                className="text-sky-700 hover:text-sky-900 hover:bg-sky-100"
                            >
                                Reset all filters
                            </Button>
                        </div>
                    </div>
                )}

                {/* Active filters display */}
                {(searchQuery || selectedStatusFilter !== "All" || selectedPlatform !== "All") && (
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="text-sm text-sky-700">Active filters:</div>
                        {searchQuery && (
                            <Badge variant="secondary" className="flex items-center gap-1 bg-sky-100 text-sky-700">
                                Search: {searchQuery}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-4 w-4 p-0 hover:bg-sky-200"
                                    onClick={() => setSearchQuery("")}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </Badge>
                        )}
                        {selectedStatusFilter !== "All" && (
                            <Badge variant="secondary" className="flex items-center gap-1 bg-sky-100 text-sky-700">
                                Status: {selectedStatusFilter}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-4 w-4 p-0 hover:bg-sky-200"
                                    onClick={() => setSelectedStatusFilter("All")}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </Badge>
                        )}
                        {selectedPlatform !== "All" && (
                            <Badge variant="secondary" className="flex items-center gap-1 bg-sky-100 text-sky-700">
                                Platform: {selectedPlatform.replace('_', ' ')}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-4 w-4 p-0 hover:bg-sky-200"
                                    onClick={() => setSelectedPlatform("All")}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </Badge>
                        )}
                    </div>
                )}
            </div>

            {/* Results count */}
            <div className="flex items-center justify-between">
                <div className="text-sm text-sky-600 font-medium">
                    {isLoading ? "Loading..." : `Found ${filteredMeetings.length} meetings`}
                </div>
                {isLoading && (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-sky-600 border-t-transparent" />
                )}
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-sky-600" />
                </div>
            ) : (
                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date & Time</TableHead>
                                    <TableHead>Platform</TableHead>
                                    <TableHead>Duration</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Notes</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredMeetings.length > 0 ? (
                                    filteredMeetings.map((meeting) => (
                                        <TableRow key={meeting._id}>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4 text-sky-600" />
                                                        <span>{format(new Date(meeting.requested_date), 'MMM d, yyyy')}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="h-4 w-4 text-sky-600" />
                                                        <span>{format(new Date(`2000-01-01T${meeting.requested_time}`), 'h:mm a')}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Video className="h-4 w-4 text-sky-600" />
                                                    <span>{getPlatformIcon(meeting.platform)} {meeting.platform.replace('_', ' ')}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{meeting.duration} min</TableCell>
                                            <TableCell>{getStatusBadge(meeting.status as MeetingStatus)}</TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    {meeting.admin_notes && (
                                                        <p className="text-sm text-sky-600">Admin: {meeting.admin_notes}</p>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {meeting.status === 'pending' && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        onClick={() => handleCancelMeeting(meeting._id)}
                                                    >
                                                        Cancel Request
                                                    </Button>
                                                )}
                                                {meeting.meeting_link && meeting.status === 'approved' && (
                                                    <a
                                                        href={meeting.meeting_link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm text-sky-600 hover:text-sky-700 underline"
                                                    >
                                                        Join Meeting
                                                    </a>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-sky-600">
                                            {isLoading ? (
                                                <div className="flex flex-col items-center gap-2">
                                                    <Loader2 className="h-6 w-6 animate-spin" />
                                                    <p>Loading meetings...</p>
                                                </div>
                                            ) : (
                                                <>
                                                    No meetings found
                                                    {searchQuery || selectedStatusFilter !== "All" || selectedPlatform !== "All" ? (
                                                        <p className="text-sky-500 mt-2">Try adjusting your search or filters</p>
                                                    ) : (
                                                        <p className="text-sky-500 mt-2">Click the Request Meeting button to schedule a new meeting</p>
                                                    )}
                                                </>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
    );
} 