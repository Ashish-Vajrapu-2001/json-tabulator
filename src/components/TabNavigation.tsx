
import React, { useEffect, useState, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface TabNavigationProps {
  tabs: {
    id: string;
    label: string;
    content: React.ReactNode;
  }[];
  defaultSelectedTab?: string;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  defaultSelectedTab,
}) => {
  const [selectedTab, setSelectedTab] = useState<string>(
    defaultSelectedTab || (tabs.length > 0 ? tabs[0].id : "")
  );
  const [animating, setAnimating] = useState(false);
  const tabContentsRef = useRef<HTMLDivElement>(null);

  const handleTabChange = (value: string) => {
    if (value === selectedTab) return;
    
    setAnimating(true);
    setTimeout(() => {
      setSelectedTab(value);
      setAnimating(false);
    }, 180);
  };

  useEffect(() => {
    if (tabs.length > 0 && !tabs.some(tab => tab.id === selectedTab)) {
      setSelectedTab(tabs[0].id);
    }
  }, [tabs, selectedTab]);

  return (
    <Tabs
      value={selectedTab}
      onValueChange={handleTabChange}
      className="w-full animate-fade-in"
    >
      <div className="border-b border-border/60 bg-secondary/5 rounded-t-lg">
        <TabsList className="mx-4 bg-transparent h-14">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className={cn(
                "h-12 px-6 text-sm rounded-none border-b-2 data-[state=active]:border-primary border-transparent data-[state=active]:text-primary text-muted-foreground data-[state=active]:bg-transparent relative",
                "transition-all duration-200 ease-in-out data-[state=active]:font-medium"
              )}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      <div
        ref={tabContentsRef}
        className={cn(
          "tab-content p-4 transition-opacity duration-200 bg-card/50 rounded-b-lg",
          animating ? "opacity-0" : "opacity-100 animate-slide-up"
        )}
      >
        {tabs.map((tab) => (
          <TabsContent
            key={tab.id}
            value={tab.id}
            className="m-0 data-[state=active]:animate-slide-up data-[state=active]:opacity-100"
          >
            {tab.content}
          </TabsContent>
        ))}
      </div>
    </Tabs>
  );
};

export default TabNavigation;
