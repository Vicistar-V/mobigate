import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Image, Video, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const CreatePostDialog = () => {
  const [content, setContent] = useState("");
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Please write something before posting.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Success!",
      description: "Your monetized post has been created.",
    });
    setContent("");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="w-full p-5 bg-card border-2 border-success/30 rounded-lg shadow-sm hover:shadow-md hover:border-success/50 transition-all cursor-pointer group">
          <div className="flex items-center gap-4">
            <div className="flex-1 text-left">
              <p className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                Create a Monetized Status Post
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Share your thoughts and earn
              </p>
            </div>
            <Plus className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
          </div>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create a Monetized Post</DialogTitle>
          <DialogDescription>
            Share your content and start earning from views and engagement.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="content">What's on your mind?</Label>
            <Textarea
              id="content"
              placeholder="Share something valuable with your audience..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[150px]"
            />
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1">
              <Image className="h-4 w-4 mr-2" />
              Photo
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <Video className="h-4 w-4 mr-2" />
              Video
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <FileText className="h-4 w-4 mr-2" />
              Article
            </Button>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <DialogTrigger asChild>
            <Button variant="outline">Cancel</Button>
          </DialogTrigger>
          <Button onClick={handleSubmit}>Publish Post</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
