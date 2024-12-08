"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileIcon, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock data - replace with actual API calls
const resources = [
  {
    id: "1",
    title: "Lecture Slides",
    resource_type: "pdf",
    file_size: 2.5,
    download_count: 45,
  },
];

export function ResourceList({ lessonId }: { lessonId: string }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Resource</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Size (MB)</TableHead>
            <TableHead>Downloads</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {resources.map((resource) => (
            <TableRow key={resource.id}>
              <TableCell className="font-medium">
                <div className="flex items-center space-x-2">
                  <FileIcon className="h-4 w-4" />
                  <span>{resource.title}</span>
                </div>
              </TableCell>
              <TableCell className="uppercase text-xs">
                {resource.resource_type}
              </TableCell>
              <TableCell>{resource.file_size} MB</TableCell>
              <TableCell>{resource.download_count}</TableCell>
              <TableCell>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}