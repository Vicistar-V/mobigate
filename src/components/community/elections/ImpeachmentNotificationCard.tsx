import { Bell, Gavel, Timer, Vote, ChevronRight, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { format, differenceInDays } from "date-fns";

interface ImpeachmentNotification {
  id: string;
  officerName: string;
  officerPosition: string;
  officerAvatar?: string;
  votesFor: number;
  votesAgainst: number;
  totalEligibleVoters: number;
  requiredThreshold: number;
  expiresAt: Date;
  initiatedAt: Date;
  hasUserVoted: boolean;
}

interface ImpeachmentNotificationCardProps {
  notification: ImpeachmentNotification;
  onViewDetails?: () => void;
  onVote?: () => void;
}

// Calculate days remaining
const getDaysRemaining = (expiresAt: Date): number => {
  return Math.max(0, differenceInDays(expiresAt, new Date()));
};

export function ImpeachmentNotificationCard({
  notification,
  onViewDetails,
  onVote,
}: ImpeachmentNotificationCardProps) {
  const progress = (notification.votesFor / notification.totalEligibleVoters) * 100;
  const daysRemaining = getDaysRemaining(notification.expiresAt);
  const isUrgent = daysRemaining <= 7;
  const isCritical = daysRemaining <= 3;

  return (
    <Card 
      className={cn(
        "border-red-200 bg-red-50/50 dark:bg-red-950/20 cursor-pointer hover:shadow-md active:scale-[0.99] transition-all",
        isCritical && "border-red-400 animate-pulse"
      )}
      onClick={onViewDetails}
    >
      <CardContent className="p-3">
        {/* Header with Alert */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center justify-center h-6 w-6 rounded-full bg-red-100 dark:bg-red-900">
            <Gavel className="h-3.5 w-3.5 text-red-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-red-700 dark:text-red-400">
              🔔 Active Impeachment Process
            </p>
          </div>
          <Badge 
            className={cn(
              "text-xs text-white shrink-0",
              isCritical ? "bg-red-600" : isUrgent ? "bg-amber-500" : "bg-blue-500"
            )}
          >
            <Timer className="h-3 w-3 mr-1" />
            {daysRemaining}d left
          </Badge>
        </div>

        {/* Officer Info */}
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarImage src={notification.officerAvatar} />
            <AvatarFallback className="text-xs">
              {notification.officerName.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm leading-tight truncate">{notification.officerName}</p>
            <p className="text-xs text-muted-foreground">{notification.officerPosition}</p>
          </div>
        </div>

        {/* Vote Progress */}
        <div className="space-y-1.5 mb-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">
              Current: <span className="font-semibold text-foreground">{notification.votesFor}</span>/{notification.totalEligibleVoters} votes
            </span>
            <span className={cn(
              "font-semibold",
              progress >= notification.requiredThreshold ? "text-green-600" : "text-amber-600"
            )}>
              {progress.toFixed(1)}%
            </span>
          </div>
          <div className="relative">
            <Progress value={progress} className="h-2" />
            {/* 85% threshold marker */}
            <div 
              className="absolute top-0 bottom-0 w-0.5 bg-green-500"
              style={{ left: '85%' }}
            />
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Required: {notification.requiredThreshold}% ({Math.ceil(notification.totalEligibleVoters * notification.requiredThreshold / 100)} votes)
          </p>
        </div>

        {/* Action Row */}
        <div className="flex items-center justify-between">
          {notification.hasUserVoted ? (
            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
              ✓ You have voted
            </Badge>
          ) : (
            <Badge className="text-xs bg-primary text-white animate-pulse">
              <Vote className="h-3 w-3 mr-1" />
              Cast Your Vote
            </Badge>
          )}
          <div className="flex items-center text-xs text-muted-foreground">
            <span>View Details</span>
            <ChevronRight className="h-4 w-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Compact version for dashboard sidebar or smaller spaces
export function ImpeachmentNotificationBadge({
  count,
  onClick,
}: {
  count: number;
  onClick?: () => void;
}) {
  if (count === 0) return null;

  return (
    <div 
      className="flex items-center gap-2 px-3 py-2 bg-red-100 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg cursor-pointer hover:bg-red-200 dark:hover:bg-red-900 transition-colors"
      onClick={onClick}
    >
      <div className="relative">
        <Gavel className="h-4 w-4 text-red-600" />
        <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full animate-ping" />
        <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full" />
      </div>
      <span className="text-xs font-medium text-red-700 dark:text-red-400">
        {count} Active Impeachment{count > 1 ? 's' : ''}
      </span>
      <ChevronRight className="h-3.5 w-3.5 text-red-600" />
    </div>
  );
}

// Mock data for demo
export const mockImpeachmentNotifications: ImpeachmentNotification[] = [
  {
    id: "imp-notif-1",
    officerName: "Chief Ikenna Uche",
    officerPosition: "Treasurer",
    officerAvatar: "/placeholder.svg",
    votesFor: 180,
    votesAgainst: 25,
    totalEligibleVoters: 250,
    requiredThreshold: 85,
    expiresAt: new Date("2025-02-14"),
    initiatedAt: new Date("2025-01-15"),
    hasUserVoted: false,
  },
  {
    id: "imp-notif-2",
    officerName: "Barr. Ngozi Okonkwo",
    officerPosition: "Secretary General",
    officerAvatar: "/placeholder.svg",
    votesFor: 75,
    votesAgainst: 12,
    totalEligibleVoters: 250,
    requiredThreshold: 85,
    expiresAt: new Date("2025-02-24"),
    initiatedAt: new Date("2025-01-25"),
    hasUserVoted: true,
  },
];
