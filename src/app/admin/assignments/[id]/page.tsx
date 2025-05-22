"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SubmissionsList } from "@/components/assignments/instructor/SubmissionsList";
import { Calendar, Clock, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreateAssignmentForm } from "@/components/assignments/instructor/CreateAssignmentForm";

interface Assignment {
  _id: string;
  title: string;
  description: string;
  due_date: string;
  max_points: number;
  requires_file: boolean;
  rubric: Record<string, any>;
  module_id: string;
}

export default function InstructorAssignmentPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const params = useParams();
  const { toast } = useToast();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAddAssignmentOpen, setIsAddAssignmentOpen] = useState(false);

  const fetchAssignment = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/assignments/${params.id}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
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

  useEffect(() => {
    fetchAssignment();
  }, [params.id]);

  const handleAssignmentSuccess = () => {
    setIsAddAssignmentOpen(false);
    // Optionally refresh the current page or redirect to the new assignment
    window.location.reload();
  };

  if (loading) return <div>Loading...</div>;
  if (!assignment) return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md text-center">
        <h2 className="text-2xl mb-4 text-orange-500">Assignment Not Found</h2>
        <p className="mb-6 text-gray-600">The assignment you're looking for doesn't exist or has been removed.</p>
        <div className="space-x-4">
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            className="border-orange-500 text-orange-500 hover:bg-orange-50"
          >
            Go Back
          </Button>
          <Button
            onClick={() => setIsAddAssignmentOpen(true)}
            className="bg-orange-500 hover:bg-orange-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Assignment
          </Button>
        </div>
      </div>

      <Dialog open={isAddAssignmentOpen} onOpenChange={setIsAddAssignmentOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-orange-500">Create New Assignment</DialogTitle>
          </DialogHeader>
          <CreateAssignmentForm
            moduleId={params.id as string}
            onSuccess={handleAssignmentSuccess}
          />
        </DialogContent>
      </Dialog>
    </div>
  );

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-orange-500">{assignment.title}</h1>
        <Button
          onClick={() => setIsAddAssignmentOpen(true)}
          className="bg-orange-500 hover:bg-orange-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Assignment
        </Button>
      </div>

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

      <Dialog open={isAddAssignmentOpen} onOpenChange={setIsAddAssignmentOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-orange-500">Create New Assignment</DialogTitle>
          </DialogHeader>
          <CreateAssignmentForm
            moduleId={assignment.module_id}
            onSuccess={handleAssignmentSuccess}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}