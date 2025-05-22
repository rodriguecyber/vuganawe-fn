"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { PlayCircle, BookOpen, Clock, Award, GraduationCap } from "lucide-react";
import Link from "next/link";
import { useLevels } from "@/lib/hooks/use-levels";
import LevelPopup from "../level-component";

const difficultyColors = {
  beginner: "bg-green-50 text-green-600",
  intermediate: "bg-orange-50 text-orange-600",
  advanced: "bg-red-50 text-red-600",
};

export function LevelList() {
  const { levels, progress, loadLevels, isLoading } = useLevels();
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  useEffect(() => {
    loadLevels();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-64 bg-gray-200 animate-pulse rounded-lg" />
          <div className="w-32 h-10 bg-gray-200 animate-pulse rounded-lg" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="h-48 bg-gray-200 animate-pulse" />
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="h-6 w-3/4 bg-gray-100 animate-pulse rounded-lg" />
                  <div className="h-4 w-full bg-gray-100 animate-pulse rounded-lg" />
                  <div className="h-2 w-full bg-gray-200 animate-pulse rounded-lg" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white p-6 rounded-lg shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-orange-500">My Learning</h1>
          <p className="text-gray-600 mt-1">Continue your learning journey</p>
        </div>
        <button
          onClick={openPopup}
          className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors"
        >
          Explore More Levels
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {levels.map((level) => {
          const levelProgress = progress[level._id] || {
            progress_percentage: 0,
            completedLessons: 0,
            totalLessons: 0
          };

          return (
            <Card key={level._id} className="overflow-hidden bg-white">
              <div className="relative h-48">
                <img
                  src={level.thumbnail || "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500&h=300&fit=crop"}
                  alt={level.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-semibold text-white truncate">{level.title}</h3>
                  <div className="flex items-center mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full capitalize ${difficultyColors[level.difficulty_level]}`}>
                      <GraduationCap className="w-3 h-3 inline-block mr-1" />
                      {level.difficulty_level}
                    </span>
                  </div>
                </div>
              </div>

              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <BookOpen className="h-5 w-5 text-orange-500 mx-auto mb-1" />
                    <p className="text-sm text-gray-600">Lessons</p>
                    <p className="font-semibold text-orange-600">
                      {levelProgress.completedLessons || 0}/{levelProgress.totalLessons || 0}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-sky-50 rounded-lg">
                    <Clock className="h-5 w-5 text-sky-500 mx-auto mb-1" />
                    <p className="text-sm text-gray-600">Hours</p>
                    <p className="font-semibold text-sky-600">{level.duration || 0}h</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-600">Progress</span>
                    <span className="text-orange-500 font-semibold">
                      {levelProgress.progress_percentage || 0}%
                    </span>
                  </div>
                  <Progress
                    className="h-2 bg-orange-100"
                    value={levelProgress.progress_percentage || 0}
                  />
                </div>

                <Link href={`/student/levels/${level._id}`}>
                  <Button className="w-full bg-orange-500 hover:bg-orange-600">
                    {levelProgress.progress_percentage > 0 ? (
                      <>
                        <PlayCircle className="mr-2 h-4 w-4" />
                        Continue Learning
                      </>
                    ) : (
                      <>
                        <Award className="mr-2 h-4 w-4" />
                        Start level
                      </>
                    )}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <LevelPopup isOpen={isPopupOpen} closePopup={closePopup} />
    </div>
  );
}