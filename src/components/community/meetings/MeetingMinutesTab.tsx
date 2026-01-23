import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  FileText,
  Download,
  Upload,
  CheckCircle2,
  Clock,
  AlertCircle,
  Users,
  Calendar,
  Lock,
  Unlock,
  ChevronRight,
  Eye,
  Vote,
  Info,
} from "lucide-react";
import {
  mockMeetingMinutes,
  mockMinutesSettings,
  MeetingMinutes,
} from "@/data/meetingsData";
import { format, formatDistanceToNow, differenceInDays } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { MinutesAdoptionDialog } from "./MinutesAdoptionDialog";
import { MinutesDownloadDialog } from "./MinutesDownloadDialog";
import { SecretaryUploadMinutesDialog } from "./SecretaryUploadMinutesDialog";
import { PremiumAdRotation } from "@/components/PremiumAdRotation";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface MeetingMinutesTabProps {
  isAdmin?: boolean;
  isSecretary?: boolean;
}

export const MeetingMinutesTab = ({
  isAdmin = false,
  isSecretary = true, // For demo, set to true
}: MeetingMinutesTabProps) => {
  const { toast } = useToast();
  const [selectedMinutes, setSelectedMinutes] = useState<MeetingMinutes | null>(null);
  const [showAdoptionDialog, setShowAdoptionDialog] = useState(false);
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Check if previous meeting minutes are adopted (for new meeting button logic)
  const latestCompletedMeetingMinutes = mockMeetingMinutes.find(
    (m) => m.status === "pending_adoption"
  );
  const canStartNewMeeting = !latestCompletedMeetingMinutes;

  // Filter minutes based on status
  const filteredMinutes =
    statusFilter === "all"
      ? mockMeetingMinutes
      : mockMeetingMinutes.filter((m) => m.status === statusFilter);

  const getStatusBadge = (minutes: MeetingMinutes) => {
    switch (minutes.status) {
      case "adopted":
        return (
          <Badge className="bg-green-500/10 text-green-600 border-green-200">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Adopted
          </Badge>
        );
      case "pending_adoption":
        return (
          <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            Pending Adoption
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-500/10 text-red-600 border-red-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return null;
    }
  };

  const getAttendanceStatus = (minutes: MeetingMinutes) => {
    if (minutes.status !== "adopted" || !minutes.attendanceDeadline) {
      return null;
    }
    
    const daysRemaining = differenceInDays(minutes.attendanceDeadline, new Date());
    
    if (daysRemaining < 0) {
      return (
        <Badge variant="outline" className="text-xs text-muted-foreground">
          <Lock className="h-3 w-3 mr-1" />
          Attendance Expired
        </Badge>
      );
    }
    
    return (
      <Badge variant="outline" className="text-xs text-green-600 border-green-200">
        <Unlock className="h-3 w-3 mr-1" />
        {daysRemaining} days for attendance
      </Badge>
    );
  };

  const handleAdoptClick = (minutes: MeetingMinutes) => {
    setSelectedMinutes(minutes);
    setShowAdoptionDialog(true);
  };

  const handleDownloadClick = (minutes: MeetingMinutes) => {
    if (minutes.status !== "adopted") {
      toast({
        title: "Minutes Not Adopted",
        description: "Minutes must be adopted before downloading.",
        variant: "destructive",
      });
      return;
    }
    setSelectedMinutes(minutes);
    setShowDownloadDialog(true);
  };

  const premiumAdSlots = [
    {
      slotId: "minutes-ad-1",
      ads: [
        {
          id: "minutes-ad-1",
          advertiser: {
            name: "DocuSign Pro",
            verified: true,
          },
          content: {
            headline: "Streamline Your Document Workflow",
            description: "Automated document management for communities.",
            ctaText: "Learn More",
            ctaUrl: "https://example.com",
          },
          media: {
            type: "image" as const,
            items: [
              {
                url: "https://images.unsplash.com/photo-1568702846914-96b305d2uj?w=800&q=80",
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
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">Meeting Minutes</h2>
            <p className="text-sm text-muted-foreground mt-1">
              View, adopt, and download meeting minutes
            </p>
          </div>
        </div>

        {/* New Meeting Alert */}
        {!canStartNewMeeting && (
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800 text-sm">
              <strong>New Meetings Locked:</strong> Previous meeting minutes must be 
              adopted before a new meeting can proceed.{" "}
              <span className="font-medium">
                {latestCompletedMeetingMinutes?.adoptionPercentage}% adopted
              </span>{" "}
              ({mockMinutesSettings.adoptionThreshold}% required)
            </AlertDescription>
          </Alert>
        )}

        {/* Secretary Upload Button */}
        {isSecretary && (
          <Button
            onClick={() => setShowUploadDialog(true)}
            className="w-full sm:w-auto gap-2"
          >
            <Upload className="h-4 w-4" />
            Upload New Minutes
          </Button>
        )}
      </div>

      {/* Info Card */}
      <Card className="p-4 bg-muted/30">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
          <div className="space-y-1 text-sm">
            <p className="font-medium">How Meeting Minutes Work:</p>
            <ul className="text-muted-foreground space-y-1 list-disc list-inside">
              <li>Secretary uploads minutes after each meeting</li>
              <li>Members must adopt minutes (requires {mockMinutesSettings.adoptionThreshold}% majority)</li>
              <li>Download minutes at M{mockMinutesSettings.downloadFeeDefault} fee</li>
              <li>Downloading marks your attendance (within 90 days of adoption)</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Status Filter */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={statusFilter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setStatusFilter("all")}
        >
          All
        </Button>
        <Button
          variant={statusFilter === "pending_adoption" ? "default" : "outline"}
          size="sm"
          onClick={() => setStatusFilter("pending_adoption")}
          className="gap-1"
        >
          <Clock className="h-3 w-3" />
          Pending
        </Button>
        <Button
          variant={statusFilter === "adopted" ? "default" : "outline"}
          size="sm"
          onClick={() => setStatusFilter("adopted")}
          className="gap-1"
        >
          <CheckCircle2 className="h-3 w-3" />
          Adopted
        </Button>
      </div>

      {/* Minutes List */}
      <div className="space-y-4">
        {filteredMinutes.map((minutes) => (
          <Card key={minutes.id} className="p-4 space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-base">{minutes.meetingName}</h3>
                  {getStatusBadge(minutes)}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  <Calendar className="h-3 w-3 inline mr-1" />
                  {format(minutes.meetingDate, "MMMM d, yyyy")}
                </p>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground flex-shrink-0" />
            </div>

            {/* File Info */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                {minutes.fileName}
              </span>
              <span>{minutes.fileSize}</span>
            </div>

            {/* Uploader Info */}
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={minutes.uploadedByAvatar} alt={minutes.uploadedBy} />
                <AvatarFallback>{minutes.uploadedBy.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">
                Uploaded by {minutes.uploadedBy} •{" "}
                {formatDistanceToNow(minutes.uploadedAt, { addSuffix: true })}
              </span>
            </div>

            {/* Adoption Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1">
                  <Vote className="h-4 w-4" />
                  Adoption Progress
                </span>
                <span className="font-medium">
                  {minutes.adoptionPercentage}% ({minutes.adoptedVotes}/{minutes.totalVoters})
                </span>
              </div>
              <Progress
                value={minutes.adoptionPercentage}
                className="h-2"
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Threshold: {minutes.adoptionThreshold}%</span>
                {minutes.status === "adopted" && (
                  <span className="text-green-600">
                    ✓ Adopted {minutes.adoptedAt && formatDistanceToNow(minutes.adoptedAt, { addSuffix: true })}
                  </span>
                )}
              </div>
            </div>

            {/* Attendance & Download Info */}
            {minutes.status === "adopted" && (
              <div className="flex items-center justify-between flex-wrap gap-2">
                {getAttendanceStatus(minutes)}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Download className="h-3 w-3" />
                  {minutes.downloadCount} downloads
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 flex-wrap pt-2 border-t">
              {minutes.status === "pending_adoption" && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleAdoptClick(minutes)}
                  className="flex-1 sm:flex-none gap-1"
                >
                  <Vote className="h-4 w-4" />
                  Adopt Minutes
                </Button>
              )}
              
              {minutes.status === "adopted" && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAdoptClick(minutes)}
                    className="gap-1"
                  >
                    <Eye className="h-4 w-4" />
                    View Adoption
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleDownloadClick(minutes)}
                    className="flex-1 sm:flex-none gap-1"
                  >
                    <Download className="h-4 w-4" />
                    Download (M{minutes.downloadFee})
                  </Button>
                </>
              )}
            </div>
          </Card>
        ))}

        {filteredMinutes.length === 0 && (
          <Card className="p-8 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium mb-2">No Minutes Found</h3>
            <p className="text-sm text-muted-foreground">
              {statusFilter === "all"
                ? "No meeting minutes have been uploaded yet."
                : `No minutes with "${statusFilter.replace("_", " ")}" status.`}
            </p>
          </Card>
        )}
      </div>

      {/* Ad Slot */}
      <PremiumAdRotation slotId="minutes-ad-1" ads={[]} />

      {/* Dialogs */}
      {selectedMinutes && (
        <>
          <MinutesAdoptionDialog
            open={showAdoptionDialog}
            onOpenChange={setShowAdoptionDialog}
            minutes={selectedMinutes}
          />
          <MinutesDownloadDialog
            open={showDownloadDialog}
            onOpenChange={setShowDownloadDialog}
            minutes={selectedMinutes}
          />
        </>
      )}
      
      <SecretaryUploadMinutesDialog
        open={showUploadDialog}
        onOpenChange={setShowUploadDialog}
      />
    </div>
  );
};
