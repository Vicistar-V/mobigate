import { useState } from "react";
import { X, Image, BarChart3, Users, Lock, Smile } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

interface CommunityPostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const privacyOptions = [
  { value: "public", label: "Public", icon: "🌍" },
  { value: "members", label: "Members Only", icon: "👥" },
  { value: "executives", label: "Executives Only", icon: "👔" }
];

export function CommunityPostDialog({ open, onOpenChange }: CommunityPostDialogProps) {
  const { toast } = useToast();
  const [postContent, setPostContent] = useState("");
  const [privacy, setPrivacy] = useState("public");
  const [taggedMembers, setTaggedMembers] = useState("");
  const [showPoll, setShowPoll] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);

  const addPollOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions([...pollOptions, ""]);
    }
  };

  const updatePollOption = (index: number, value: string) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const removePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  };

  const handlePost = () => {
    if (!postContent.trim() && !showPoll) {
      toast({
        title: "Empty Post",
        description: "Please write something or create a poll",
        variant: "destructive"
      });
      return;
    }

    if (showPoll && (!pollQuestion.trim() || pollOptions.filter(o => o.trim()).length < 2)) {
      toast({
        title: "Incomplete Poll",
        description: "Poll needs a question and at least 2 options",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Post Created!",
      description: "Your post has been shared on the community status",
    });
    
    // Reset form
    setPostContent("");
    setPollQuestion("");
    setPollOptions(["", ""]);
    setShowPoll(false);
    setTaggedMembers("");
    setPrivacy("public");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0">
        <DialogHeader className="p-4 sm:p-6 pb-0 sticky top-0 bg-background z-10 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">Create Community Post</DialogTitle>
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
            {/* Post Content */}
            <div>
              <Textarea
                placeholder="What's on your mind? Share updates, announcements, or thoughts with the community..."
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                rows={6}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {postContent.length}/1000 characters
              </p>
            </div>

            {/* Media Upload */}
            <div>
              <Button variant="outline" className="w-full" size="sm">
                <Image className="h-4 w-4 mr-2" />
                Add Photos/Videos
              </Button>
            </div>

            <Separator />

            {/* Poll Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="poll-toggle" className="flex items-center gap-2 cursor-pointer">
                  <BarChart3 className="h-4 w-4" />
                  <span>Create Poll</span>
                </Label>
                <Switch
                  id="poll-toggle"
                  checked={showPoll}
                  onCheckedChange={setShowPoll}
                />
              </div>

              {showPoll && (
                <div className="space-y-3 p-4 bg-muted/30 rounded-lg border">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Poll Question</label>
                    <Input
                      placeholder="Ask a question..."
                      value={pollQuestion}
                      onChange={(e) => setPollQuestion(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Options</label>
                    <div className="space-y-2">
                      {pollOptions.map((option, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            placeholder={`Option ${index + 1}`}
                            value={option}
                            onChange={(e) => updatePollOption(index, e.target.value)}
                          />
                          {pollOptions.length > 2 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removePollOption(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                    {pollOptions.length < 4 && (
                      <Button
                        onClick={addPollOption}
                        variant="outline"
                        size="sm"
                        className="w-full mt-2"
                      >
                        Add Option
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Tag Members */}
            <div>
              <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                <Users className="h-4 w-4" />
                Tag Members (Optional)
              </label>
              <Input
                placeholder="Type names to tag members..."
                value={taggedMembers}
                onChange={(e) => setTaggedMembers(e.target.value)}
              />
            </div>

            {/* Privacy Settings */}
            <div>
              <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Who can see this?
              </label>
              <Select value={privacy} onValueChange={setPrivacy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {privacyOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <span className="flex items-center gap-2">
                        <span>{option.icon}</span>
                        <span>{option.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </ScrollArea>

        {/* Footer Actions */}
        <div className="p-4 border-t bg-background sticky bottom-0">
          <Button onClick={handlePost} className="w-full">
            Post to Community
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
