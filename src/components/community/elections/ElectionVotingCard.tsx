import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, MessageSquare, ChevronDown, FileText, Clock, RefreshCw, ChevronRight, MessageCircle, Users, Vote, TrendingUp } from "lucide-react";
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
import { AdminRemarkDrawer } from "./AdminRemarkDrawer";
import { CandidateCommentsDrawer } from "./CandidateCommentsDrawer";
import { MemberPreviewDialog } from "@/components/community/MemberPreviewDialog";
import { ExecutiveMember } from "@/data/communityExecutivesData";

interface ElectionVotingCardProps {
  office: ElectionOffice;
  onVote?: (candidateId: string, comment?: string) => void;
  settings?: typeof defaultElectionSettings;
}

interface CandidateComment {
  id: string;
  candidateName: string;
  candidateColor: string;
  comment: string;
  timestamp: Date;
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
  
  // Admin remark drawer state
  const [showRemarkDrawer, setShowRemarkDrawer] = useState(false);
  
  // Comments drawer state
  const [showCommentsDrawer, setShowCommentsDrawer] = useState(false);
  
  // Comment state
  const [comments, setComments] = useState<Record<string, string>>({});
  const [customComment, setCustomComment] = useState("");
  const [showCustomComment, setShowCustomComment] = useState<string | null>(null);
  
  // Manifesto state
  const [manifestoCandidate, setManifestoCandidate] = useState<ElectionCandidate | null>(null);
  const [showManifesto, setShowManifesto] = useState(false);

  // Profile preview state
  const [showMemberPreview, setShowMemberPreview] = useState(false);
  const [selectedMember, setSelectedMember] = useState<ExecutiveMember | null>(null);

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

  const mapCandidateToMember = (candidate: ElectionCandidate): ExecutiveMember => ({
    id: candidate.id,
    name: candidate.name,
    position: office.name + " Candidate",
    tenure: "2024-2026",
    imageUrl: candidate.avatar || "/placeholder.svg",
    level: "officer" as const,
    committee: "executive" as const,
  });

  const handleNameClick = (candidate: ElectionCandidate) => {
    setSelectedMember(mapCandidateToMember(candidate));
    setShowMemberPreview(true);
  };

  const getButtonColorClasses = (color: string, isVoted: boolean) => {
    if (isVoted) {
      const colorMap = {
        green: 'bg-green-600 hover:bg-green-700 text-white',
        purple: 'bg-purple-600 hover:bg-purple-700 text-white',
        magenta: 'bg-pink-600 hover:bg-pink-700 text-white',
        orange: 'bg-orange-600 hover:bg-orange-700 text-white',
        blue: 'bg-blue-600 hover:bg-blue-700 text-white',
      };
      return colorMap[color as keyof typeof colorMap] || 'bg-primary text-white';
    }
    return 'bg-primary/10 hover:bg-primary/20 text-primary border-primary/30';
  };

  const getVotedCandidate = () => {
    return office.candidates.find(c => c.id === selectedCandidate) || null;
  };

  // Get all comments for the drawer
  const getAllComments = (): CandidateComment[] => {
    return Object.entries(comments).map(([candidateId, comment], index) => {
      const candidate = office.candidates.find(c => c.id === candidateId);
      return {
        id: `comment-${candidateId}`,
        candidateName: candidate?.name || "Unknown",
        candidateColor: candidate?.color || "gray",
        comment,
        timestamp: new Date(Date.now() - (index * 300000)) // Stagger timestamps
      };
    });
  };

  const totalComments = Object.keys(comments).length;

  return (
    <Card className="p-4 mb-4">
      {/* Office Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold">{office.name}</h3>
          <p className="text-sm text-muted-foreground">
            Code: {office.shortCode}
          </p>
        </div>
        <Badge 
          variant="secondary" 
          className="cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors"
          onClick={() => setShowRemarkDrawer(true)}
        >
          Remark
        </Badge>
      </div>

      {/* Stats Row - Accredited Voters & Voted */}
      <div className="flex gap-3 mb-4">
        <button 
          className="flex-1 flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
          onClick={() => {
            // Could navigate to accredited voters list
          }}
        >
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Accredited Voters: {office.totalAccreditedVoters?.toLocaleString() || "1,200"}
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-blue-500 dark:text-blue-400" />
        </button>
        
        <button 
          className="flex-1 flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/30 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors"
          onClick={() => {
            // Could show voting progress
          }}
        >
          <div className="flex items-center gap-2">
            <Vote className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-green-700 dark:text-green-300">
              Voted: {office.votedCount?.toLocaleString() || "320"}
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-green-500 dark:text-green-400" />
        </button>
      </div>

      {/* Comment Stats Bar - Clickable */}
      <button 
        className="w-full flex items-center justify-between p-3 bg-muted/50 rounded-lg mb-4 hover:bg-muted transition-colors"
        onClick={() => setShowCommentsDrawer(true)}
      >
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">
            {totalComments} Voter Comment{totalComments !== 1 ? 's' : ''}
          </span>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      </button>

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
              {/* Row 1: Avatar Photo + Name - Full Width */}
              <div className="flex items-center gap-3 mb-1">
                <button
                  className="relative shrink-0 touch-manipulation active:scale-[0.95]"
                  onClick={() => handleNameClick(candidate)}
                >
                  <Avatar className="h-12 w-12 border-2 border-muted">
                    <AvatarImage src={candidate.avatar} alt={candidate.name} />
                    <AvatarFallback className="text-sm font-semibold bg-muted">
                      {candidate.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <span className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-background ${getCandidateColorClass(candidate.color)}`} />
                </button>
                <div className="flex-1 min-w-0">
                  <button
                    className="text-base font-semibold text-foreground break-words leading-tight text-left touch-manipulation active:text-primary transition-colors"
                    onClick={() => handleNameClick(candidate)}
                  >
                    {candidate.name}
                  </button>
                </div>
              </div>

              {/* Row 1.5: Current Votes Stat */}
              <div className="flex items-center gap-2 ml-[calc(3rem+0.75rem)] mb-3">
                <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                  {candidate.votes.toLocaleString()} {candidate.votes === 1 ? 'Vote' : 'Votes'}
                </span>
              </div>

              {/* Row 2: View Campaign Manifesto - Directly below name */}
              <button
                className="w-full flex items-center justify-center gap-2 py-2 mb-3 text-primary hover:text-primary/80 hover:bg-primary/5 rounded-lg transition-colors text-sm font-medium"
                onClick={() => {
                  setManifestoCandidate(candidate);
                  setShowManifesto(true);
                }}
              >
                <FileText className="w-4 h-4" />
                View Campaign Manifesto
              </button>

              {/* Row 3: Action Buttons - Colored and prominent */}
              <div className="flex gap-2 mb-3">
                <Button
                  size="default"
                  className={`flex-1 h-12 font-semibold border ${getButtonColorClasses(candidate.color, isVoted)} ${
                    isDisabled ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={() => handleVoteClick(candidate)}
                  disabled={isDisabled}
                >
                  {isVoted ? (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      Voted
                    </>
                  ) : (
                    "Vote"
                  )}
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      size="default" 
                      className="flex-1 h-12 font-semibold bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                    >
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

              {/* Row 4: Comment Display */}
              {comments[candidate.id] && (
                <div className="text-sm text-muted-foreground p-3 bg-muted rounded-lg mb-2">
                  <span className="font-medium">Your comment:</span> {comments[candidate.id]}
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

      {/* Admin Remark Drawer */}
      <AdminRemarkDrawer
        open={showRemarkDrawer}
        onOpenChange={setShowRemarkDrawer}
        officeName={office.name}
        remark={office.adminRemark || "No admin remarks available for this position."}
      />

      {/* Candidate Comments Drawer */}
      <CandidateCommentsDrawer
        open={showCommentsDrawer}
        onOpenChange={setShowCommentsDrawer}
        officeName={office.name}
        comments={getAllComments()}
      />

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

      {/* Member Profile Preview */}
      <MemberPreviewDialog
        member={selectedMember}
        open={showMemberPreview}
        onOpenChange={setShowMemberPreview}
      />
    </Card>
  );
};

