import { useState } from "react";
import { X, Calendar, Image, Users, Lock, ImagePlus, Video, Play, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { MediaUploadDialog } from "./MediaUploadDialog";

interface CreateSpecialEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface MediaFile {
  url: string;
  type: "image" | "video";
}

const eventTypes = [
  { value: "birthday", label: "Birthday", icon: "🎂" },
  { value: "anniversary", label: "Anniversary", icon: "💍" },
  { value: "achievement", label: "Achievement/Award", icon: "🏆" },
  { value: "graduation", label: "Graduation", icon: "🎓" },
  { value: "promotion", label: "Job Promotion", icon: "📈" },
  { value: "new-baby", label: "New Baby", icon: "👶" },
  { value: "wedding", label: "Wedding", icon: "💒" },
  { value: "retirement", label: "Retirement", icon: "🎉" },
  { value: "memorial", label: "Memorial/Remembrance", icon: "🕯️" },
  { value: "other", label: "Other", icon: "✨" }
];

const privacyOptions = [
  { value: "public", label: "Public", description: "Everyone can see" },
  { value: "members", label: "Members Only", description: "Only community members" },
  { value: "friends", label: "Friends", description: "Only your friends" },
  { value: "private", label: "Private", description: "Only you" }
];

export function CreateSpecialEventDialog({ open, onOpenChange }: CreateSpecialEventDialogProps) {
  const { toast } = useToast();
  const [eventType, setEventType] = useState("");
  const [eventDate, setEventDate] = useState<Date>();
  const [caption, setCaption] = useState("");
  const [taggedMembers, setTaggedMembers] = useState("");
  const [privacy, setPrivacy] = useState("public");
  
  // Media upload state
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [showMediaUpload, setShowMediaUpload] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleMediaUploadComplete = (files: Array<{ url: string; type: "image" | "video" }>) => {
    setMediaFiles(prev => [...prev, ...files]);
    setShowMediaUpload(false);
  };

  const handleRemoveMedia = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') || file.type.startsWith('video/')
    );

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const type = file.type.startsWith('video/') ? 'video' : 'image';
        setMediaFiles(prev => [...prev, { url: reader.result as string, type }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handlePost = () => {
    if (!eventType || !eventDate || !caption.trim()) {
      toast({
        title: "Incomplete Post",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Special Event Posted! 🎉",
      description: "Your special event has been shared with the community",
    });
    
    // Reset form
    setEventType("");
    setEventDate(undefined);
    setCaption("");
    setTaggedMembers("");
    setPrivacy("public");
    setMediaFiles([]);
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] p-0">
          <DialogHeader className="p-4 sm:p-6 pb-0 sticky top-0 bg-background z-10 border-b">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-bold">Create Special Event Post</DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <ScrollArea className="h-[calc(90vh-140px)]">
            <div className="p-4 sm:p-6 space-y-4">
              {/* Event Type */}
              <div>
                <label className="text-sm font-medium mb-2 block">Event Type *</label>
                <Select value={eventType} onValueChange={setEventType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type..." />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <span className="flex items-center gap-2">
                          <span>{type.icon}</span>
                          <span>{type.label}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Event Date */}
              <div>
                <label className="text-sm font-medium mb-2 block">Event Date *</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !eventDate && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {eventDate ? format(eventDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={eventDate}
                      onSelect={setEventDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Caption/Description */}
              <div>
                <label className="text-sm font-medium mb-2 block">Caption/Description *</label>
                <Textarea
                  placeholder="Share the story behind this special moment..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  rows={4}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {caption.length}/500 characters
                </p>
              </div>

              {/* Media Upload Section */}
              <div className="space-y-3">
                <label className="text-sm font-medium block">Photos/Videos</label>
                
                {/* Drop Zone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => setShowMediaUpload(true)}
                  className={cn(
                    "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
                    isDragging ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                  )}
                >
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG, GIF or MP4 up to 50MB
                  </p>
                </div>

                {/* Media Preview Grid */}
                {mediaFiles.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {mediaFiles.map((media, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-muted group">
                        {media.type === "video" ? (
                          <>
                            <video
                              src={media.url}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                              <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                                <Play className="h-5 w-5 text-primary fill-primary" />
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
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveMedia(index);
                          }}
                          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                        <div className="absolute bottom-1 left-1">
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-black/60 text-white flex items-center gap-1">
                            {media.type === "video" ? <Video className="h-3 w-3" /> : <Image className="h-3 w-3" />}
                          </span>
                        </div>
                      </div>
                    ))}
                    
                    {/* Add More Button */}
                    <button
                      onClick={() => setShowMediaUpload(true)}
                      className="aspect-square rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 hover:border-primary/50 transition-colors"
                    >
                      <ImagePlus className="h-6 w-6 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Add More</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Tag Members */}
              <div>
                <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Tag Members
                </label>
                <Input
                  placeholder="Type names to tag members..."
                  value={taggedMembers}
                  onChange={(e) => setTaggedMembers(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Tagged members will be notified about this post
                </p>
              </div>

              {/* Privacy Settings */}
              <div>
                <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Privacy
                </label>
                <Select value={privacy} onValueChange={setPrivacy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {privacyOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div>
                          <p className="font-medium">{option.label}</p>
                          <p className="text-xs text-muted-foreground">{option.description}</p>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </ScrollArea>

          {/* Footer Actions */}
          <div className="p-4 border-t bg-background sticky bottom-0">
            <div className="flex gap-2">
              <Button onClick={() => onOpenChange(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button onClick={handlePost} className="flex-1">
                Post Event 🎉
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <MediaUploadDialog
        open={showMediaUpload}
        onOpenChange={setShowMediaUpload}
        onUploadComplete={handleMediaUploadComplete}
      />
    </>
  );
}