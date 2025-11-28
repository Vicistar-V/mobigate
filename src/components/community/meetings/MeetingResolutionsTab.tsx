import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle2, XCircle, Clock, User } from "lucide-react";
import { mockResolutions, mockMeetings } from "@/data/meetingsData";
import { format } from "date-fns";
import { PremiumAdRotation } from "@/components/PremiumAdRotation";
import { useState } from "react";
import { VoteBoxGroup } from "../shared/VoteBoxGroup";

export const MeetingResolutionsTab = () => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Combine resolutions with meeting data
  const resolutionsWithMeetings = mockResolutions.map((resolution) => {
    const meeting = mockMeetings.find((m) => m.id === resolution.meetingId);
    return { ...resolution, meeting };
  });

  // Filter by status
  const filteredResolutions =
    statusFilter === "all"
      ? resolutionsWithMeetings
      : resolutionsWithMeetings.filter((r) => r.status === statusFilter);

  const totalPages = Math.ceil(filteredResolutions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedResolutions = filteredResolutions.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const premiumAdSlots = [
    {
      slotId: "resolutions-ad-1",
      ads: [
        {
          id: "resolutions-ad-1",
          advertiser: {
            name: "Legal Compliance Hub",
            verified: true,
          },
          content: {
            headline: "Ensure Your Resolutions are Legally Sound",
            description: "Expert legal review for community resolutions and bylaws.",
            ctaText: "Consult Now",
            ctaUrl: "https://example.com",
          },
          media: {
            type: "image" as const,
            items: [
              {
                url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80",
              },
            ],
          },
          layout: "standard" as const,
          duration: 15,
        },
      ],
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "passed":
        return (
          <Badge className="bg-green-500/10 text-green-500">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Passed
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-500/10 text-red-500">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      case "tabled":
        return (
          <Badge className="bg-yellow-500/10 text-yellow-500">
            <Clock className="h-3 w-3 mr-1" />
            Tabled
          </Badge>
        );
      default:
        return null;
    }
  };

  const calculatePercentage = (votes: number, total: number) => {
    return total > 0 ? (votes / total) * 100 : 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Meeting Resolutions</h2>
          <p className="text-sm text-muted-foreground mt-1">
            View voting results and resolution statuses
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            <Calendar className="h-4 w-4 mr-2" />
            Filter by Date [Day, Month, Year]
          </Button>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={statusFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("all")}
            >
              All
            </Button>
            <Button
              variant={statusFilter === "passed" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("passed")}
            >
              Passed
            </Button>
            <Button
              variant={statusFilter === "rejected" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("rejected")}
            >
              Rejected
            </Button>
            <Button
              variant={statusFilter === "tabled" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("tabled")}
            >
              Tabled
            </Button>
          </div>
        </div>
      </Card>

      {/* Resolutions List */}
      <div className="space-y-4">
        {displayedResolutions.map((resolution, index) => {
          const totalVotes =
            resolution.votesFor +
            resolution.votesAgainst +
            resolution.abstentions;
          const forPercentage = calculatePercentage(
            resolution.votesFor,
            totalVotes
          );
          const againstPercentage = calculatePercentage(
            resolution.votesAgainst,
            totalVotes
          );

          return (
            <div key={resolution.id}>
              {index === 2 && (
                <div className="mb-4">
                  <PremiumAdRotation 
                    slotId={premiumAdSlots[0].slotId}
                    ads={premiumAdSlots[0].ads}
                  />
                </div>
              )}
              <Card className="p-4 sm:p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusBadge(resolution.status)}
                      <span className="text-xs text-muted-foreground">
                        {resolution.meeting &&
                          format(resolution.meeting.date, "MMM dd, yyyy")}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg mb-1">
                      {resolution.title}
                    </h3>
                    {resolution.proposedBy && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <User className="h-3 w-3" />
                        Proposed by {resolution.proposedBy}
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-4">
                  {resolution.description}
                </p>

                {/* Voting Results */}
                <div className="flex flex-col items-center space-y-3">
                  <div className="flex justify-center">
                    <VoteBoxGroup
                      values={[
                        resolution.votesFor,
                        resolution.votesAgainst,
                        resolution.abstentions
                      ]}
                      labels={['For', 'Against', 'Abstain']}
                      colorClass="border-gray-400"
                      isLarge={true}
                    />
                  </div>
                  
                  <div className="flex gap-4 text-xs">
                    <span className="text-green-600 font-medium">
                      {forPercentage.toFixed(1)}%
                    </span>
                    <span className="text-red-600 font-medium">
                      {againstPercentage.toFixed(1)}%
                    </span>
                    <span className="text-muted-foreground">
                      {((resolution.abstentions / totalVotes) * 100).toFixed(1)}%
                    </span>
                  </div>

                  <div className="text-sm font-medium pt-2 border-t w-full text-center">
                    Total Votes: {totalVotes}
                  </div>
                </div>
              </Card>
            </div>
          );
        })}
      </div>

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
