"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GradeSubmissionForm } from "./GradeSubmissionForm";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Submission {
  _id: string;
  content: string;
  file_url?: string;
  score?: number;
  feedback?: string;
  status: string;
  submitted_at: string;
  user_id: {
    name: string;
    email: string;
  };
}

interface SubmissionsListProps {
  assignmentId: string;
  maxPoints: number;
}

export function SubmissionsList({ assignmentId, maxPoints }: SubmissionsListProps) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/submissions/${assignmentId}`, {
          headers: { 
      "Authorization": `Bearer ${localStorage.getItem("token")}`,

           },
        });

        if (!response.ok) throw new Error("Failed to fetch submissions");

        const data = await response.json();
        setSubmissions(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load submissions",
          variant: "destructive",
        });
        console.log('hello')
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [assignmentId]);

  if (loading) return <div>Loading submissions...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Student Submissions</h2>
      {submissions.length === 0 ? (
        <p>No submissions yet</p>
      ) : (
        submissions.map((submission) => (
          <Card key={submission._id}>
            <CardHeader>
              <CardTitle className="flex justify-between">
                <span>{submission.user_id.name}</span>
                <span className="text-sm text-muted-foreground">
                  Submitted: {formatDate(submission.submitted_at)}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Submission Content:</h4>
                <p className="text-sm">{submission.content}</p>
                {submission.file_url && (
                  <a
                    href={submission.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline block mt-2"
                  >
                    View Attached File
                  </a>
                )}
              </div>

              {submission.status === 'graded' ? (
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Grade:</h4>
                  <p>Score: {submission.score}/{maxPoints}</p>
                  <p className="text-sm mt-2">Feedback: {submission.feedback}</p>
                </div>
              ) : (
                <GradeSubmissionForm
                  submissionId={submission._id}
                  maxPoints={maxPoints}
                  onSuccess={() => window.location.reload()}
                />
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}