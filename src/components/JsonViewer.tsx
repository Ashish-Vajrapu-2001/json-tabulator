
import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TabNavigation from "./TabNavigation";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface JsonViewerProps {
  data: any;
  className?: string;
}

const JsonViewer: React.FC<JsonViewerProps> = ({ data, className }) => {
  // Function to render a value based on its type
  const renderValue = (value: any) => {
    if (value === null) return <span className="text-gray-400">null</span>;
    if (typeof value === "boolean") return <span className="text-purple-600">{value.toString()}</span>;
    if (typeof value === "number") return <span className="text-amber-600">{value}</span>;
    if (typeof value === "string") return <span className="text-green-600">"{value}"</span>;
    if (Array.isArray(value)) {
      if (value.length === 0) return <span className="text-gray-400">[]</span>;
      return (
        <div className="pl-4 border-l-2 border-border">
          {value.map((item, index) => (
            <div key={index} className="mb-2">
              <span className="mr-2 text-muted-foreground">{index}:</span>
              {renderValue(item)}
            </div>
          ))}
        </div>
      );
    }
    if (typeof value === "object") {
      return <ObjectCard data={value} />;
    }
    return <span>{String(value)}</span>;
  };

  // Card component for displaying objects
  const ObjectCard = ({ data }: { data: Record<string, any> }) => {
    if (!data) return null;
    
    return (
      <Card className="border border-border shadow-sm mb-4">
        <CardContent className="p-4">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="mb-3">
              <div className="flex items-start">
                <span className="text-primary font-medium min-w-[150px] mr-2">{key}:</span>
                <div className="flex-1">{renderValue(value)}</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  };

  // Function to render a table for arrays of objects
  const renderTable = (data: any[]) => {
    if (!data || data.length === 0) return null;
    
    // Get all possible keys from all objects
    const allKeys = Array.from(
      new Set(data.flatMap(item => Object.keys(item)))
    );
    
    return (
      <div className="overflow-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              {allKeys.map(key => (
                <TableHead key={key}>{key}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index}>
                {allKeys.map(key => (
                  <TableCell key={`${index}-${key}`}>
                    {item[key] !== undefined ? renderValue(item[key]) : "-"}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  // Section renderer
  const renderSection = (title: string, content: any) => {
    return (
      <Card className="border border-border shadow-sm mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          {content}
        </CardContent>
      </Card>
    );
  };

  // Generate tabs based on the JSON structure
  const tabs = useMemo(() => {
    if (!data) return [];
    
    const baseTab = {
      id: "overview",
      label: "Overview",
      content: (
        <div className="space-y-6">
          <Card className="border border-border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              {data.name && (
                <div className="mb-4">
                  <h3 className="text-primary font-medium mb-1">Name</h3>
                  <p>{data.name}</p>
                </div>
              )}
              
              {data.description && (
                <div className="mb-4">
                  <h3 className="text-primary font-medium mb-1">Description</h3>
                  <p>{data.description}</p>
                </div>
              )}
              
              {data.type && (
                <div className="mb-4">
                  <h3 className="text-primary font-medium mb-1">Type</h3>
                  <p>{data.type}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ),
    };

    const sections = [
      { 
        id: "parameters", 
        label: "Parameters", 
        fields: ["parameters"],
        renderer: (data: any) => {
          if (Array.isArray(data.parameters)) {
            return renderTable(data.parameters);
          }
          return renderValue(data.parameters);
        }
      },
      { 
        id: "sources", 
        label: "Sources", 
        fields: ["sources"],
        renderer: (data: any) => {
          if (Array.isArray(data.sources)) {
            return renderTable(data.sources);
          }
          return renderValue(data.sources);
        }
      },
      { 
        id: "targets", 
        label: "Targets", 
        fields: ["targets"],
        renderer: (data: any) => {
          if (Array.isArray(data.targets)) {
            return renderTable(data.targets);
          }
          return renderValue(data.targets);
        }
      },
      { 
        id: "transforms", 
        label: "Transforms", 
        fields: ["transforms"],
        renderer: (data: any) => {
          if (!data.transforms) return null;
          
          return (
            <div className="space-y-4">
              {Array.isArray(data.transforms) ? 
                data.transforms.map((transform, index) => (
                  <Card key={index} className="border border-border shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md">{transform.name || `Transform ${index + 1}`}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {transform.rules && (
                        <div>
                          <h3 className="text-primary font-medium mb-2">Rules</h3>
                          <div className="bg-secondary/30 p-4 rounded-md">
                            {Array.isArray(transform.rules) ? 
                              transform.rules.map((rule, idx) => (
                                <div key={idx} className="mb-1 font-mono text-sm">{rule}</div>
                              )) : 
                              <div className="font-mono text-sm">{transform.rules}</div>
                            }
                          </div>
                        </div>
                      )}
                      
                      {transform.input && (
                        <div className="mt-4">
                          <h3 className="text-primary font-medium mb-1">Input</h3>
                          <div className="font-mono text-sm">{transform.input}</div>
                        </div>
                      )}
                      
                      {transform.output && (
                        <div className="mt-4">
                          <h3 className="text-primary font-medium mb-1">Output</h3>
                          <div className="font-mono text-sm">{transform.output}</div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )) :
                renderValue(data.transforms)
              }
            </div>
          );
        }
      },
      { 
        id: "sql_scripts", 
        label: "SQL Scripts", 
        fields: ["sql_scripts"],
        renderer: (data: any) => {
          if (!data.sql_scripts) return null;
          
          return (
            <div className="space-y-4">
              {Array.isArray(data.sql_scripts) ? 
                data.sql_scripts.map((script, index) => (
                  <Card key={index} className="border border-border shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md">{script.stage || `Script ${index + 1}`}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {script.type && (
                        <div className="mb-2">
                          <span className="text-primary font-medium">Type: </span>
                          <span>{script.type}</span>
                        </div>
                      )}
                      
                      {script.sql && (
                        <div>
                          <h3 className="text-primary font-medium mb-2">SQL</h3>
                          <div className="bg-secondary/30 p-4 rounded-md overflow-auto">
                            <pre className="font-mono text-sm whitespace-pre-wrap">{script.sql}</pre>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )) :
                renderValue(data.sql_scripts)
              }
            </div>
          );
        }
      },
      { 
        id: "flow", 
        label: "Flow", 
        fields: ["flow", "lookups"],
        renderer: (data: any) => {
          return (
            <div className="space-y-6">
              {data.flow && (
                <div>
                  <h3 className="text-primary font-medium mb-2">Flow</h3>
                  {Array.isArray(data.flow) ? 
                    renderTable(data.flow) :
                    renderValue(data.flow)
                  }
                </div>
              )}
              
              {data.lookups && (
                <div className="mt-4">
                  <h3 className="text-primary font-medium mb-2">Lookups</h3>
                  {Array.isArray(data.lookups) ? 
                    (data.lookups.length > 0 ? renderTable(data.lookups) : 
                    <p className="text-muted-foreground">No lookups defined</p>) :
                    renderValue(data.lookups)
                  }
                </div>
              )}
            </div>
          );
        }
      },
    ];

    const contentTabs = sections
      .filter((section) => {
        return section.fields.some((field) => data[field] !== undefined);
      })
      .map((section) => {
        return {
          id: section.id,
          label: section.label,
          content: (
            <div className="json-card-view">
              {section.renderer(data)}
            </div>
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
