"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CheckCircle2, PlayCircle, FileText, Download } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data - replace with actual API calls
const courseData = {
  id: "1",
  title: "Web Development Fundamentals",
  progress: 65,
  modules: [
    {
      id: "m1",
      title: "Introduction to HTML",
      completed: true,
      lessons: [
        {
          id: "l1",
          title: "HTML Basics",
          duration: "15 mins",
          completed: true,
          type: "video",
        },
        {
          id: "l2",
          title: "HTML Forms",
          duration: "20 mins",
          completed: true,
          type: "video",
        },
      ],
    },
    {
      id: "m2",
      title: "CSS Fundamentals",
      completed: false,
      lessons: [
        {
          id: "l3",
          title: "CSS Selectors",
          duration: "25 mins",
          completed: false,
          type: "video",
        },
        {
          id: "l4",
          title: "CSS Box Model",
          duration: "20 mins",
          completed: false,
          type: "video",
        },
      ],
    },
  ],
};

export function CourseView({ courseId }: { courseId: string }) {
  const [activeLesson, setActiveLesson] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{courseData.title}</h1>
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Overall Progress</span>
            <span>{courseData.progress}%</span>
          </div>
          <Progress value={courseData.progress} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {activeLesson ? (
            <div className="space-y-4">
              <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                <PlayCircle className="h-16 w-16 text-white opacity-50" />
              </div>
              <h2 className="text-xl font-semibold">Lesson Title</h2>
              <div className="prose max-w-none">
                <p>Lesson content goes here...</p>
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
            {courseData.modules.map((module) => (
              <AccordionItem key={module.id} value={module.id}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    {module.completed && (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                    <span>{module.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pt-2">
                    {module.lessons.map((lesson) => (
                      <button
                        key={lesson.id}
                        onClick={() => setActiveLesson(lesson.id)}
                        className={cn(
                          "flex items-center gap-3 w-full rounded-lg p-2 text-sm transition-colors hover:bg-gray-100",
                          activeLesson === lesson.id && "bg-gray-100"
                        )}
                      >
                        {lesson.type === "video" ? (
                          <PlayCircle className="h-4 w-4" />
                        ) : (
                          <FileText className="h-4 w-4" />
                        )}
                        <div className="flex-1 text-left">
                          <div>{lesson.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {lesson.duration}
                          </div>
                        </div>
                        {lesson.completed && (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        )}
                      </button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="space-y-4">
            <h3 className="font-semibold">Resources</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Course Slides
                <Download className="ml-auto h-4 w-4" />
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Exercise Files
                <Download className="ml-auto h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}