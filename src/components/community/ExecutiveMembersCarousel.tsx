import { useState } from "react";
import { Card } from "@/components/ui/card";
import { MoveHorizontal, MoveVertical, ArrowLeft } from "lucide-react";
import { ExecutiveMemberCard } from "./ExecutiveMemberCard";
import { ExecutiveMember } from "@/data/communityExecutivesData";
import { Button } from "@/components/ui/button";

interface ExecutiveMembersCarouselProps {
  title: string;
  members: ExecutiveMember[];
  showViewToggle?: boolean;
  onMemberClick?: (member: ExecutiveMember) => void;
  headerExtra?: React.ReactNode;
}

export const ExecutiveMembersCarousel = ({
  title,
  members,
  showViewToggle = true,
  onMemberClick,
  headerExtra,
}: ExecutiveMembersCarouselProps) => {
  const [viewMode, setViewMode] = useState<"carousel" | "grid">("carousel");

  const toggleView = () => {
    setViewMode(viewMode === "carousel" ? "grid" : "carousel");
  };

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-3 flex items-center justify-between">
        <h3 className="font-semibold text-sm">{title}</h3>
        <div className="flex items-center gap-2">
          {headerExtra}
          {showViewToggle && (
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleView}
            className="h-7 gap-1.5 text-primary-foreground hover:bg-primary-foreground/20 transition-all duration-200"
            title={viewMode === "carousel" ? "Switch to Vertical View" : "Switch to Horizontal View"}
          >
            {viewMode === "carousel" ? (
              <>
                <MoveHorizontal className="h-4 w-4" />
                <span className="text-xs hidden sm:inline">Horizontal</span>
              </>
            ) : (
              <>
                <MoveVertical className="h-4 w-4" />
                <span className="text-xs hidden sm:inline">Vertical</span>
              </>
            )}
          </Button>
          )}
        </div>
      </div>

      {/* Scrolling Indicator - only show in carousel mode */}
      {viewMode === "carousel" && (
        <div className="bg-card p-2 border-b flex items-center justify-end gap-2">
          <span className="text-xs text-destructive font-medium">More scrolling out</span>
          <ArrowLeft className="h-3 w-3 text-destructive" />
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {viewMode === "carousel" ? (
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent snap-x snap-mandatory">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex-shrink-0 w-[160px] snap-start"
              >
                <ExecutiveMemberCard
                  id={member.id}
                  name={member.name}
                  position={member.position}
                  tenure={member.tenure}
                  imageUrl={member.imageUrl}
                  communityImageUrl={member.communityImageUrl}
                  isFriend={member.isFriend}
                  onClick={onMemberClick ? () => onMemberClick(member) : undefined}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {members.map((member) => (
              <ExecutiveMemberCard
                key={member.id}
                id={member.id}
                name={member.name}
                position={member.position}
                tenure={member.tenure}
                imageUrl={member.imageUrl}
                communityImageUrl={member.communityImageUrl}
                isFriend={member.isFriend}
                onClick={onMemberClick ? () => onMemberClick(member) : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};