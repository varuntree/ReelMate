import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SimpleTabsProps {
  children: React.ReactNode;
  defaultValue?: string;
}

function SimpleTabsForNavigation({ children, defaultValue = "script-video" }: SimpleTabsProps) {
  return (
    <Tabs defaultValue={defaultValue} className="w-full">
      <ScrollArea>
        <TabsList className="mb-3 bg-background">
          <TabsTrigger 
            value="script-video" 
            className="group data-[state=active]:bg-accent data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="-ms-0.5 me-1.5 opacity-60"><path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="m5 12-3 3 3 3"/><path d="m9 18 3-3-3-3"/></svg>
            Script & Video
          </TabsTrigger>
          <TabsTrigger 
            value="voice-music" 
            className="group data-[state=active]:bg-accent data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="-ms-0.5 me-1.5 opacity-60"><path d="M2 10v3"/><path d="M6 6v11"/><path d="M10 3v18"/><path d="M14 8v7"/><path d="M18 5v13"/><path d="M22 10v3"/></svg>
            Voice & Music
          </TabsTrigger>
          <TabsTrigger 
            value="captions-style" 
            className="group data-[state=active]:bg-accent data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="-ms-0.5 me-1.5 opacity-60"><path d="m14.622 17.897-10.68-2.913"/><path d="M18.376 2.622a1 1 0 1 1 3.002 3.002L17.36 9.643a.5.5 0 0 0 0 .707l.944.944a2.41 2.41 0 0 1 0 3.408l-.944.944a.5.5 0 0 1-.707 0L8.354 7.348a.5.5 0 0 1 0-.707l.944-.944a2.41 2.41 0 0 1 3.408 0l.944.944a.5.5 0 0 0 .707 0z"/><path d="M9 8c-1.804 2.71-3.97 3.46-6.583 3.948a.507.507 0 0 0-.302.819l7.32 8.883a1 1 0 0 0 1.185.204C12.735 20.405 16 16.792 16 15"/></svg>
            Captions & Style
          </TabsTrigger>
        </TabsList>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      {children}
    </Tabs>
  );
}

export { SimpleTabsForNavigation };
