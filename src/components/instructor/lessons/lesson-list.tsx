"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Video, FileText, Music } from 'lucide-react';
import { ResourceList } from "../resources/resource-list";
import { AddResourceForm } from "../resources/add-resources";

const contentTypeIcons = {
  video: Video,
  text: FileText,
  audio: Music,
};

interface Lesson {
  _id: string;
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
  const [openDialogs, setOpenDialogs] = useState<{ [key: string]: boolean }>({});

  const handleOpenChange = (lessonId: string, isOpen: boolean) => {
    setOpenDialogs((prev) => ({ ...prev, [lessonId]: isOpen }));
  };

  const handleSuccess = (lessonId: string) => {
    handleOpenChange(lessonId, false);
  };

  return (
    <div className="space-y-4">
      {lessons.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No lessons available for this module.</p>
      ) : (
        lessons.map((lesson) => {
          const Icon = contentTypeIcons[lesson.content_type];
          return (
            <Card key={lesson._id} className="border border-gray-100 hover:border-orange-200 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center space-x-2">
                  <Icon className="h-4 w-4 text-orange-500" />
                  <CardTitle className="text-base font-medium text-gray-700">{lesson.title}</CardTitle>
                </div>
                <Dialog
                  open={openDialogs[lesson._id]}
                  onOpenChange={(isOpen) => handleOpenChange(lesson._id, isOpen)}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-sky-400 text-sky-500 hover:bg-sky-50"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Resource
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="text-orange-500">Add Resource</DialogTitle>
                      <DialogDescription>
                        Add a new resource to the lesson &quot;{lesson.title}&quot;.
                      </DialogDescription>
                    </DialogHeader>
                    <AddResourceForm
                      lessonId={lesson._id}
                      onSuccess={() => handleSuccess(lesson._id)}
                    />
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-500">
                  Duration: {lesson.duration_minutes} minutes
                </CardDescription>
                <div className="mt-4">
                  <ResourceList lessonId={lesson._id} />
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}

