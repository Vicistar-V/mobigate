import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThumbsUp, Trophy, ArrowRight, MessageSquare } from "lucide-react";
import { MemberRecommendation, DEMOCRATIC_SETTINGS_CONFIG } from "@/types/communityDemocraticSettings";
import { votesNeededForRecommendation } from "@/lib/democraticSettingsUtils";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface MemberRecommendationsListProps {
  recommendations: MemberRecommendation[];
  onSupport: (recommendationId: string) => void;
}

export function MemberRecommendationsList({
  recommendations,
  onSupport,
}: MemberRecommendationsListProps) {
  const { toast } = useToast();
  const [localSupport, setLocalSupport] = useState<Record<string, boolean>>(
    recommendations.reduce((acc, rec) => {
      acc[rec.recommendationId] = rec.hasSupported || false;
      return acc;
    }, {} as Record<string, boolean>)
  );

  const threshold = DEMOCRATIC_SETTINGS_CONFIG.RECOMMENDATION_THRESHOLD;

  const handleToggleSupport = (recommendationId: string, currentlySupported: boolean) => {
    setLocalSupport((prev) => ({
      ...prev,
      [recommendationId]: !currentlySupported,
    }));
    
    onSupport(recommendationId);
    
    toast({
      title: currentlySupported ? "Support Removed" : "Support Added",
      description: currentlySupported
        ? "You have removed your support for this recommendation"
        : "You are now supporting this recommendation",
    });
  };

  return (
    <div className="space-y-3">
      {recommendations.map((rec) => {
        const isSupported = localSupport[rec.recommendationId];
        const hasReachedThreshold = rec.supportPercentage >= threshold;
        const votesNeeded = votesNeededForRecommendation(rec);

        return (
          <Card
            key={rec.recommendationId}
            className={`overflow-hidden ${
              hasReachedThreshold
                ? "border-green-300 bg-green-50/50 dark:bg-green-950/20 dark:border-green-800"
                : ""
            }`}
          >
            <CardContent className="p-3 space-y-3">
              {/* Header - Stacked for mobile */}
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold text-sm break-words flex-1 min-w-0">{rec.settingName}</h4>
                  {hasReachedThreshold && (
                    <Badge className="text-xs px-2 py-0.5 bg-green-500/10 text-green-600 border-green-200 shrink-0">
                      <Trophy className="h-3 w-3 mr-1" />
                      Majority
                    </Badge>
                  )}
                </div>
              </div>

              {/* Value Comparison - Stacked for mobile */}
              <div className="space-y-2 p-3 rounded-lg bg-background">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground uppercase font-medium">Current</span>
                  <span className="text-sm font-semibold break-words">{rec.currentValue}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <ArrowRight className="h-4 w-4" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground uppercase font-medium">Recommended</span>
                  <span className="text-sm font-semibold text-blue-600 break-words">{rec.recommendedValue}</span>
                </div>
              </div>

              {/* Reason */}
              {rec.reason && (
                <div className="flex items-start gap-2 p-2.5 rounded-lg bg-muted/30">
                  <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <p className="text-sm text-muted-foreground line-clamp-2 break-words">{rec.reason}</p>
                </div>
              )}

              {/* Recommended By */}
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6 shrink-0">
                  <AvatarImage src={rec.recommendedBy.avatar} />
                  <AvatarFallback className="text-xs">
                    {rec.recommendedBy.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground break-words">
                  By <strong>{rec.recommendedBy.name}</strong> •{" "}
                  {formatDistanceToNow(rec.recommendedAt, { addSuffix: true })}
                </span>
              </div>

              {/* Support Progress - Stacked */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm text-muted-foreground">Member Support</span>
                  <span className="text-sm font-semibold">
                    {rec.supportPercentage}% / {threshold}% needed
                  </span>
                </div>
                <div className="relative">
                  <Progress
                    value={rec.supportPercentage}
                    className={`h-2 ${hasReachedThreshold ? "[&>div]:bg-green-500" : "[&>div]:bg-blue-500"}`}
                  />
                  {/* 60% threshold marker */}
                  <div
                    className="absolute top-0 h-2 w-0.5 bg-foreground/30"
                    style={{ left: `${threshold}%` }}
                  />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
                  <span>{rec.supportCount} members supporting</span>
                  {!hasReachedThreshold && <span>{votesNeeded} more needed</span>}
                </div>
              </div>

              {/* Support Button */}
              <Button
                size="sm"
                variant={isSupported ? "default" : "outline"}
                className={`w-full h-10 text-sm ${
                  isSupported
                    ? "bg-blue-500 hover:bg-blue-600"
                    : "text-blue-600 border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                }`}
                onClick={() => handleToggleSupport(rec.recommendationId, isSupported)}
              >
                <ThumbsUp className={`h-4 w-4 mr-2 ${isSupported ? "fill-current" : ""}`} />
                {isSupported ? "Supporting" : "Support This Recommendation"}
              </Button>

              {/* Override Notice */}
              {hasReachedThreshold && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                  <Trophy className="h-4 w-4 shrink-0 mt-0.5" />
                  <p className="text-sm break-words">
                    This recommendation will automatically override the admin setting!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
