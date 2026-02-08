import { useState } from "react";
import { X, Search, Download, BookOpen, ChevronRight, FileText, Scale } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { constitutionSections, constitutionMetadata } from "@/data/constitutionData";
import { DownloadFormatSheet, DownloadFormat } from "@/components/common/DownloadFormatSheet";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

interface ConstitutionViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ConstitutionViewer({ open, onOpenChange }: ConstitutionViewerProps) {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);
  const [showDownloadSheet, setShowDownloadSheet] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [activeTab, setActiveTab] = useState("content");

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
    setActiveTab("content");
    setTimeout(() => {
      const element = document.getElementById(`section-${sectionId}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  /* ── MOBILE LAYOUT ── */
  const mobileContent = (
    <div className="flex flex-col h-full max-h-[92vh] overflow-hidden w-full box-border">
      {/* ── Sticky header ── */}
      <div className="shrink-0 px-3 pt-1 pb-2 border-b bg-card">
        {/* Title row */}
        <div className="flex items-start gap-2 mb-2">
          <div className="bg-primary/10 p-1.5 rounded-lg shrink-0 mt-0.5">
            <Scale className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-bold leading-snug break-words">
              {constitutionMetadata.title}
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
              <Badge variant="secondary" className="text-xs px-1.5 py-0 h-5">
                v{constitutionMetadata.version}
              </Badge>
              <span className="text-xs text-muted-foreground">
                Effective {constitutionMetadata.effectiveDate.toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Search + Download row */}
        <div className="flex gap-1.5">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search constitution..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 text-sm h-8 touch-manipulation"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <Button 
            onClick={() => setShowDownloadSheet(true)} 
            size="sm" 
            variant="outline" 
            className="shrink-0 h-8 w-8 p-0 touch-manipulation active:bg-muted/70"
          >
            <Download className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* ── Tab bar ── */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <div className="shrink-0 px-3 pt-1.5 pb-1 border-b bg-card">
          <TabsList className="w-full grid grid-cols-2 h-8">
            <TabsTrigger value="content" className="text-xs h-7">
              <FileText className="h-3 w-3 mr-1" />
              Full Document
            </TabsTrigger>
            <TabsTrigger value="toc" className="text-xs h-7">
              <BookOpen className="h-3 w-3 mr-1" />
              Contents
            </TabsTrigger>
          </TabsList>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 min-h-0 overflow-y-auto touch-auto overscroll-contain">
          
          {/* Full Document Tab */}
          <TabsContent value="content" className="mt-0 m-0">
            <div className="px-3 py-2.5">
              {searchQuery && filteredSections.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground mb-2">
                    {filteredSections.length} result(s) for "{searchQuery}"
                  </p>
                  {filteredSections.map((section) => (
                    <div 
                      key={section.id} 
                      className="border-l-3 border-l-primary bg-muted/20 rounded-r-lg p-2.5"
                    >
                      <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                        {section.number && (
                          <Badge variant="outline" className="text-xs px-1.5 py-0 h-5 shrink-0">
                            {section.number}
                          </Badge>
                        )}
                        <span className="font-semibold text-xs break-words">{section.title}</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed break-words">
                        {section.content}
                      </p>
                    </div>
                  ))}
                </div>
              ) : searchQuery && filteredSections.length === 0 ? (
                <div className="text-center py-10">
                  <Search className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No results for "{searchQuery}"
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {constitutionSections.map((section) => {
                    if (section.type !== "article") return null;
                    const subsections = getArticleSections(section.id);
                    
                    return (
                      <div
                        key={section.id}
                        id={`section-${section.id}`}
                        className={`scroll-mt-2 ${
                          selectedArticle === section.id 
                            ? "bg-primary/5 rounded-lg p-2 -mx-0.5" 
                            : ""
                        }`}
                      >
                        {/* Article header */}
                        <div className="mb-2">
                          {section.number && (
                            <Badge className="text-xs px-1.5 py-0 h-5 mb-1">
                              {section.number}
                            </Badge>
                          )}
                          <h3 className="text-sm font-bold break-words leading-snug">
                            {section.title}
                          </h3>
                          <p className="text-xs text-muted-foreground leading-relaxed mt-1 break-words">
                            {section.content}
                          </p>
                        </div>
                        
                        {/* Sub-sections */}
                        {subsections.length > 0 && (
                          <div className="space-y-1.5 ml-1">
                            {subsections.map((sub) => (
                              <div 
                                key={sub.id} 
                                className="border-l-2 border-l-primary/30 pl-2.5 py-1.5"
                              >
                                <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                                  <Badge variant="secondary" className="text-xs px-1.5 py-0 h-5 shrink-0">
                                    {sub.number}
                                  </Badge>
                                  <span className="font-semibold text-xs break-words">
                                    {sub.title}
                                  </span>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed break-words">
                                  {sub.content}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Separator between articles */}
                        <div className="border-b border-border/50 mt-3" />
                      </div>
                    );
                  })}
                  
                  {/* Bottom safe area */}
                  <div className="h-6" />
                </div>
              )}
            </div>
          </TabsContent>

          {/* Table of Contents Tab */}
          <TabsContent value="toc" className="mt-0 m-0">
            <div className="px-3 py-2.5 space-y-1">
              {articles.map((article, index) => {
                const sections = getArticleSections(article.id);
                return (
                  <button
                    key={article.id}
                    className="w-full text-left rounded-lg p-2.5 bg-muted/30 hover:bg-muted/60 active:bg-muted/80 active:scale-[0.98] transition-all touch-manipulation"
                    tabIndex={-1}
                    onPointerDown={(e) => e.preventDefault()}
                    onClick={() => scrollToSection(article.id)}
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center h-6 w-6 rounded-md bg-primary/10 text-primary text-xs font-bold shrink-0">
                        {index + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        {article.number && (
                          <p className="text-xs font-bold text-primary mb-0.5">
                            {article.number}
                          </p>
                        )}
                        <p className="text-xs break-words leading-snug">
                          {article.title}
                        </p>
                        {sections.length > 0 && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {sections.length} section{sections.length > 1 ? "s" : ""}
                          </p>
                        )}
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    </div>
                  </button>
                );
              })}
              
              {/* Bottom safe area */}
              <div className="h-6" />
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );

  if (isMobile) {
    return (
      <>
        <Drawer open={open} onOpenChange={onOpenChange}>
          <DrawerContent className="max-h-[92vh] p-0 overflow-hidden" showClose={false}>
            {mobileContent}
          </DrawerContent>
        </Drawer>

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

  /* ── DESKTOP LAYOUT (kept minimal) ── */
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden">
          {mobileContent}
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
