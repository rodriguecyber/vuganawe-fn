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
import { useLevels } from "@/lib/hooks/use-levels";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";

export function LevelView({ levelId }: { levelId: string }) {
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
    currentLevel,
    modules,
    lessons,
    resources,
    progress,
    lessonProgress,
    loadLevel,
    loadModules,
    loadLessons,
    loadResources,
    updateProgress,
    isLoading,
  } = useLevels();

  useEffect(() => {
    loadLevel(levelId);
    loadModules(levelId);
  }, [levelId]);

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
          throw error
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
            watchedDuration: Math.max(watchedDuration, newCurrentTime),

          }));
        } catch (error) {
          throw error
        }

        if (progress >= 0.9) {
          updateProgress(activeLesson, {
            is_completed: true,
            last_accessed: new Date(),
            time_spent: Math.max(watchedDuration, newCurrentTime)
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
                  {isPlaying ? <PauseCircle className="h-6 w-6 text-white hover:text-black" /> : <PlayCircle className="h-6 text-white hover:text-black w-6" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={toggleMute}>
                  {isMuted ? <VolumeX className="h-6 w-6 text-white hover:text-black" /> : <Volume2 className="h-6 w-6 text-white hover:text-black" />}
                </Button>
                <Slider
                  className="w-24  "
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
                    <Settings className="h-4 w-4 text-white hover:text-black" />
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

  if (isLoading || !currentLevel) {
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

  const levelProgress = progress[levelId];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold text-orange-500">{currentLevel.title}</h1>
        <p className="text-gray-600 mt-2">{currentLevel.description}</p>
        {levelProgress && (
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Overall Progress</span>
              <span className="text-orange-500 font-semibold">{levelProgress.progress_percentage || 0}%</span>
            </div>
            
            <Progress className="h-2 bg-orange-100" value={levelProgress.progress_percentage || 0} />
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {activeLesson ? (
            <div className="space-y-4">
              <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden">
                {modules
                  .flatMap((module) => module.lessons)
                  .find((lesson) => lesson._id === activeLesson)?.video_url ? (
                  renderVideoPlayer(
                    modules
                      .flatMap((module) => module.lessons)
                      .find((lesson) => lesson._id === activeLesson)?.video_url || ""
                  )
                ) : (
                  <div className="text-center">
                    <PlayCircle className="h-16 w-16 text-white opacity-50 mx-auto mb-2" />
                    <p className="text-white opacity-75">No video available</p>
                  </div>
                )}
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold text-orange-500 mb-4">
                  {modules
                    .flatMap((module) => module.lessons)
                    .find((lesson) => lesson._id === activeLesson)?.title}
                </h2>
                <div className="prose max-w-none text-gray-600">
                  {modules
                    .flatMap((module) => module.lessons)
                    .find((lesson) => lesson._id === activeLesson)?.content}
                </div>
              </div>
            </div>
          ) : (
            <div className="aspect-video bg-white rounded-lg shadow-sm flex items-center justify-center">
              <div className="text-center">
                <PlayCircle className="h-16 w-16 text-orange-500 opacity-50 mx-auto mb-2" />
                <p className="text-gray-600">Select a lesson to start learning</p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <Card className="p-4">
            <h2 className="text-xl font-semibold text-orange-500 mb-4">Level Content</h2>
            <Accordion type="single" collapsible className="w-full">
              {modules.sort((a, b) => a.order_index - b.order_index).map((module) => (
                <AccordionItem key={module._id} value={module._id} className="border-b border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <AccordionTrigger className="hover:no-underline py-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{module.title}</span>
                      </div>
                    </AccordionTrigger>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-orange-500 text-orange-500 hover:bg-orange-50"
                      onClick={() => window.location.href = `/student/assignments/${module._id}`}
                    >
                      View Assignment
                    </Button>
                  </div>
                  <AccordionContent>
                    <div className="space-y-2 pt-2">
                      {(lessons[module._id] || [])
                        .sort((a, b) => a.order_index - b.order_index)
                        .map((lesson) => {
                          const progress = lessonProgress[lesson._id] || {};
                          return (
                            <button
                              key={lesson._id}
                              onClick={() => setActiveLesson(lesson._id)}
                              className={cn(
                                "flex items-center gap-3 w-full rounded-lg p-3 text-sm transition-colors",
                                activeLesson === lesson._id
                                  ? "bg-orange-50 text-orange-500"
                                  : "hover:bg-gray-50",
                                progress?.is_completed && "bg-green-50"
                              )}
                            >
                              {lesson.content_type === "video" ? (
                                <PlayCircle className={cn(
                                  "h-4 w-4",
                                  activeLesson === lesson._id && "text-orange-500",
                                  progress?.is_completed && "text-green-500"
                                )} />
                              ) : (
                                <FileText className={cn(
                                  "h-4 w-4",
                                  activeLesson === lesson._id && "text-orange-500",
                                  progress?.is_completed && "text-green-500"
                                )} />
                              )}
                              <div className="flex-1 text-left">
                                <div className={cn(
                                  activeLesson === lesson._id && "text-orange-500",
                                  progress?.is_completed && "text-green-500"
                                )}>{lesson.title}</div>
                                <div className="text-xs text-gray-500">
                                  {lesson.duration_minutes || 0} mins
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
          </Card>

          {activeLesson && resources[activeLesson]?.length > 0 && (
            <Card className="p-4">
              <h3 className="font-semibold text-orange-500 mb-4">Resources</h3>
              <div className="space-y-2">
                {resources[activeLesson].map((resource) => (
                  <Button
                    key={resource._id}
                    variant="outline"
                    className="w-full justify-start border-gray-200 hover:bg-gray-50 hover:border-orange-500"
                  >
                    <FileText className="mr-2 h-4 w-4 text-orange-500" />
                    <span className="flex-1 text-left">{resource.title}</span>
                    <Download className="ml-auto h-4 w-4 text-gray-400" />
                  </Button>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

