"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { SubmissionForm } from "@/components/assignments/SubmissionForm";

interface Assignment {
  _id: string;
  title: string;
  description: string;
  due_date: string;
  max_points: number;
  requires_file: boolean;
  rubric: Record<string, any>;
}

interface Submission {
  _id: string;
  content: string;
  file_url?: string;
  score?: number;
  feedback?: string;
  status: 'pending' | 'graded' | 'late';
  submitted_at: string;
}

export default function AssignmentPage() {
  const params = useParams();
  const { toast } = useToast();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const [assignmentRes, submissionRes] = await Promise.all([
        fetch(`http://localhost:5000/api/assignments/${params.id}`, {
          headers: { 
      "Authorization": `Bearer ${localStorage.getItem("token")}`, // Add token here

           },
        }),
        fetch(`http://localhost:5000/api/submissions/${params.id}`, {
          headers: { 
      "Authorization": `Bearer ${localStorage.getItem("token")}`, // Add token here

           },
        }),
      ]);

      if (!assignmentRes.ok) throw new Error("Failed to fetch assignment");

      const assignmentData = await assignmentRes.json();
      setAssignment(assignmentData);

      if (submissionRes.ok) {
        const submissionData = await submissionRes.json();
        setSubmission(submissionData);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load assignment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [params.id]);

  const handleSubmissionSuccess = async () => {
    try {
      const token = localStorage.getItem("token");
      const submissionRes = await fetch(`http://localhost:5000/api/submissions/assignment/${params.id}`, {
        headers: { 
      "Authorization": `Bearer ${localStorage.getItem("token")}`, // Add token here

         },
      });

      if (submissionRes.ok) {
        const submissionData = await submissionRes.json();
        setSubmission(submissionData);
      }
    } catch (error) {
      console.error("Error fetching updated submission:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!assignment) return <div>Assignment not found</div>;

  const dueDate = new Date(assignment.due_date);
  const isOverdue = dueDate < new Date();

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{assignment.title}</CardTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Due: {dueDate.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{assignment.max_points} points</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose max-w-none dark:prose-invert">
                <p>{assignment.description}</p>
              </div>

              {isOverdue && !submission && (
                <div className="flex items-center gap-2 text-red-500 bg-red-50 dark:bg-red-900/10 p-4 rounded-lg">
                  <AlertCircle className="h-5 w-5" />
                  <p>This assignment is overdue</p>
                </div>
              )}

              {submission ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Your Submission</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>{submission.content}</p>
                    {submission.file_url && (
                      <a
                        href={submission.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        View Attached File
                      </a>
                    )}
                    {submission.status === 'graded' && (
                      <div className="space-y-2">
                        <p className="font-medium">Score: {submission.score}/{assignment.max_points}</p>
                        <p className="text-sm text-muted-foreground">{submission.feedback}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <SubmissionForm
                  assignmentId={assignment._id}
                  requiresFile={assignment.requires_file}
                  onSubmit={handleSubmissionSuccess}
                />
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Rubric</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(assignment.rubric || {}).map(([criterion, points]) => (
                  <div key={criterion} className="flex justify-between items-center">
                    <span>{criterion}</span>
                    <span className="text-muted-foreground">{points} points</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

