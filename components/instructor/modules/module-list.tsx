"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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
