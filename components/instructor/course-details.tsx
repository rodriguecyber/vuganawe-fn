"use client";

import { useState } from "react";
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

// Mock data - replace with actual API calls
const courseData = {
  id: "1",
  title: "Introduction to Web Development",
  description: "Learn the basics of web development",
  modules: [
    {
      id: "m1",
      title: "HTML Fundamentals",
      description: "Learn the basics of HTML",
      order_index: 1,
      lessons: [
        {
          id: "l1",
          title: "Introduction to HTML",
          content_type: "video",
          duration_minutes: 15,
        },
      ],
    },
  ],
};

export function CourseDetails({ courseId }: { courseId: string }) {
  const [activeTab, setActiveTab] = useState("modules");
  const [isAddModuleOpen, setIsAddModuleOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{courseData.title}</h1>
          <p className="text-muted-foreground">{courseData.description}</p>
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
          <ModuleList modules={courseData.modules} courseId={courseId} />
        </TabsContent>
        <TabsContent value="settings">Course settings content</TabsContent>
      </Tabs>
    </div>
  );
}