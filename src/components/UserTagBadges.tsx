import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Gavel, Flag, Calendar, EyeOff, Eye, User, ShieldOff, Ban, ChevronDown } from "lucide-react";
import { getVisibleTags, getAllTags, hideTag, unhideTag, getPenaltyBreakdown, type UserTag, type TagType, type PenaltySubType } from "@/data/userTags";

interface UserTagBadgesProps {
  userId: string;
  showAdminControls?: boolean;
  className?: string;
}

const PENALTY_SUBTYPE_CONFIG: Record<PenaltySubType, { label: string; pluralLabel: string; color: string; bg: string; border: string; icon: React.ElementType }> = {
  warning: { label: "Warning", pluralLabel: "Warnings", color: "text-amber-700", bg: "bg-amber-500/15", border: "border-amber-300", icon: Flag },
  suspended: { label: "Suspended", pluralLabel: "Suspensions", color: "text-orange-700", bg: "bg-orange-500/15", border: "border-orange-300", icon: ShieldOff },
  banned: { label: "Banned", pluralLabel: "Bans", color: "text-red-700", bg: "bg-red-500/15", border: "border-red-300", icon: Ban },
  deactivated: { label: "Deactivated", pluralLabel: "Deactivations", color: "text-red-900", bg: "bg-red-600/15", border: "border-red-500", icon: Gavel },
};

export function UserTagBadges({ userId, showAdminControls = false, className = "" }: UserTagBadgesProps) {
  const [selectedTag, setSelectedTag] = useState<UserTag | null>(null);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [, forceUpdate] = useState(0);

  const visibleTags = getVisibleTags(userId);
  const allTags = showAdminControls ? getAllTags(userId) : [];
  const breakdown = getPenaltyBreakdown(userId);

  if (visibleTags.length === 0 && !showAdminControls) return null;

  // For admin: show hidden tags too with a muted style
  const hiddenTags = showAdminControls
    ? allTags.filter((t) => !visibleTags.find((v) => v.type === t.type))
    : [];

  const penalisedTag = visibleTags.find(t => t.type === "penalised");
  const reportedTag = visibleTags.find(t => t.type === "reported");

  // Check if there are suspensions or bans to show collapsed tags
  const suspensions = breakdown.find(b => b.subType === "suspended");
  const bans = breakdown.find(b => b.subType === "banned");

  const handleToggleHide = (type: TagType) => {
    const isCurrentlyVisible = visibleTags.find((t) => t.type === type);
    if (isCurrentlyVisible) {
      hideTag(userId, type);
    } else {
      unhideTag(userId, type);
    }
    forceUpdate((n) => n + 1);
    setSelectedTag(null);
  };

  return (
    <>
      <div className={`flex items-center gap-1.5 flex-wrap ${className}`}>
        {/* Reported tag */}
        {reportedTag && (
          <button
            onClick={(e) => { e.stopPropagation(); setSelectedTag(reportedTag); }}
            className="touch-manipulation"
          >
            <Badge
              variant="outline"
              className="text-xs h-6 px-2 whitespace-nowrap flex items-center gap-1 cursor-pointer active:scale-95 transition-transform bg-amber-500/15 text-amber-700 border-amber-300"
            >
              <Flag className="h-3 w-3 shrink-0" />
              Reported ({reportedTag.count}x)
            </Badge>
          </button>
        )}

        {/* Penalised tag — shows collapsed "Penalised" that expands to show Suspended/Banned breakdown */}
        {penalisedTag && (
          <button
            onClick={(e) => { e.stopPropagation(); setSelectedTag(penalisedTag); }}
            className="touch-manipulation"
          >
            <Badge
              variant="outline"
              className="text-xs h-6 px-2 whitespace-nowrap flex items-center gap-1 cursor-pointer active:scale-95 transition-transform bg-red-500/15 text-red-700 border-red-300"
            >
              <Gavel className="h-3 w-3 shrink-0" />
              Penalised ({penalisedTag.count}x)
            </Badge>
          </button>
        )}

        {/* Admin-only: show hidden tags with muted style */}
        {hiddenTags.map((tag) => (
          <button
            key={`hidden-${tag.type}`}
            onClick={(e) => { e.stopPropagation(); setSelectedTag(tag); }}
            className="touch-manipulation"
          >
            <Badge
              variant="outline"
              className="text-xs h-6 px-2 whitespace-nowrap flex items-center gap-1 cursor-pointer active:scale-95 transition-transform bg-muted/50 text-muted-foreground border-border opacity-60"
            >
              <EyeOff className="h-3 w-3 shrink-0" />
              {tag.type === "penalised" ? "Penalised" : "Reported"} ({tag.count}x)
              <span className="text-[10px] ml-0.5">(hidden)</span>
            </Badge>
          </button>
        ))}
      </div>

      {/* History Drawer */}
      <Drawer open={!!selectedTag} onOpenChange={(open) => { if (!open) { setSelectedTag(null); setShowBreakdown(false); } }}>
        <DrawerContent className="max-h-[92vh]">
          {selectedTag && (
            <div className="flex flex-col h-full max-h-[92vh]">
              <DrawerHeader className="pb-2 border-b border-border shrink-0">
                <DrawerTitle className="text-base font-bold flex items-center gap-2">
                  {selectedTag.type === "penalised" ? (
                    <Gavel className="h-4 w-4 text-red-600 shrink-0" />
                  ) : (
                    <Flag className="h-4 w-4 text-amber-600 shrink-0" />
                  )}
                  {selectedTag.type === "penalised" ? "Penalty" : "Report"} History
                  <Badge
                    variant="outline"
                    className={`ml-auto text-xs ${
                      selectedTag.type === "penalised"
                        ? "bg-red-500/15 text-red-700 border-red-300"
                        : "bg-amber-500/15 text-amber-700 border-amber-300"
                    }`}
                  >
                    {selectedTag.count}x total
                  </Badge>
                </DrawerTitle>
              </DrawerHeader>

              <div className="flex-1 overflow-y-auto touch-auto overscroll-contain px-4 py-3 space-y-3">
                {/* Summary card */}
                <div className={`rounded-xl p-3 border ${
                  selectedTag.type === "penalised"
                    ? "bg-red-500/5 border-red-300/50"
                    : "bg-amber-500/5 border-amber-300/50"
                }`}>
                  <p className="text-sm font-medium">
                    Total {selectedTag.type === "penalised" ? "Penalties" : "Reports"}: <strong>{selectedTag.count}</strong>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Last recorded: {selectedTag.lastOffenceDate}
                  </p>
                  {selectedTag.manuallyHidden && (
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <EyeOff className="h-3 w-3" /> Currently hidden by admin
                    </p>
                  )}
                </div>

                {/* Penalty breakdown cards — only for penalised tags */}
                {selectedTag.type === "penalised" && breakdown.length > 0 && (
                  <div className="space-y-2">
                    <button
                      onClick={() => setShowBreakdown(!showBreakdown)}
                      className="w-full flex items-center justify-between text-xs font-medium text-muted-foreground touch-manipulation py-1"
                    >
                      <span>Penalty Breakdown</span>
                      <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showBreakdown ? "rotate-180" : ""}`} />
                    </button>
                    {showBreakdown && (
                      <div className="grid grid-cols-2 gap-2">
                        {breakdown.map(({ subType, entries }) => {
                          const config = PENALTY_SUBTYPE_CONFIG[subType];
                          const Icon = config.icon;
                          return (
                            <div
                              key={subType}
                              className={`rounded-xl p-2.5 border ${config.bg} ${config.border}`}
                            >
                              <div className="flex items-center gap-1.5 mb-1">
                                <Icon className={`h-3.5 w-3.5 shrink-0 ${config.color}`} />
                                <span className={`text-xs font-bold ${config.color}`}>{config.label}</span>
                              </div>
                              <p className={`text-lg font-bold ${config.color}`}>{entries.length}x</p>
                              {(subType === "suspended" || subType === "banned") && entries.length > 0 && (
                                <div className="mt-1.5 space-y-0.5">
                                  {entries.map((entry, i) => (
                                    <p key={entry.id} className="text-[10px] text-muted-foreground leading-tight">
                                      {i + 1}. {entry.duration || "N/A"}
                                    </p>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Timeline entries */}
                <p className="text-xs font-medium text-muted-foreground">Full History</p>
                <div className="space-y-0">
                  {[...selectedTag.entries].reverse().map((entry, i) => (
                    <div key={entry.id} className="flex gap-3 relative">
                      {i < selectedTag.entries.length - 1 && (
                        <div className="absolute left-[7px] top-5 bottom-0 w-px bg-border" />
                      )}
                      <div className={`h-4 w-4 rounded-full shrink-0 mt-0.5 z-10 border-2 ${
                        entry.penaltySubType === "suspended" ? "bg-orange-500/20 border-orange-500" :
                        entry.penaltySubType === "banned" ? "bg-red-500/20 border-red-500" :
                        entry.penaltySubType === "deactivated" ? "bg-red-700/20 border-red-700" :
                        selectedTag.type === "penalised"
                          ? "bg-amber-500/20 border-amber-500"
                          : "bg-amber-500/20 border-amber-500"
                      }`} />
                      <div className="pb-4 flex-1 min-w-0">
                        <p className="text-sm">{entry.description}</p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {entry.date}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {entry.by}
                          </span>
                          {entry.penaltySubType && entry.penaltySubType !== "warning" && (
                            <Badge variant="outline" className={`text-[10px] h-5 px-1.5 ${
                              PENALTY_SUBTYPE_CONFIG[entry.penaltySubType].bg
                            } ${PENALTY_SUBTYPE_CONFIG[entry.penaltySubType].color} ${
                              PENALTY_SUBTYPE_CONFIG[entry.penaltySubType].border
                            }`}>
                              {entry.duration || PENALTY_SUBTYPE_CONFIG[entry.penaltySubType].label}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Admin controls */}
              {showAdminControls && (
                <div className="shrink-0 border-t border-border p-4 bg-background">
                  <Button
                    variant="outline"
                    className={`w-full h-11 touch-manipulation ${
                      selectedTag.manuallyHidden
                        ? "text-emerald-700 border-emerald-300 hover:bg-emerald-500/10"
                        : "text-muted-foreground border-border hover:bg-muted"
                    }`}
                    onClick={() => handleToggleHide(selectedTag.type)}
                  >
                    {selectedTag.manuallyHidden ? (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        Unhide Tag
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-4 w-4 mr-2" />
                        Hide Tag
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    Hidden tags reappear automatically if new offences are recorded
                  </p>
                </div>
              )}
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}