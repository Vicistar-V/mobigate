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
  ArrowDown,
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
      <CardContent className="p-3 sm:p-4 space-y-3">
        {/* Header - Full width stacked */}
        <div className="space-y-2">
          {/* Title row with time remaining */}
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-bold text-sm sm:text-base leading-snug flex-1 min-w-0 line-clamp-2">
              {proposal.settingName}
            </h4>
            <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground shrink-0">
              <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>{daysRemaining}d left</span>
            </div>
          </div>

          {/* Category badge */}
          <Badge variant="outline" className="text-xs px-2 py-0.5">
            {SETTING_CATEGORY_LABELS[proposal.settingCategory]}
          </Badge>

          {/* Description */}
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3">
            {proposal.settingDescription}
          </p>
        </div>

        {/* Value Comparison - Fully stacked for mobile */}
        <div className="space-y-2 p-3 rounded-lg bg-background">
          {/* Current Value */}
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase font-medium">Current</p>
            <p className="text-sm font-semibold break-words">{proposal.currentValue}</p>
          </div>
          
          {/* Arrow */}
          <div className="flex justify-center py-1">
            <ArrowDown className="h-4 w-4 text-muted-foreground" />
          </div>
          
          {/* Proposed Value */}
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase font-medium">Proposed</p>
            <p className="text-sm font-bold text-primary break-words">{proposal.proposedValue}</p>
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
          <span className="text-xs sm:text-sm text-muted-foreground">
            Proposed by <strong className="text-foreground">{proposal.proposedBy.name}</strong> ({proposal.proposedBy.role})
          </span>
        </div>

        {/* Progress Bar - Stacked with clear labels */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-1">
            <span className="text-xs sm:text-sm font-medium">Approval Progress</span>
            <span className="text-xs sm:text-sm font-bold whitespace-nowrap">
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
          <div className="flex items-center justify-between gap-2 text-xs sm:text-sm">
            <span className="flex items-center gap-1 text-green-600">
              <Check className="h-3.5 w-3.5" />
              {proposal.approvalCount} approved
            </span>
            <span className="flex items-center gap-1 text-red-600">
              <X className="h-3.5 w-3.5" />
              {proposal.disapprovalCount} disapproved
            </span>
          </div>
        </div>

        {/* Vote Actions */}
        {hasVoted ? (
          <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-muted/50">
            <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
            <span className="text-xs sm:text-sm font-medium">
              You {localVote === "approve" ? "approved" : "disapproved"} this change
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              className="h-10 text-sm font-semibold text-green-600 border-green-300 hover:bg-green-50 dark:hover:bg-green-950/30"
              onClick={() => handleVote("approve")}
              disabled={isVoting}
            >
              <Check className="h-4 w-4 mr-1.5" />
              Approve
            </Button>
            <Button
              variant="outline"
              className="h-10 text-sm font-semibold text-red-600 border-red-300 hover:bg-red-50 dark:hover:bg-red-950/30"
              onClick={() => handleVote("disapprove")}
              disabled={isVoting}
            >
              <X className="h-4 w-4 mr-1.5" />
              Disapprove
            </Button>
          </div>
        )}

        {/* Recommend Alternative */}
        <Button
          variant="ghost"
          className="w-full h-9 text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/30"
          onClick={() => onRecommend(proposal.proposalId)}
        >
          <Lightbulb className="h-3.5 w-3.5 mr-1.5" />
          Recommend Alternative
        </Button>

        {/* Votes Needed Info */}
        {votesNeeded > 0 && (
          <div className="flex items-start gap-2 p-2 rounded-lg bg-amber-100/50 dark:bg-amber-900/20 text-xs sm:text-sm text-amber-700 dark:text-amber-400">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            <span>{votesNeeded} more approvals needed to reach {threshold}%</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
