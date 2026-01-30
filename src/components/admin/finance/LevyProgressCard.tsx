import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Wallet, 
  Users, 
  Calendar, 
  ChevronRight, 
  Bell,
  TrendingUp 
} from "lucide-react";
import { formatLocalAmount, formatMobiAmount } from "@/lib/mobiCurrencyTranslation";
import { format, differenceInDays } from "date-fns";

interface LevyProgressCardProps {
  id: string;
  name: string;
  year: string;
  unitPrice: number;
  deadline: Date;
  paidCount: number;
  totalMembers: number;
  amountCollected: number;
  targetAmount: number;
  status: "active" | "suspended" | "expired";
  onViewDetails?: () => void;
  onSendReminders?: () => void;
}

export function LevyProgressCard({
  id,
  name,
  year,
  unitPrice,
  deadline,
  paidCount,
  totalMembers,
  amountCollected,
  targetAmount,
  status,
  onViewDetails,
  onSendReminders,
}: LevyProgressCardProps) {
  const progressPercentage = Math.round((amountCollected / targetAmount) * 100);
  const memberProgressPercentage = Math.round((paidCount / totalMembers) * 100);
  const daysUntilDeadline = differenceInDays(deadline, new Date());

  const getStatusColor = () => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-600";
      case "suspended":
        return "bg-amber-500/10 text-amber-600";
      case "expired":
        return "bg-red-500/10 text-red-600";
      default:
        return "bg-muted";
    }
  };

  const getDeadlineColor = () => {
    if (daysUntilDeadline < 0) return "text-red-600";
    if (daysUntilDeadline <= 7) return "text-amber-600";
    return "text-muted-foreground";
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-base">{name}</h3>
              <Badge className={getStatusColor()}>{status}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{year}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Unit Amount</p>
            <div className="text-primary font-semibold">
              {formatLocalAmount(unitPrice, "NGN")}
            </div>
            <p className="text-[10px] text-muted-foreground">
              ≈ {formatMobiAmount(unitPrice)}
            </p>
          </div>
        </div>

        {/* Progress Circle & Stats */}
        <div className="flex items-center gap-4">
          {/* Circular Progress Indicator */}
          <div className="relative w-16 h-16 shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="6"
                fill="none"
                className="text-muted"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="6"
                fill="none"
                className="text-primary"
                strokeDasharray={`${(memberProgressPercentage / 100) * 176} 176`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold">{memberProgressPercentage}%</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{paidCount}/{totalMembers} members paid</span>
            </div>
            <div className="flex items-center gap-2 text-sm flex-wrap">
              <TrendingUp className="h-4 w-4 text-green-600 shrink-0" />
              <span className="font-semibold">{formatLocalAmount(amountCollected, "NGN")}</span>
              <span className="text-muted-foreground text-xs">({formatMobiAmount(amountCollected)})</span>
              <span className="text-muted-foreground">of</span>
              <span className="font-semibold">{formatLocalAmount(targetAmount, "NGN")}</span>
            </div>
            <div className={`flex items-center gap-2 text-sm ${getDeadlineColor()}`}>
              <Calendar className="h-4 w-4" />
              <span>
                {daysUntilDeadline < 0 
                  ? `${Math.abs(daysUntilDeadline)} days overdue`
                  : daysUntilDeadline === 0 
                    ? "Due today!"
                    : `${daysUntilDeadline} days left`
                }
              </span>
            </div>
          </div>
        </div>

        {/* Collection Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Collection Progress</span>
            <span className="font-medium">{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Deadline */}
        <div className="flex items-center justify-between text-sm bg-muted/50 rounded-lg p-2">
          <span className="text-muted-foreground">Deadline</span>
          <span className="font-medium">{format(deadline, "MMMM d, yyyy")}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={onViewDetails}
          >
            View Details
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onSendReminders}
          >
            <Bell className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Mock data for demo
export const mockLevyData = {
  id: "levy-2025-001",
  name: "Annual Dues 2025",
  year: "Fiscal Year 2025",
  unitPrice: 15000,
  deadline: new Date("2025-03-31"),
  paidCount: 30,
  totalMembers: 50,
  amountCollected: 450000,
  targetAmount: 750000,
  status: "active" as const,
};
