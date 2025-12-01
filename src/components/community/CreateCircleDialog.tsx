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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Lock, Globe, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CreateCircleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCircleCreated?: (circle: any) => void;
}

const emojiOptions = [
  "👥", "💙", "🎯", "⭐", "🔥", "💪", "🌟", "🎉",
  "🏆", "💼", "🎓", "🏠", "⚽", "🎨", "🎵", "📚",
  "💻", "🌍", "🚀", "🎮", "🍕", "☕", "🌸", "🎭",
];

export function CreateCircleDialog({
  open,
  onOpenChange,
  onCircleCreated,
}: CreateCircleDialogProps) {
  const [circleName, setCircleName] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState(emojiOptions[0]);
  const [description, setDescription] = useState("");
  const [privacy, setPrivacy] = useState<"private" | "public">("private");
  const [step, setStep] = useState<"details" | "confirm">("details");
  const { toast } = useToast();

  const handleContinue = () => {
    if (!circleName.trim()) {
      toast({
        title: "Circle Name Required",
        description: "Please provide a name for your circle",
        variant: "destructive",
      });
      return;
    }

    if (circleName.trim().length < 3) {
      toast({
        title: "Name Too Short",
        description: "Circle name must be at least 3 characters",
        variant: "destructive",
      });
      return;
    }

    setStep("confirm");
  };

  const handleCreate = () => {
    const newCircle = {
      id: `circle-${Date.now()}`,
      name: circleName,
      icon: selectedEmoji,
      description: description || "No description provided",
      privacy,
      memberCount: 1,
      isOwner: true,
      createdAt: new Date(),
    };

    toast({
      title: "Circle Created!",
      description: `"${circleName}" has been created successfully`,
    });

    if (onCircleCreated) {
      onCircleCreated(newCircle);
    }

    onOpenChange(false);
    // Reset form
    setTimeout(() => {
      setCircleName("");
      setSelectedEmoji(emojiOptions[0]);
      setDescription("");
      setPrivacy("private");
      setStep("details");
    }, 300);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setCircleName("");
      setSelectedEmoji(emojiOptions[0]);
      setDescription("");
      setPrivacy("private");
      setStep("details");
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Create New Circle
          </DialogTitle>
        </DialogHeader>

        {step === "details" && (
          <div className="space-y-4">
            {/* Circle Name */}
            <div className="space-y-2">
              <Label htmlFor="circle-name">Circle Name *</Label>
              <Input
                id="circle-name"
                placeholder="e.g., Close Friends, Family, Work Buddies"
                value={circleName}
                onChange={(e) => setCircleName(e.target.value)}
                maxLength={50}
              />
              <p className="text-xs text-muted-foreground text-right">
                {circleName.length}/50 characters
              </p>
            </div>

            {/* Emoji Selector */}
            <div className="space-y-2">
              <Label>Choose an Icon</Label>
              <Card className="p-4">
                <ScrollArea className="h-32">
                  <div className="grid grid-cols-8 gap-2">
                    {emojiOptions.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setSelectedEmoji(emoji)}
                        className={`text-2xl w-10 h-10 rounded-lg flex items-center justify-center transition-all hover:bg-accent ${
                          selectedEmoji === emoji
                            ? "bg-primary text-primary-foreground ring-2 ring-primary"
                            : "bg-muted"
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </Card>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Description <span className="text-muted-foreground">(Optional)</span>
              </Label>
              <Textarea
                id="description"
                placeholder="What's this circle about?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                maxLength={150}
              />
              <p className="text-xs text-muted-foreground text-right">
                {description.length}/150 characters
              </p>
            </div>

            {/* Privacy Setting */}
            <div className="space-y-2">
              <Label>Privacy Setting</Label>
              <RadioGroup value={privacy} onValueChange={(v) => setPrivacy(v as "private" | "public")}>
                <Card className="p-4">
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="private" id="private" className="mt-1" />
                    <Label htmlFor="private" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2 mb-1">
                        <Lock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Private</span>
                        <Badge variant="secondary" className="text-xs">Recommended</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Only people you add can see this circle and its content
                      </p>
                    </Label>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="public" id="public" className="mt-1" />
                    <Label htmlFor="public" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2 mb-1">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Public</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Anyone in the community can discover and join this circle
                      </p>
                    </Label>
                  </div>
                </Card>
              </RadioGroup>
            </div>

            <DialogFooter>
              <Button onClick={handleContinue} className="w-full">
                Continue
              </Button>
            </DialogFooter>
          </div>
        )}

        {step === "confirm" && (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <div className="flex justify-center">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-4xl">
                  {selectedEmoji}
                </div>
              </div>
              <h3 className="text-xl font-bold">Review Your Circle</h3>
              <p className="text-sm text-muted-foreground">
                Make sure everything looks good before creating
              </p>
            </div>

            <Card className="p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Circle Name</span>
                <span className="font-semibold">{circleName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Icon</span>
                <span className="text-2xl">{selectedEmoji}</span>
              </div>
              {description && (
                <div className="flex justify-between text-sm items-start">
                  <span className="text-muted-foreground">Description</span>
                  <span className="font-medium text-right max-w-[200px]">
                    {description}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Privacy</span>
                <div className="flex items-center gap-1">
                  {privacy === "private" ? (
                    <>
                      <Lock className="h-3 w-3" />
                      <span className="font-medium capitalize">{privacy}</span>
                    </>
                  ) : (
                    <>
                      <Globe className="h-3 w-3" />
                      <span className="font-medium capitalize">{privacy}</span>
                    </>
                  )}
                </div>
              </div>
            </Card>

            <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-blue-800 dark:text-blue-200">
                  <p className="font-medium mb-1">What happens next?</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Your circle will be created instantly</li>
                    <li>You can start adding members right away</li>
                    <li>Share posts exclusively with this circle</li>
                  </ul>
                </div>
              </div>
            </div>

            <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setStep("details")} className="w-full sm:w-auto">
                Back
              </Button>
              <Button onClick={handleCreate} className="w-full sm:w-auto">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Create Circle
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
