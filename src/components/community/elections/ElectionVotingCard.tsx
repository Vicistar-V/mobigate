import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, MessageSquare, ChevronDown, FileText, Clock, RefreshCw } from "lucide-react";
import { ElectionOffice, ElectionCandidate, defaultElectionSettings } from "@/data/electionData";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { ManifestoViewerDialog } from "./ManifestoViewerDialog";
import { VoteConfirmationDialog } from "./VoteConfirmationDialog";
import { ChangeVoteDialog } from "./ChangeVoteDialog";

interface ElectionVotingCardProps {
  office: ElectionOffice;
  onVote?: (candidateId: string, comment?: string) => void;
  settings?: typeof defaultElectionSettings;
}

export const ElectionVotingCard = ({ 
  office, 
  onVote,
  settings = defaultElectionSettings 
}: ElectionVotingCardProps) => {
  // Voting state
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [voteTimestamp, setVoteTimestamp] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  
  // Dialog states
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingVoteCandidate, setPendingVoteCandidate] = useState<ElectionCandidate | null>(null);
  const [showChangeDialog, setShowChangeDialog] = useState(false);
  const [pendingChangeCandidate, setPendingChangeCandidate] = useState<ElectionCandidate | null>(null);
  
  // Comment state
  const [comments, setComments] = useState<Record<string, string>>({});
  const [customComment, setCustomComment] = useState("");
  const [showCustomComment, setShowCustomComment] = useState<string | null>(null);
  
  // Manifesto state
  const [manifestoCandidate, setManifestoCandidate] = useState<ElectionCandidate | null>(null);
  const [showManifesto, setShowManifesto] = useState(false);

  const predefinedComments = [
    "Excellent choice!",
    "I trust this candidate",
    "Best for the community",
    "Strong leadership skills",
    "I have reservations",
    "Need more information"
  ];

  // Countdown timer for vote change
  useEffect(() => {
    if (!voteTimestamp || !settings.allowVoteChange) return;

    const interval = setInterval(() => {
      const elapsedMinutes = (Date.now() - voteTimestamp) / 1000 / 60;
      const remaining = settings.voteChangeTimeframeMinutes - elapsedMinutes;
      
      if (remaining <= 0) {
        setTimeRemaining(0);
        clearInterval(interval);
      } else {
        setTimeRemaining(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [voteTimestamp, settings.voteChangeTimeframeMinutes, settings.allowVoteChange]);

  const formatTimeRemaining = useCallback((minutes: number) => {
    const mins = Math.floor(minutes);
    const secs = Math.floor((minutes - mins) * 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const canChangeVote = settings.allowVoteChange && timeRemaining > 0;

  const handleVoteClick = (candidate: ElectionCandidate) => {
    if (selectedCandidate === candidate.id) {
      // Already voted for this candidate
      return;
    }

    if (selectedCandidate && canChangeVote) {
      // Changing vote - show change dialog
      setPendingChangeCandidate(candidate);
      setShowChangeDialog(true);
    } else if (!selectedCandidate) {
      // Initial vote - show confirmation dialog
      setPendingVoteCandidate(candidate);
      setShowConfirmDialog(true);
    }
    // If selectedCandidate exists but can't change, button should be disabled
  };

  const handleConfirmVote = () => {
    if (pendingVoteCandidate) {
      setSelectedCandidate(pendingVoteCandidate.id);
      setVoteTimestamp(Date.now());
      setTimeRemaining(settings.voteChangeTimeframeMinutes);
      onVote?.(pendingVoteCandidate.id, comments[pendingVoteCandidate.id]);
      setPendingVoteCandidate(null);
    }
  };

  const handleConfirmChangeVote = () => {
    if (pendingChangeCandidate) {
      setSelectedCandidate(pendingChangeCandidate.id);
      setVoteTimestamp(Date.now()); // Reset timer
      setTimeRemaining(settings.voteChangeTimeframeMinutes);
      onVote?.(pendingChangeCandidate.id, comments[pendingChangeCandidate.id]);
      setPendingChangeCandidate(null);
    }
  };

  const handleCommentSelect = (candidateId: string, comment: string) => {
    setComments({ ...comments, [candidateId]: comment });
    setShowCustomComment(null);
  };

  const handleCustomCommentSave = (candidateId: string) => {
    if (customComment.trim()) {
      setComments({ ...comments, [candidateId]: customComment });
      setCustomComment("");
      setShowCustomComment(null);
    }
  };

  const getCandidateColorClass = (color: string, type: 'bg' | 'border' = 'bg') => {
    const colorMap = {
      green: type === 'bg' ? 'bg-green-500' : 'border-green-500',
      purple: type === 'bg' ? 'bg-purple-600' : 'border-purple-600',
      magenta: type === 'bg' ? 'bg-pink-500' : 'border-pink-500',
      orange: type === 'bg' ? 'bg-orange-500' : 'border-orange-500',
      blue: type === 'bg' ? 'bg-blue-500' : 'border-blue-500',
    };
    return colorMap[color as keyof typeof colorMap] || (type === 'bg' ? 'bg-gray-500' : 'border-gray-500');
  };

  const getVotedCandidate = () => {
    return office.candidates.find(c => c.id === selectedCandidate) || null;
  };

  return (
    <Card className="p-4 mb-4">
      {/* Office Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">{office.name}</h3>
          <p className="text-sm text-muted-foreground">
            Code: {office.shortCode} | Voters: {office.totalAccreditedVoters}
          </p>
        </div>
        <Badge variant="secondary">Remark</Badge>
      </div>

      {/* Candidates List */}
      <div className="space-y-4">
        {office.candidates.map((candidate) => {
          const isVoted = selectedCandidate === candidate.id;
          const isOtherCandidate = selectedCandidate && selectedCandidate !== candidate.id;
          const isDisabled = isOtherCandidate && !canChangeVote;

          return (
            <div 
              key={candidate.id} 
              className={`border rounded-xl p-4 transition-all ${
                isVoted 
                  ? `border-2 ${getCandidateColorClass(candidate.color, 'border')} bg-muted/30` 
                  : 'border-border'
              }`}
            >
              {/* Row 1: Full Name - Full Width */}
              <div className="flex items-center gap-3 mb-4">
                <span className={`w-4 h-4 rounded-full flex-shrink-0 ${getCandidateColorClass(candidate.color)}`} />
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-base font-semibold text-foreground">+</span>
                  <span className="text-base font-semibold text-foreground break-words">
                    {candidate.name}
                  </span>
                </div>
              </div>

              {/* Row 2: Action Buttons */}
              <div className="flex gap-2 mb-3">
                <Button
                  size="default"
                  variant={isVoted ? "default" : "outline"}
                  className={`flex-1 h-11 ${
                    isVoted
                      ? `${getCandidateColorClass(candidate.color)} text-white hover:opacity-90`
                      : isDisabled
                        ? "opacity-50"
                        : ""
                  }`}
                  onClick={() => handleVoteClick(candidate)}
                  disabled={isDisabled}
                >
                  {isVoted ? (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      Voted
                    </>
                  ) : isOtherCandidate && canChangeVote ? (
                    "Vote"
                  ) : (
                    "Vote"
                  )}
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="default" variant="outline" className="flex-1 h-11">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Comment
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    {predefinedComments.map((comment) => (
                      <DropdownMenuItem
                        key={comment}
                        onClick={() => handleCommentSelect(candidate.id, comment)}
                      >
                        {comment}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuItem onClick={() => setShowCustomComment(candidate.id)}>
                      Write custom comment...
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Row 3: View Campaign Manifesto Button */}
              <Button
                size="default"
                variant="ghost"
                className="w-full h-10 text-primary hover:text-primary hover:bg-primary/10 mb-2"
                onClick={() => {
                  setManifestoCandidate(candidate);
                  setShowManifesto(true);
                }}
              >
                <FileText className="w-4 h-4 mr-2" />
                View Campaign Manifesto
              </Button>

              {/* Row 4: Comment Display */}
              {comments[candidate.id] && (
                <div className="text-sm text-muted-foreground p-3 bg-muted rounded-lg mb-2">
                  <span className="font-medium">Comment:</span> {comments[candidate.id]}
                </div>
              )}

              {/* Custom Comment Input */}
              {showCustomComment === candidate.id && (
                <div className="space-y-3 mb-2">
                  <Textarea
                    placeholder="Write your comment..."
                    value={customComment}
                    onChange={(e) => setCustomComment(e.target.value)}
                    className="min-h-[80px]"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1" onClick={() => handleCustomCommentSave(candidate.id)}>
                      Save Comment
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => setShowCustomComment(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Row 5: Change Vote Timer (only for voted candidate) */}
              {isVoted && settings.allowVoteChange && settings.showVoteChangeCountdown && (
                <div className={`flex items-center justify-center gap-2 p-3 rounded-lg ${
                  timeRemaining > 0 
                    ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {timeRemaining > 0 ? (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        Change vote available for {formatTimeRemaining(timeRemaining)}
                      </span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">Vote is now final</span>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Vote Confirmation Dialog */}
      <VoteConfirmationDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        candidate={pendingVoteCandidate}
        officeName={office.name}
        onConfirm={handleConfirmVote}
      />

      {/* Change Vote Dialog */}
      <ChangeVoteDialog
        open={showChangeDialog}
        onOpenChange={setShowChangeDialog}
        previousCandidate={getVotedCandidate()}
        newCandidate={pendingChangeCandidate}
        officeName={office.name}
        timeRemainingMinutes={timeRemaining}
        onConfirm={handleConfirmChangeVote}
      />

      {/* Manifesto Viewer Dialog */}
      <ManifestoViewerDialog
        open={showManifesto}
        onOpenChange={setShowManifesto}
        candidate={manifestoCandidate}
        officeName={office.name}
      />
    </Card>
  );
};
