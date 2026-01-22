import React, { useState, useEffect } from "react";
import { X, Upload, Image, Video, Music, Images, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ContentType, AdminContentItem } from "@/data/adminContentData";

interface ContentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contentType: ContentType;
  editingItem?: AdminContentItem | null;
  onSubmit: (data: Partial<AdminContentItem>) => void;
}

const contentTypeLabels: Record<ContentType, string> = {
  news: "News",
  event: "Event",
  article: "Article",
  vibe: "Vibe"
};

const newsCategories = ["Announcements", "Events", "Updates", "General", "Affairs"];
const eventTypes = ["Conference", "Workshop", "Meetup", "Celebration", "Fundraiser", "Social"];
const venueTypes = ["indoor", "outdoor", "virtual", "hybrid"] as const;
const audienceTypes = ["Members Only", "Public", "VIP", "Families", "Youth", "Seniors"];
const articleCategories = ["Community News", "Culture", "Development", "Education", "Opinion"];
const mediaTypes = ["video", "photo", "audio", "gallery"] as const;

export function ContentFormDialog({
  open,
  onOpenChange,
  contentType,
  editingItem,
  onSubmit
}: ContentFormDialogProps) {
  const [formData, setFormData] = useState<Partial<AdminContentItem>>({
    type: contentType,
    title: "",
    description: "",
    content: "",
    category: "",
    featured: false,
    spotlight: false,
    mediaType: "photo",
    venueType: "indoor",
    tags: [],
  });
  const [newTag, setNewTag] = useState("");
  const [publishOption, setPublishOption] = useState<"draft" | "pending" | "published">("draft");

  useEffect(() => {
    if (editingItem) {
      setFormData({
        ...editingItem,
        tags: editingItem.tags || [],
      });
      setPublishOption(editingItem.status === "published" ? "published" : editingItem.status === "pending" ? "pending" : "draft");
    } else {
      setFormData({
        type: contentType,
        title: "",
        description: "",
        content: "",
        category: "",
        featured: false,
        spotlight: false,
        mediaType: "photo",
        venueType: "indoor",
        tags: [],
      });
      setPublishOption("draft");
    }
  }, [editingItem, contentType, open]);

  const handleSubmit = () => {
    const data: Partial<AdminContentItem> = {
      ...formData,
      type: contentType,
      status: publishOption,
      submittedAt: publishOption === "pending" ? new Date() : undefined,
      publishedAt: publishOption === "published" ? new Date() : undefined,
    };
    onSubmit(data);
    onOpenChange(false);
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(t => t !== tag) || []
    }));
  };

  const renderTypeSpecificFields = () => {
    switch (contentType) {
      case "news":
        return (
          <>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={formData.category || ""} onValueChange={(v) => setFormData(prev => ({ ...prev, category: v }))}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {newsCategories.map(cat => (
                    <SelectItem key={cat} value={cat.toLowerCase()}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label>Featured News</Label>
              <Switch checked={formData.featured} onCheckedChange={(v) => setFormData(prev => ({ ...prev, featured: v }))} />
            </div>
          </>
        );

      case "event":
        return (
          <>
            <div className="space-y-2">
              <Label>Event Type</Label>
              <Select value={formData.category || ""} onValueChange={(v) => setFormData(prev => ({ ...prev, category: v }))}>
                <SelectTrigger><SelectValue placeholder="Select event type" /></SelectTrigger>
                <SelectContent>
                  {eventTypes.map(type => (
                    <SelectItem key={type} value={type.toLowerCase()}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Venue Name</Label>
              <Input 
                value={formData.venue || ""} 
                onChange={(e) => setFormData(prev => ({ ...prev, venue: e.target.value }))}
                placeholder="Enter venue name"
              />
            </div>
            <div className="space-y-2">
              <Label>Venue Type</Label>
              <Select value={formData.venueType || "indoor"} onValueChange={(v) => setFormData(prev => ({ ...prev, venueType: v as typeof venueTypes[number] }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {venueTypes.map(type => (
                    <SelectItem key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Start Date & Time</Label>
                <Input 
                  type="datetime-local" 
                  onChange={(e) => setFormData(prev => ({ ...prev, eventDate: new Date(e.target.value) }))}
                />
              </div>
              <div className="space-y-2">
                <Label>End Date & Time</Label>
                <Input 
                  type="datetime-local" 
                  onChange={(e) => setFormData(prev => ({ ...prev, eventEndDate: new Date(e.target.value) }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Capacity (optional)</Label>
              <Input 
                type="number" 
                value={formData.capacity || ""} 
                onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) || undefined }))}
                placeholder="Maximum attendees"
              />
            </div>
          </>
        );

      case "article":
        return (
          <>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={formData.category || ""} onValueChange={(v) => setFormData(prev => ({ ...prev, category: v }))}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {articleCategories.map(cat => (
                    <SelectItem key={cat} value={cat.toLowerCase()}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Excerpt</Label>
              <Textarea 
                value={formData.description || ""} 
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief summary of the article"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Full Content</Label>
              <Textarea 
                value={formData.content || ""} 
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Article content..."
                rows={6}
              />
            </div>
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input 
                  value={newTag} 
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add tag"
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                />
                <Button type="button" size="icon" variant="outline" onClick={addTag}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.tags && formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {formData.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <button onClick={() => removeTag(tag)} className="ml-1">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center justify-between">
              <Label>Featured Article</Label>
              <Switch checked={formData.featured} onCheckedChange={(v) => setFormData(prev => ({ ...prev, featured: v }))} />
            </div>
          </>
        );

      case "vibe":
        return (
          <>
            <div className="space-y-2">
              <Label>Media Type</Label>
              <div className="grid grid-cols-4 gap-2">
                {mediaTypes.map(type => {
                  const icons = { video: Video, photo: Image, audio: Music, gallery: Images };
                  const Icon = icons[type];
                  return (
                    <Button
                      key={type}
                      type="button"
                      variant={formData.mediaType === type ? "default" : "outline"}
                      className="flex flex-col h-16 gap-1"
                      onClick={() => setFormData(prev => ({ ...prev, mediaType: type }))}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-[10px] capitalize">{type}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
            {(formData.mediaType === "video" || formData.mediaType === "audio") && (
              <div className="space-y-2">
                <Label>Duration</Label>
                <Input 
                  value={formData.duration || ""} 
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  placeholder="e.g., 3:45"
                />
              </div>
            )}
            <div className="flex items-center justify-between">
              <Label>Add to Spotlight</Label>
              <Switch checked={formData.spotlight} onCheckedChange={(v) => setFormData(prev => ({ ...prev, spotlight: v }))} />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader className="border-b pb-4">
          <DrawerTitle>
            {editingItem ? `Edit ${contentTypeLabels[contentType]}` : `Create ${contentTypeLabels[contentType]}`}
          </DrawerTitle>
        </DrawerHeader>
        
        <ScrollArea className="flex-1 px-4 py-4 overflow-y-auto touch-auto" style={{ maxHeight: "60vh" }}>
          <div className="space-y-4">
            {/* Title - Common to all */}
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input 
                value={formData.title || ""} 
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder={`Enter ${contentType} title`}
              />
            </div>

            {/* Description - Common to most */}
            {contentType !== "article" && (
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea 
                  value={formData.description || ""} 
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter description..."
                  rows={3}
                />
              </div>
            )}

            {/* Thumbnail Upload */}
            <div className="space-y-2">
              <Label>{contentType === "vibe" ? "Media Upload" : "Thumbnail"}</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF up to 10MB</p>
                <Button variant="outline" size="sm" className="mt-3">
                  Choose File
                </Button>
              </div>
            </div>

            {/* Type-specific fields */}
            {renderTypeSpecificFields()}

            {/* Publish Option */}
            <div className="space-y-2">
              <Label>Publish Option</Label>
              <Select value={publishOption} onValueChange={(v) => setPublishOption(v as typeof publishOption)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Save as Draft</SelectItem>
                  <SelectItem value="pending">Submit for Review</SelectItem>
                  <SelectItem value="published">Publish Now</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </ScrollArea>

        <DrawerFooter className="border-t pt-4">
          <div className="flex gap-2 w-full">
            <DrawerClose asChild>
              <Button variant="outline" className="flex-1">Cancel</Button>
            </DrawerClose>
            <Button 
              className="flex-1 bg-purple-600 hover:bg-purple-700" 
              onClick={handleSubmit}
              disabled={!formData.title?.trim()}
            >
              {editingItem ? "Update" : "Create"}
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
