import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Tag, ChevronDown, ChevronUp } from "lucide-react";
import { mockMeetingHeadlines, mockMeetings } from "@/data/meetingsData";
import { format } from "date-fns";
import { PremiumAdRotation } from "@/components/PremiumAdRotation";
import { useState } from "react";

export const MeetingHeadlineThemeTab = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Combine headlines with meeting data
  const headlinesWithMeetings = mockMeetingHeadlines.map((headline) => {
    const meeting = mockMeetings.find((m) => m.id === headline.meetingId);
    return { ...headline, meeting };
  });

  const totalPages = Math.ceil(headlinesWithMeetings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedHeadlines = headlinesWithMeetings.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const premiumAdSlots = [
    {
      slotId: "headline-ad-1",
      ads: [
        {
          id: "headline-ad-1",
          advertiser: {
            name: "Event Planning Masters",
            verified: true,
          },
          content: {
            headline: "Professional Meeting Planning Services",
            description: "Let us handle your next community event from start to finish.",
            ctaText: "Get Started",
            ctaUrl: "https://example.com",
          },
          media: {
            type: "image" as const,
            items: [
              {
                url: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80",
              },
            ],
          },
          layout: "standard" as const,
          duration: 15,
        },
      ],
    },
  ];

  const getTypeColor = (type: string) => {
    return type === "executive" ? "bg-blue-500/10 text-blue-500" : "bg-green-500/10 text-green-500";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Meeting Headlines & Themes</h2>
          <p className="text-sm text-muted-foreground mt-1">
            View meeting topics and agenda summaries
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

      {/* Headlines List */}
      <div className="space-y-4">
        {displayedHeadlines.map((headline, index) => (
          <div key={headline.id}>
            {index === 2 && (
              <div className="mb-4">
                <PremiumAdRotation 
                  slotId={premiumAdSlots[0].slotId}
                  ads={premiumAdSlots[0].ads}
                />
              </div>
            )}
            <Card className="p-4 sm:p-6">
              {/* Meeting Info */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className={getTypeColor(headline.meeting?.type || "")}>
                      {headline.meeting?.type || "Meeting"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {headline.meeting && format(headline.meeting.date, "MMM dd, yyyy")}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg">{headline.headline}</h3>
                </div>
              </div>

              {/* Theme Badge */}
              <div className="flex items-center gap-2 mb-3">
                <Tag className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  Theme: {headline.theme}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground mb-4">
                {headline.description}
              </p>

              {/* Expandable Agenda */}
              <div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setExpandedId(expandedId === headline.id ? null : headline.id)
                  }
                  className="gap-2"
                >
                  {expandedId === headline.id ? (
                    <>
                      <ChevronUp className="h-4 w-4" />
                      Hide Agenda
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4" />
                      Show Agenda Items
                    </>
                  )}
                </Button>

                {expandedId === headline.id && (
                  <div className="mt-3 pl-4 border-l-2 border-primary/20">
                    <h4 className="text-sm font-medium mb-2">Agenda Items:</h4>
                    <ul className="space-y-2">
                      {headline.agendaItems.map((item, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-0.5">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
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
