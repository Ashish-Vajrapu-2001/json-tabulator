
import React, { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import TabNavigation from "./TabNavigation";
import { cn } from "@/lib/utils";

interface JsonViewerProps {
  data: any;
  className?: string;
}

const JsonViewer: React.FC<JsonViewerProps> = ({ data, className }) => {
  // Function to format JSON with syntax highlighting
  const formatJsonWithHighlighting = (obj: any) => {
    if (typeof obj !== "object" || obj === null) {
      return <span>{JSON.stringify(obj)}</span>;
    }

    const json = JSON.stringify(obj, null, 2);
    const highlighted = json.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      (match) => {
        let cls = "json-number";
        if (/^"/.test(match)) {
          cls = /:$/.test(match) ? "json-key" : "json-string";
        } else if (/true|false/.test(match)) {
          cls = "json-boolean";
        } else if (/null/.test(match)) {
          cls = "json-null";
        }
        return `<span class="${cls}">${match}</span>`;
      }
    );

    return (
      <pre
        className="overflow-auto"
        dangerouslySetInnerHTML={{ __html: highlighted }}
      />
    );
  };

  // Generate tabs based on the JSON structure
  const tabs = useMemo(() => {
    if (!data) return [];
    
    const baseTab = {
      id: "overview",
      label: "Overview",
      content: (
        <Card className="border border-border shadow-sm">
          <CardContent className="pt-6 json-viewer">
            {formatJsonWithHighlighting(data)}
          </CardContent>
        </Card>
      ),
    };

    const sections = [
      { id: "info", label: "Information", fields: ["name", "description", "type", "parameters"] },
      { id: "sources", label: "Sources", fields: ["sources"] },
      { id: "targets", label: "Targets", fields: ["targets"] },
      { id: "transforms", label: "Transforms", fields: ["transforms"] },
      { id: "scripts", label: "SQL Scripts", fields: ["sql_scripts"] },
      { id: "flow", label: "Flow", fields: ["flow", "lookups"] },
    ];

    const contentTabs = sections
      .filter((section) => {
        return section.fields.some((field) => data[field] !== undefined);
      })
      .map((section) => {
        const sectionData: Record<string, any> = {};
        section.fields.forEach((field) => {
          if (data[field] !== undefined) {
            sectionData[field] = data[field];
          }
        });

        return {
          id: section.id,
          label: section.label,
          content: (
            <Card className="border border-border shadow-sm">
              <CardContent className="pt-6 json-viewer">
                {formatJsonWithHighlighting(sectionData)}
              </CardContent>
            </Card>
          ),
        };
      });

    return [baseTab, ...contentTabs];
  }, [data]);

  return (
    <div className={cn("w-full", className)}>
      <TabNavigation tabs={tabs} defaultSelectedTab="overview" />
    </div>
  );
};

export default JsonViewer;
