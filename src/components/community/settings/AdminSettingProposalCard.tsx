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
      <CardContent className="p-4 space-y-4">
        {/* Header - Full width stacked */}
        <div className="space-y-3">
          {/* Title row with time remaining */}
          <div className="flex items-start justify-between gap-3">
            <h4 className="font-bold text-base break-words leading-snug flex-1 min-w-0">
              {proposal.settingName}
            </h4>
            <div className="flex items-center gap-1 text-sm text-muted-foreground shrink-0 whitespace-nowrap">
              <Clock className="h-4 w-4" />
              <span>{daysRemaining}d left</span>
            </div>
          </div>

          {/* Category badge */}
          <Badge variant="outline" className="text-xs px-2.5 py-1">
            {SETTING_CATEGORY_LABELS[proposal.settingCategory]}
          </Badge>

          {/* Description */}
          <p className="text-sm text-muted-foreground break-words leading-relaxed">
            {proposal.settingDescription}
          </p>
        </div>

        {/* Value Comparison - Fully stacked side by side */}
        <div className="grid grid-cols-[1fr_auto_1fr] gap-2 p-3 rounded-lg bg-background items-center">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground uppercase font-medium mb-1">Current</p>
            <p className="text-sm font-semibold break-words leading-tight">{proposal.currentValue}</p>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0" />
          <div className="min-w-0 text-right">
            <p className="text-xs text-muted-foreground uppercase font-medium mb-1">Proposed</p>
            <p className="text-sm font-bold text-primary break-words leading-tight">{proposal.proposedValue}</p>
          </div>
        </div>

        {/* Proposed By */}
        <div className="flex items-center gap-2.5">
          <Avatar className="h-7 w-7 shrink-0">
            <AvatarImage src={proposal.proposedBy.avatar} />
            <AvatarFallback className="text-xs">
              {proposal.proposedBy.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground break-words">
            Proposed by <strong className="text-foreground">{proposal.proposedBy.name}</strong> ({proposal.proposedBy.role})
          </span>
        </div>

        {/* Progress Bar - Stacked with clear labels */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium">Approval Progress</span>
            <span className="text-sm font-bold">
              {proposal.approvalPercentage}% / {threshold}% needed
            </span>
          </div>
          <div className="relative">
            <Progress value={proposal.approvalPercentage} className="h-2.5" />
            {/* 60% threshold marker */}
            <div
              className="absolute top-0 h-2.5 w-0.5 bg-primary"
              style={{ left: `${threshold}%` }}
            />
          </div>
          <div className="flex items-center justify-between gap-2 text-sm">
            <span className="flex items-center gap-1.5 text-green-600">
              <Check className="h-4 w-4" />
              {proposal.approvalCount} approved
            </span>
            <span className="flex items-center gap-1.5 text-red-600">
              <X className="h-4 w-4" />
              {proposal.disapprovalCount} disapproved
            </span>
          </div>
        </div>

        {/* Vote Actions */}
        {hasVoted ? (
          <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-muted/50">
            <Check className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium">
              You {localVote === "approve" ? "approved" : "disapproved"} this change
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="h-11 text-base font-semibold text-green-600 border-green-300 hover:bg-green-50 dark:hover:bg-green-950/30"
              onClick={() => handleVote("approve")}
              disabled={isVoting}
            >
              <Check className="h-5 w-5 mr-2" />
              Approve
            </Button>
            <Button
              variant="outline"
              className="h-11 text-base font-semibold text-red-600 border-red-300 hover:bg-red-50 dark:hover:bg-red-950/30"
              onClick={() => handleVote("disapprove")}
              disabled={isVoting}
            >
              <X className="h-5 w-5 mr-2" />
              Disapprove
            </Button>
          </div>
        )}

        {/* Recommend Alternative */}
        <Button
          variant="ghost"
          className="w-full h-10 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/30"
          onClick={() => onRecommend(proposal.proposalId)}
        >
          <Lightbulb className="h-4 w-4 mr-2" />
          Recommend Alternative Setting
        </Button>

        {/* Votes Needed Info */}
        {votesNeeded > 0 && (
          <div className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-100/50 dark:bg-amber-900/20 text-sm text-amber-700 dark:text-amber-400">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <span className="break-words">{votesNeeded} more approvals needed to reach {threshold}% threshold</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
