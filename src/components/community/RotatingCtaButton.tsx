import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { DollarSign, Gift, Gamepad2, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface CtaAction {
  id: string;
  label: string;
  icon: React.ElementType;
  bgColor: string;
  hoverColor: string;
  onClick: () => void;
}

interface RotatingCtaButtonProps {
  onDonate: () => void;
  onFundRaiser: () => void;
  onQuizGame: () => void;
  onMobiCircle: () => void;
  donationEnabled?: boolean;
  interval?: number; // in milliseconds
  className?: string;
}

export function RotatingCtaButton({
  onDonate,
  onFundRaiser,
  onQuizGame,
  onMobiCircle,
  donationEnabled = true,
  interval = 15000, // 15 seconds default
  className,
}: RotatingCtaButtonProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Define all CTA actions
  const actions: CtaAction[] = [
    ...(donationEnabled
      ? [
          {
            id: "donate",
            label: "Donate To Community",
            icon: DollarSign,
            bgColor: "bg-green-600",
            hoverColor: "hover:bg-green-700",
            onClick: onDonate,
          },
        ]
      : []),
    {
      id: "fundraiser",
      label: "FundRaiser",
      icon: Gift,
      bgColor: "bg-rose-600",
      hoverColor: "hover:bg-rose-700",
      onClick: onFundRaiser,
    },
    {
      id: "quiz",
      label: "Play Mobi-Quiz",
      icon: Gamepad2,
      bgColor: "bg-amber-600",
      hoverColor: "hover:bg-amber-700",
      onClick: onQuizGame,
    },
    {
      id: "circle",
      label: "Create Mobi-Circle",
      icon: Users,
      bgColor: "bg-indigo-600",
      hoverColor: "hover:bg-indigo-700",
      onClick: onMobiCircle,
    },
  ];

  const currentAction = actions[currentIndex];

  // Auto-rotate with transition effect
  useEffect(() => {
    if (actions.length <= 1) return;

    const timer = setInterval(() => {
      setIsTransitioning(true);
      
      // Wait for fade-out animation
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % actions.length);
        setIsTransitioning(false);
      }, 300);
    }, interval);

    return () => clearInterval(timer);
  }, [actions.length, interval]);

  const handleClick = useCallback(() => {
    currentAction?.onClick();
  }, [currentAction]);

  if (!currentAction) return null;

  const Icon = currentAction.icon;

  return (
    <div className={cn("relative", className)}>
      <Button
        onClick={handleClick}
        className={cn(
          "min-w-[180px] transition-all duration-300 ease-in-out",
          currentAction.bgColor,
          currentAction.hoverColor,
          isTransitioning && "opacity-0 scale-95",
          !isTransitioning && "opacity-100 scale-100"
        )}
      >
        <Icon className="h-4 w-4 mr-2 shrink-0" />
        <span className="truncate">{currentAction.label}</span>
      </Button>
      
      {/* Progress indicator dots */}
      {actions.length > 1 && (
        <div className="flex items-center justify-center gap-1 mt-1.5">
          {actions.map((action, index) => (
            <button
              key={action.id}
              onClick={() => {
                setIsTransitioning(true);
                setTimeout(() => {
                  setCurrentIndex(index);
                  setIsTransitioning(false);
                }, 200);
              }}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                index === currentIndex
                  ? "w-4 bg-primary"
                  : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              )}
              aria-label={`Go to ${action.label}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
