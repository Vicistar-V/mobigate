import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  PenSquare, 
  Eye, 
  Save, 
  Send, 
  FileText,
  AlertCircle 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ArticleEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const categories = [
  "Community News",
  "Opinion",
  "Education",
  "Health",
  "Technology",
  "Culture",
  "Business",
  "Sports",
];

export function ArticleEditorDialog({ open, onOpenChange }: ArticleEditorDialogProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [mode, setMode] = useState<"write" | "preview">("write");
  const { toast } = useToast();

  const handleSaveDraft = () => {
    if (!title.trim()) {
      toast({
        title: "Title Required",
        description: "Please provide a title for your article",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Draft Saved",
      description: "Your article has been saved as a draft",
    });
  };

  const handlePublish = () => {
    if (!title.trim() || !category || !content.trim()) {
      toast({
        title: "Incomplete Article",
        description: "Please fill in title, category, and content before publishing",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Article Published!",
      description: "Your article has been submitted for review",
    });

    onOpenChange(false);
    // Reset form
    setTimeout(() => {
      setTitle("");
      setCategory("");
      setExcerpt("");
      setContent("");
      setMode("write");
    }, 300);
  };

  const handleClose = () => {
    if (title || content) {
      const confirmed = window.confirm(
        "You have unsaved changes. Are you sure you want to close?"
      );
      if (!confirmed) return;
    }
    onOpenChange(false);
    setTimeout(() => {
      setTitle("");
      setCategory("");
      setExcerpt("");
      setContent("");
      setMode("write");
    }, 300);
  };

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const estimatedReadTime = Math.ceil(wordCount / 200); // Assuming 200 words per minute

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-4xl max-h-[95vh] p-0 flex flex-col">
        <DialogHeader className="p-4 sm:p-6 pb-0 border-b">
          <DialogTitle className="flex items-center gap-2">
            <PenSquare className="h-5 w-5 text-primary" />
            Write Article
          </DialogTitle>
        </DialogHeader>

        <Tabs value={mode} onValueChange={(v) => setMode(v as "write" | "preview")} className="flex-1 flex flex-col">
          <div className="px-4 sm:px-6 pt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="write">
                <FileText className="h-4 w-4 mr-2" />
                Write
              </TabsTrigger>
              <TabsTrigger value="preview">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="write" className="flex-1 mt-0">
            <ScrollArea className="h-[calc(95vh-240px)]">
              <div className="p-4 sm:p-6 space-y-4">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Article Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter a compelling title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-lg font-semibold"
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Excerpt */}
                <div className="space-y-2">
                  <Label htmlFor="excerpt">
                    Excerpt <span className="text-muted-foreground">(Optional)</span>
                  </Label>
                  <Textarea
                    id="excerpt"
                    placeholder="A brief summary of your article (shown in previews)..."
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    rows={2}
                    maxLength={200}
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {excerpt.length}/200 characters
                  </p>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <Label htmlFor="content">Article Content *</Label>
                  <Textarea
                    id="content"
                    placeholder="Start writing your article here...

You can write multiple paragraphs, share your insights, and tell your story. 

Tips for great articles:
• Use clear, concise language
• Break content into readable sections
• Share personal experiences or insights
• End with a call to action or conclusion"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={18}
                    className="font-mono text-sm"
                  />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{wordCount} words</span>
                    <span>{estimatedReadTime} min read</span>
                  </div>
                </div>

                {/* Writing Tips */}
                <Card className="p-4 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-blue-800 dark:text-blue-200">
                      <p className="font-medium mb-1">Writing Tips</p>
                      <ul className="space-y-1 list-disc list-inside">
                        <li>Start with a strong opening paragraph</li>
                        <li>Use subheadings to organize your content</li>
                        <li>Keep paragraphs short for mobile readability</li>
                        <li>Proofread before publishing</li>
                      </ul>
                    </div>
                  </div>
                </Card>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="preview" className="flex-1 mt-0">
            <ScrollArea className="h-[calc(95vh-240px)]">
              <div className="p-4 sm:p-6">
                {title || category || content ? (
                  <article className="max-w-3xl mx-auto space-y-4">
                    {/* Header */}
                    <div className="space-y-3">
                      {category && <Badge className="text-xs">{category}</Badge>}
                      {title && (
                        <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
                          {title}
                        </h1>
                      )}
                      {excerpt && (
                        <p className="text-base text-muted-foreground italic leading-relaxed">
                          {excerpt}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{wordCount} words</span>
                        <span>•</span>
                        <span>{estimatedReadTime} min read</span>
                      </div>
                    </div>

                    {/* Content */}
                    {content && (
                      <div className="prose prose-sm dark:prose-invert max-w-none pt-4 border-t">
                        {content.split("\n\n").map((paragraph, index) => (
                          <p key={index} className="text-sm leading-relaxed mb-4">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    )}
                  </article>
                ) : (
                  <div className="text-center py-12">
                    <Eye className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm font-medium">No content to preview</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Start writing to see a preview
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <DialogFooter className="p-4 sm:p-6 pt-0 border-t flex-col-reverse sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleSaveDraft}
            className="w-full sm:w-auto"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button onClick={handlePublish} className="w-full sm:w-auto">
            <Send className="h-4 w-4 mr-2" />
            Publish Article
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
