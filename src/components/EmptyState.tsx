
import React from "react";
import { FileJson } from "lucide-react";

const EmptyState: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center py-20 animate-fade-in">
      <div className="h-20 w-20 rounded-full bg-secondary flex items-center justify-center mb-6">
        <FileJson className="h-10 w-10 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-medium text-foreground mb-3">
        No JSON File Loaded
      </h2>
      <p className="text-muted-foreground text-center max-w-md mb-8">
        Upload a JSON file to see its contents displayed in organized tabs
      </p>
    </div>
  );
};

export default EmptyState;
