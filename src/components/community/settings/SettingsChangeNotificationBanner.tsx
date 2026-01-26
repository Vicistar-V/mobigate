import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, X, ChevronRight } from "lucide-react";

interface SettingsChangeNotificationBannerProps {
  pendingCount: number;
  onReviewClick: () => void;
  onDismiss?: () => void;
}

export function SettingsChangeNotificationBanner({
  pendingCount,
  onReviewClick,
  onDismiss,
}: SettingsChangeNotificationBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (pendingCount === 0 || isDismissed) {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  return (
    <Card className="mx-4 mt-2 border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 overflow-hidden">
      <CardContent className="p-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/50 shrink-0">
              <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                  Settings Pending Approval
                </p>
                <Badge className="bg-amber-500 text-white text-[10px] px-1.5">
                  {pendingCount}
                </Badge>
              </div>
              <p className="text-xs text-amber-600 dark:text-amber-400 truncate">
                Admin changes need your vote
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs border-amber-300 text-amber-700 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-300 dark:hover:bg-amber-900/50"
              onClick={onReviewClick}
            >
              Review
              <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 text-amber-600 hover:text-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/50"
              onClick={handleDismiss}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
