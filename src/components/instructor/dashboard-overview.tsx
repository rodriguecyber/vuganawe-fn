"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { BookOpen, Users, Clock, Award, TrendingUp, BarChart2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";

interface IDashboard {
  levels: number;
  students: number;
  hours: number;
  certified?: number;
  active?: number;
  completed?: number;
}

export const DashboardOverview = () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [dashboard, setDashboard] = useState<IDashboard>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/progress/dashboard`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.data) {
        setDashboard(response.data);
      } else {
        throw new Error("Invalid response data");
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg">
        <p className="font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 bg-gray-50">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total levels</CardTitle>
            <BookOpen className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">{dashboard?.levels || 0}</div>
            <p className="text-sm text-gray-500 mt-1">Active levels</p>
          </CardContent>
        </Card>

        <Card className="bg-white hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Students</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">{dashboard?.students || 0}</div>
            <p className="text-sm text-gray-500 mt-1">
              {dashboard?.active || 0} Active Students
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Hours of Content</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">{dashboard?.hours || 0}</div>
            <p className="text-sm text-gray-500 mt-1">Total Learning Hours</p>
          </CardContent>
        </Card>

        <Card className="bg-white hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Certified Students</CardTitle>
            <Award className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">{dashboard?.certified || 0}</div>
            <p className="text-sm text-gray-500 mt-1">level Completions</p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-white hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">level Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Overall Completion</span>
                <span className="font-medium text-gray-800">{(dashboard?.completed || 0)/(dashboard?.students || 0)}%</span>
              </div>
              <Progress
                value={dashboard?.completed|| 0}
                className="h-2"
                style={{
                  backgroundColor: '#E5E7EB',
                  '--progress-color': '#F97316'
                } as React.CSSProperties}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">Student Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-orange-500" />
                  <span className="text-sm text-gray-600">Active Students</span>
                </div>
                <span className="font-medium text-gray-800">{dashboard?.active || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BarChart2 className="h-5 w-5 text-blue-500" />
                  <span className="text-sm text-gray-600">Completion Rate</span>
                </div>
                <span className="font-medium text-gray-800">{(dashboard?.completed || 0)/(dashboard?.students || 0)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};