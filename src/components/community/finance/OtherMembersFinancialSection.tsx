import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { otherMembersFinancialData } from "@/data/financialData";
import { MemberPreviewDialog } from "@/components/community/MemberPreviewDialog";
import { FinancialStatusDialog } from "./FinancialStatusDialog";
import { useToast } from "@/hooks/use-toast";
import type { ExecutiveMember } from "@/data/communityExecutivesData";

export const OtherMembersFinancialSection = () => {
  const { toast } = useToast();
  const [friendRequests, setFriendRequests] = useState<Set<string>>(new Set());
  const [selectedMember, setSelectedMember] = useState<ExecutiveMember | null>(null);
  const [showMemberPreview, setShowMemberPreview] = useState(false);
  const [showFinancialReport, setShowFinancialReport] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const handleFriendRequest = (memberId: string, memberName: string) => {
    if (friendRequests.has(memberId)) return;
    setFriendRequests(prev => {
      const next = new Set(prev);
      next.add(memberId);
      return next;
    });
    toast({
      title: "Friend Request Sent",
      description: `Friend request sent to ${memberName}`,
    });
  };

  const handleViewProfile = (member: typeof otherMembersFinancialData[0]) => {
    const mapped: ExecutiveMember = {
      id: member.id,
      name: member.name,
      position: "Community Member",
      tenure: "Active Member",
      imageUrl: member.avatar,
      level: "officer",
      committee: "executive",
      isFriend: friendRequests.has(member.id),
    };
    setSelectedMember(mapped);
    setShowMemberPreview(true);
  };

  const handleViewReport = () => {
    setShowFinancialReport(true);
  };

  const handleViewNow = () => {
    listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    toast({
      title: "Financial Summaries",
      description: "Viewing all member financial summaries",
    });
  };

  return (
    <>
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold">Other Members' Financial Summaries</h3>
          <Button
            size="sm"
            className="bg-yellow-400 text-black hover:bg-yellow-500 active:scale-[0.97] touch-manipulation"
            onClick={handleViewNow}
          >
            View Now
          </Button>
        </div>
        
        <div ref={listRef} className="space-y-3">
          {otherMembersFinancialData.map(member => {
            const isFriendRequested = friendRequests.has(member.id);
            return (
              <div key={member.id} className="flex items-center gap-3 p-3 bg-yellow-50 rounded border border-yellow-200">
                <Avatar
                  className="cursor-pointer active:scale-95 touch-manipulation"
                  onClick={() => handleViewProfile(member)}
                >
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback>{member.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-semibold text-sm">{member.name}</div>
                  <div className="text-xs text-muted-foreground">{member.registration}</div>
                  <div className="flex gap-2 mt-1">
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0 text-xs touch-manipulation active:scale-[0.97]"
                      disabled={isFriendRequested}
                      onClick={() => handleFriendRequest(member.id, member.name)}
                    >
                      {isFriendRequested ? "Requested" : "Friends"}
                    </Button>
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0 text-xs touch-manipulation active:scale-[0.97]"
                      onClick={() => handleViewProfile(member)}
                    >
                      Profile
                    </Button>
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0 text-xs touch-manipulation active:scale-[0.97]"
                      onClick={handleViewReport}
                    >
                      View Report
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <MemberPreviewDialog
        member={selectedMember}
        open={showMemberPreview}
        onOpenChange={setShowMemberPreview}
      />

      <FinancialStatusDialog
        open={showFinancialReport}
        onOpenChange={setShowFinancialReport}
      />
    </>
  );
};
