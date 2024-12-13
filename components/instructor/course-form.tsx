"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCourses } from "@/lib/hooks/use-courses";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.string().min(1, "Price is required"),
  difficulty_level: z.enum(["beginner", "intermediate", "advanced"]),
  duration_weeks: z.string().min(1, "Duration is required"),
  is_certified: z.boolean().default(false),
  thumbnail: z.any().default(null),  // Allow the file to be handled as any (not array)
});

export function CourseForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      difficulty_level: "beginner",
      duration_weeks: "",
      is_certified: false,
      thumbnail: null,
    },
  });

  const { createCourse } = useCourses();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const formData = new FormData();

      // Append regular fields
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("price", values.price);
      formData.append("difficulty_level", values.difficulty_level);
      formData.append("duration_weeks", values.duration_weeks);
      formData.append("is_certified", String(values.is_certified));

      // Append the file (thumbnail)
      if (values.thumbnail && values.thumbnail[0]) {
        formData.append("thumbnail", values.thumbnail[0]); // Ensure it's a single file
      }

      // Send the formData to the backend
      await createCourse(formData);
      // Optionally, you can reset the form or show a success message
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create New Course</h1>
        <p className="text-muted-foreground">
          Fill in the details below to create a new course.
        </p>
      </div>
      <div className="max-w-2xl">
        <div className="space-y-8">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Course Title
            </label>
            <input
              type="text"
              id="title"
              placeholder="Enter course title"
              {...form.register("title")}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
            {form.formState.errors.title && (
              <p className="text-red-500 text-sm">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              placeholder="Enter course description"
              {...form.register("description")}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
            {form.formState.errors.description && (
              <p className="text-red-500 text-sm">{form.formState.errors.description.message}</p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price Rwf
              </label>
              <input
                type="number"
                id="price"
                placeholder="10000"
                {...form.register("price")}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              />
              {form.formState.errors.price && (
                <p className="text-red-500 text-sm">{form.formState.errors.price.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="difficulty_level" className="block text-sm font-medium text-gray-700">
                Difficulty Level
              </label>
              <select
                id="difficulty_level"
                {...form.register("difficulty_level")}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              {form.formState.errors.difficulty_level && (
                <p className="text-red-500 text-sm">{form.formState.errors.difficulty_level.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="duration_weeks" className="block text-sm font-medium text-gray-700">
              Duration (in weeks)
            </label>
            <input
              type="number"
              id="duration_weeks"
              placeholder="Enter duration in weeks"
              {...form.register("duration_weeks")}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
            {form.formState.errors.duration_weeks && (
              <p className="text-red-500 text-sm">{form.formState.errors.duration_weeks.message}</p>
            )}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_certified"
              {...form.register("is_certified")}
              className="mr-2"
            />
            <label htmlFor="is_certified" className="text-sm">
              Is this course certified?
            </label>
          </div>

          <div>
            <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700">
              Upload Image (Thumbnail)
            </label>
            <input
              type="file"
              id="thumbnail"
              accept="image/*"
              {...form.register("thumbnail")}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>

          <div className="mt-4">
            <button
              type="button"
              onClick={() => onSubmit(form.getValues())}
              className="bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Create Course
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
