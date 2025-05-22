"use client";

import { LevelDetails } from "@/components/instructor/level-details";
import { useParams } from "next/navigation";

export default function LevelPage() {
  const params = useParams();
  const levelId = params.levelId as string;
  
  return <LevelDetails levelId={levelId} />;
}