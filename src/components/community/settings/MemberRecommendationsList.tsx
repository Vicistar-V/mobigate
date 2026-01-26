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
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-medium text-sm truncate">{rec.settingName}</h4>
                    {hasReachedThreshold && (
                      <Badge className="text-[10px] px-1.5 py-0 bg-green-500/10 text-green-600 border-green-200">
                        <Trophy className="h-2.5 w-2.5 mr-0.5" />
                        Majority Reached
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Value Comparison */}
              <div className="flex items-center gap-2 p-2 rounded-lg bg-background">
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                    Current
                  </p>
                  <p className="text-xs font-medium truncate">{rec.currentValue}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0 text-right">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                    Recommended
                  </p>
                  <p className="text-xs font-medium text-blue-600 truncate">
                    {rec.recommendedValue}
                  </p>
                </div>
              </div>

              {/* Reason */}
              {rec.reason && (
                <div className="flex items-start gap-2 p-2 rounded-lg bg-muted/30">
                  <MessageSquare className="h-3 w-3 text-muted-foreground mt-0.5 shrink-0" />
                  <p className="text-xs text-muted-foreground line-clamp-2">{rec.reason}</p>
                </div>
              )}

              {/* Recommended By */}
              <div className="flex items-center gap-2">
                <Avatar className="h-5 w-5">
                  <AvatarImage src={rec.recommendedBy.avatar} />
                  <AvatarFallback className="text-[8px]">
                    {rec.recommendedBy.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground">
                  By <strong>{rec.recommendedBy.name}</strong> •{" "}
                  {formatDistanceToNow(rec.recommendedAt, { addSuffix: true })}
                </span>
              </div>

              {/* Support Progress */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Member Support</span>
                  <span className="font-medium">
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
                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>{rec.supportCount} members supporting</span>
                  {!hasReachedThreshold && <span>{votesNeeded} more needed</span>}
                </div>
              </div>

              {/* Support Button */}
              <Button
                size="sm"
                variant={isSupported ? "default" : "outline"}
                className={`w-full h-9 ${
                  isSupported
                    ? "bg-blue-500 hover:bg-blue-600"
                    : "text-blue-600 border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                }`}
                onClick={() => handleToggleSupport(rec.recommendationId, isSupported)}
              >
                <ThumbsUp className={`h-4 w-4 mr-1 ${isSupported ? "fill-current" : ""}`} />
                {isSupported ? "Supporting" : "Support This Recommendation"}
              </Button>

              {/* Override Notice */}
              {hasReachedThreshold && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                  <Trophy className="h-4 w-4 shrink-0" />
                  <p className="text-xs">
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
