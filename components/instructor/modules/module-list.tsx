"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { LessonList } from "../lessons/lesson-list";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LessonForm } from "../lessons/lesson-form";
import { CreateAssignmentForm } from "@/components/assignments/instructor/CreateAssignmentForm";

interface Module {
  _id: string;
  title: string;
  description: string;
  order_index: number;
  lessons: any[];
}

export function ModuleList({
  modules,
  courseId,
}: {
  modules: Module[];
  courseId: string;
}) {
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [isAddLessonOpen, setIsAddLessonOpen] = useState(false);
  const [isAddAssignmentOpen, setIsAddAssignmentOpen] = useState(false);
  const [currentModuleId, setCurrentModuleId] = useState<string | null>(null);

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full space-y-4"
      value={activeModule || ""}
      onValueChange={(newValue) => setActiveModule(newValue)}
    >
      {modules.map((module) => (
        <AccordionItem
          key={module._id}
          value={module._id}
          className="border rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-4">
                <div>
                  <h3 className="text-lg font-semibold">{module.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {module.description}
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <div className="flex gap-2">
              {/* Add Lesson Dialog */}
              <Dialog open={isAddLessonOpen} onOpenChange={setIsAddLessonOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Lesson
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Lesson</DialogTitle>
                  </DialogHeader>
                  <LessonForm
                    moduleId={module._id}
                    onSuccess={() => setIsAddLessonOpen(false)}
                  />
                </DialogContent>
              </Dialog>
              {/* Add Assignment Dialog */}
              <Dialog open={isAddAssignmentOpen} onOpenChange={setIsAddAssignmentOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" onClick={() => setCurrentModuleId(module._id)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Assignment
                  </Button>
                </DialogTrigger>
                <DialogTrigger asChild>
                  <Button variant="outline" style={{ borderColor: 'green', color: 'blue' }} size="sm" onClick={() => window.location.href=`/instructor/assignments/${module._id}`}>
                    
                     View Assignment
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Assignment</DialogTitle>
                  </DialogHeader>
                  <CreateAssignmentForm
                    moduleId={currentModuleId || ''}
                    onSuccess={() => setIsAddAssignmentOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <AccordionContent>
            {/* Display lessons only if the module is active */}
            {activeModule === module._id && (
              <div className="mt-4">
                <LessonList lessons={module.lessons} moduleId={module._id} />
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

