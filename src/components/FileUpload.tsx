
import React, { useCallback, useState } from "react";
import { FileJson, Upload } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface FileUploadProps {
  onFileUploaded: (jsonData: any) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUploaded }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const processFile = useCallback(
    (file: File) => {
      if (!file) return;

      // Check if the file is a JSON
      if (file.type !== "application/json" && !file.name.endsWith(".json")) {
        toast.error("Please upload a valid JSON file");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const jsonData = JSON.parse(event.target?.result as string);
          onFileUploaded(jsonData);
          toast.success(`Successfully loaded ${file.name}`);
        } catch (error) {
          toast.error("Failed to parse JSON file");
          console.error("Error parsing JSON:", error);
        }
      };

      reader.onerror = () => {
        toast.error("Failed to read file");
      };

      reader.readAsText(file);
    },
    [onFileUploaded]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        processFile(e.dataTransfer.files[0]);
      }
    },
    [processFile]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        processFile(e.target.files[0]);
      }
    },
    [processFile]
  );

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`file-drop-zone flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg ${
        isDragging
          ? "active bg-accent border-primary/60"
          : "border-border bg-secondary/30"
      }`}
    >
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-2">
          <FileJson className="h-7 w-7 text-primary animate-fade-in" />
        </div>
        <h3 className="text-lg font-medium">Drag and drop your JSON file</h3>
        <p className="text-muted-foreground max-w-lg">
          Upload a JSON file to visualize its structure and content in a clean,
          organized interface with tabs for easy navigation.
        </p>
        <div className="mt-4">
          <label
            htmlFor="file-upload"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors font-medium cursor-pointer"
          >
            <Upload className="h-4 w-4" />
            Choose a file
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".json,application/json"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
