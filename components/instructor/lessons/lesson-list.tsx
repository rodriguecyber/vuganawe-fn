"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Video, FileText, Music } from "lucide-react";
import { ResourceList } from "../resources/resource-list";

const contentTypeIcons = {
  video: Video,
  text: FileText,
  audio: Music,
};

interface Lesson {
  id: string;
  title: string;
  content_type: keyof typeof contentTypeIcons;
  duration_minutes: number;
}

export function LessonList({
  lessons,
  moduleId,
}: {
  lessons: Lesson[];
  moduleId: string;
}) {
  return (
    <div className="space-y-4">
      {lessons.map((lesson) => {
        const Icon = contentTypeIcons[lesson.content_type];
        return (
          <Card key={lesson.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                <Icon className="h-4 w-4" />
                <CardTitle className="text-base">{lesson.title}</CardTitle>
              </div>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Resource
              </Button>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Duration: {lesson.duration_minutes} minutes
              </CardDescription>
              <div className="mt-4">
                <ResourceList lessonId={lesson.id} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}