import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Calendar } from "lucide-react";
import { mockMeetingProceedings, mockMeetings } from "@/data/meetingsData";
import { format } from "date-fns";
import { PremiumAdRotation } from "@/components/PremiumAdRotation";
import { useState } from "react";

export const MeetingProceedingsTab = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Combine proceedings with meeting data
  const proceedingsWithMeetings = mockMeetingProceedings.map((proceeding) => {
    const meeting = mockMeetings.find((m) => m.id === proceeding.meetingId);
    return { ...proceeding, meeting };
  });

  const totalPages = Math.ceil(proceedingsWithMeetings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedProceedings = proceedingsWithMeetings.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const premiumAdSlots = [
    {
      slotId: "proceedings-ad-1",
      ads: [
        {
          id: "proceedings-ad-1",
          advertiser: {
            name: "Document Solutions Pro",
            verified: true,
          },
          content: {
            headline: "Professional Document Management",
            description: "Streamline your meeting documentation with cloud-based solutions.",
            ctaText: "Learn More",
            ctaUrl: "https://example.com",
          },
          media: {
            type: "image" as const,
            items: [
              {
                url: "https://images.unsplash.com/photo-1554224311-beee460201e8?w=800&q=80",
              },
            ],
          },
          layout: "standard" as const,
          duration: 15,
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Meeting Proceedings</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Download official meeting documents and minutes
          </p>
        </div>
      </div>

      {/* Date Filter Placeholder */}
      <Card className="p-4">
        <Button variant="outline" className="w-full justify-start">
          <Calendar className="h-4 w-4 mr-2" />
          Filter by Date [Day, Month, Year]
        </Button>
      </Card>

      {/* Proceedings List */}
      <div className="space-y-4">
        {displayedProceedings.map((proceeding, index) => (
          <div key={proceeding.id}>
            {index === 2 && (
              <div className="mb-4">
                <PremiumAdRotation 
                  slotId={premiumAdSlots[0].slotId}
                  ads={premiumAdSlots[0].ads}
                />
              </div>
            )}
            <Card className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* File Icon */}
                <div className="flex-shrink-0">
                  <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                </div>

                {/* Meeting Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg mb-1">
                    {proceeding.meeting?.name || "Meeting"}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {proceeding.meeting &&
                      format(proceeding.meeting.date, "MMMM dd, yyyy")}
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span className="px-2 py-1 bg-secondary rounded">
                      {proceeding.fileType}
                    </span>
                    <span className="px-2 py-1 bg-secondary rounded">
                      {proceeding.fileSize}
                    </span>
                    <span className="px-2 py-1 bg-secondary rounded capitalize">
                      {proceeding.meeting?.type}
                    </span>
                  </div>
                  <p className="text-sm mt-3 line-clamp-2">
                    {proceeding.content}
                  </p>
                </div>

                {/* Download Button */}
                <div className="flex-shrink-0 flex items-center">
                  <Button className="w-full sm:w-auto">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        ))}
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
