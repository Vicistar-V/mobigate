import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, Image as ImageIcon, Video, X, Upload, FileText, Calendar, Star } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CommunityCreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  communityName?: string;
  authorName?: string;
  authorAvatar?: string;
  onSubmit: (payload: { content: string; title?: string; type: string; mediaUrl?: string; mediaType?: string }) => Promise<boolean>;
  uploadMedia: (file: File) => Promise<{ url: string; type: string } | null>;
}

const POST_TYPES = [
  { value: "status",    label: "Status Update",    icon: FileText,  color: "text-blue-500" },
  { value: "photo",     label: "Photo",             icon: ImageIcon, color: "text-green-500" },
  { value: "video",     label: "Video",             icon: Video,     color: "text-purple-500" },
  { value: "event",     label: "Event",             icon: Calendar,  color: "text-orange-500" },
  { value: "announcement", label: "Announcement",  icon: Star,      color: "text-yellow-500" },
];

export function CommunityCreatePostDialog({
  open, onOpenChange, communityName, authorName, authorAvatar,
  onSubmit, uploadMedia,
}: CommunityCreatePostDialogProps) {
  const [content,     setContent]     = useState("");
  const [title,       setTitle]       = useState("");
  const [type,        setType]        = useState("status");
  const [mediaUrl,    setMediaUrl]    = useState<string | null>(null);
  const [mediaType,   setMediaType]   = useState<string | null>(null);
  const [uploading,   setUploading]   = useState(false);
  const [submitting,  setSubmitting]  = useState(false);
  const [preview,     setPreview]     = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const selectedType = POST_TYPES.find(t => t.value === type) || POST_TYPES[0];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) { toast.error("File too large (max 50MB)"); return; }
    setUploading(true);
    // Show local preview immediately
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    const result = await uploadMedia(file);
    setUploading(false);
    if (result) {
      setMediaUrl(result.url);
      setMediaType(result.type);
      setType(result.type === "video" ? "video" : "photo");
      toast.success("Media uploaded");
    } else {
      setPreview(null);
      toast.error("Upload failed");
    }
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleRemoveMedia = () => {
    setMediaUrl(null); setMediaType(null); setPreview(null);
    if (type === "photo" || type === "video") setType("status");
  };

  const handleSubmit = async () => {
    if (!content.trim() && !mediaUrl) { toast.error("Please write something or add media"); return; }
    setSubmitting(true);
    const ok = await onSubmit({ content: content.trim(), title: title.trim() || undefined, type, mediaUrl: mediaUrl || undefined, mediaType: mediaType || undefined });
    setSubmitting(false);
    if (ok) {
      setContent(""); setTitle(""); setMediaUrl(null); setMediaType(null); setPreview(null); setType("status");
      onOpenChange(false);
      toast.success("Post published!");
    }
  };

  const handleClose = () => {
    if (!submitting) {
      setContent(""); setTitle(""); setMediaUrl(null); setMediaType(null); setPreview(null); setType("status");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-xl p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-5 py-4 border-b">
          <DialogTitle className="text-base">
            Create Post in <span className="text-primary">{communityName}</span>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <div className="px-5 py-4 space-y-4">
            {/* Author row */}
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={authorAvatar} />
                <AvatarFallback>{(authorName || "U")[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold">{authorName}</p>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger className="h-6 text-xs border-none shadow-none p-0 w-auto gap-1 focus:ring-0">
                    <selectedType.icon className={cn("h-3 w-3", selectedType.color)} />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {POST_TYPES.map(t => (
                      <SelectItem key={t.value} value={t.value}>
                        <div className="flex items-center gap-2">
                          <t.icon className={cn("h-4 w-4", t.color)} />
                          {t.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Title (for events/announcements) */}
            {(type === "event" || type === "announcement") && (
              <Input
                placeholder={type === "event" ? "Event title..." : "Announcement title..."}
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="font-semibold"
              />
            )}

            {/* Content */}
            <Textarea
              placeholder={`What's on your mind? Share with ${communityName}...`}
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={4}
              className="resize-none border-none shadow-none text-base focus-visible:ring-0 px-0"
            />

            {/* Media preview */}
            {(preview || uploading) && (
              <div className="relative rounded-xl overflow-hidden bg-muted">
                {uploading && !preview && (
                  <div className="h-48 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                )}
                {preview && mediaType === "video" ? (
                  <video src={preview} className="w-full max-h-64 object-cover rounded-xl" controls />
                ) : preview ? (
                  <img src={preview} className="w-full max-h-64 object-cover rounded-xl" alt="preview" />
                ) : null}
                {uploading && preview && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-white" />
                  </div>
                )}
                {!uploading && (
                  <button onClick={handleRemoveMedia}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}

            {/* Character count */}
            {content && (
              <p className={cn("text-xs text-right", content.length > 4500 ? "text-destructive" : "text-muted-foreground")}>
                {content.length}/5000
              </p>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="px-5 py-3 border-t bg-muted/30">
          <div className="flex items-center justify-between">
            {/* Media attach buttons */}
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" className="h-8 px-2 text-green-600 hover:text-green-700 hover:bg-green-50"
                disabled={uploading} onClick={() => { fileRef.current?.setAttribute('accept', 'image/*'); fileRef.current?.click(); }}>
                <ImageIcon className="h-4 w-4 mr-1" /> Photo
              </Button>
              <Button variant="ghost" size="sm" className="h-8 px-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                disabled={uploading} onClick={() => { fileRef.current?.setAttribute('accept', 'video/*'); fileRef.current?.click(); }}>
                <Video className="h-4 w-4 mr-1" /> Video
              </Button>
              <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleFileChange} />
            </div>

            {/* Submit */}
            <Button onClick={handleSubmit} disabled={submitting || uploading || (!content.trim() && !mediaUrl)} className="h-8 px-5">
              {submitting ? <><Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />Posting...</> : "Post"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
