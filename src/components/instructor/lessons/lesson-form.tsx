"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useLevels } from "@/lib/hooks/use-levels";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content_type: z.enum(["text", "video", "audio"]),
  duration_minutes: z.string().transform((val) => parseInt(val, 10)),
  content: z.string().min(1, "Content is required"),
  video: z.instanceof(File).optional(),
});

export function LessonForm({
  moduleId,
  onSuccess,
}: {
  moduleId: string;
  onSuccess: () => void;
}) {
  const { createLesson } = useLevels();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content_type: "text",
      duration_minutes: 0,
      content: "",
    },
  });

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const values = form.getValues();
    const { title, content, content_type, duration_minutes, video } = values;

    try {
      await createLesson(moduleId, title, content, duration_minutes, video || null);
      form.reset();
      setTimeout(() => {
        onSuccess();
      }, 1000);
    } catch (error) {
      console.error("Error creating lesson:", error);
      setError("Failed to create lesson. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="space-y-6">
        {error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">
            {error}
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

        {/* Content Type Field */}
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
        </div>

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
              form.watch("content_type") === "video"
                ? "Enter video URL"
                : "Enter content"
            }
            {...form.register("content")}
            disabled={isSubmitting}
          />
          {form.formState.errors.content && (
            <p className="text-sm text-red-600">{form.formState.errors.content.message}</p>
          )}
        </div>

        {/* Video Upload Field */}
        {form.watch("content_type") === "video" && (
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
        )}

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
  );
}
