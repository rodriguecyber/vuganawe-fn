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
import { useCourses } from "@/lib/hooks/use-courses";
import { useEffect, useState } from "react";
import { Resource } from "@/lib/types/course";
import axios from "axios";
import { toast } from "react-toastify";

export function ResourceList({ lessonId }: { lessonId: string }) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL 

  const { resources, loadResources, isLoading } = useCourses();
  const [lessonResources, setLessonResources] = useState<Resource[]>([]);

  useEffect(() => {
    const fetchData = async () => {
        try {
          const response = await axios.get(`${API_URL}/api/resources/${lessonId}`,{
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          });   
         ;
      setLessonResources(response.data);

        } catch (error) {
          toast.error('Failed to fetch resources');
          
      
      }
    };
    fetchData();
  }, [lessonId, loadResources]);

  // useEffect(() => {
  //   if (resources[lessonId]) {
  //     console.log("Resources loaded:", resources[lessonId]);
  //     setLessonResources(resources[lessonId]);
  //   }
  // }, [resources, lessonId]);


  if (isLoading) {
    return <div>Loading...</div>;
  }
  console.log("Lesson Resources:", lessonResources);

  return (
    <div className="rounded-md border">
      {resources[lessonId].length === 0 ? (
        <div className="p-4 text-center text-gray-500">No resources available for this lesson.</div>
      ) : (
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
            {resources[lessonId].map((resource) => (
              <TableRow key={resource._id}>
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-2">
                    <FileIcon className="h-4 w-4" />
                    <span>{resource.title}</span>
                  </div>
                </TableCell>
                <TableCell className="uppercase text-xs">{resource.resource_type}</TableCell>
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
      )}
    </div>
  );
  
}
