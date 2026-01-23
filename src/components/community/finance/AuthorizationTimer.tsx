import { useState, useEffect } from "react";
import { Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthorizationTimerProps {
  expiresAt: Date;
  onExpire?: () => void;
}

export function AuthorizationTimer({ expiresAt, onExpire }: AuthorizationTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
  }>({ hours: 0, minutes: 0, seconds: 0, isExpired: false });

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const diff = expiresAt.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeRemaining({ hours: 0, minutes: 0, seconds: 0, isExpired: true });
        onExpire?.();
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeRemaining({ hours, minutes, seconds, isExpired: false });
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  const totalHoursRemaining = timeRemaining.hours + timeRemaining.minutes / 60;
  
  // Color based on time remaining
  const getColorClass = () => {
    if (timeRemaining.isExpired) return "text-destructive bg-destructive/10 border-destructive/20";
    if (totalHoursRemaining < 2) return "text-destructive bg-destructive/10 border-destructive/20";
    if (totalHoursRemaining < 12) return "text-yellow-600 bg-yellow-50 dark:bg-yellow-950/50 border-yellow-200 dark:border-yellow-800";
    return "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800";
  };

  if (timeRemaining.isExpired) {
    return (
      <div className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-lg border",
        getColorClass()
      )}>
        <AlertTriangle className="h-4 w-4" />
        <span className="text-sm font-medium">Authorization Expired</span>
      </div>
    );
  }

  const formatTime = () => {
    const { hours, minutes, seconds } = timeRemaining;
    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    }
    if (minutes > 0) {
      return `${minutes}m ${seconds}s remaining`;
    }
    return `${seconds}s remaining`;
  };

  return (
    <div className={cn(
      "flex items-center gap-2 px-3 py-2 rounded-lg border",
      getColorClass()
    )}>
      <Clock className="h-4 w-4" />
      <span className="text-sm font-medium">Expires in: {formatTime()}</span>
    </div>
  );
}
