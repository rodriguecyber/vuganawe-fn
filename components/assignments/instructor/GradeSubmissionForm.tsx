"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const gradeSchema = z.object({
  score: z.number().min(0, "Score cannot be negative"),
  feedback: z.string().min(1, "Feedback is required"),
});

interface GradeSubmissionFormProps {
  submissionId: string;
  maxPoints: number;
  onSuccess: () => void;
}

export function GradeSubmissionForm({ submissionId, maxPoints, onSuccess }: GradeSubmissionFormProps) {
const API_URL = process.env.NEXT_PUBLIC_API_URL 
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(gradeSchema),
  });

  const onSubmit = async (data: z.infer<typeof gradeSchema>) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/submissions/${submissionId}/grade`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
          
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to grade submission");

      toast({ title: "Success", description: "Submission graded successfully" });
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to grade submission",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grade Submission</CardTitle>
      </CardHeader>
      <CardContent>
        {/* @ts-expect-error error */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              type="number"
              placeholder={`Score (max ${maxPoints})`}
              {...register("score", { valueAsNumber: true })}
              className={errors.score ? "border-red-500" : ""}
              max={maxPoints}
            />
            {errors.score && (
              <p className="text-red-500 text-sm mt-1">{errors.score.message as string}</p>
            )}
          </div>

          <div>
            <Textarea
              placeholder="Feedback"
              {...register("feedback")}
              className={errors.feedback ? "border-red-500" : ""}
            />
            {errors.feedback && (
              <p className="text-red-500 text-sm mt-1">{errors.feedback.message as string}</p>
            )}
          </div>

          <Button type="submit">Submit Grade</Button>
        </form>
      </CardContent>
    </Card>
  );
}