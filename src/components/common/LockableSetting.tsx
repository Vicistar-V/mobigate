import { ReactNode, useState } from "react";
import { Lock, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * LockableSetting — wraps any setting input/control with a 🔒/🔓 toggle.
 * Controls are protected (read-only) until the user explicitly unlocks them.
 * After Save, the parent should call `onLockAfterSave()` to re-lock automatically.
 *
 * Usage:
 *   <LockableSetting
 *     label="Service Charge Rate"
 *     locked={locked}
 *     onLockedChange={setLocked}
 *     displayValue={`${rate}%`}
 *   >
 *     {(unlocked) => <Slider disabled={!unlocked} ... />}
 *   </LockableSetting>
 */
interface LockableSettingProps {
  label?: string;
  description?: string;
  locked: boolean;
  onLockedChange: (locked: boolean) => void;
  displayValue?: ReactNode;
  className?: string;
  /** Render-prop receives `unlocked` boolean so children can disable themselves. */
  children: (unlocked: boolean) => ReactNode;
}

export function LockableSetting({
  label,
  description,
  locked,
  onLockedChange,
  displayValue,
  className,
  children,
}: LockableSettingProps) {
  return (
    <div
      className={cn(
        "rounded-xl border-2 transition-colors",
        locked
          ? "border-amber-200 bg-amber-50/40 dark:bg-amber-950/10"
          : "border-emerald-300 bg-emerald-50/40 dark:bg-emerald-950/10",
        className
      )}
    >
      {(label || displayValue) && (
        <div className="flex items-center justify-between gap-2 px-3 pt-3 pb-2">
          <div className="min-w-0">
            {label && (
              <p className="text-sm font-semibold text-foreground truncate">
                {label}
              </p>
            )}
            {description && (
              <p className="text-[11px] text-muted-foreground leading-tight">
                {description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {displayValue !== undefined && (
              <Badge
                variant="outline"
                className={cn(
                  "text-xs font-bold",
                  locked
                    ? "bg-card text-foreground"
                    : "bg-emerald-100 text-emerald-700 border-emerald-300"
                )}
              >
                {displayValue}
              </Badge>
            )}
            <Button
              type="button"
              variant={locked ? "outline" : "default"}
              size="sm"
              className={cn(
                "h-8 px-2.5 text-xs gap-1 touch-manipulation",
                locked
                  ? "border-amber-300 text-amber-700 hover:bg-amber-100"
                  : "bg-emerald-600 text-white hover:bg-emerald-700"
              )}
              onClick={() => onLockedChange(!locked)}
              aria-label={locked ? "Unlock setting to edit" : "Lock setting"}
            >
              {locked ? (
                <>
                  <Lock className="h-3 w-3" />
                  <span className="hidden xs:inline">Locked</span>
                  <span className="xs:hidden">🔒</span>
                </>
              ) : (
                <>
                  <Unlock className="h-3 w-3" />
                  <span className="hidden xs:inline">Unlocked</span>
                  <span className="xs:hidden">🔓</span>
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      <div
        className={cn(
          "px-3 pb-3 transition-opacity",
          locked && "opacity-60 pointer-events-none select-none"
        )}
        aria-disabled={locked}
      >
        {children(!locked)}
      </div>

      {locked && (
        <div className="px-3 pb-2 -mt-1">
          <p className="text-[10px] text-amber-700 dark:text-amber-400 flex items-center gap-1">
            <Lock className="h-2.5 w-2.5" />
            Protected. Tap 🔒 to unlock and edit. Re-locks automatically after save.
          </p>
        </div>
      )}
    </div>
  );
}

export default LockableSetting;
