"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, FileText } from "lucide-react";
import Link from "next/link";

interface AssignmentCardProps {
  assignment: {
    _id: string;
    title: string;
    description: string;
    due_date: string;
    max_points: number;
    requires_file: boolean;
  };
  moduleId: string;
}

export function AssignmentCard({ assignment, moduleId }: AssignmentCardProps) {
  const dueDate = new Date(assignment.due_date);
  const isOverdue = dueDate < new Date();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{assignment.title}</span>
          <span className={`text-sm ${isOverdue ? 'text-red-500' : 'text-muted-foreground'}`}>
            {assignment.max_points} points
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{assignment.description}</p>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{dueDate.toLocaleDateString()}</span>
          </div>
          {assignment.requires_file && (
            <div className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span>File required</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Link 
          href={`/courses/${moduleId}/assignments/${assignment._id}`} 
          className="w-full"
        >
          <Button className="w-full" variant={isOverdue ? "secondary" : "default"}>
            {isOverdue ? "View Assignment" : "Start Assignment"}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}