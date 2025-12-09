import { useState, useRef } from "react";
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
  AlertCircle,
  Image as ImageIcon,
  Video,
  Upload,
  X,
  ImagePlus,
  Play
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MediaUploadDialog } from "./MediaUploadDialog";

interface ArticleEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface MediaFile {
  url: string;
  type: "image" | "video";
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
  
  // Media state
  const [coverImage, setCoverImage] = useState<string>("");
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [showMediaUpload, setShowMediaUpload] = useState(false);
  const [isDraggingCover, setIsDraggingCover] = useState(false);
  
  const coverInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleCoverImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid File",
          description: "Please select an image file for the cover",
          variant: "destructive",
        });
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Cover image must be under 10MB",
          variant: "destructive",
        });
        return;
      }
      const url = URL.createObjectURL(file);
      setCoverImage(url);
    }
  };

  const handleCoverDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingCover(true);
  };

  const handleCoverDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingCover(false);
  };

  const handleCoverDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingCover(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid File",
          description: "Please drop an image file for the cover",
          variant: "destructive",
        });
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Cover image must be under 10MB",
          variant: "destructive",
        });
        return;
      }
      const url = URL.createObjectURL(file);
      setCoverImage(url);
    }
  };

  const handleRemoveCover = () => {
    setCoverImage("");
    if (coverInputRef.current) {
      coverInputRef.current.value = "";
    }
  };

  const handleMediaUploadComplete = (files: Array<{ url: string; type: "image" | "video" }>) => {
    setMediaFiles((prev) => [...prev, ...files]);
    setShowMediaUpload(false);
    toast({
      title: "Media Added",
      description: `${files.length} file(s) added to your article`,
    });
  };

  const handleRemoveMedia = (index: number) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
  };

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
      resetForm();
    }, 300);
  };

  const resetForm = () => {
    setTitle("");
    setCategory("");
    setExcerpt("");
    setContent("");
    setCoverImage("");
    setMediaFiles([]);
    setMode("write");
  };

  const handleClose = () => {
    if (title || content || coverImage || mediaFiles.length > 0) {
      const confirmed = window.confirm(
        "You have unsaved changes. Are you sure you want to close?"
      );
      if (!confirmed) return;
    }
    onOpenChange(false);
    setTimeout(() => {
      resetForm();
    }, 300);
  };

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const estimatedReadTime = Math.ceil(wordCount / 200); // Assuming 200 words per minute

  return (
    <>
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

                  {/* Featured/Cover Image */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-primary" />
                      Featured Image <span className="text-muted-foreground">(Optional)</span>
                    </Label>
                    
                    {coverImage ? (
                      <div className="relative rounded-lg overflow-hidden border bg-muted">
                        <img 
                          src={coverImage} 
                          alt="Cover preview" 
                          className="w-full h-48 object-cover"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-8 w-8 rounded-full"
                          onClick={handleRemoveCover}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <div className="absolute bottom-2 left-2">
                          <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                            <ImageIcon className="h-3 w-3 mr-1" />
                            Cover Image
                          </Badge>
                        </div>
                      </div>
                    ) : (
                      <div
                        className={`
                          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
                          transition-all duration-200
                          ${isDraggingCover 
                            ? "border-primary bg-primary/5" 
                            : "border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/50"
                          }
                        `}
                        onDragOver={handleCoverDragOver}
                        onDragLeave={handleCoverDragLeave}
                        onDrop={handleCoverDrop}
                        onClick={() => coverInputRef.current?.click()}
                      >
                        <input
                          ref={coverInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleCoverImageSelect}
                        />
                        <div className="flex flex-col items-center gap-2">
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <Upload className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {isDraggingCover ? "Drop image here" : "Click or drag to upload"}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              PNG, JPG, GIF up to 10MB
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Additional Media Gallery */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <ImagePlus className="h-4 w-4 text-primary" />
                      Additional Media <span className="text-muted-foreground">(Optional)</span>
                    </Label>
                    
                    <div className="space-y-3">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full h-12 border-dashed"
                        onClick={() => setShowMediaUpload(true)}
                      >
                        <ImagePlus className="h-4 w-4 mr-2" />
                        Add Photos / Videos
                      </Button>

                      {/* Media Preview Grid */}
                      {mediaFiles.length > 0 && (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                          {mediaFiles.map((file, index) => (
                            <div
                              key={index}
                              className="relative aspect-square rounded-lg overflow-hidden border bg-muted group"
                            >
                              {file.type === "image" ? (
                                <img
                                  src={file.url}
                                  alt={`Media ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full relative">
                                  <video
                                    src={file.url}
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                    <div className="h-8 w-8 rounded-full bg-white/90 flex items-center justify-center">
                                      <Play className="h-4 w-4 text-foreground fill-current ml-0.5" />
                                    </div>
                                  </div>
                                </div>
                              )}
                              
                              {/* Remove button */}
                              <Button
                                variant="destructive"
                                size="icon"
                                className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleRemoveMedia(index)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                              
                              {/* Type indicator */}
                              <div className="absolute bottom-1 left-1">
                                <div className="h-5 w-5 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center">
                                  {file.type === "image" ? (
                                    <ImageIcon className="h-3 w-3 text-foreground" />
                                  ) : (
                                    <Video className="h-3 w-3 text-foreground" />
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                          
                          {/* Add more button */}
                          <button
                            type="button"
                            onClick={() => setShowMediaUpload(true)}
                            className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/50 flex items-center justify-center transition-all"
                          >
                            <ImagePlus className="h-5 w-5 text-muted-foreground" />
                          </button>
                        </div>
                      )}

                      {mediaFiles.length > 0 && (
                        <p className="text-xs text-muted-foreground">
                          {mediaFiles.length} file{mediaFiles.length !== 1 ? "s" : ""} added • 
                          {mediaFiles.filter(f => f.type === "image").length} photo{mediaFiles.filter(f => f.type === "image").length !== 1 ? "s" : ""}, 
                          {" "}{mediaFiles.filter(f => f.type === "video").length} video{mediaFiles.filter(f => f.type === "video").length !== 1 ? "s" : ""}
                        </p>
                      )}
                    </div>
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
                          <li>Add media to make your article more engaging</li>
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
                  {title || category || content || coverImage || mediaFiles.length > 0 ? (
                    <article className="max-w-3xl mx-auto space-y-4">
                      {/* Cover Image in Preview */}
                      {coverImage && (
                        <div className="rounded-lg overflow-hidden border">
                          <img 
                            src={coverImage} 
                            alt="Article cover" 
                            className="w-full h-48 sm:h-64 object-cover"
                          />
                        </div>
                      )}

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
                          {mediaFiles.length > 0 && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <ImageIcon className="h-3 w-3" />
                                {mediaFiles.length} media
                              </span>
                            </>
                          )}
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

                      {/* Media Gallery in Preview */}
                      {mediaFiles.length > 0 && (
                        <div className="space-y-3 pt-4 border-t">
                          <h3 className="text-sm font-semibold flex items-center gap-2">
                            <ImagePlus className="h-4 w-4" />
                            Media Gallery ({mediaFiles.length})
                          </h3>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {mediaFiles.map((file, index) => (
                              <div
                                key={index}
                                className="relative aspect-video rounded-lg overflow-hidden border bg-muted"
                              >
                                {file.type === "image" ? (
                                  <img
                                    src={file.url}
                                    alt={`Gallery ${index + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full relative">
                                    <video
                                      src={file.url}
                                      className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                      <div className="h-10 w-10 rounded-full bg-white/90 flex items-center justify-center">
                                        <Play className="h-5 w-5 text-foreground fill-current ml-0.5" />
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
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

      {/* Media Upload Dialog */}
      <MediaUploadDialog
        open={showMediaUpload}
        onOpenChange={setShowMediaUpload}
        onUploadComplete={handleMediaUploadComplete}
      />
    </>
  );
}
