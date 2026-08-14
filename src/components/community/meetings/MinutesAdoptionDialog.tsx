import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Calendar,
  Users,
  Vote,
  MessageSquare,
  AlertCircle,
} from "lucide-react";
import {
  MeetingMinutes,
  mockMinutesAdoptions,
  mockMinutesSettings,
} from "@/data/meetingsData";
import { format, formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

interface MinutesAdoptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  minutes: MeetingMinutes;
  communityId?: string;
  onVoted?: () => void;
}

export const MinutesAdoptionDialog = ({
  open,
  onOpenChange,
  minutes,
  communityId,
  onVoted,
}: MinutesAdoptionDialogProps) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [userVote, setUserVote] = useState<"adopt" | "reject" | null>(null);

  const [adoptVotes, setAdoptVotes] = useState<any[]>([]);
  const [rejectVotes, setRejectVotes] = useState<any[]>([]);

  const loadAdoptions = () => {
    if (!communityId) return;
    fetch(`/api/community/meetings_admin.php?action=minutes_adoptions&minutes_id=${minutes.id}&community_id=${communityId}`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        const mapped = (d.adoptions ?? []).map((a: any) => ({
          id: a.id, minutesId: a.minutes_id, memberId: a.member_id,
          memberName: a.member_name?.trim() || "Member", memberAvatar: a.member_avatar || "/placeholder.svg",
          vote: a.vote, comment: a.comment, votedAt: new Date(a.voted_at),
        }));
        setAdoptVotes(mapped.filter((a: any) => a.vote === "adopt"));
        setRejectVotes(mapped.filter((a: any) => a.vote === "reject"));
      })
      .catch(() => {});
  };

  useEffect(() => { if (open) loadAdoptions(); }, [open, minutes.id, communityId]);

  const handleVote = async (vote: "adopt" | "reject") => {
    if (!communityId) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/community/meetings_admin.php", {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "vote_adopt_minutes", community_id: communityId, minutes_id: minutes.id, vote, comment }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d.error || "Failed to record your vote");

      setHasVoted(true);
      setUserVote(vote);

      toast({
        title: vote === "adopt" ? "Vote Recorded: Adopt" : "Vote Recorded: Reject",
        description: vote === "adopt"
          ? "Thank you for adopting the minutes. Your vote has been recorded."
          : "Your rejection has been recorded with your feedback.",
      });
      onVoted?.();
      loadAdoptions();
    } catch (e: any) {
      toast({ title: "Couldn't Record Vote", description: e.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const content = (
    <div className="space-y-6">
      {/* Minutes Info Card */}
      <Card className="p-4 bg-muted/30">
        <div className="flex items-start gap-3">
          <FileText className="h-8 w-8 text-primary flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold">{minutes.meetingName}</h3>
            <p className="text-sm text-muted-foreground">
              <Calendar className="h-3 w-3 inline mr-1" />
              {format(minutes.meetingDate, "MMMM d, yyyy")}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {minutes.fileName} • {minutes.fileSize}
            </p>
          </div>
        </div>
      </Card>

      {/* Adoption Progress */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-medium flex items-center gap-2">
            <Vote className="h-4 w-4" />
            Adoption Progress
          </h4>
          <Badge
            variant="outline"
            className={
              minutes.adoptionPercentage >= minutes.adoptionThreshold
                ? "text-green-600 border-green-200"
                : "text-yellow-600 border-yellow-200"
            }
          >
            {minutes.adoptionPercentage}%
          </Badge>
        </div>
        
        <Progress value={minutes.adoptionPercentage} className="h-3" />
        
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 bg-green-50 rounded-lg">
            <div className="text-lg font-bold text-green-600">{minutes.adoptedVotes}</div>
            <div className="text-xs text-muted-foreground">Adopted</div>
          </div>
          <div className="p-2 bg-red-50 rounded-lg">
            <div className="text-lg font-bold text-red-600">{minutes.rejectedVotes}</div>
            <div className="text-xs text-muted-foreground">Rejected</div>
          </div>
          <div className="p-2 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-gray-600">
              {minutes.totalVoters - minutes.adoptedVotes - minutes.rejectedVotes}
            </div>
            <div className="text-xs text-muted-foreground">Pending</div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground text-center">
          Requires {minutes.adoptionThreshold}% ({Math.ceil(minutes.totalVoters * minutes.adoptionThreshold / 100)} votes) for adoption
        </p>
      </div>

      {/* Tabs for Voters */}
      <Tabs defaultValue="adopted" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="adopted" className="gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Adopted ({adoptVotes.length})
          </TabsTrigger>
          <TabsTrigger value="rejected" className="gap-1">
            <XCircle className="h-3 w-3" />
            Rejected ({rejectVotes.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="adopted" className="mt-4">
          <ScrollArea className="h-[200px]">
            <div className="space-y-2">
              {adoptVotes.map((adoption) => (
                <Card key={adoption.id} className="p-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={adoption.memberAvatar} alt={adoption.memberName} />
                      <AvatarFallback>{adoption.memberName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{adoption.memberName}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(adoption.votedAt, { addSuffix: true })}
                      </p>
                    </div>
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  </div>
                  {adoption.comment && (
                    <p className="text-xs text-muted-foreground mt-2 pl-11">
                      "{adoption.comment}"
                    </p>
                  )}
                </Card>
              ))}
              {adoptVotes.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No adoption votes yet
                </p>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="rejected" className="mt-4">
          <ScrollArea className="h-[200px]">
            <div className="space-y-2">
              {rejectVotes.map((adoption) => (
                <Card key={adoption.id} className="p-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={adoption.memberAvatar} alt={adoption.memberName} />
                      <AvatarFallback>{adoption.memberName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{adoption.memberName}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(adoption.votedAt, { addSuffix: true })}
                      </p>
                    </div>
                    <XCircle className="h-4 w-4 text-red-600" />
                  </div>
                  {adoption.comment && (
                    <p className="text-xs text-muted-foreground mt-2 pl-11">
                      "{adoption.comment}"
                    </p>
                  )}
                </Card>
              ))}
              {rejectVotes.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No rejection votes yet
                </p>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* Vote Section */}
      {minutes.status === "pending_adoption" && (
        <div className="space-y-4 border-t pt-4">
          <h4 className="font-medium">Cast Your Vote</h4>
          
          {hasVoted ? (
            <Card className="p-4 bg-muted/30 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                {userVote === "adopt" ? (
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-600" />
                )}
                <span className="font-medium">
                  {userVote === "adopt" ? "You adopted these minutes" : "You rejected these minutes"}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Thank you for participating in the adoption process.
              </p>
            </Card>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="comment">Comment (Optional)</Label>
                <Textarea
                  id="comment"
                  placeholder="Add a comment about your vote..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                  onClick={() => handleVote("reject")}
                  disabled={isSubmitting}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => handleVote("adopt")}
                  disabled={isSubmitting}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Adopt
                </Button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Already Adopted Notice */}
      {minutes.status === "adopted" && (
        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex items-center gap-2 text-green-700">
            <CheckCircle2 className="h-5 w-5" />
            <div>
              <p className="font-medium">Minutes Adopted</p>
              <p className="text-sm">
                Adopted on {minutes.adoptedAt && format(minutes.adoptedAt, "MMMM d, yyyy")} with {minutes.adoptionPercentage}% approval.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[92vh]">
          <DrawerHeader className="border-b">
            <DrawerTitle>Minutes Adoption</DrawerTitle>
          </DrawerHeader>
          <ScrollArea className="flex-1 p-4 overflow-y-auto touch-auto">
            {content}
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Minutes Adoption</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-4">
          {content}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
