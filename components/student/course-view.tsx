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
import { CheckCircle2, PlayCircle, FileText, Download, PauseCircle, Settings, Volume2, VolumeX } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useCourses } from "@/lib/hooks/use-courses";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";

export function CourseView({ courseId }: { courseId: string }) {
  const [activeLesson, setActiveLesson] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoQuality, setVideoQuality] = useState<string>("auto");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [watchedDuration, setWatchedDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  
  const {
    currentCourse,
    modules,
    lessons,
    resources,
    progress,
    lessonProgress,
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
      const savedProgress = localStorage.getItem(`videoProgress_${activeLesson}`);
      if (savedProgress) {
        try {
          const { currentTime, watchedDuration } = JSON.parse(savedProgress);
          setCurrentTime(currentTime || 0);
          setWatchedDuration(watchedDuration || 0);
          if (videoRef.current && isFinite(currentTime)) {
            videoRef.current.currentTime = currentTime;
          }
        } catch (error) {
          console.error("Error loading saved progress:", error);
        }
      }
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

  const handleVideoProgress = () => {
    if (videoRef.current && activeLesson) {
      const newCurrentTime = videoRef.current.currentTime;
      if (isFinite(newCurrentTime)) {
        setCurrentTime(newCurrentTime);
        
        if (newCurrentTime > watchedDuration) {
          setWatchedDuration(newCurrentTime);
        }

        const progress = newCurrentTime / videoRef.current.duration;
        try {
          localStorage.setItem(`videoProgress_${activeLesson}`, JSON.stringify({
            currentTime: newCurrentTime,
            watchedDuration: Math.max(watchedDuration, newCurrentTime)
          }));
        } catch (error) {
          console.error("Error saving progress:", error);
        }
        
        if (progress >= 0.9) { // Consider video watched when 90% complete
          updateProgress(activeLesson, {
            is_completed: true,
            last_accessed: new Date(),
          });
        }
      }
    }
  };

  const handleVideoEnded = () => {
    if (activeLesson) {
      updateProgress(activeLesson, {
        is_completed: true,
        last_accessed: new Date(),
      });
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current && progressBarRef.current) {
      const progressBar = progressBarRef.current;
      const rect = progressBar.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const clickedTime = (x / rect.width) * duration;
      
      if (isFinite(clickedTime) && clickedTime <= watchedDuration) {
        videoRef.current.currentTime = clickedTime;
        setCurrentTime(clickedTime);
      }
    }
  };

  const handleVolumeChange = (newVolume: number[]) => {
    if (videoRef.current) {
      const volumeValue = newVolume[0];
      videoRef.current.volume = volumeValue;
      setVolume(volumeValue);
      setIsMuted(volumeValue === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume;
        setIsMuted(false);
      } else {
        videoRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const renderVideoPlayer = (videoUrl: string) => {
    if (videoUrl && videoUrl.endsWith(".mp4")) {
      return (
        <div className="relative">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            src={`${videoUrl}#quality=${videoQuality}`}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onTimeUpdate={handleVideoProgress}
            onLoadedMetadata={() => {
              if (videoRef.current) {
                setDuration(videoRef.current.duration);
              }
            }}
            onEnded={handleVideoEnded}
          >
            Your browser does not support the video tag.
          </video>
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2">
            <div 
              ref={progressBarRef}
              className="h-1 bg-gray-600 cursor-pointer" 
              onClick={handleSeek}
            >
              <div 
                className="h-full bg-white" 
                style={{ width: `${(watchedDuration / duration) * 100}%` }}
              />
              <div 
                className="h-full bg-blue-500" 
                style={{ width: `${(currentTime / duration) * 100}%`, marginTop: '-4px' }}
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center">
                <Button variant="ghost" size="icon" onClick={handlePlayPause}>
                  {isPlaying ? <PauseCircle className="h-6 w-6" /> : <PlayCircle className="h-6 w-6" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={toggleMute}>
                  {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
                </Button>
                <Slider
                  className="w-24"
                  min={0}
                  max={1}
                  step={0.01}
                  value={[isMuted ? 0 : volume]}
                  onValueChange={handleVolumeChange}
                />
              </div>
              <div className="text-white text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onSelect={() => setVideoQuality("auto")}>
                    Auto
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setVideoQuality("high")}>
                    High
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setVideoQuality("medium")}>
                    Medium
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setVideoQuality("low")}>
                    Low
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
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
               <Button variant="outline" style={{ borderColor: 'green', color: 'blue' }} size="sm" onClick={() => window.location.href=`/student/assignments/${module._id}`}>
                    
                    View Assignment
                 </Button>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <span>{module.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pt-2">
                    {(lessons[module._id] || []).sort((a, b) => a.order_index - b.order_index).map((lesson) => {
                      const progress = lessonProgress[lesson._id] || {};  
                      return (
                        <button
                          key={lesson._id}
                          onClick={() => {
                            setActiveLesson(lesson._id);
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

