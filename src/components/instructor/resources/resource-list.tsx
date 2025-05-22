import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileIcon, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLevels } from "@/lib/hooks/use-levels";
import { useEffect, useState } from "react";
import { Resource } from "@/lib/types/level";
import axios from "axios";
import { toast } from "react-toastify";
import * as levelApi from "@/lib/api/levels";

export function ResourceList({ lessonId }: { lessonId: string }) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const { resources, loadResources, isLoading } = useLevels();
  const [lessonResources, setLessonResources] = useState<Resource[]>([]);
  const [downloadingResource, setDownloadingResource] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/resources/${lessonId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setLessonResources(response.data);
      } catch (error) {
        toast.error('Failed to fetch resources');
      }
    };
    fetchData();
  }, [lessonId, loadResources]);

  const handleDownload = async (resource: Resource) => {
    try {
      setDownloadingResource(resource._id);
      const { url, filename } = await levelApi.downloadResource(resource._id);

      // Create a temporary link element and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Download started');
    } catch (error) {
      toast.error('Failed to download resource');
    } finally {
      setDownloadingResource(null);
    }
  };

  if (isLoading) {
    return <div className="text-gray-500 text-center py-4">Loading...</div>;
  }

  return (
    <div className="rounded-md border border-gray-100">
      {lessonResources.length === 0 ? (
        <div className="p-4 text-center text-gray-500">No resources available for this lesson.</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="bg-orange-50/50 hover:bg-orange-50">
              <TableHead className="font-medium">Resource</TableHead>
              <TableHead className="font-medium">Type</TableHead>
              <TableHead className="font-medium">Size</TableHead>
              <TableHead className="font-medium">Downloads</TableHead>
              <TableHead className="font-medium">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lessonResources.map((resource) => (
              <TableRow key={resource._id} className="hover:bg-sky-50/50">
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-2">
                    <FileIcon className="h-4 w-4 text-orange-500" />
                    <span className="text-gray-700">{resource.title}</span>
                  </div>
                </TableCell>
                <TableCell className="uppercase text-xs text-sky-600">{resource.resource_type}</TableCell>
                <TableCell className="text-gray-600">
                  {resource.file_size / 1024 / 1024 >= 1024
                    ? (resource.file_size / 1024 / 1024 / 1024).toPrecision(3) + " GB"
                    : resource.file_size / 1024 >= 1024
                      ? (resource.file_size / 1024 / 1024).toPrecision(3) + " MB"
                      : resource.file_size >= 1024
                        ? (resource.file_size / 1024).toPrecision(3) + " KB"
                        : (resource.file_size).toPrecision(3) + " B"}
                </TableCell>
                <TableCell className="text-gray-600">{resource.download_count}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-sky-500 hover:text-sky-600 hover:bg-sky-50"
                    onClick={() => handleDownload(resource)}
                    disabled={downloadingResource === resource._id}
                  >
                    {downloadingResource === resource._id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
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
