import { useState } from "react";
import { X, Search, Download, BookOpen, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { constitutionSections, constitutionMetadata } from "@/data/constitutionData";
import { useToast } from "@/hooks/use-toast";

interface ConstitutionViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ConstitutionViewer({ open, onOpenChange }: ConstitutionViewerProps) {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);

  const articles = constitutionSections.filter(s => s.type === "article");
  
  const getArticleSections = (articleId: string) => {
    return constitutionSections.filter(s => s.parent === articleId);
  };

  const filteredSections = searchQuery
    ? constitutionSections.filter(
        s =>
          s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleDownload = () => {
    toast({
      title: "Downloading Constitution",
      description: "PDF document will be downloaded",
    });
  };

  const scrollToSection = (sectionId: string) => {
    setSelectedArticle(sectionId);
    const element = document.getElementById(`section-${sectionId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[95vh] p-0">
        <DialogHeader className="p-4 sm:p-6 pb-0 sticky top-0 bg-background z-20 border-b">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-lg sm:text-xl font-bold">
                  {constitutionMetadata.title}
                </DialogTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Version {constitutionMetadata.version} • Effective {constitutionMetadata.effectiveDate.toLocaleDateString()}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search constitution..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button onClick={handleDownload} size="sm" variant="outline" className="shrink-0">
              <Download className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">PDF</span>
            </Button>
          </div>
        </DialogHeader>

        <Tabs defaultValue="content" className="flex-1">
          <div className="px-4 sm:px-6 border-b">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="content" className="text-xs sm:text-sm">Full Document</TabsTrigger>
              <TabsTrigger value="toc" className="text-xs sm:text-sm">Table of Contents</TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="h-[calc(95vh-180px)]">
            <TabsContent value="content" className="mt-0 p-4 sm:p-6">
              {searchQuery && filteredSections.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Found {filteredSections.length} result(s) for "{searchQuery}"
                  </p>
                  {filteredSections.map((section) => (
                    <Card key={section.id} className="border-l-4 border-l-primary">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-2 mb-2">
                          <Badge variant="outline" className="shrink-0">
                            {section.number}
                          </Badge>
                          <h4 className="font-semibold text-sm">{section.title}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">{section.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : searchQuery && filteredSections.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {constitutionSections.map((section) => {
                    if (section.type !== "article") return null;
                    const subsections = getArticleSections(section.id);
                    
                    return (
                      <div
                        key={section.id}
                        id={`section-${section.id}`}
                        className={`scroll-mt-4 ${selectedArticle === section.id ? "bg-primary/5 rounded-lg p-4 -m-4" : ""}`}
                      >
                        <div className="mb-4">
                          {section.number && (
                            <Badge className="mb-2">{section.number}</Badge>
                          )}
                          <h2 className="text-xl sm:text-2xl font-bold mb-3">{section.title}</h2>
                          <p className="text-muted-foreground leading-relaxed">{section.content}</p>
                        </div>
                        
                        {subsections.length > 0 && (
                          <div className="space-y-4 ml-0 sm:ml-4">
                            {subsections.map((subsection) => (
                              <Card key={subsection.id} className="border-l-2 border-l-primary/40">
                                <CardContent className="p-4">
                                  <div className="flex items-start gap-2 mb-2">
                                    <Badge variant="secondary" className="shrink-0 text-xs">
                                      {subsection.number}
                                    </Badge>
                                    <h4 className="font-semibold text-sm">{subsection.title}</h4>
                                  </div>
                                  <p className="text-sm text-muted-foreground leading-relaxed">
                                    {subsection.content}
                                  </p>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="toc" className="mt-0 p-4 sm:p-6">
              <div className="space-y-2">
                {articles.map((article) => {
                  const sections = getArticleSections(article.id);
                  return (
                    <Card key={article.id} className="overflow-hidden">
                      <Button
                        variant="ghost"
                        className="w-full justify-between p-4 h-auto"
                        onClick={() => {
                          scrollToSection(article.id);
                          // Switch to content tab on mobile
                          const contentTab = document.querySelector('[value="content"]') as HTMLElement;
                          contentTab?.click();
                        }}
                      >
                        <div className="text-left">
                          <p className="font-semibold text-sm mb-1">{article.number}</p>
                          <p className="text-xs text-muted-foreground">{article.title}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 shrink-0" />
                      </Button>
                      {sections.length > 0 && (
                        <div className="border-t bg-muted/30 px-4 py-2">
                          <p className="text-xs text-muted-foreground">
                            {sections.length} section{sections.length > 1 ? "s" : ""}
                          </p>
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
