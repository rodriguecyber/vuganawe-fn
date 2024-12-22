"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Clock, Award, BookMarked } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import axios from "axios";
import { useEffect, useState } from "react";

export interface IEnrollment {
  user_id: string;
  course_id: {_id:string,title:string};
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
  const [dashboard, setDashboard] = useState<IEnrollment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/progress/dashboard`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.data && Array.isArray(response.data)) {
        setDashboard(response.data);
      } else {
        throw new Error("Invalid response data");
      }
    } catch (error) {
      setError("Error fetching dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // Loading state handling
  if (loading) {
    return <div>Loading...</div>;
  }

  // Error state handling
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Learning Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboard.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboard ? dashboard.filter(dash => dash.status === 'active').length : 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <BookMarked className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboard ? dashboard.filter(dash => dash.status === 'completed').length : 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Certificates</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboard ? dashboard.filter(dash => dash.status === 'completed').length : 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Current Progress</h2>
        <div className="grid gap-6">
          {dashboard && dashboard.length > 0 ? (
            dashboard.map((dash) => (
              <Card key={dash.course_id._id}>
                <CardHeader>
                  <CardTitle>{dash.course_id.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{dash.progress_percentage}%</span>
                    </div>
                    <Progress color="green" value={dash.progress_percentage || 0 } />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div>No dashboard data available</div>
          )}
        </div>
      </div>
    </div>
  );
}
