"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SubmissionsList } from "@/components/assignments/instructor/SubmissionsList";
import { Calendar, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Assignment {
  _id: string;
  title: string;
  description: string;
  due_date: string;
  max_points: number;
  requires_file: boolean;
  rubric: Record<string, any>;
}

export default function InstructorAssignmentPage() {
  const params = useParams();
  const { toast } = useToast();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:5000/api/assignments/${params.id}`, {
          headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`,

           },
        });

        if (!response.ok) throw new Error("Failed to fetch assignment");

        const data = await response.json();
        setAssignment(data);
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

    fetchAssignment();
  }, [params.id]);

  if (loading) return <div>Loading...</div>;
  if (!assignment) return <div>Assignment not found</div>;

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
                  <span>Due: {new Date(assignment.due_date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{assignment.max_points} points</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none dark:prose-invert">
                <p>{assignment.description}</p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6">
            <SubmissionsList
              assignmentId={assignment._id}
              maxPoints={assignment.max_points}
            />
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Assignment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Requirements:</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {assignment.requires_file && (
                    <li>File submission required</li>
                  )}
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Rubric:</h4>
                <div className="space-y-2">
                  {Object.entries(assignment.rubric || {}).map(([criterion, points]) => (
                    <div key={criterion} className="flex justify-between text-sm">
                      <span>{criterion}</span>
                      <span className="text-muted-foreground">{points} points</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}