"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLevels } from "@/lib/hooks/use-levels";

export function ModuleForm({
  levelId,
  onSuccess,
}: {
  levelId: string;
  onSuccess: () => void;
}) {
  const { createModule } = useLevels();
  
  // Local state for form inputs
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [durationHours, setDurationHours] = useState(1);

  // Local state for form validation error messages
  const [errors, setErrors] = useState<{ title?: string; description?: string; durationHours?: string }>({
    title: "",
    description: "",
    durationHours: "",
  });

  // Handle form submission
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Simple validation
    const newErrors: any = {};
    if (!title) newErrors.title = "Title is required";
    if (!description) newErrors.description = "Description is required";
    if (durationHours < 1) newErrors.durationHours = "Duration must be at least 1 hour";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await createModule(levelId, title, description, durationHours);
      onSuccess();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="title" className="block">Module Title</label>
        <Input
          id="title"
          placeholder="Enter module title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full"
        />
        {errors.title && <p className="text-red-600 text-sm">{errors.title}</p>}
      </div>
      
      <div>
        <label htmlFor="description" className="block">Description</label>
        <Textarea
          id="description"
          placeholder="Enter module description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full"
        />
        {errors.description && <p className="text-red-600 text-sm">{errors.description}</p>}
      </div>

      <div>
        <label htmlFor="duration_hours" className="block">Duration (Hours)</label>
        <Input
          id="duration_hours"
          type="number"
          value={durationHours}
          onChange={(e) => setDurationHours(parseInt(e.target.value, 10))}
          min="1"
          className="w-full"
        />
        {errors.durationHours && <p className="text-red-600 text-sm">{errors.durationHours}</p>}
      </div>

      <Button type="submit" onClick={onSubmit} className="w-full">
        Create Module
      </Button>
    </div>
  );
}
