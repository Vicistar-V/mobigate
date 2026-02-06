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
import { DownloadFormatSheet, DownloadFormat } from "@/components/common/DownloadFormatSheet";
import { useToast } from "@/hooks/use-toast";

interface ConstitutionViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ConstitutionViewer({ open, onOpenChange }: ConstitutionViewerProps) {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);
  const [showDownloadSheet, setShowDownloadSheet] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

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

  const handleDownload = (format: DownloadFormat) => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      setShowDownloadSheet(false);
      toast({
        title: "Download Complete",
        description: `Constitution downloaded as ${format.toUpperCase()}`,
      });
    }, 1500);
  };

  const scrollToSection = (sectionId: string) => {
    setSelectedArticle(sectionId);
    const element = document.getElementById(`section-${sectionId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[95vh] p-0 overflow-x-hidden">
          <DialogHeader className="p-3 pb-0 sticky top-0 bg-background z-20 border-b">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <div className="bg-primary/10 p-1.5 rounded-lg shrink-0">
                  <BookOpen className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <DialogTitle className="text-sm font-bold truncate">
                    {constitutionMetadata.title}
                  </DialogTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    v{constitutionMetadata.version} • {constitutionMetadata.effectiveDate.toLocaleDateString()}
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
            
            <div className="flex gap-2 pb-2">
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 text-sm h-9 touch-manipulation"
                />
              </div>
              <Button 
                onClick={() => setShowDownloadSheet(true)} 
                size="sm" 
                variant="outline" 
                className="shrink-0 h-9 px-2.5 touch-manipulation active:bg-muted/70"
              >
                <Download className="h-3.5 w-3.5" />
              </Button>
            </div>
          </DialogHeader>

          <Tabs defaultValue="content" className="flex-1">
            <div className="px-3 border-b">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="content" className="text-xs">Full Document</TabsTrigger>
                <TabsTrigger value="toc" className="text-xs">Contents</TabsTrigger>
              </TabsList>
            </div>

            <ScrollArea className="h-[calc(95vh-160px)]">
              <TabsContent value="content" className="mt-0 p-3">
                {searchQuery && filteredSections.length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-xs text-muted-foreground">
                      Found {filteredSections.length} result(s) for "{searchQuery}"
                    </p>
                    {filteredSections.map((section) => (
                      <Card key={section.id} className="border-l-4 border-l-primary overflow-hidden">
                        <CardContent className="p-3">
                          <div className="flex items-start gap-2 mb-1.5 flex-wrap">
                            <Badge variant="outline" className="shrink-0 text-xs">
                              {section.number}
                            </Badge>
                            <h4 className="font-semibold text-xs min-w-0">{section.title}</h4>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">{section.content}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : searchQuery && filteredSections.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground text-sm">No results found for "{searchQuery}"</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {constitutionSections.map((section) => {
                      if (section.type !== "article") return null;
                      const subsections = getArticleSections(section.id);
                      
                      return (
                        <div
                          key={section.id}
                          id={`section-${section.id}`}
                          className={`scroll-mt-4 ${selectedArticle === section.id ? "bg-primary/5 rounded-lg p-3 -m-3" : ""}`}
                        >
                          <div className="mb-3">
                            {section.number && (
                              <Badge className="mb-1.5 text-xs">{section.number}</Badge>
                            )}
                            <h2 className="text-base font-bold mb-2">{section.title}</h2>
                            <p className="text-sm text-muted-foreground leading-relaxed">{section.content}</p>
                          </div>
                          
                          {subsections.length > 0 && (
                            <div className="space-y-2.5">
                              {subsections.map((subsection) => (
                                <Card key={subsection.id} className="border-l-2 border-l-primary/40 overflow-hidden">
                                  <CardContent className="p-3">
                                    <div className="flex items-start gap-1.5 mb-1.5 flex-wrap">
                                      <Badge variant="secondary" className="shrink-0 text-xs">
                                        {subsection.number}
                                      </Badge>
                                      <h4 className="font-semibold text-xs min-w-0">{subsection.title}</h4>
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
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

              <TabsContent value="toc" className="mt-0 p-3">
                <div className="space-y-1.5">
                  {articles.map((article) => {
                    const sections = getArticleSections(article.id);
                    return (
                      <Card key={article.id} className="overflow-hidden">
                        <Button
                          variant="ghost"
                          className="w-full justify-between p-3 h-auto touch-manipulation"
                          onClick={() => {
                            scrollToSection(article.id);
                            const contentTab = document.querySelector('[value="content"]') as HTMLElement;
                            contentTab?.click();
                          }}
                        >
                          <div className="text-left min-w-0 flex-1">
                            <p className="font-semibold text-xs mb-0.5">{article.number}</p>
                            <p className="text-xs text-muted-foreground truncate">{article.title}</p>
                          </div>
                          <ChevronRight className="h-3.5 w-3.5 shrink-0 ml-2" />
                        </Button>
                        {sections.length > 0 && (
                          <div className="border-t bg-muted/30 px-3 py-1.5">
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

      <DownloadFormatSheet
        open={showDownloadSheet}
        onOpenChange={setShowDownloadSheet}
        onDownload={handleDownload}
        title="Download Constitution"
        documentName={constitutionMetadata.title}
        availableFormats={["pdf", "docx", "txt"]}
        isDownloading={isDownloading}
      />
    </>
  );
}
