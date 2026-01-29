import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Check,
  X,
  Lightbulb,
  Clock,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import { AdminSettingProposal, SETTING_CATEGORY_LABELS, DEMOCRATIC_SETTINGS_CONFIG } from "@/types/communityDemocraticSettings";
import { getDaysUntilExpiry, votesNeededForApproval } from "@/lib/democraticSettingsUtils";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface AdminSettingProposalCardProps {
  proposal: AdminSettingProposal;
  onVote: (proposalId: string, vote: "approve" | "disapprove") => void;
  onRecommend: (proposalId: string) => void;
}

export function AdminSettingProposalCard({
  proposal,
  onVote,
  onRecommend,
}: AdminSettingProposalCardProps) {
  const { toast } = useToast();
  const [isVoting, setIsVoting] = useState(false);
  const [localVote, setLocalVote] = useState<"approve" | "disapprove" | null>(proposal.memberVote || null);

  const daysRemaining = getDaysUntilExpiry(proposal.expiresAt);
  const votesNeeded = votesNeededForApproval(proposal);
  const threshold = DEMOCRATIC_SETTINGS_CONFIG.APPROVAL_THRESHOLD;

  const handleVote = async (vote: "approve" | "disapprove") => {
    setIsVoting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    setLocalVote(vote);
    onVote(proposal.proposalId, vote);
    
    toast({
      title: vote === "approve" ? "Vote Recorded" : "Disapproval Recorded",
      description: `You have ${vote === "approve" ? "approved" : "disapproved"} "${proposal.settingName}"`,
    });
    
    setIsVoting(false);
  };

  const hasVoted = localVote !== null;

  return (
    <Card className="overflow-hidden border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20">
      <CardContent className="p-3 space-y-3">
        {/* Header - Stacked for mobile */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold text-sm break-words leading-tight">{proposal.settingName}</h4>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground shrink-0">
              <Clock className="h-3.5 w-3.5" />
              <span>{daysRemaining}d left</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="text-xs px-2 py-0.5 shrink-0">
              {SETTING_CATEGORY_LABELS[proposal.settingCategory]}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground break-words">
            {proposal.settingDescription}
          </p>
        </div>

        {/* Value Comparison - Stacked for mobile */}
        <div className="space-y-2 p-3 rounded-lg bg-background">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground uppercase font-medium">Current</span>
            <span className="text-sm font-semibold break-words">{proposal.currentValue}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <ArrowRight className="h-4 w-4" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground uppercase font-medium">Proposed</span>
            <span className="text-sm font-semibold text-primary break-words">{proposal.proposedValue}</span>
          </div>
        </div>

        {/* Proposed By */}
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6 shrink-0">
            <AvatarImage src={proposal.proposedBy.avatar} />
            <AvatarFallback className="text-xs">
              {proposal.proposedBy.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground break-words">
            Proposed by <strong>{proposal.proposedBy.name}</strong> ({proposal.proposedBy.role})
          </span>
        </div>

        {/* Progress Bar - Stacked */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm text-muted-foreground">Approval Progress</span>
            <span className="text-sm font-semibold">
              {proposal.approvalPercentage}% / {threshold}% needed
            </span>
          </div>
          <div className="relative">
            <Progress value={proposal.approvalPercentage} className="h-2" />
            {/* 60% threshold marker */}
            <div
              className="absolute top-0 h-2 w-0.5 bg-primary"
              style={{ left: `${threshold}%` }}
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-green-500" />
              {proposal.approvalCount} approved
            </span>
            <span className="flex items-center gap-1.5">
              <X className="h-3.5 w-3.5 text-red-500" />
              {proposal.disapprovalCount} disapproved
            </span>
          </div>
        </div>

        {/* Vote Actions */}
        {hasVoted ? (
          <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-muted/50">
            <Check className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium">
              You {localVote === "approve" ? "approved" : "disapproved"} this change
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1 h-10 text-sm text-green-600 border-green-200 hover:bg-green-50 dark:hover:bg-green-950/30"
              onClick={() => handleVote("approve")}
              disabled={isVoting}
            >
              <Check className="h-4 w-4 mr-2" />
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1 h-10 text-sm text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/30"
              onClick={() => handleVote("disapprove")}
              disabled={isVoting}
            >
              <X className="h-4 w-4 mr-2" />
              Disapprove
            </Button>
          </div>
        )}

        {/* Recommend Alternative */}
        <Button
          variant="ghost"
          size="sm"
          className="w-full h-9 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/30"
          onClick={() => onRecommend(proposal.proposalId)}
        >
          <Lightbulb className="h-4 w-4 mr-2" />
          Recommend Alternative Setting
        </Button>

        {/* Votes Needed Info */}
        {votesNeeded > 0 && (
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <span className="break-words">{votesNeeded} more approvals needed to reach {threshold}% threshold</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
