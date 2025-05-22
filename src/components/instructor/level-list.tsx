"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Plus, Users, BookOpen, DollarSign, Eye, GraduationCap } from "lucide-react";
import Link from "next/link";
import { useLevels } from "@/lib/hooks/use-levels";
import { Card } from "@/components/ui/card";

const difficultyColors = {
  beginner: "bg-green-50 text-green-600",
  intermediate: "bg-orange-50 text-orange-600",
  advanced: "bg-red-50 text-red-600",
};

export function LevelList() {
  const { levels, loadLevels, isLoading } = useLevels();

  useEffect(() => {
    loadLevels();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-64 bg-gray-200 animate-pulse rounded-lg" />
          <div className="w-32 h-10 bg-gray-200 animate-pulse rounded-lg" />
        </div>
        <Card className="p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-full h-16 bg-gray-100 animate-pulse rounded-lg" />
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
          <h1 className="text-3xl font-bold text-orange-500">Levels</h1>
          <p className="text-gray-600 mt-1">Manage levels and track student progress</p>
        </div>
        <Link href="/admin/levels/new">
          <Button className="bg-orange-500 hover:bg-orange-600">
            <Plus className="mr-2 h-4 w-4" />
            Create New Level
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {levels.map((level) => (
          <Card key={level._id} className="overflow-hidden bg-white">
            <div className="relative h-48">
              <img
                src={level.thumbnail }
                alt={level.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-xl font-semibold text-white truncate">{level.title}</h3>
                <div className="flex items-center mt-2">
                  
                </div>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-2 bg-sky-50 rounded-lg">
                  <Users className="h-5 w-5 text-sky-500 mx-auto mb-1" />
                  <p className="text-sm text-gray-600">Students</p>
                  <p className="font-semibold text-sky-600">{level.totalEnrolled || 0}</p>
                </div>
                <div className="text-center p-2 bg-orange-50 rounded-lg">
                  <BookOpen className="h-5 w-5 text-orange-500 mx-auto mb-1" />
                  <p className="text-sm text-gray-600">Modules</p>
                  <p className="font-semibold text-orange-600">{level.modules?.length || 0}</p>
                </div>
                <div className="text-center p-2 bg-green-50 rounded-lg">
                  <DollarSign className="h-5 w-5 text-green-500 mx-auto mb-1" />
                  <p className="text-sm text-gray-600">Price</p>
                  <p className="font-semibold text-green-600"> Frw {level.price}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link href={`/admin/levels/${level._id}`} className="flex-1">
                  <Button variant="outline" className="w-full border-orange-500 text-orange-500 hover:bg-orange-50">
                    <Edit className="h-4 w-4 mr-2" />
                    Details
                  </Button>
                </Link>
               
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}