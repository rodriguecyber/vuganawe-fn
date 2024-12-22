"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CheckCircle2, PlayCircle, FileText, Download, PauseCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCourses } from "@/lib/hooks/use-courses";
import { Card } from "@/components/ui/card";

export function CourseView({ courseId }: { courseId: string }) {
  const [activeLesson, setActiveLesson] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  
  const {
    currentCourse,
    modules ,  
    lessons , 
    resources , 
    progress ,
    lessonProgress ,
    loadCourse,
    loadModules,
    loadLessons,
    loadResources,
    updateProgress,
    isLoading,
  } = useCourses();

  useEffect(() => {
    loadCourse(courseId);
    loadModules(courseId);
  }, [courseId]);

  useEffect(() => {
    if (modules.length > 0) {
      modules.forEach((module) => {
        loadLessons(module._id);
      });
    }
  }, [modules]);

  useEffect(() => {
    if (activeLesson) {
      loadResources(activeLesson);
    }
  }, [activeLesson]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const renderVideoPlayer = (videoUrl: string) => {
    if (videoUrl && videoUrl.endsWith(".mp4")) {
      return (
        <video
          ref={videoRef}
          controls
          className="w-full h-full object-cover"
          src={videoUrl}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        >
          Your browser does not support the video tag.
        </video>
      );
    }

    return (
      <iframe
        className="w-full h-full rounded-lg"
        src={videoUrl}
        frameBorder="0"
        allow="autoplay; fullscreen"
        allowFullScreen
      />
    );
  };

  if (isLoading || !currentCourse) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 bg-gray-200 rounded" />
          <div className="h-4 w-96 bg-gray-100 rounded" />
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="aspect-video bg-gray-200 rounded-lg animate-pulse" />
          </div>
          <Card className="p-6">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-full h-12 bg-gray-100 animate-pulse rounded-md" />
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const courseProgress = progress[courseId];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{currentCourse.title}</h1>
        {courseProgress && (
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>{courseProgress.progress_percentage||0}%</span>
            </div>
            <Progress value={courseProgress.progress_percentage || 0} />
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {activeLesson ? (
            <div className="space-y-4">
              <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center relative">
                {modules
                  .flatMap((module) => module.lessons)
                  .find((lesson) => lesson._id === activeLesson)?.video_url ? (
                  renderVideoPlayer(
                    modules
                      .flatMap((module) => module.lessons)
                      .find((lesson) => lesson._id === activeLesson)?.video_url || ""
                  )
                ) : (
                  <PlayCircle className="h-16 w-16 text-white opacity-50" />
                )}

                {modules
                  .flatMap((module) => module.lessons)
                  .find((lesson) => lesson._id === activeLesson)?.video_url && (
                  <button
                    onClick={handlePlayPause}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 text-white opacity-75 hover:opacity-100 transition-opacity"
                  >
                    {isPlaying ? (
                      <PauseCircle className="h-16 w-16" />
                    ) : (
                      <PlayCircle className="h-16 w-16" />
                    )}
                  </button>
                )}
              </div>
              <h2 className="text-xl font-semibold">
                {modules
                  .flatMap((module) => module.lessons)
                  .find((lesson) => lesson._id === activeLesson)?.title}
              </h2>
              <div className="prose max-w-none">
                {modules
                  .flatMap((module) => module.lessons)
                  .find((lesson) => lesson._id === activeLesson)?.content}
              </div>
            </div>
          ) : (
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Select a lesson to start learning</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Course Content</h2>
          <Accordion type="single" collapsible className="w-full">
            {modules.sort((a, b) => a.order_index - b.order_index).map((module) => (
              <AccordionItem key={module._id} value={module._id}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <span>{module.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pt-2">
                    {(lessons[module._id] || []).map((lesson) => {
                      const progress = lessonProgress[lesson._id] || {};  
                      return (
                        <button
                          key={lesson._id}
                          onClick={() => {
                            setActiveLesson(lesson._id);
                            if (!progress?.is_completed) {
                              updateProgress(lesson._id, {
                                is_completed: true,
                                last_accessed: new Date(),
                              });
                            }
                          }}
                          className={cn(
                            "flex items-center gap-3 w-full rounded-lg p-2 text-sm transition-colors hover:bg-gray-100",
                            activeLesson === lesson._id && "bg-gray-100"
                          )}
                        >
                          {lesson.content_type === "video" ? (
                            <PlayCircle className="h-4 w-4" />
                          ) : (
                            <FileText className="h-4 w-4" />
                          )}
                          <div className="flex-1 text-left">
                            <div>{lesson.title}</div>
                            <div className="text-xs text-muted-foreground">
                              {lesson.duration_minutes ||0} mins
                            </div>
                          </div>

                          {progress?.is_completed && (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {activeLesson && resources[activeLesson] && resources[activeLesson].length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold">Resources</h3>
              <div className="space-y-2">
                {resources[activeLesson].map((resource) => (
                  <Button
                    key={resource._id}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    {resource.title}
                    <Download className="ml-auto h-4 w-4" />
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
