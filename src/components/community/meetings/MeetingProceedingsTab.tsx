import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Calendar, X, ChevronLeft, ChevronRight } from "lucide-react";
import { mockMeetingProceedings, mockMeetings } from "@/data/meetingsData";
import { format, isAfter, isBefore, startOfDay, endOfDay } from "date-fns";
import { PremiumAdRotation } from "@/components/PremiumAdRotation";
import { DownloadFormatSheet, DownloadFormat } from "@/components/common/DownloadFormatSheet";
import { useToast } from "@/hooks/use-toast";

export const MeetingProceedingsTab = () => {
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [downloadDocName, setDownloadDocName] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const itemsPerPage = 5;

  // Combine proceedings with meeting data
  const proceedingsWithMeetings = mockMeetingProceedings.map((proceeding) => {
    const meeting = mockMeetings.find((m) => m.id === proceeding.meetingId);
    return { ...proceeding, meeting };
  });

  // Apply date filter
  const filteredProceedings = proceedingsWithMeetings.filter((p) => {
    if (!p.meeting) return true;
    const meetingDate = new Date(p.meeting.date);
    if (dateFrom) {
      const from = startOfDay(new Date(dateFrom));
      if (isBefore(meetingDate, from)) return false;
    }
    if (dateTo) {
      const to = endOfDay(new Date(dateTo));
      if (isAfter(meetingDate, to)) return false;
    }
    return true;
  });

  const totalPages = Math.ceil(filteredProceedings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedProceedings = filteredProceedings.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const hasActiveFilter = dateFrom || dateTo;

  const clearFilters = () => {
    setDateFrom("");
    setDateTo("");
    setCurrentPage(1);
  };

  const handleDownload = (docName: string) => {
    setDownloadDocName(docName);
    setDownloadOpen(true);
  };

  const handleDownloadFormat = (fmt: DownloadFormat) => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      setDownloadOpen(false);
      toast({
        title: "Download Complete",
        description: `${downloadDocName} downloaded as ${fmt.toUpperCase()}`,
      });
    }, 1500);
  };

  const premiumAdSlots = [
    {
      slotId: "proceedings-ad-1",
      ads: [
        {
          id: "proceedings-ad-1",
          advertiser: { name: "Document Solutions Pro", verified: true },
          content: {
            headline: "Professional Document Management",
            description: "Streamline your meeting documentation with cloud-based solutions.",
            ctaText: "Learn More",
            ctaUrl: "https://example.com",
          },
          media: {
            type: "image" as const,
            items: [{ url: "https://images.unsplash.com/photo-1554224311-beee460201e8?w=800&q=80" }],
          },
          layout: "standard" as const,
          duration: 15,
        },
      ],
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold">Meeting Proceedings</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Download official meeting documents and minutes
        </p>
      </div>

      {/* Date Filter */}
      <Card className="p-3">
        <Button
          variant="outline"
          className="w-full h-11 justify-start text-sm font-medium touch-manipulation active:scale-[0.98]"
          onClick={() => setShowDateFilter(!showDateFilter)}
        >
          <Calendar className="h-4 w-4 mr-2 shrink-0" />
          {hasActiveFilter ? (
            <span className="truncate">
              {dateFrom ? format(new Date(dateFrom), "MMM d, yyyy") : "Any"} — {dateTo ? format(new Date(dateTo), "MMM d, yyyy") : "Any"}
            </span>
          ) : (
            "Filter by Date"
          )}
          {hasActiveFilter && (
            <Badge variant="secondary" className="ml-auto text-xs px-1.5 py-0 shrink-0">Active</Badge>
          )}
        </Button>

        {showDateFilter && (
          <div className="mt-3 space-y-2.5 animate-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">From Date</label>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => { setDateFrom(e.target.value); setCurrentPage(1); }}
                  className="h-10 text-sm touch-manipulation"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">To Date</label>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => { setDateTo(e.target.value); setCurrentPage(1); }}
                  className="h-10 text-sm touch-manipulation"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
            {hasActiveFilter && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full h-8 text-xs text-muted-foreground"
                onClick={clearFilters}
              >
                <X className="h-3 w-3 mr-1" /> Clear Date Filter
              </Button>
            )}
          </div>
        )}
      </Card>

      {/* Results count */}
      <p className="text-xs text-muted-foreground px-1">
        {filteredProceedings.length} document{filteredProceedings.length !== 1 ? "s" : ""} found
      </p>

      {/* Proceedings List */}
      <div className="space-y-3">
        {displayedProceedings.length === 0 ? (
          <Card className="p-8 text-center">
            <FileText className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No proceedings match the selected date range</p>
            {hasActiveFilter && (
              <Button variant="link" size="sm" className="text-xs mt-1" onClick={clearFilters}>
                Clear filters
              </Button>
            )}
          </Card>
        ) : (
          displayedProceedings.map((proceeding, index) => (
            <div key={proceeding.id}>
              {index === 2 && (
                <div className="mb-3">
                  <PremiumAdRotation
                    slotId={premiumAdSlots[0].slotId}
                    ads={premiumAdSlots[0].ads}
                  />
                </div>
              )}
              <Card className="p-4 space-y-3">
                {/* File Icon */}
                <div className="h-14 w-14 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="h-7 w-7 text-primary" />
                </div>

                {/* Meeting Info */}
                <div>
                  <h3 className="font-semibold text-base">
                    {proceeding.meeting?.name || "Meeting"}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {proceeding.meeting && format(proceeding.meeting.date, "MMMM dd, yyyy")}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="secondary" className="text-xs">{proceeding.fileType}</Badge>
                  <Badge variant="secondary" className="text-xs">{proceeding.fileSize}</Badge>
                  <Badge variant="secondary" className="text-xs capitalize">{proceeding.meeting?.type}</Badge>
                </div>

                {/* Content preview */}
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {proceeding.content}
                </p>

                {/* Download Button */}
                <Button
                  className="w-full h-12 font-semibold text-sm touch-manipulation active:scale-[0.98]"
                  onClick={() => handleDownload(proceeding.meeting?.name || "Meeting Proceedings")}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </Card>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="h-10 px-3 touch-manipulation active:scale-[0.97]"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <span className="text-sm font-medium text-muted-foreground">
            {currentPage} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="h-10 px-3 touch-manipulation active:scale-[0.97]"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}

      {/* Download Format Sheet */}
      <DownloadFormatSheet
        open={downloadOpen}
        onOpenChange={setDownloadOpen}
        onDownload={handleDownloadFormat}
        title="Download Proceedings"
        documentName={downloadDocName}
        availableFormats={["pdf", "docx", "txt"]}
        isDownloading={isDownloading}
      />
    </div>
  );
};
