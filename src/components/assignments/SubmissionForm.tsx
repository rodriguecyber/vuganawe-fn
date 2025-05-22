"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

const submissionSchema = z.object({
  content: z.string().min(1, "Submission content is required"),
  file: z.instanceof(File).optional(),
});

type SubmissionFormData = z.infer<typeof submissionSchema>;

interface SubmissionFormProps {
  assignmentId: string;
  requiresFile: boolean;
  onSubmit: () => void;
}

export function SubmissionForm({ assignmentId, requiresFile, onSubmit }: SubmissionFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SubmissionFormData>({
    resolver: zodResolver(submissionSchema),
  });

  const onSubmitForm = async (data: SubmissionFormData) => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("content", data.content);
      if (data.file) {
        formData.append("file", data.file);
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/submissions/${assignmentId}`, {
        method: "POST",
        headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`, // Add token here
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to submit assignment");
      }

      toast({
        title: "Success",
        description: "Assignment submitted successfully",
      });
      onSubmit();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit assignment",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
      <div>
        <Textarea
          placeholder="Enter your submission here"
          {...register("content")}
          className={errors.content ? "border-red-500" : ""}
        />
        {errors.content && (
          <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
        )}
      </div>

      {requiresFile && (
        <div>
          <Controller
            name="file"
            control={control}
            render={({ field: { onChange, value, ...field } }) => (
              <Input
                type="file"
                onChange={(e) => onChange(e.target.files?.[0])}
                {...field}
              />
            )}
          />
          {errors.file && (
            <p className="text-red-500 text-sm mt-1">{errors.file.message}</p>
          )}
        </div>
      )}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Assignment"}
      </Button>
    </form>
  );
}

