"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModuleList } from "./modules/module-list";
import { ModuleForm } from "./modules/module-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCourses } from "@/lib/hooks/use-courses";
import { Card } from "@/components/ui/card";

export function CourseDetails({ courseId }: { courseId: string }) {
  const [activeTab, setActiveTab] = useState("modules");
  const [isAddModuleOpen, setIsAddModuleOpen] = useState(false);
  const { currentCourse, modules, loadCourse, loadModules, isLoading } = useCourses();

  useEffect(() => {
    loadCourse(courseId);
    loadModules(courseId);
  }, [courseId]);

  if (isLoading || !currentCourse) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 bg-gray-200 rounded" />
          <div className="h-4 w-96 bg-gray-100 rounded" />
        </div>
        <Card className="p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-full h-24 bg-gray-100 animate-pulse rounded-md" />
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{currentCourse.title}</h1>
          <p className="text-muted-foreground">{currentCourse.description}</p>
        </div>
        <Dialog open={isAddModuleOpen} onOpenChange={setIsAddModuleOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Module
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Module</DialogTitle>
            </DialogHeader>
            <ModuleForm
              courseId={courseId}
              onSuccess={() => setIsAddModuleOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="settings">Course Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="modules">
          {/* @ts-expect-error error */}
          <ModuleList modules={modules} courseId={courseId} />
        </TabsContent>
        <TabsContent value="settings">Course settings content</TabsContent>
      </Tabs>
    </div>
  );
}