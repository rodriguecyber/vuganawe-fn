"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, X, FileCheck } from "lucide-react";
import { cn, formatFileSize } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  accept?: string;
  maxSize?: number; // in bytes
  onUpload: (file: File | null) => void;
  className?: string;
  value?: File | null;
}

export function ImageFileUpload({
  accept = "*/*",
  maxSize = 5 * 1024 * 1024, // 5MB default
  onUpload,
  className,
  value
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(value || null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) {
      onUpload(null);
      return;
    }

    if (selectedFile.size > maxSize) {
      toast({
        title: "Error",
        description: `File size must be less than ${formatFileSize(maxSize)}`,
        variant: "destructive",
      });
      return;
    }

    setFile(selectedFile);
    onUpload(selectedFile);
  };

  const clearFile = () => {
    setFile(null);
    setProgress(0);
    onUpload(null);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-4">
        <input
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
          disabled={uploading}
        />
        <label
          htmlFor="file-upload"
          className={cn(
            "flex items-center gap-2 px-4 py-2 border-2 border-dashed rounded-lg cursor-pointer",
            "hover:border-primary/50 transition-colors",
            "text-sm text-muted-foreground",
            uploading && "opacity-50 cursor-not-allowed"
          )}
        >
          <Upload className="h-4 w-4" />
          {file ? file.name : "Choose a file"}
        </label>
        {file && !uploading && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={clearFile}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {file && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {formatFileSize(file.size)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
export function VideoFileUpload({
  accept = "*/*",
  maxSize = 5 * 1024 * 1024, // 5MB default
  onUpload,
  className,
  value
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(value || null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) {
      onUpload(null);
      return;
    }

    if (selectedFile.size > maxSize) {
      toast({
        title: "Error",
        description: `File size must be less than ${formatFileSize(maxSize)}`,
        variant: "destructive",
      });
      return;
    }

    setFile(selectedFile);
    onUpload(selectedFile);
  };

  const clearFile = () => {
    setFile(null);
    setProgress(0);
    onUpload(null);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-4">
        <input
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
          disabled={uploading}
        />
        <label
          htmlFor="file-upload"
          className={cn(
            "flex items-center gap-2 px-4 py-2 border-2 border-dashed rounded-lg cursor-pointer",
            "hover:border-primary/50 transition-colors",
            "text-sm text-muted-foreground",
            uploading && "opacity-50 cursor-not-allowed"
          )}
        >
          <Upload className="h-4 w-4" />
          {file ? file.name : "Choose a file"}
        </label>
        {file && !uploading && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={clearFile}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {file && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {formatFileSize(file.size)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}