import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Post } from "@/data/posts";
import { Upload, X } from "lucide-react";
import { LegalCopyrightAcceptance } from "@/components/common/LegalCopyrightAcceptance";
import { CopyrightDocumentsField } from "@/components/common/CopyrightDocumentsField";

const API_BASE = (import.meta.env.VITE_API_URL as string) || "https://angola-press.com/en/api";

interface EditPostDialogProps {
  post: Post;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updatedPost: Post) => void;
}

export const EditPostDialog = ({ post, open, onOpenChange, onSave }: EditPostDialogProps) => {
  const [title,       setTitle]       = useState(post.title);
  const [subtitle,    setSubtitle]    = useState(post.subtitle    || "");
  const [description, setDescription] = useState(post.description || "");
  const [type,        setType]        = useState(post.type);
  const [imageUrl,    setImageUrl]    = useState(post.imageUrl    || "");
  const [newMediaFile, setNewMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [submitting,   setSubmitting]   = useState(false);
  const [legalAccepted, setLegalAccepted] = useState(false);
  const [copyrightEnabled, setCopyrightEnabled] = useState(post.hasCopyrightDocs ?? false);
  const [copyrightFile, setCopyrightFile] = useState<File | null>(null);
  const [copyrightMarked, setCopyrightMarked] = useState(post.copyrightMarked ?? true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewMediaFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setMediaPreview(reader.result as string);
      reader.readAsDataURL(file);
      toast({ title: "Media selected", description: `${file.name} ready to upload` });
    }
  };

  const handleRemoveMedia = () => {
    setNewMediaFile(null);
    setMediaPreview(null);
    setImageUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast({ title: "Error", description: "Title is required", variant: "destructive" });
      return;
    }

    setSubmitting(true);

    try {
      const form = new FormData();
      form.append("post_id",   post.id ?? "");
      form.append("title",     title.trim());
      form.append("subtitle",  subtitle.trim());
      form.append("content",   description.trim());
      form.append("post_type", type.toLowerCase());
      if (newMediaFile) form.append("media", newMediaFile);
      if (copyrightEnabled && copyrightFile) form.append("copyright_document", copyrightFile);

      const xhr = new XMLHttpRequest();
      const result = await new Promise<{ success: boolean; error?: string }>((resolve, reject) => {
        xhr.onload  = () => { try { resolve(JSON.parse(xhr.responseText)); } catch { reject(new Error("Invalid response")); } };
        xhr.onerror = () => reject(new Error("Network error"));
        xhr.open("POST", `${API_BASE}/posts/update.php`);
        xhr.withCredentials = true;
        xhr.send(form);
      });

      if (result.success) {
        const updatedPost: Post = {
          ...post,
          title:       title.trim(),
          subtitle:    subtitle.trim()    || undefined,
          description: description.trim() || undefined,
          type,
          imageUrl:    mediaPreview || imageUrl || undefined,
        };
        onSave(updatedPost);
        toast({ title: "Success", description: "Post updated successfully" });
        onOpenChange(false);
      } else {
        toast({ title: "Error", description: result.error || "Could not save post.", variant: "destructive" });
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Upload failed.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Post</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter post title" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input id="subtitle" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Enter post subtitle (optional)" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description / Story</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Add accompanying story, description or more information about your media" className="min-h-[120px]" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Content Type</Label>
            <Select value={type} onValueChange={(value: any) => setType(value)}>
              <SelectTrigger id="type"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Photo">Photo</SelectItem>
                <SelectItem value="Video">Video</SelectItem>
                <SelectItem value="Audio">Audio</SelectItem>
                <SelectItem value="Article">Article</SelectItem>
                <SelectItem value="PDF">PDF</SelectItem>
                <SelectItem value="URL">URL</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Media File</Label>
            {(mediaPreview || imageUrl) && (
              <div className="relative rounded-lg border overflow-hidden bg-muted">
                <img src={mediaPreview || imageUrl} alt="Media preview" className="w-full h-48 object-cover" />
                <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2" onClick={handleRemoveMedia}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            <div className="flex gap-2">
              <Button type="button" variant="outline" className="w-full" onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-4 w-4 mr-2" />
                {mediaPreview || imageUrl ? "Change Media" : "Upload Media"}
              </Button>
              <input ref={fileInputRef} type="file" accept="image/*,video/*,audio/*,.pdf" onChange={handleFileChange} className="hidden" />
            </div>
            <p className="text-base text-muted-foreground">Supported formats: Images, Videos, Audio, PDF (Max 20MB)</p>
          </div>

        </div>

        <LegalCopyrightAcceptance
          accepted={legalAccepted}
          onAcceptedChange={setLegalAccepted}
          className="mt-2"
        />

        <CopyrightDocumentsField
          className="mt-3"
          enabled={copyrightEnabled}
          onEnabledChange={setCopyrightEnabled}
          file={copyrightFile}
          onFileChange={setCopyrightFile}
          marker={copyrightMarked}
          onMarkerChange={setCopyrightMarked}
        />



        <div className="flex justify-end gap-2 mt-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={submitting || !legalAccepted}>
            {submitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>

  );
};
