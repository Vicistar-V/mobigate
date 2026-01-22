import { useState } from "react";
import { Crown, Bell, Users, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { ElectionWinnerResult } from "@/data/adminElectionData";

interface WinnerAnnouncementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: ElectionWinnerResult | null;
  onConfirm: (resultId: string, options: { notify: boolean; updateLeadership: boolean; message: string }) => void;
}

export function WinnerAnnouncementDialog({
  open,
  onOpenChange,
  result,
  onConfirm
}: WinnerAnnouncementDialogProps) {
  const [notify, setNotify] = useState(true);
  const [updateLeadership, setUpdateLeadership] = useState(true);
  const [message, setMessage] = useState("");

  if (!result) return null;

  const winner = result.candidates.find(c => c.isWinner);

  if (!winner) return null;

  const handleConfirm = () => {
    onConfirm(result.id, { notify, updateLeadership, message });
    setMessage("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-green-600" />
            Announce Winner
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Confirmation Message */}
          <Card className="bg-amber-50 dark:bg-amber-950/30 border-amber-500/20">
            <CardContent className="p-4">
              <p className="text-sm">
                You are about to announce{" "}
                <span className="font-bold">{winner.name}</span> as the winner for the office of{" "}
                <span className="font-bold">{result.officeName}</span> of this community.
              </p>
            </CardContent>
          </Card>

          {/* Winner Preview Card */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={winner.avatar} alt={winner.name} />
                  <AvatarFallback>{winner.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg">{winner.name}</h3>
                    <Crown className="h-5 w-5 text-amber-500" />
                  </div>
                  <p className="text-sm text-muted-foreground">{result.officeName}</p>
                  <p className="text-sm font-medium text-green-600 mt-1">
                    {winner.votes.toLocaleString()} votes ({winner.percentage}%)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Options */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Notify All Members</p>
                  <p className="text-xs text-muted-foreground">Send push notification</p>
                </div>
              </div>
              <Switch checked={notify} onCheckedChange={setNotify} />
            </div>

            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Update Leadership</p>
                  <p className="text-xs text-muted-foreground">Auto-update executive list</p>
                </div>
              </div>
              <Switch checked={updateLeadership} onCheckedChange={setUpdateLeadership} />
            </div>
          </div>

          {/* Custom Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Announcement Message (Optional)</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a custom message for the announcement..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} className="gap-2 bg-green-600 hover:bg-green-700">
            <Megaphone className="h-4 w-4" />
            Announce Winner
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
