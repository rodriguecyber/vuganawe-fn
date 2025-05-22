"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Clock, Award, BookMarked, Calendar, Target, Play, GraduationCap, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useAuth } from "@/lib/context/auth-context";
import LevelPopup from "@/components/level-component";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useLevels } from "@/lib/hooks/use-levels";

export interface IEnrollment {
  user_id: string;
  level_id: { _id: string, title: string, difficulty_level: string, thumbnail: string };
  totalLessons: number;
  completedLessons: number;
  lastAccessed: Date;
  enrolled_at: Date;
  status: string;
  completion_date?: Date;
  progress_percentage: number;
}

export function DashboardOverview() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL
  const [dashboard, setDashboard] = useState<IEnrollment>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState(false);
  const { user } = useAuth();
  const {
    lessonProgress,
    loadLessons,
    loadModules,
    modules
  } = useLevels();



  const fetchDashboard = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/progress/dashboard`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.data && !Array.isArray(response.data)) {
        setDashboard(response.data);
      } else {

        setDashboard({
          user_id: user?._id || "",
          level_id: { _id: "", title: "", difficulty_level: "", thumbnail: "" },
          totalLessons: 0,
          completedLessons: 0,
          lastAccessed: new Date(),
          enrolled_at: new Date(),
          status: "Not Started",
          progress_percentage: 0,
        })
      }
    } catch (error) {
      setError("Error fetching dashboard data");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);
  useEffect(() => {
    loadModules(dashboard?.level_id._id as string);
  }, [dashboard?.level_id._id as string]);
  useEffect(() => {
    if (modules.length > 0) {
      modules.forEach((module) => {
        loadLessons(module._id);
      });
    }
  }, [modules]);
  console.log(lessonProgress)
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // Error state handling
  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg">
        <p className="font-medium">{error}</p>
      </div>
    );
  }

  // Empty state handling - no enrollment
  if (!dashboard?.level_id?._id) {
    return (
      <div className="space-y-8 p-6 bg-gray-50">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">My Learning Dashboard</h1>
        </div>

        <Card className="bg-white hover:shadow-lg transition-shadow duration-200">
          <div className="p-8 text-center">
            <div className="mx-auto w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-6">
              <GraduationCap className="h-12 w-12 text-orange-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Start Your Learning Journey</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              You haven't enrolled in any courses yet. Choose a level to begin your Kinyarwanda learning journey and track your progress.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Dialog open={isEnrollDialogOpen} onOpenChange={setIsEnrollDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Enroll in a Level
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Choose Your Learning Level</DialogTitle>
                  </DialogHeader>
                  <LevelPopup isOpen={isEnrollDialogOpen} closePopup={() => setIsEnrollDialogOpen(false)} />
                </DialogContent>
              </Dialog>
              <Button variant="outline" className="px-6 py-3" onClick={() => window.location.href = '/free-courses'}>
                <Play className="h-5 w-5 mr-2" />
                Try Free Courses
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="bg-white hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Structured Learning</CardTitle>
              <BookOpen className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Follow our carefully designed curriculum to master Kinyarwanda step by step.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Track Progress</CardTitle>
              <Target className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Monitor your learning journey with detailed progress tracking and achievements.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Get Certified</CardTitle>
              <Award className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Earn certificates as you complete levels and showcase your language proficiency.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 bg-gray-50">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">My Learning Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last accessed: {dashboard?.lastAccessed ? new Date(dashboard.lastAccessed).toLocaleDateString() : 'N/A'}
        </div>
      </div>

      <Card className="bg-white hover:shadow-lg transition-shadow duration-200">
        <div className="grid md:grid-cols-3 gap-6 p-6">
          <div className="relative h-48 rounded-lg overflow-hidden">
            <Image
              src={dashboard?.level_id?.thumbnail || '/placeholder-level.jpg'}
              alt={dashboard?.level_id?.title || 'level thumbnail'}
              fill
              className="object-cover"
            />
          </div>

          <div className="md:col-span-2 space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{dashboard?.level_id?.title}</h2>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-gray-600">
                    {modules.reduce((t, m) => {
                      return t + m.lessons.length
                    }, 0)} Lessons
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">level Progress</span>
                <span className="font-medium text-gray-800">{dashboard?.progress_percentage}%</span>
              </div>
              <Progress
                value={dashboard?.progress_percentage || 0}
                className="h-2"
                style={{
                  backgroundColor: '#E5E7EB',
                  '--progress-color': dashboard?.progress_percentage === 100 ? '#10B981' : '#F97316'
                } as React.CSSProperties}
              />
            </div>

            <Button
              className="w-full md:w-auto bg-orange-500 hover:bg-orange-600 text-white"
              onClick={() => {
                window.location.href = `/student/levels/${dashboard?.level_id?._id}/`;
              }}
            >
              <Play className="h-4 w-4 mr-2" />
              Continue Learning
            </Button>
            
          </div>
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Current Plan</CardTitle>
            <BookOpen className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">{user?.current_plan.toUpperCase()}</div>
            <p className="text-sm text-gray-500 mt-1">Enrolled on {new Date(dashboard?.enrolled_at || '').toLocaleDateString()}</p>
          </CardContent>
        </Card>

        <Card className="bg-white hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Status</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">{dashboard?.status || 'Not Started'}</div>
            <p className="text-sm text-gray-500 mt-1">level Progress</p>
          </CardContent>
        </Card>

        <Card className="bg-white hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
            <BookMarked className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">{dashboard?.completedLessons || 0}</div>
            <p className="text-sm text-gray-500 mt-1">of {dashboard?.totalLessons || 0} lessons</p>
          </CardContent>
        </Card>

        <Card className="bg-white hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Certificates</CardTitle>
            <Award className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">{dashboard?.completedLessons === dashboard?.totalLessons ? 'Available' : 'In Progress'}</div>
            <p className="text-sm text-gray-500 mt-1">level Completion</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Learning Progress</h2>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>Expected completion: {dashboard?.completion_date ? new Date(dashboard.completion_date).toLocaleDateString() : 'Not set'}</span>
          </div>
        </div>

        <div className="grid gap-6">
          {dashboard ? (
            <Card className="bg-white hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-orange-100 rounded-full">
                      <Target className="h-6 w-6 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Remaining Lessons</p>
                      <p className="text-xl font-bold text-gray-800">{modules.reduce((t, m) => {
                      return t + m.lessons.length
                    },0) - dashboard?.completedLessons}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Clock className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Last Activity</p>
                      <p className="text-xl font-bold text-gray-800">{new Date(dashboard?.lastAccessed || '').toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-green-100 rounded-full">
                      <Award className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Completion Status</p>
                      <p className="text-xl font-bold text-gray-800">{dashboard?.status}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="p-4 bg-gray-50 text-gray-600 rounded-lg">No dashboard data available</div>
          )}
        </div>
      </div>
    </div>
  );
}
