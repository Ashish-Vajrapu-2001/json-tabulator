
import React, { useState } from "react";
import FileUpload from "@/components/FileUpload";
import JsonViewer from "@/components/JsonViewer";
import EmptyState from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const Index = () => {
  const [jsonData, setJsonData] = useState<any>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileUploaded = (data: any, name?: string) => {
    setJsonData(data);
    if (name) {
      setFileName(name);
    }
  };

  const handleClearData = () => {
    setJsonData(null);
    setFileName(null);
  };

  const handleDownload = () => {
    if (!jsonData) return;

    try {
      const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName || "data.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("File downloaded successfully");
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Failed to download file");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-medium text-foreground">
                JSON Tabulator
              </h1>
              <p className="text-muted-foreground mt-1">
                Visualize and explore JSON data through organized tabs
              </p>
            </div>
            
            {jsonData && (
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearData}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  New File
                </Button>
                <Button
                  size="sm"
                  onClick={handleDownload}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div
          className={cn(
            "max-w-screen-xl mx-auto transition-all duration-500",
            jsonData ? "opacity-100" : "opacity-0"
          )}
          style={{ display: jsonData ? "block" : "none" }}
        >
          <JsonViewer data={jsonData} />
        </div>

        <div
          className={cn(
            "max-w-screen-lg mx-auto transition-all duration-500",
            !jsonData ? "opacity-100" : "opacity-0"
          )}
          style={{ display: !jsonData ? "block" : "none" }}
        >
          {!jsonData ? (
            <div className="space-y-8">
              <FileUpload
                onFileUploaded={(data) => handleFileUploaded(data)}
              />
              <EmptyState />
            </div>
          ) : null}
        </div>
      </main>

      <footer className="border-t border-border bg-card">
        <div className="container mx-auto py-6 px-4 text-center text-sm text-muted-foreground">
          <p>JSON Tabulator • Visualize and explore your JSON data</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
