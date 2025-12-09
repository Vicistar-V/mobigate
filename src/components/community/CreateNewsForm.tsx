import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Video, Image, FileText, Upload, X, Eye, Edit, Trash2, Send, ImagePlus, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NewsItem } from "@/data/newsData";
import { MediaUploadDialog } from "./MediaUploadDialog";
import { toast } from "sonner";

interface CreateNewsFormProps {
  onNewsCreated?: (news: NewsItem) => void;
  canPost?: boolean;
  className?: string;
}

interface MediaFile {
  url: string;
  type: "image" | "video";
}

export const CreateNewsForm = ({ onNewsCreated, canPost = true, className }: CreateNewsFormProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<NewsItem["category"]>("general");
  const [mediaType, setMediaType] = useState<NewsItem["mediaType"]>("article");
  const [thumbnail, setThumbnail] = useState<string>("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  
  // Additional media state
  const [additionalMedia, setAdditionalMedia] = useState<MediaFile[]>([]);
  const [showMediaUpload, setShowMediaUpload] = useState(false);

  if (!canPost) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnail(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeThumbnail = () => {
    setThumbnail("");
    setThumbnailFile(null);
  };

  const handleMediaUploadComplete = (files: Array<{ url: string; type: "image" | "video" }>) => {
    setAdditionalMedia(prev => [...prev, ...files]);
    setShowMediaUpload(false);
  };

  const handleRemoveAdditionalMedia = (index: number) => {
    setAdditionalMedia(prev => prev.filter((_, i) => i !== index));
  };

  const handlePreview = () => {
    if (!title || !description) {
      toast.error("Please fill in title and description");
      return;
    }
    setIsPreviewMode(true);
  };

  const handleDelete = () => {
    setTitle("");
    setDescription("");
    setCategory("general");
    setMediaType("article");
    setThumbnail("");
    setThumbnailFile(null);
    setAdditionalMedia([]);
    setIsPreviewMode(false);
  };

  const handlePublish = () => {
    if (!title || !description) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newNews: NewsItem = {
      id: `news-${Date.now()}`,
      title,
      description,
      date: new Date().toISOString(),
      category,
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      trending: false,
      mediaType,
      thumbnail: thumbnail || undefined,
      author: "Current User",
      authorProfileImage: "/placeholder.svg",
      authorId: "current-user"
    };

    onNewsCreated?.(newNews);
    toast.success("News published successfully!");
    handleDelete();
    setIsExpanded(false);
  };

  const getCategoryDisplay = (cat: NewsItem["category"]) => {
    const map = {
      announcements: "Announcements",
      events: "Events",
      updates: "Updates",
      general: "General News",
      affairs: "Community Affairs"
    };
    return map[cat];
  };

  return (
    <>
      <Card className={cn("mb-6 border-2 border-primary/30 hover:border-primary/50 transition-all overflow-hidden", className)}>
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <button className="w-full p-4 sm:p-6 text-center hover:bg-accent/50 transition-colors">
              <div className="flex items-center justify-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold text-primary">
                  Post News Info Here
                </h3>
                {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                [Admin could turn off this in Privacy Setting]
              </p>
            </button>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <div className="border-t">
              {/* Form Content */}
              {!isPreviewMode ? (
                <div className="p-4 sm:p-6 space-y-4">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="news-title" className="text-sm font-semibold">
                      Title <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="news-title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter news title..."
                      className="text-base"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="news-description" className="text-sm font-semibold">
                      Description <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="news-description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Write your news content here..."
                      className="min-h-[120px] resize-none text-base"
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <Label htmlFor="news-category" className="text-sm font-semibold">
                      Category
                    </Label>
                    <Select value={category} onValueChange={(val) => setCategory(val as NewsItem["category"])}>
                      <SelectTrigger id="news-category" className="text-base">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="announcements">Announcements</SelectItem>
                        <SelectItem value="events">Events</SelectItem>
                        <SelectItem value="updates">Updates</SelectItem>
                        <SelectItem value="general">General News</SelectItem>
                        <SelectItem value="affairs">Community Affairs</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Media Type */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Media Type</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        type="button"
                        variant={mediaType === "video" ? "default" : "outline"}
                        onClick={() => setMediaType("video")}
                        className="w-full gap-2 h-auto py-3"
                      >
                        <Video className="w-4 h-4" />
                        <span className="text-sm">Video</span>
                      </Button>
                      <Button
                        type="button"
                        variant={mediaType === "photo" ? "default" : "outline"}
                        onClick={() => setMediaType("photo")}
                        className="w-full gap-2 h-auto py-3"
                      >
                        <Image className="w-4 h-4" />
                        <span className="text-sm">Photo</span>
                      </Button>
                      <Button
                        type="button"
                        variant={mediaType === "article" ? "default" : "outline"}
                        onClick={() => setMediaType("article")}
                        className="w-full gap-2 h-auto py-3"
                      >
                        <FileText className="w-4 h-4" />
                        <span className="text-sm">Article</span>
                      </Button>
                    </div>
                  </div>

                  {/* Thumbnail Upload (for video/photo) */}
                  {(mediaType === "video" || mediaType === "photo") && (
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">
                        {mediaType === "video" ? "Video Thumbnail" : "Featured Photo"}
                      </Label>
                      
                      {thumbnail ? (
                        <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                          <img src={thumbnail} alt="Preview" className="w-full h-full object-cover" />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={removeThumbnail}
                            className="absolute top-2 right-2 h-8 w-8"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors bg-muted/30">
                          <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                          <span className="text-sm text-muted-foreground">
                            Click to upload {mediaType === "video" ? "thumbnail" : "photo"}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  )}

                  {/* Additional Media Gallery */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">
                      Additional Media Gallery (Optional)
                    </Label>
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowMediaUpload(true)}
                      className="w-full gap-2"
                    >
                      <ImagePlus className="w-4 h-4" />
                      Add More Photos/Videos
                    </Button>

                    {/* Additional Media Preview Grid */}
                    {additionalMedia.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {additionalMedia.map((media, index) => (
                          <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-muted group">
                            {media.type === "video" ? (
                              <>
                                <video
                                  src={media.url}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                  <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
                                    <Play className="h-4 w-4 text-primary fill-primary" />
                                  </div>
                                </div>
                              </>
                            ) : (
                              <img
                                src={media.url}
                                alt={`Media ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            )}
                            <button
                              onClick={() => handleRemoveAdditionalMedia(index)}
                              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </button>
                            <div className="absolute bottom-1 left-1">
                              <span className="px-1 py-0.5 rounded text-[9px] font-medium bg-black/60 text-white flex items-center gap-0.5">
                                {media.type === "video" ? <Video className="h-2.5 w-2.5" /> : <Image className="h-2.5 w-2.5" />}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2 mt-6 pt-4 border-t">
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handlePreview}
                        disabled={!title || !description}
                        className="gap-1 text-xs sm:text-sm"
                      >
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="truncate">PREVIEW</span>
                      </Button>
                      
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleDelete}
                        className="gap-1 text-xs sm:text-sm"
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="truncate">DELETE</span>
                      </Button>
                    </div>
                    
                    <Button
                      type="button"
                      onClick={handlePublish}
                      disabled={!title || !description}
                      className="w-full gap-2"
                    >
                      <Send className="w-4 h-4" />
                      PUBLISH NOW
                    </Button>
                  </div>
                </div>
              ) : (
                /* Preview Mode */
                <div className="p-4 sm:p-6 space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Preview</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsPreviewMode(false)}
                      className="gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      EDIT PREVIEW
                    </Button>
                  </div>

                  {/* Preview Card */}
                  <Card className="border-2 overflow-hidden">
                    {thumbnail && (
                      <div className="aspect-video relative bg-muted">
                        <img src={thumbnail} alt={title} className="w-full h-full object-cover" />
                        <div className="absolute top-2 right-2">
                          <span className="px-2 py-1 rounded-md bg-background/80 text-xs font-medium flex items-center gap-1">
                            {mediaType === "video" && <Video className="w-3 h-3" />}
                            {mediaType === "photo" && <Image className="w-3 h-3" />}
                            {mediaType === "article" && <FileText className="w-3 h-3" />}
                            {mediaType}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <div className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-lg leading-tight">{title}</h4>
                        <span className="text-xs px-2 py-1 rounded-md bg-primary/10 text-primary whitespace-nowrap">
                          {getCategoryDisplay(category)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {description}
                      </p>

                      {/* Additional Media Gallery in Preview */}
                      {additionalMedia.length > 0 && (
                        <div className="pt-3 border-t">
                          <p className="text-xs text-muted-foreground mb-2">Media Gallery ({additionalMedia.length})</p>
                          <div className="grid grid-cols-4 gap-1">
                            {additionalMedia.slice(0, 4).map((media, index) => (
                              <div key={index} className="relative aspect-square rounded overflow-hidden bg-muted">
                                {media.type === "video" ? (
                                  <>
                                    <video src={media.url} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                      <Play className="h-3 w-3 text-white" />
                                    </div>
                                  </>
                                ) : (
                                  <img src={media.url} alt="" className="w-full h-full object-cover" />
                                )}
                                {index === 3 && additionalMedia.length > 4 && (
                                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                    <span className="text-white text-sm font-bold">+{additionalMedia.length - 4}</span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
                        <span>Just now</span>
                        <span>0 views</span>
                        <span>0 likes</span>
                        <span>0 comments</span>
                      </div>
                    </div>
                  </Card>

                  {/* Action Buttons in Preview */}
                  <div className="flex flex-col gap-2 pt-4 border-t">
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsPreviewMode(false)}
                        className="gap-1 text-xs sm:text-sm"
                      >
                        <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="truncate">EDIT</span>
                      </Button>
                      
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleDelete}
                        className="gap-1 text-xs sm:text-sm"
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="truncate">DELETE</span>
                      </Button>
                    </div>
                    
                    <Button
                      type="button"
                      onClick={handlePublish}
                      className="w-full gap-2"
                    >
                      <Send className="w-4 h-4" />
                      PUBLISH NOW
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      <MediaUploadDialog
        open={showMediaUpload}
        onOpenChange={setShowMediaUpload}
        onUploadComplete={handleMediaUploadComplete}
      />
    </>
  );
};