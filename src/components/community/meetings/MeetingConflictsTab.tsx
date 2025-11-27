import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { mockConflictsOfInterest, mockMeetings } from "@/data/meetingsData";
import { format } from "date-fns";
import { PremiumAdRotation } from "@/components/PremiumAdRotation";
import { useState } from "react";

export const MeetingConflictsTab = () => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Combine conflicts with meeting data
  const conflictsWithMeetings = mockConflictsOfInterest.map((conflict) => {
    const meeting = mockMeetings.find((m) => m.id === conflict.meetingId);
    return { ...conflict, meeting };
  });

  // Filter by status
  const filteredConflicts =
    statusFilter === "all"
      ? conflictsWithMeetings
      : conflictsWithMeetings.filter((c) => c.status === statusFilter);

  const totalPages = Math.ceil(filteredConflicts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedConflicts = filteredConflicts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const premiumAdSlots = [
    {
      slotId: "conflicts-ad-1",
      ads: [
        {
          id: "conflicts-ad-1",
          advertiser: {
            name: "Ethics & Compliance Solutions",
            verified: true,
          },
          content: {
            headline: "Manage Conflicts of Interest Effectively",
            description: "Professional guidance for ethical governance and transparency.",
            ctaText: "Learn More",
            ctaUrl: "https://example.com",
          },
          media: {
            type: "image" as const,
            items: [
              {
                url: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80",
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
      case "declared":
        return (
          <Badge className="bg-yellow-500/10 text-yellow-500">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Declared
          </Badge>
        );
      case "resolved":
        return (
          <Badge className="bg-green-500/10 text-green-500">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Resolved
          </Badge>
        );
      case "dismissed":
        return (
          <Badge className="bg-gray-500/10 text-gray-500">
            <XCircle className="h-3 w-3 mr-1" />
            Dismissed
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Conflicts of Interest</h2>
          <p className="text-sm text-muted-foreground mt-1">
            View declared conflicts and their resolutions
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
              variant={statusFilter === "declared" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("declared")}
            >
              Declared
            </Button>
            <Button
              variant={statusFilter === "resolved" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("resolved")}
            >
              Resolved
            </Button>
            <Button
              variant={statusFilter === "dismissed" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("dismissed")}
            >
              Dismissed
            </Button>
          </div>
        </div>
      </Card>

      {/* Conflicts List */}
      <div className="space-y-4">
        {displayedConflicts.map((conflict, index) => (
          <div key={conflict.id}>
            {index === 2 && (
              <div className="mb-4">
                <PremiumAdRotation 
                  slotId={premiumAdSlots[0].slotId}
                  ads={premiumAdSlots[0].ads}
                />
              </div>
            )}
            <Card className="p-4 sm:p-6">
              {/* Header with Status */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-1">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={conflict.memberAvatar}
                      alt={conflict.memberName}
                    />
                    <AvatarFallback>
                      {conflict.memberName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{conflict.memberName}</h3>
                    <p className="text-xs text-muted-foreground">
                      {conflict.meeting &&
                        format(conflict.meeting.date, "MMM dd, yyyy")} •{" "}
                      {conflict.meeting?.type}
                    </p>
                  </div>
                </div>
                {getStatusBadge(conflict.status)}
              </div>

              {/* Conflict Description */}
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium mb-1">
                    Conflict Description:
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {conflict.description}
                  </p>
                </div>

                {/* Resolution */}
                <div className="pt-3 border-t">
                  <h4 className="text-sm font-medium mb-1">Resolution:</h4>
                  <p className="text-sm text-muted-foreground">
                    {conflict.resolution}
                  </p>
                </div>

                {/* Timeline */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
                  <Calendar className="h-3 w-3" />
                  Declared on {format(conflict.declaredAt, "MMMM dd, yyyy 'at' h:mm a")}
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {displayedConflicts.length === 0 && (
        <Card className="p-12 text-center">
          <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Conflicts Found</h3>
          <p className="text-sm text-muted-foreground">
            No conflicts of interest match your current filter criteria.
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
