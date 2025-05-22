"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Plus, X, FileText } from 'lucide-react';
import { LessonList } from "../lessons/lesson-list";
import { useState } from "react";
import { useLevels } from "@/lib/hooks/use-levels";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  duration_minutes: z.string().transform((val) => parseInt(val, 10)),
  content: z.string().min(1, "Content is required"),
  video: z.instanceof(File).optional(),
});

interface Module {
  _id: string;
  title: string;
  description: string;
  order_index: number;
  lessons: any[];
}

export function ModuleList({
  modules,
  levelId,
}: {
  modules: Module[];
  levelId: string;
}) {
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [isAddLessonOpen, setIsAddLessonOpen] = useState(false);
  const [currentModuleId, setCurrentModuleId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { createLesson, loadLessons } = useLevels();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      duration_minutes: 0,
      content: "",
    },
  });

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!currentModuleId) return;

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    const values = form.getValues();
    const { title, content, duration_minutes, video } = values;

    try {
      await createLesson(currentModuleId, title, content, duration_minutes, video || null);
      await loadLessons(currentModuleId);
      setSuccess(true);
      form.reset();

   
      setTimeout(() => {
        setIsAddLessonOpen(false);
        setCurrentModuleId(null);
        setSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Error creating lesson:", error);
      setError("Failed to create lesson. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return; // Prevent closing while submitting
    setIsAddLessonOpen(false);
    setCurrentModuleId(null);
    form.reset();
    setError(null);
    setSuccess(false);
  };

  return (
    <>
      <Accordion type="single" collapsible className="w-full">
        {modules.map((module) => (
          <AccordionItem key={module._id} value={module._id}>
            <AccordionTrigger
              onClick={() => setActiveModule(module._id)}
              className="hover:no-underline hover:bg-orange-50/50 px-4"
            >
              <div className="flex items-center justify-between w-full pr-4">
                <span className="font-medium text-gray-700 hover:text-orange-500">{module.title}</span>
              </div>
            </AccordionTrigger>
            <div className="flex gap-2 px-4 py-2 bg-orange-50/30">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setCurrentModuleId(module._id);
                  setIsAddLessonOpen(true);
                }}
                className="border-orange-500 text-orange-500 hover:bg-orange-50"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Lesson
              </Button>
              <Link href={`/admin/assignments/${module._id}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-sky-400 text-sky-500 hover:bg-sky-50"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Assignments
                </Button>
              </Link>
            </div>
            <AccordionContent className="bg-white px-4">
              {activeModule === module._id && (
                <div className="mt-4">
                  <LessonList lessons={module.lessons} moduleId={module._id} />
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Popup Dialog */}
      {isAddLessonOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            {/* Dialog Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold text-orange-500">Add New Lesson</h2>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                disabled={isSubmitting}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Dialog Content */}
            <div className="p-6">
              <div className="space-y-6">
                {error && (
                  <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="p-3 bg-green-50 text-green-600 rounded-md text-sm">
                    Lesson created successfully!
                  </div>
                )}

                {/* Title Field */}
                <div className="space-y-2">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Lesson Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter lesson title"
                    {...form.register("title")}
                    disabled={isSubmitting}
                  />
                  {form.formState.errors.title && (
                    <p className="text-sm text-red-600">{form.formState.errors.title.message}</p>
                  )}
                </div>

                {/* Content Type Field
                <div className="space-y-2">
                  <label htmlFor="content_type" className="block text-sm font-medium text-gray-700">
                    Content Type
                  </label>
                  <select
                    id="content_type"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    {...form.register("content_type")}
                    disabled={isSubmitting}
                  >
                    <option value="text">Text</option>
                    <option value="video">Video</option>
                    <option value="audio">Audio</option>
                  </select>
                  {form.formState.errors.content_type && (
                    <p className="text-sm text-red-600">{form.formState.errors.content_type.message}</p>
                  )}
                </div> */}

                {/* Duration Field */}
                <div className="space-y-2">
                  <label htmlFor="duration_minutes" className="block text-sm font-medium text-gray-700">
                    Duration (minutes)
                  </label>
                  <input
                    id="duration_minutes"
                    type="number"
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    {...form.register("duration_minutes")}
                    disabled={isSubmitting}
                  />
                  {form.formState.errors.duration_minutes && (
                    <p className="text-sm text-red-600">{form.formState.errors.duration_minutes.message}</p>
                  )}
                </div>

                {/* Content Field */}
                <div className="space-y-2">
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                    Content
                  </label>
                  <input
                    id="content"
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder={
                       "Enter lesson content "
                       
                    }
                    {...form.register("content")}
                    disabled={isSubmitting}
                  />
                  {form.formState.errors.content && (
                    <p className="text-sm text-red-600">{form.formState.errors.content.message}</p>
                  )}
                </div>

               
                  <div className="space-y-2">
                    <label htmlFor="video" className="block text-sm font-medium text-gray-700">
                      Upload Video
                    </label>
                    <input
                      id="video"
                      type="file"
                      accept="video/*"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      onChange={(e) => {
                        if (e.target.files) {
                          form.setValue("video", e.target.files[0]);
                        }
                      }}
                      disabled={isSubmitting}
                    />
                    {form.formState.errors.video && (
                      <p className="text-sm text-red-600">{form.formState.errors.video.message}</p>
                    )}
                  </div>
                

                {/* Submit Button */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full px-4 py-2 text-white bg-orange-500 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Lesson...
                    </span>
                  ) : (
                    'Create Lesson'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

