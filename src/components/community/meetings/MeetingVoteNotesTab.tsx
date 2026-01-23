import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Download, FileText, ThumbsUp, ThumbsDown, MinusCircle } from "lucide-react";
import { mockVoteNotes, mockResolutions, mockMeetings } from "@/data/meetingsData";
import { format } from "date-fns";
import { PremiumAdRotation } from "@/components/PremiumAdRotation";
import { useState } from "react";

export const MeetingVoteNotesTab = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Combine vote notes with resolution and meeting data
  const votesWithDetails = mockVoteNotes.map((vote) => {
    const resolution = mockResolutions.find((r) => r.id === vote.resolutionId);
    const meeting = mockMeetings.find((m) => m.id === vote.meetingId);
    return { ...vote, resolution, meeting };
  });

  const totalPages = Math.ceil(votesWithDetails.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedVotes = votesWithDetails.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const premiumAdSlots = [
    {
      slotId: "votes-ad-1",
      ads: [
        {
          id: "votes-ad-1",
          advertiser: {
            name: "Voting Systems Pro",
            verified: true,
          },
          content: {
            headline: "Secure Digital Voting Platform",
            description: "Modern voting solutions for community organizations.",
            ctaText: "Get Demo",
            ctaUrl: "https://example.com",
          },
          media: {
            type: "image" as const,
            items: [
              {
                url: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=800&q=80",
              },
            ],
          },
          layout: "standard" as const,
          duration: 15,
        },
      ],
    },
  ];

  const getVoteIcon = (vote: string) => {
    switch (vote) {
      case "for":
        return <ThumbsUp className="h-4 w-4 text-green-500" />;
      case "against":
        return <ThumbsDown className="h-4 w-4 text-red-500" />;
      case "abstain":
        return <MinusCircle className="h-4 w-4 text-gray-500" />;
      default:
        return null;
    }
  };

  const getVoteBadge = (vote: string) => {
    switch (vote) {
      case "for":
        return (
          <Badge className="bg-green-500/10 text-green-500">
            <ThumbsUp className="h-3 w-3 mr-1" />
            For
          </Badge>
        );
      case "against":
        return (
          <Badge className="bg-red-500/10 text-red-500">
            <ThumbsDown className="h-3 w-3 mr-1" />
            Against
          </Badge>
        );
      case "abstain":
        return (
          <Badge className="bg-gray-500/10 text-gray-500">
            <MinusCircle className="h-3 w-3 mr-1" />
            Abstain
          </Badge>
        );
      default:
        return null;
    }
  };

  const handleExport = () => {
    // Create export data
    const exportData = votesWithDetails
      .map(
        (vote) =>
          `${vote.meeting?.name} | ${vote.resolution?.title} | ${vote.voterName} | ${vote.vote.toUpperCase()} | ${vote.note || "No note"}`
      )
      .join("\n");

    const blob = new Blob([exportData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vote-notes-${format(new Date(), "yyyy-MM-dd")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Meeting Voice Notes</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Voice recordings with member notes and comments
          </p>
        </div>
        <Button size="sm" onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Export All
        </Button>
      </div>

      {/* Date Filter */}
      <Card className="p-4">
        <Button variant="outline" className="w-full justify-start">
          <Calendar className="h-4 w-4 mr-2" />
          Filter by Date [Day, Month, Year]
        </Button>
      </Card>

      {/* Vote Notes List */}
      <div className="space-y-4">
        {displayedVotes.map((vote, index) => (
          <div key={vote.id}>
            {index === 5 && (
              <div className="mb-4">
                <PremiumAdRotation 
                  slotId={premiumAdSlots[0].slotId}
                  ads={premiumAdSlots[0].ads}
                />
              </div>
            )}
            <Card className="p-4 sm:p-6">
              {/* Resolution Info */}
              <div className="mb-4 pb-4 border-b">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">
                      {vote.resolution?.title || "Unknown Resolution"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {vote.meeting?.name} •{" "}
                      {vote.meeting && format(vote.meeting.date, "MMM dd, yyyy")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Voter Info and Vote */}
              <div className="flex items-start gap-4">
                <Avatar className="h-10 w-10 flex-shrink-0">
                  <AvatarImage src={vote.voterAvatar} alt={vote.voterName} />
                  <AvatarFallback>{vote.voterName.charAt(0)}</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">{vote.voterName}</span>
                    {getVoteBadge(vote.vote)}
                  </div>

                  <div className="text-xs text-muted-foreground mb-3">
                    Voted on {format(vote.timestamp, "MMMM dd, yyyy 'at' h:mm a")}
                  </div>

                  {/* Vote Note */}
                  {vote.note && (
                    <div className="bg-muted/50 rounded-lg p-3">
                      <div className="flex items-start gap-2 mb-1">
                        <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <span className="text-xs font-medium text-muted-foreground">
                          Note:
                        </span>
                      </div>
                      <p className="text-sm ml-6">{vote.note}</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {displayedVotes.length === 0 && (
        <Card className="p-12 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Voice Notes Found</h3>
          <p className="text-sm text-muted-foreground">
            No voice recordings match your current filter criteria.
          </p>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="flex items-center px-4 text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};
