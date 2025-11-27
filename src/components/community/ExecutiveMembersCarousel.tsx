import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Grid3x3, ArrowLeft } from "lucide-react";
import { ExecutiveMemberCard } from "./ExecutiveMemberCard";
import { ExecutiveMember } from "@/data/communityExecutivesData";

interface ExecutiveMembersCarouselProps {
  title: string;
  members: ExecutiveMember[];
  showViewToggle?: boolean;
}

export const ExecutiveMembersCarousel = ({
  title,
  members,
  showViewToggle = true,
}: ExecutiveMembersCarouselProps) => {
  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm">{title}</h3>
          {showViewToggle && <Grid3x3 className="h-4 w-4" />}
        </div>
      </div>

      {/* Scrolling Indicator */}
      <div className="bg-card p-2 border-b flex items-center justify-end gap-2">
        <span className="text-xs text-destructive font-medium">More scrolling out</span>
        <ArrowLeft className="h-3 w-3 text-destructive" />
      </div>

      {/* Carousel Content */}
      <div className="p-4">
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
                isFriend={member.isFriend}
              />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};