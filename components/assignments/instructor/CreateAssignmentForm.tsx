"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { DatePicker } from "@/components/ui/date-picker";

const assignmentSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  due_date: z.date(),
  max_points: z.number().min(1, "Points must be at least 1"),
  requires_file: z.boolean(),
  rubric: z.record(z.string(), z.number()).optional(),
});

type AssignmentFormData = z.infer<typeof assignmentSchema>;

export function CreateAssignmentForm({ moduleId, onSuccess }: { moduleId: string; onSuccess: () => void }) {
  const { toast } = useToast();
  const { control, register, handleSubmit, formState: { errors } } = useForm<AssignmentFormData>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      requires_file: false,
      rubric: {},
    },
  });

  const onSubmit = async (data: AssignmentFormData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/assignments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token || "",
        },
        body: JSON.stringify({ ...data, module_id: moduleId }),
      });

      if (!response.ok) throw new Error("Failed to create assignment");
      
      toast({ title: "Success", description: "Assignment created successfully" });
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create assignment",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Assignment</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              placeholder="Assignment Title"
              {...register("title")}
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <Textarea
              placeholder="Assignment Description"
              {...register("description")}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          <div>
            <Controller
              name="due_date"
              control={control}
              render={({ field }) => (
                <DatePicker
                  label="Due Date"
                  onChange={field.onChange}
                  value={field.value}
                  error={errors.due_date?.message}
                />
              )}
            />
          </div>

          <div>
            <Input
              type="number"
              placeholder="Maximum Points"
              {...register("max_points", { valueAsNumber: true })}
              className={errors.max_points ? "border-red-500" : ""}
            />
            {errors.max_points && (
              <p className="text-red-500 text-sm mt-1">{errors.max_points.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Controller
              name="requires_file"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <label>Require File Upload</label>
          </div>

          <Button type="submit">Create Assignment</Button>
        </form>
      </CardContent>
    </Card>
  );
}

