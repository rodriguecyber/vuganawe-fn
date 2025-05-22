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
import { useLevels } from "@/lib/hooks/use-levels";
import { Card } from "@/components/ui/card";

export const LevelDetails = ({ levelId }: { levelId: string }) => {
  const [activeTab, setActiveTab] = useState("modules");
  const [isAddModuleOpen, setIsAddModuleOpen] = useState(false);
  const { currentLevel, modules, loadLevel, loadModules, isLoading } = useLevels();

  useEffect(() => {
    loadLevel(levelId);
    loadModules(levelId);
  }, [levelId]);

  if (isLoading || !currentLevel) {
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
      <div className="flex items-center justify-between bg-white p-6 rounded-lg shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-orange-500">{currentLevel.title}</h1>
          <p className="text-gray-600 mt-2">{currentLevel.description}</p>
          <div className="mt-4 flex gap-4">
            <div className="bg-sky-50 p-3 rounded-lg">
              <span className="text-sky-600 font-semibold">{currentLevel.students || 0}</span>
              <p className="text-sm text-gray-600">Enrolled Students</p>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <span className="text-orange-600 font-semibold">{modules.length}</span>
              <p className="text-sm text-gray-600">Total Modules</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <span className="text-green-600 font-semibold">Frw {currentLevel.price}</span>
              <p className="text-sm text-gray-600">Level Price</p>
            </div>
          </div>
        </div>
        <Dialog open={isAddModuleOpen} onOpenChange={setIsAddModuleOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Module</DialogTitle>
            </DialogHeader>
            <ModuleForm
              levelId={levelId}
              onSuccess={() => setIsAddModuleOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <TabsList className="flex gap-5 p-1 bg-gray-100 rounded-lg">
            <TabsTrigger
              value="modules"
              className="flex-1 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:text-orange-500"
            >
              Level Modules
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="flex-1 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:text-orange-500"
            >
              Level Settings
            </TabsTrigger>
            <TabsTrigger value="module" className="flex-1">
              <Button
                onClick={() => setIsAddModuleOpen(true)}
                className="w-full bg-sky-400 hover:bg-sky-500 text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Module
              </Button>
            </TabsTrigger>
            <TabsTrigger value="exam" className="flex-1">
              <a
                href={`/admin/levels/${levelId}/exam`}
                className="flex items-center justify-center gap-2 w-full bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-md"
              >
                <Plus className="h-4 w-4" />
                Manage Exam
              </a>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="modules" className="bg-white p-6 rounded-lg shadow-sm">
          <ModuleList modules={modules} levelId={levelId} />
        </TabsContent>

        <TabsContent value="settings" className="bg-white p-6 rounded-lg shadow-sm">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Level Settings</h3>
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Level Visibility</label>
                  <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500">
                    <option>Public</option>
                    <option>Private</option>
                    <option>Draft</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Level Category</label>
                  <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500">
                    <option>Development</option>
                    <option>Business</option>
                    <option>Design</option>
                    <option>Marketing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Level Level</label>
                  <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500">
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                Save Settings
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}