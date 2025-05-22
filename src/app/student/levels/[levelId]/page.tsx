"use client";

import { LevelView } from "@/components/student/level-view";
import { useParams } from "next/navigation";

export default function LevelPage() {
  const params = useParams();
  const levelId = params.levelId as string;
  
  return <LevelView levelId={levelId} />;
}